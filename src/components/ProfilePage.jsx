import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faTrophy, 
  faClock, 
  faGamepad, 
  faPercent, 
  faArrowLeft, 
  faStar,
  faCalendarAlt,
  faChartLine,
  faTrash,
  faExclamationTriangle,
  faTimes,
  faCheck,
  faEdit,
  faCoins
} from "@fortawesome/free-solid-svg-icons";

const ProfilePage = ({ onBack }) => {
  // State for user stats
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    bestTime: null,
    joinedDate: null,
    lastPlayed: null,
    difficultyStats: {
      easy: { games: 0, wins: 0, winRate: 0, bestTime: null, dailyChallengeAttempts: 0 },
      medium: { games: 0, wins: 0, winRate: 0, bestTime: null, dailyChallengeAttempts: 0 },
      hard: { games: 0, wins: 0, winRate: 0, bestTime: null, dailyChallengeAttempts: 0 },
    },
    dailyChallengeStats: {
      streak: 0,
      maxStreak: 0,
      totalAttempts: 0,
      isCompleted: false
    },
    duelStats: {
      wins: 0,
      losses: 0,
      totalDuels: 0
    }
  });
  
  // State for reset confirmation modal
  const [showResetModal, setShowResetModal] = useState(false);
  
  // Load all stats from localStorage on component mount
  useEffect(() => {
    loadAllStats();
  }, []);
  
  // Function to load all stats from localStorage
  const loadAllStats = () => {
    // Load basic stats
    const loadedGamesPlayed = parseInt(localStorage.getItem('gamesPlayed') || '0');
    const loadedGamesWon = parseInt(localStorage.getItem('gamesWon') || '0');
    const loadedBestTime = parseInt(localStorage.getItem('bestTime') || '0');
    const joinedDate = localStorage.getItem('joinedDate') || new Date().toISOString();
    const lastPlayed = localStorage.getItem('lastPlayed') || null;
    
    // Save joined date if it doesn't exist
    if (!localStorage.getItem('joinedDate')) {
      localStorage.setItem('joinedDate', joinedDate);
    }
    
    // Calculate overall win rate
    const overallWinRate = loadedGamesPlayed > 0 
      ? Math.round((loadedGamesWon / loadedGamesPlayed) * 100) 
      : 0;
    
    // Load difficulty-specific stats
    const difficultyStats = {
      easy: {
        games: parseInt(localStorage.getItem('easyGames') || '0'),
        wins: parseInt(localStorage.getItem('easyWins') || '0'),
        winRate: parseInt(localStorage.getItem('easyWinRate') || '0'),
        bestTime: parseInt(localStorage.getItem('easyBestTime') || '0') || null,
        dailyChallengeAttempts: parseInt(localStorage.getItem('easyDailyChallengeAttempts') || '0'),
      },
      medium: {
        games: parseInt(localStorage.getItem('mediumGames') || '0'),
        wins: parseInt(localStorage.getItem('mediumWins') || '0'),
        winRate: parseInt(localStorage.getItem('mediumWinRate') || '0'),
        bestTime: parseInt(localStorage.getItem('mediumBestTime') || '0') || null,
        dailyChallengeAttempts: parseInt(localStorage.getItem('mediumDailyChallengeAttempts') || '0'),
      },
      hard: {
        games: parseInt(localStorage.getItem('hardGames') || '0'),
        wins: parseInt(localStorage.getItem('hardWins') || '0'),
        winRate: parseInt(localStorage.getItem('hardWinRate') || '0'),
        bestTime: parseInt(localStorage.getItem('hardBestTime') || '0') || null,
        dailyChallengeAttempts: parseInt(localStorage.getItem('hardDailyChallengeAttempts') || '0'),
      }
    };
    
    // Verify win rates are correct for each difficulty
    Object.keys(difficultyStats).forEach(diff => {
      const games = difficultyStats[diff].games;
      const wins = difficultyStats[diff].wins;
      if (games > 0) {
        const calculatedWinRate = Math.round((wins / games) * 100);
        difficultyStats[diff].winRate = calculatedWinRate;
      }
    });
    
    // Load daily challenge stats
    const dailyChallengeStreak = parseInt(localStorage.getItem('dailyChallengeStreak') || '0');
    const dailyChallengeMaxStreak = parseInt(localStorage.getItem('dailyChallengeMaxStreak') || '0');
    const dailyChallengeAttempts = parseInt(localStorage.getItem('dailyChallengeAttempts') || '0');
    const isDailyChallengeCompleted = localStorage.getItem('dailyChallengeCompleted') === 'true';
    
    // Load duel stats
    const challengeWins = parseInt(localStorage.getItem('challengeWins') || '0');
    const challengeLosses = parseInt(localStorage.getItem('challengeLosses') || '0');
    
    // Verify the overall win rate
    if (loadedGamesPlayed > 0) {
      const calculatedWinRate = Math.round((loadedGamesWon / loadedGamesPlayed) * 100);
      if (calculatedWinRate !== overallWinRate) {
        localStorage.setItem('winRate', calculatedWinRate.toString());
      }
    }
    
    setStats({
      gamesPlayed: loadedGamesPlayed,
      gamesWon: loadedGamesWon,
      bestTime: loadedBestTime || null,
      joinedDate,
      lastPlayed,
      difficultyStats,
      dailyChallengeStats: {
        streak: dailyChallengeStreak,
        maxStreak: dailyChallengeMaxStreak,
        totalAttempts: dailyChallengeAttempts,
        isCompleted: isDailyChallengeCompleted
      },
      duelStats: {
        wins: challengeWins,
        losses: challengeLosses,
        totalDuels: challengeWins + challengeLosses
      }
    });
  };
  
  // Calculate win rate
  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Reset all stats
  const resetAllStats = () => {
    // Reset basic stats
    localStorage.setItem('gamesPlayed', '0');
    localStorage.setItem('gamesWon', '0');
    localStorage.setItem('bestTime', '0');
    localStorage.setItem('winRate', '0');
    
    // Reset difficulty-specific stats
    ['easy', 'medium', 'hard'].forEach(diff => {
      localStorage.setItem(`${diff}Games`, '0');
      localStorage.setItem(`${diff}Wins`, '0');
      localStorage.setItem(`${diff}WinRate`, '0');
      localStorage.setItem(`${diff}BestTime`, '0');
      localStorage.setItem(`${diff}DailyChallengeAttempts`, '0');
    });
    
    // Reset streaks
    localStorage.setItem('currentStreak', '0');
    localStorage.setItem('maxStreak', '0');
    localStorage.setItem('dailyChallengeStreak', '0');
    localStorage.setItem('dailyChallengeMaxStreak', '0');
    
    // Reset daily challenge stats
    localStorage.setItem('dailyChallengeAttempts', '0');
    localStorage.removeItem('dailyChallengeLastPlayed');
    localStorage.removeItem('dailyChallengeCompleted');
    localStorage.removeItem('inDailyChallenge');
    localStorage.removeItem('currentDailyChallenge');
    
    // Reset duel stats
    localStorage.setItem('challengeWins', '0');
    localStorage.setItem('challengeLosses', '0');
    localStorage.removeItem('inDuel');
    localStorage.setItem('challengeHistory', JSON.stringify([]));
    
    // Update last reset date
    localStorage.setItem('statsResetDate', new Date().toISOString());
    
    // Dispatch a custom event that other components can listen for
    const resetEvent = new CustomEvent('statsReset');
    window.dispatchEvent(resetEvent);
    
    // Reload all stats
    loadAllStats();
    
    // Close modal
    setShowResetModal(false);
    
    // Emit a notification about the reset via a callback
    if (onBack) {
      setTimeout(() => {
        onBack(); // Return to homepage to ensure all stats are refreshed
      }, 500);
    }
  };
  
  // Function to get streak information
  const getStreakInfo = () => {
    const streakCount = parseInt(localStorage.getItem('currentStreak') || '0');
    const maxStreak = parseInt(localStorage.getItem('maxStreak') || '0');
    
    return {
      current: streakCount,
      max: maxStreak
    };
  };
  
  const streakInfo = getStreakInfo();

  // Calculate total daily challenge attempts
  const totalDailyChallengeAttempts = 
    stats.difficultyStats.easy.dailyChallengeAttempts + 
    stats.difficultyStats.medium.dailyChallengeAttempts + 
    stats.difficultyStats.hard.dailyChallengeAttempts;

  return (
    <motion.div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-600 overflow-hidden max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Close button */}
        <motion.button
          className="absolute top-4 right-4 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-full z-10"
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </motion.button>
        
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-800 text-white p-6 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="bg-indigo-600 w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-2 border-indigo-400">
              <FontAwesomeIcon icon={faUser} className="text-white text-3xl" />
            </div>
            
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center sm:justify-start gap-2">
                {localStorage.getItem('orngPlayerName') || 'You'}
                <motion.button
                  onClick={() => setShowNameModal(true)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 p-1 rounded"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={faEdit} className="text-white text-xs" />
                </motion.button>
              </h2>
              
              <div className="text-indigo-200 mb-2">
                Member since {formatDate(stats.joinedDate)}
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <div className="bg-indigo-700/50 px-3 py-1 rounded-full flex items-center gap-1">
                  <FontAwesomeIcon icon={faCoins} className="text-yellow-400 text-sm" />
                  <span className="font-medium">{parseInt(localStorage.getItem('orngPoints') || '0')} ORNG</span>
                </div>
                
                <div className="bg-indigo-700/50 px-3 py-1 rounded-full flex items-center gap-1">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-sm" />
                  <span className="font-medium">Rank: {localStorage.getItem('orngRank') || 'Novice'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Your Performance</h3>
          
          {/* Overall Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <div className="text-indigo-300 font-medium mb-1">Games</div>
              <div className="text-white text-2xl font-bold">{stats.gamesPlayed}</div>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <div className="text-green-300 font-medium mb-1">Wins</div>
              <div className="text-white text-2xl font-bold">{stats.gamesWon}</div>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <div className="text-amber-300 font-medium mb-1">Win Rate</div>
              <div className="text-white text-2xl font-bold">{winRate}%</div>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <div className="text-yellow-300 font-medium mb-1">Best Time</div>
              <div className="text-white text-2xl font-bold">{stats.bestTime || "-"}</div>
            </div>
          </div>
          
          {/* Difficulty Stats */}
          <h3 className="text-lg font-semibold mb-3 text-white">By Difficulty</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-white mb-6">
              <thead>
                <tr className="bg-slate-700">
                  <th className="p-2 text-left">Difficulty</th>
                  <th className="p-2 text-center">Games</th>
                  <th className="p-2 text-center">Wins</th>
                  <th className="p-2 text-center">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700">
                  <td className="p-2 font-medium text-green-300">Easy</td>
                  <td className="p-2 text-center">{stats.difficultyStats.easy.games}</td>
                  <td className="p-2 text-center">{stats.difficultyStats.easy.wins}</td>
                  <td className="p-2 text-center">{stats.difficultyStats.easy.winRate}%</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="p-2 font-medium text-yellow-300">Medium</td>
                  <td className="p-2 text-center">{stats.difficultyStats.medium.games}</td>
                  <td className="p-2 text-center">{stats.difficultyStats.medium.wins}</td>
                  <td className="p-2 text-center">{stats.difficultyStats.medium.winRate}%</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium text-red-300">Hard</td>
                  <td className="p-2 text-center">{stats.difficultyStats.hard.games}</td>
                  <td className="p-2 text-center">{stats.difficultyStats.hard.wins}</td>
                  <td className="p-2 text-center">{stats.difficultyStats.hard.winRate}%</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Daily Challenge Stats */}
          <h3 className="text-lg font-semibold mb-3 text-white">Daily Challenges</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <div className="text-purple-300 font-medium mb-1">Completed</div>
              <div className="text-white text-2xl font-bold">{stats.dailyChallengeStats.totalAttempts}</div>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <div className="text-purple-300 font-medium mb-1">Current Streak</div>
              <div className="text-white text-2xl font-bold">{stats.dailyChallengeStats.streak}</div>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <div className="text-purple-300 font-medium mb-1">Best Streak</div>
              <div className="text-white text-2xl font-bold">{stats.dailyChallengeStats.maxStreak}</div>
            </div>
          </div>
          
          {/* Achievement & Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button 
              onClick={() => setShowResetModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              Reset Statistics
            </button>
            
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Close
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Reset Stats Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-red-500"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <div className="flex items-center gap-3 mb-4 text-red-400">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl" />
                <h2 className="text-2xl font-bold">Reset All Stats?</h2>
              </div>
              
              <p className="text-white mb-6">
                This will permanently reset all your game statistics. This action cannot be undone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={resetAllStats}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  Yes, Reset All
                </motion.button>
                
                <motion.button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfilePage; 