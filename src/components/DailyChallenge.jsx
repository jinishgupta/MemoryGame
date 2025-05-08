import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faLock, faUnlock, faStar, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useBedrockPassport } from "@bedrock_org/passport";

const DailyChallenge = ({ onStart }) => {
  const { user } = useBedrockPassport();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastPlayed, setLastPlayed] = useState(null);
  const [challengeInfo, setChallengeInfo] = useState({
    difficulty: "Hard",
    time: 45,
    pairs: 10,
    specialReward: "2x Points"
  });

  // Check if challenge is unlocked (once per day)
  useEffect(() => {
    const today = new Date().toDateString();
    const storedLastPlayed = localStorage.getItem('dailyChallengeLastPlayed');
    const storedStreak = parseInt(localStorage.getItem('dailyChallengeStreak') || '0');
    
    setLastPlayed(storedLastPlayed);
    setStreak(storedStreak);
    
    // Unlock if not played today
    setIsUnlocked(storedLastPlayed !== today);
  }, []);

  const handleStartChallenge = () => {
    if (!isUnlocked) return;
    
    // Record that user played today
    const today = new Date().toDateString();
    localStorage.setItem('dailyChallengeLastPlayed', today);
    
    // Update streak
    const newStreak = streak + 1;
    localStorage.setItem('dailyChallengeStreak', newStreak.toString());
    setStreak(newStreak);
    
    // Start the challenge
    onStart(challengeInfo);
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-purple-800 to-indigo-900 p-6 rounded-2xl shadow-xl border border-purple-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-yellow-400" />
          Daily Challenge
        </h3>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
          <span className="text-white font-medium">{streak} Day Streak</span>
        </div>
      </div>
      
      <div className="bg-black bg-opacity-30 p-4 rounded-xl mb-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-purple-900 bg-opacity-50 p-3 rounded-lg">
            <p className="text-sm text-purple-300">Difficulty</p>
            <p className="text-lg font-bold text-white">{challengeInfo.difficulty}</p>
          </div>
          <div className="bg-purple-900 bg-opacity-50 p-3 rounded-lg">
            <p className="text-sm text-purple-300">Time Limit</p>
            <p className="text-lg font-bold text-white">{challengeInfo.time}s</p>
          </div>
          <div className="bg-purple-900 bg-opacity-50 p-3 rounded-lg">
            <p className="text-sm text-purple-300">Pairs</p>
            <p className="text-lg font-bold text-white">{challengeInfo.pairs}</p>
          </div>
          <div className="bg-purple-900 bg-opacity-50 p-3 rounded-lg">
            <p className="text-sm text-purple-300">Special Reward</p>
            <p className="text-lg font-bold text-white">{challengeInfo.specialReward}</p>
          </div>
        </div>
        
        {lastPlayed && (
          <p className="text-sm text-purple-300 text-center">
            Last played: {new Date(lastPlayed).toLocaleDateString()}
          </p>
        )}
      </div>
      
      <motion.button
        onClick={handleStartChallenge}
        disabled={!isUnlocked}
        className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 ${
          isUnlocked 
            ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white' 
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
        whileHover={isUnlocked ? { scale: 1.03 } : {}}
        whileTap={isUnlocked ? { scale: 0.98 } : {}}
      >
        {isUnlocked ? (
          <>
            <FontAwesomeIcon icon={faUnlock} />
            Start Challenge
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faLock} />
            Challenge Completed
          </>
        )}
      </motion.button>
      
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-300">
        <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
        <span>Complete daily challenges to earn special rewards!</span>
      </div>
    </motion.div>
  );
};

export default DailyChallenge; 