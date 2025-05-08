import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faRotate, faHouse, faPause, faPlay, faUser, faCalendarDay, faCoins, faTrophy, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from './ProgressBar.jsx';
import { playSound } from './sounds.js';
import { useState, useEffect } from "react";

const GameHeader = ({ timer, pairs, totalPairs, onRestart, onHome, difficulty, isPaused, onPauseToggle, onProfile, onLeaderboard, isDailyChallenge, orngPoints }) => {
  // Get initial timer value based on difficulty
  const getMaxTime = () => {
    switch(difficulty) {
      case 'Easy': return 90;
      case 'Hard': return 45;
      default: return 60; // Medium
    }
  };
  
  const maxTime = getMaxTime();
  
  // Track if the current pause state is due to tab visibility
  const [isVisibilityPaused, setIsVisibilityPaused] = useState(false);
  
  // Check if the pause was caused by visibility change
  useEffect(() => {
    if (isPaused && document.hidden) {
      setIsVisibilityPaused(true);
    } else if (!isPaused) {
      setIsVisibilityPaused(false);
    }
  }, [isPaused]);
  
  return (
    <motion.div 
      className="bg-slate-900/70 py-2 px-3 rounded-lg shadow-md border border-slate-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
              MatchUp
            </h1>
            <div className="text-xs text-white flex items-center">
              {difficulty} mode
              {isDailyChallenge && (
                <span className="ml-2 bg-yellow-500 text-black px-1.5 py-0.5 rounded-full text-xs font-bold flex items-center">
                  <FontAwesomeIcon icon={faCalendarDay} className="mr-1" size="xs" />
                  Daily
                </span>
              )}
              {isVisibilityPaused && (
                <span className="ml-2 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold flex items-center">
                  <FontAwesomeIcon icon={faEyeSlash} className="mr-1" size="xs" />
                  Auto-Paused
                </span>
              )}
            </div>
          </div>
          
          <div className="h-8 border-r border-slate-600 mx-1"></div>
          
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} className="text-yellow-300" />
            <motion.span 
              className={`font-medium ${timer < 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}
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
          
          {/* ORNG Points */}
          <div className="hidden md:flex items-center gap-1 bg-orange-900/30 px-2 py-1 rounded-lg">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-400 text-xs" />
            <span className="text-orange-300 text-sm font-medium">{orngPoints || 0}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onProfile && (
            <motion.button 
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded"
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                playSound('click');
                onProfile();
              }}
              aria-label="View profile"
            >
              <FontAwesomeIcon icon={faUser} size="sm" />
            </motion.button>
          )}
          
          {onLeaderboard && (
            <motion.button 
              className="bg-orange-600 hover:bg-orange-500 text-white p-1.5 rounded"
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                playSound('click');
                onLeaderboard();
              }}
              aria-label="View leaderboard"
            >
              <FontAwesomeIcon icon={faTrophy} size="sm" />
            </motion.button>
          )}
          
          <motion.button 
            className={`${isVisibilityPaused ? 'bg-red-700 hover:bg-red-600' : `bg-slate-700 hover:bg-${isPaused ? 'green' : 'amber'}-600`} text-white p-1.5 rounded`}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              playSound('click');
              onPauseToggle();
              if (isVisibilityPaused) {
                setIsVisibilityPaused(false);
              }
            }}
            aria-label={isPaused ? "Resume game" : "Pause game"}
          >
            <FontAwesomeIcon icon={isPaused ? faPlay : faPause} size="sm" />
          </motion.button>
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
              if (isDailyChallenge) {
                if (confirm("Returning to home will count as a loss for the Daily Challenge. Continue?")) {
                  playSound('click');
                  onHome();
                }
              } else {
                playSound('click');
                onHome();
              }
            }}
          >
            <FontAwesomeIcon icon={faHouse} size="sm" />
          </motion.button>
        </div>
      </div>
      
      <div className="mt-1 space-y-1">
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
};

export default GameHeader; 