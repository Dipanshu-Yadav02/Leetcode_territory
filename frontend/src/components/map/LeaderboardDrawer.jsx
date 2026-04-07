import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { MapContext } from '../../context/MapContext';
import { calculateDistance } from '../../utils/distanceCalc';
import { Loader2, Crown, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LeaderboardDrawer = () => {
  const { user } = useContext(AuthContext);
  const { neighbors, loadingNeighbors } = useContext(MapContext);
  const [isOpen, setIsOpen] = useState(false);

  const LeaderboardContent = (
    <>
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-black/40 pr-12">
        <h2 className="font-bold text-lg flex items-center gap-2">
          🏆 Territory Standings
        </h2>
        <p className="text-xs text-gray-400 mt-1">Rivals in your current radius</p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {loadingNeighbors ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : neighbors.length === 0 ? (
          <div className="text-center p-6 text-gray-500 text-sm">
            No rivals found. You are completely alone here.
          </div>
        ) : (
          neighbors.map((neighbor, index) => {
            const isMe = neighbor.leetcodeUsername === user.leetcodeUsername;
            const isKing = index === 0;

            return (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                key={neighbor._id}
                className={`
                  p-3 rounded-lg border transition-all hover:bg-white/5 cursor-pointer
                  ${isMe ? 'border-leetcode-orange/50 bg-leetcode-orange/10' : 'border-white/5 bg-black/20'}
                  ${isKing && !isMe ? 'border-yellow-500/50 bg-yellow-500/10' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  
                  {/* Rank / Icon */}
                  <div className="w-8 flex justify-center shrink-0">
                    {isKing ? (
                      <Crown className="text-yellow-400 w-6 h-6" />
                    ) : (
                      <span className="text-gray-500 font-mono text-sm">#{index + 1}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold truncate ${isMe ? 'text-leetcode-orange' : 'text-white'}`}>
                        {neighbor.leetcodeUsername}
                      </span>
                      {isMe && <span className="text-[10px] bg-leetcode-orange text-white px-1.5 py-0.5 rounded shrink-0">YOU</span>}
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs font-mono text-gray-400">
                        Rank: {neighbor.leetcodeGlobalRank.toLocaleString()}
                      </div>
                      {!isMe && (
                        <div className="text-[10px] text-neon-green/80">
                          {calculateDistance(user.location, neighbor.location?.coordinates)}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden absolute bottom-32 sm:bottom-32 right-4 z-[999] glass-panel p-3 rounded-full text-white shadow-xl hover:bg-white/10"
      >
        <Users className="w-6 h-6 text-leetcode-orange" />
      </button>

      {/* Desktop Drawer (always visible on lg) */}
      <div className="hidden lg:flex absolute right-4 top-24 bottom-24 w-80 z-[1000] glass-panel rounded-xl flex-col overflow-hidden shadow-2xl">
        {LeaderboardContent}
      </div>

      {/* Mobile Popup Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute inset-x-4 top-24 bottom-32 z-[1000] glass-panel rounded-xl flex flex-col overflow-hidden shadow-2xl bg-leetcode-bg/95 backdrop-blur-xl"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 bg-black/50 p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            {LeaderboardContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LeaderboardDrawer;
