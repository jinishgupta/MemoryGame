import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faClock, faRotate, faHome, faSadTear, faRedo, faCalendarDay, faCheckCircle, faCoins } from "@fortawesome/free-solid-svg-icons";
import Confetti from "./Confetti.jsx";
import { useState, useEffect } from "react";

function GameOver({ result, matchedPairs, totalPairs, onRestart, onHome, currentStats, isDailyChallenge, earnedPoints }) {
  // Create state to store the latest stats
  const [localStats, setLocalStats] = useState({
    gamesPlayed: currentStats?.gamesPlayed || parseInt(localStorage.getItem('gamesPlayed') || '0'),
    gamesWon: currentStats?.gamesWon || parseInt(localStorage.getItem('gamesWon') || '0'),
    bestTime: currentStats?.bestTime || parseInt(localStorage.getItem('bestTime') || '0'),
    winRate: currentStats?.winRate || 0,
    orngPoints: currentStats?.orngPoints || 0
  });
  
  // Update stats when props change
  useEffect(() => {
    if (currentStats) {
      setLocalStats(currentStats);
    }
  }, [currentStats]);
  
  // Listen for stats reset events
  useEffect(() => {
    const handleStatsReset = () => {
      setLocalStats({
        gamesPlayed: 0,
        gamesWon: 0,
        bestTime: null,
        winRate: 0,
        orngPoints: currentStats?.orngPoints || 0
      });
      console.log("Stats reset detected in GameOver");
    };
    
    // Add event listener
    window.addEventListener('statsReset', handleStatsReset);
    
    // Clean up
    return () => {
      window.removeEventListener('statsReset', handleStatsReset);
    };
  }, [currentStats]);
  
  const isWin = result === "win";
  const dailyChallengeCompleted = isDailyChallenge && isWin;
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {isWin && <Confetti />}
      
      <motion.div 
        className="bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-600"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="text-center mb-8">
          {isWin ? (
            <>
              <motion.div 
                className="inline-block mb-4"
                animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: 1 }}
              >
                <FontAwesomeIcon 
                  icon={dailyChallengeCompleted ? faCalendarDay : faTrophy} 
                  className={`${dailyChallengeCompleted ? 'text-purple-400' : 'text-yellow-400'} text-5xl`} 
                />
              </motion.div>
              <h2 className="text-3xl font-bold text-green-400 mb-2">Congratulations!</h2>
              <p className="text-white text-lg">You matched all {totalPairs} pairs!</p>
              
              {/* ORNG Points earned */}
              {earnedPoints > 0 && (
                <motion.div 
                  className="mt-4 bg-orange-900/60 p-3 rounded-lg text-center"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-orange-200 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCoins} className="mr-2 text-yellow-400" />
                    <span>
                      {isDailyChallenge ? 
                        `Daily Challenge Bonus! +${earnedPoints} ORNG` : 
                        `+${earnedPoints} ORNG Points!`
                      }
                    </span>
                  </p>
                  <p className="text-xs text-orange-300 mt-1">
                    Your total: {localStats.orngPoints} points
                  </p>
                </motion.div>
              )}
              
              {dailyChallengeCompleted && (
                <motion.div 
                  className="mt-3 bg-purple-900/70 p-3 rounded-lg text-center"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-purple-200 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-400" />
                    <span>Daily Challenge Completed!</span>
                  </p>
                  <p className="text-xs text-purple-300 mt-1">
                    Challenge can only be completed once per day. Come back tomorrow for a new challenge!
                  </p>
                </motion.div>
              )}
              
              {localStats.bestTime && (
                <div className="mt-2 inline-block bg-indigo-900/50 px-4 py-2 rounded-lg">
                  <FontAwesomeIcon icon={faClock} className="text-indigo-400 mr-2" />
                  <span className="text-indigo-300">Best time: {localStats.bestTime}s</span>
                </div>
              )}
            </>
          ) : (
            <>
              <motion.div 
                className="inline-block mb-4"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FontAwesomeIcon 
                  icon={faSadTear} 
                  className={`${isDailyChallenge ? 'text-purple-400' : 'text-blue-400'} text-5xl`} 
                />
              </motion.div>
              <h2 className="text-3xl font-bold text-red-400 mb-2">Game Over!</h2>
              <p className="text-white text-lg">You matched {matchedPairs} out of {totalPairs} pairs</p>
              
              {isDailyChallenge && (
                <p className="text-yellow-300 text-sm mt-2">
                  You can try the daily challenge again!
                </p>
              )}
            </>
          )}
        </div>
        
        {/* Game stats summary */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="bg-slate-700/50 p-3 rounded-xl">
            <p className="text-sm text-slate-400">Games Played</p>
            <p className="text-2xl font-bold text-white">{localStats.gamesPlayed}</p>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-xl">
            <p className="text-sm text-slate-400">Win Rate</p>
            <p className="text-2xl font-bold text-white">{localStats.winRate}%</p>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-xl">
            <p className="text-sm text-slate-400">ORNG Points</p>
            <p className="text-2xl font-bold text-orange-300">{localStats.orngPoints}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            className="bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-lg font-bold flex-1 flex items-center justify-center"
            onClick={onRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faRedo} className="mr-2" />
            Play Again
          </motion.button>
          
          <motion.button
            className="bg-slate-600 hover:bg-slate-500 text-white py-3 px-6 rounded-lg font-bold flex-1 flex items-center justify-center"
            onClick={onHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Home
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GameOver; 