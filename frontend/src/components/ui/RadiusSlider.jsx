import { useContext } from 'react';
import { MapContext } from '../../context/MapContext';

const RadiusSlider = () => {
  const { radius, setRadius } = useContext(MapContext);
  
  const marks = [1, 5, 10, 25];

  return (
    <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-[1000] glass-panel p-2 sm:p-4 rounded-full flex items-center gap-2 sm:gap-4 w-11/12 max-w-md overflow-x-auto custom-scrollbar">
      <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-bold shrink-0 pl-2">
        Radius
      </div>
      
      <div className="flex-1 flex justify-between items-center bg-black/40 rounded-full p-1 border border-white/5 relative">
        {marks.map((mark) => (
          <button
            key={mark}
            onClick={() => setRadius(mark)}
            className={`
              relative z-10 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300
              ${radius === mark ? 'text-white shadow-[0_0_15px_rgba(255,161,22,0.5)]' : 'text-gray-500 hover:text-gray-300'}
            `}
          >
            {radius === mark && (
              <span className="absolute inset-0 bg-leetcode-orange rounded-full -z-10" />
            )}
            {mark}km
          </button>
        ))}
      </div>
    </div>
  );
};

export default RadiusSlider;
