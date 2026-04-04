import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { MapContext } from '../../context/MapContext';
import { Settings, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { neighbors } = useContext(MapContext);

  // Check if current user is the King/Queen of the current radius.
  // We assume neighbors array is sorted by global rank ascending.
  const isKing = neighbors.length > 0 && neighbors[0].leetcodeGlobalRank === user?.leetcodeGlobalRank;
  
  return (
    <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-center glass-panel p-4 rounded-xl">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="bg-leetcode-surface p-2 rounded-lg border border-white/10 shadow-lg">
          👑📍
        </div>
        <h1 className="font-bold text-lg hidden md:block">
          LeetCode <span className="text-leetcode-orange">Territory</span>
        </h1>
      </div>

      {/* Center - Status Banner */}
      <div className="hidden sm:flex flex-col items-center">
        {isKing ? (
          <div className="text-neon-green font-bold flex items-center gap-2">
            👑 King of the Territory
          </div>
        ) : (
          <div className="text-leetcode-orange font-bold flex items-center gap-2">
            ⚔️ Challenger
          </div>
        )}
        <div className="text-xs text-gray-400 font-mono">
          Global Rank: #{user?.leetcodeGlobalRank?.toLocaleString()}
        </div>
      </div>

      {/* Right - Profile */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium">{user?.leetcodeUsername}</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-leetcode-orange text-white flex items-center justify-center font-bold text-lg">
          {user?.leetcodeUsername?.charAt(0).toUpperCase()}
        </div>
        
        <button 
          onClick={logout}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
