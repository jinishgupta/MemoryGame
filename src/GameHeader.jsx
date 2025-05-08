import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPause, faPlay, faRotate, faHouse } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from './ProgressBar.jsx';

function GameHeader({ timer, pairs, totalPairs, isRunning, onPause, onPlay, onRestart, onHome, difficulty }) {
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
      className="game-header"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
          MatchUp
        </h1>
        <div className="text-xs text-white">
          {difficulty} mode
        </div>
      </div>

      <div className="game-stats mb-4 sm:mb-0">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
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
            <div className="text-white">{pairs}/{totalPairs} pairs</div>
          </div>
          
          <div className="w-full space-y-1">
            <ProgressBar 
              value={timer} 
              max={maxTime} 
              height="h-2" 
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
              height="h-2" 
              colorClass="bg-gradient-to-r from-yellow-500 to-yellow-400" 
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {isRunning ? (
          <motion.button 
            className="btn btn-secondary"
            whileTap={{ scale: 0.9 }}
            onClick={onPause}
          >
            <FontAwesomeIcon icon={faPause} />
          </motion.button>
        ) : (
          <motion.button 
            className="btn btn-success"
            whileTap={{ scale: 0.9 }}
            onClick={onPlay}
          >
            <FontAwesomeIcon icon={faPlay} />
          </motion.button>
        )}
        <motion.button 
          className="btn btn-danger"
          whileTap={{ scale: 0.9 }}
          onClick={onRestart}
        >
          <FontAwesomeIcon icon={faRotate} />
        </motion.button>
        <motion.button 
          className="btn btn-primary"
          whileTap={{ scale: 0.9 }}
          onClick={onHome}
        >
          <FontAwesomeIcon icon={faHouse} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default GameHeader; 