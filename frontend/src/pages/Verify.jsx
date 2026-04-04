import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardCopy, Loader2, CheckCircle, MapPin } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Verify = () => {
  const { user, finishVerification } = useContext(AuthContext);
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  // GPS state
  const [location, setLocation] = useState(null);
  const [gpsError, setGpsError] = useState(null);

  // Automatically fetch GPS when component mounts as per user request
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setGpsError("Failed to get GPS location. Please allow location access.");
        }
      );
    } else {
      setGpsError("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleCopy = () => {
    if (user?.verificationToken) {
      navigator.clipboard.writeText(user.verificationToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerify = async () => {
    if (!location) {
      setErrorMsg("We need your GPS coordinates to assign your territory!");
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await api.post('/verify/check', {
        lat: location.lat,
        lng: location.lng
      });

      setStatus('success');
      finishVerification(res.data.leetcodeGlobalRank, [location.lng, location.lat]);

      // Delay redirect to let them see the green glow
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Verification failed. Token not found.');
    }
  };

  if (!user) return <div className="p-10 text-white">Loading user context...</div>;
  if (user.isVerified) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-leetcode-bg flex flex-col items-center justify-center p-4 text-white">
      <motion.div
        animate={status === 'error' ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`max-w-2xl w-full glass-panel rounded-xl p-8 transition-shadow duration-500 ${status === 'success' ? 'shadow-[0_0_50px_rgba(0,255,0,0.4)] border-neon-green' : ''}`}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">The Handshake 🤝</h2>
          <p className="text-gray-400">Prove ownership of the <span className="text-leetcode-orange font-mono">{user.leetcodeUsername}</span> LeetCode account.</p>
        </div>

        <div className="bg-black/50 p-6 rounded-lg mb-8 font-mono border border-white/5 relative group">
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Your Unique Token</div>
          <div className="text-2xl text-neon-green tracking-widest">{user.verificationToken}</div>

          <button
            onClick={handleCopy}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-leetcode-surface hover:bg-white/10 p-2 rounded transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <CheckCircle className="text-neon-green w-5 h-5" /> : <ClipboardCopy className="text-gray-400 w-5 h-5" />}
          </button>
        </div>

        <ol className="space-y-4 mb-8 text-gray-300 list-decimal list-inside">
          <li>Copy the secure token above.</li>
          <li>Go to your <a href="https://leetcode.com/profile/" target="_blank" rel="noreferrer" className="text-leetcode-orange hover:underline">LeetCode Profile settings</a>.</li>
          <li>Paste the token in your ReadMe by clicking on <strong>"Edit Profile"</strong> button and then save.</li>
          <li>Ensure you have granted GPS permissions (Current status: {location ? <span className="text-neon-green">Acquired</span> : <span className="text-red-400">Pending/Denied</span>})</li>
          <li>Click verify below to claim your territory.</li>
        </ol>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-500 rounded text-red-200 text-center">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={status === 'loading'}
          className={`w-full py-4 rounded font-bold text-lg transition-all flex items-center justify-center gap-2 ${status === 'success'
              ? 'bg-neon-green text-black'
              : 'bg-leetcode-orange hover:bg-orange-500 flex'
            }`}
        >
          {status === 'loading' && <Loader2 className="animate-spin w-6 h-6" />}
          {status === 'success' && <CheckCircle className="w-6 h-6" />}

          {status === 'idle' && 'Verify My Account'}
          {status === 'error' && 'Retry Verification'}
          {status === 'loading' && 'Checking LeetCode Servers...'}
          {status === 'success' && 'Verified! Redirecting...'}
        </button>
      </motion.div>
    </div>
  );
};

export default Verify;
