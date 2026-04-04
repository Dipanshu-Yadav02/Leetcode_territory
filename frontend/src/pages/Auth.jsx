import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', leetcodeUsername: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await api.post(endpoint, formData);
      login(res.data.user, res.data.token);
      
      if (!res.data.user.isVerified) {
        navigate('/verify');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-leetcode-bg overflow-hidden text-white">
      {/* Left Screen: Mock 3D Globe / Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-leetcode-surface flex-col items-center justify-center p-10 border-r border-white/5">
        <h1 className="text-4xl font-bold mb-4 z-10 flex gap-3 pb-8">
          👑 LeetCode <span className="text-leetcode-orange">Territory</span>
        </h1>
        {/* Abstract animated globe rendering */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          className="relative w-64 h-64 border-2 border-leetcode-orange/30 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(255,161,22,0.2)]"
        >
          <div className="absolute w-[110%] h-[110%] border border-neon-green/30 rounded-full" style={{ transform: 'rotateX(60deg)' }}></div>
          <div className="absolute w-[110%] h-[110%] border border-neon-green/30 rounded-full" style={{ transform: 'rotateY(60deg)' }}></div>
          <div className="text-leetcode-orange font-mono text-sm">Geospatial Grid</div>
        </motion.div>
        
        <p className="mt-16 text-gray-400 font-mono text-sm max-w-sm text-center">
          "Don't just rank up globally. Conquer your local city. Become the King of your coordinates."
        </p>
      </div>

      {/* Right Screen: Interactive Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <h2 className="text-3xl font-semibold mb-2">
            {isLogin ? 'Welcome Back' : 'Claim Your Territory'}
          </h2>
          <p className="text-gray-400 mb-8">
            {isLogin ? 'Enter your coordinates.' : 'Register to join the global grid.'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input 
                type="email" name="email" required
                className="w-full px-4 py-3 bg-leetcode-surface border border-white/10 rounded focus:border-leetcode-orange focus:ring-1 focus:ring-leetcode-orange outline-none transition-all"
                placeholder="developer@city.com"
                value={formData.email} onChange={handleChange}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">LeetCode Username</label>
                <input 
                  type="text" name="leetcodeUsername" required
                  className="w-full px-4 py-3 bg-leetcode-surface border border-white/10 rounded focus:border-leetcode-orange focus:ring-1 focus:ring-leetcode-orange outline-none transition-all"
                  placeholder="e.g. dishuyadav477"
                  value={formData.leetcodeUsername} onChange={handleChange}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input 
                type="password" name="password" required
                className="w-full px-4 py-3 bg-leetcode-surface border border-white/10 rounded focus:border-leetcode-orange focus:ring-1 focus:ring-leetcode-orange outline-none transition-all"
                placeholder="••••••••"
                value={formData.password} onChange={handleChange}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-leetcode-orange text-white py-3 rounded font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {isLogin ? "Don't have an account? " : "Already established? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-leetcode-orange hover:underline font-medium"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
