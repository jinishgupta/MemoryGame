import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faRotate, faHouse } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from './ProgressBar.jsx';
import { playSound } from './sounds.js';

function GameHeader({ timer, pairs, totalPairs, onRestart, onHome, difficulty }) {
  // Get initial timer value based on difficulty
  const getMaxTime = () => {
    switch(difficulty) {
      case 'Easy': return 90;
      case 'Hard': return 45;
      default: return 60; // Medium
    }
  };
  
  const maxTime = getMaxTime();
  
  return (
    <motion.div 
      className="bg-slate-900/70 py-2 px-3 rounded-lg shadow-md border border-slate-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
              MatchUp
            </h1>
            <div className="text-xs text-white">
              {difficulty} mode
            </div>
          </div>
          
          <div className="h-8 border-r border-slate-600"></div>
          
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} className="text-yellow-300" />
            <motion.span 
              className={`font-medium ${timer < 10 ? 'text-red-400 animate-pulse-custom' : 'text-white'}`}
              key={timer}
              initial={{ scale: 1 }}
              animate={{ scale: timer < 10 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {timer}s
            </motion.span>
          </div>
          
          <div className="text-sm text-white">
            <span className="font-medium">{pairs}</span>/{totalPairs} pairs
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button 
            className="bg-slate-700 hover:bg-slate-600 text-white p-1.5 rounded"
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              playSound('click');
              onRestart();
            }}
          >
            <FontAwesomeIcon icon={faRotate} size="sm" />
          </motion.button>
          <motion.button 
            className="bg-slate-700 hover:bg-slate-600 text-white p-1.5 rounded"
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              playSound('click');
              onHome();
            }}
          >
            <FontAwesomeIcon icon={faHouse} size="sm" />
          </motion.button>
        </div>
      </div>
      
      <div className="mt-2 space-y-1">
        <ProgressBar 
          value={timer} 
          max={maxTime} 
          height="h-1.5" 
          colorClass={`bg-gradient-to-r ${
            timer < 10 
              ? 'from-red-500 to-red-400' 
              : timer < 30 
                ? 'from-yellow-500 to-yellow-400' 
                : 'from-emerald-500 to-emerald-400'
          }`} 
        />
        <ProgressBar 
          value={pairs} 
          max={totalPairs} 
          height="h-1.5" 
          colorClass="bg-gradient-to-r from-yellow-500 to-yellow-400" 
        />
      </div>
    </motion.div>
  );
}

export default GameHeader; 