import React from 'react';
import { useBedrockPassport } from "@bedrock_org/passport";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlay, faTrophy, faGear, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Profile } from './auth';
import StartScreen from '../StartScreen';
import DailyChallenge from './DailyChallenge';

const HomePage = ({ onStart, onDifficultyChange, selectedDifficulty }) => {
  const { isLoggedIn, user, signOut } = useBedrockPassport();
  
  if (!isLoggedIn) {
    return null;
  }
  
  const userName = user?.displayName || user?.name || "Player";

  const handleLogout = async () => {
    await signOut();
    // Refresh page after logout
    window.location.reload();
  };

  const handleChallengeStart = (challengeInfo) => {
    // Set the difficulty based on challenge info
    onDifficultyChange(challengeInfo.difficulty);
    // Start the game with challenge settings
    onStart();
  };
  
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-slate-800 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Header with user profile */}
      <header className="p-4 flex justify-between items-center bg-slate-800 bg-opacity-70 backdrop-blur-sm">
        <div className="flex items-center">
          <motion.img 
            src="https://irp.cdn-website.com/e81c109a/dms3rep/multi/orange-web3-logo-v2a-20241018.svg"
            alt="Memory Game" 
            className="h-10 mr-3"
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
          />
          <h1 className="text-2xl font-bold text-orange-400">Memory Game</h1>
        </div>
        
        <div className="profile-section">
          <Profile />
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Welcome section */}
        <motion.section 
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
            Welcome, {userName}!
          </h2>
          <p className="text-xl opacity-80 max-w-2xl mx-auto">
            Challenge your memory with our exciting card matching game. Match all the pairs before time runs out!
          </p>
        </motion.section>
        
        {/* Game options */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left panel - Difficulty selector */}
          <motion.div 
            className="bg-slate-800 bg-opacity-60 p-8 rounded-2xl shadow-lg border border-slate-700 md:col-span-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <FontAwesomeIcon icon={faGear} className="mr-3 text-orange-400" />
              Game Settings
            </h3>
            
            <StartScreen 
              onStart={onStart} 
              onDifficultyChange={onDifficultyChange}
              selectedDifficulty={selectedDifficulty}
              embedded={true}
            />
          </motion.div>
          
          {/* Right panel - Daily Challenge */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <DailyChallenge onStart={handleChallengeStart} />
          </motion.div>
        </div>
        
        {/* Right panel - Stats and info */}
        <motion.div 
          className="bg-slate-800 bg-opacity-60 p-8 rounded-2xl shadow-lg border border-slate-700"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h3 className="text-2xl font-semibold mb-6 flex items-center">
            <FontAwesomeIcon icon={faTrophy} className="mr-3 text-orange-400" />
            Your Stats
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-700 bg-opacity-50 rounded-lg">
              <span>Games Played</span>
              <span className="font-bold text-xl">0</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-700 bg-opacity-50 rounded-lg">
              <span>Best Time</span>
              <span className="font-bold text-xl">--</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-700 bg-opacity-50 rounded-lg">
              <span>Win Rate</span>
              <span className="font-bold text-xl">0%</span>
            </div>
          </div>
          
          <motion.button
            onClick={onStart}
            className="w-full mt-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg shadow-lg flex items-center justify-center text-xl transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <FontAwesomeIcon icon={faPlay} className="mr-3" />
            Play Now
          </motion.button>
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="mt-12 p-4 text-center">
        <motion.button
          onClick={handleLogout}
          className="mb-4 px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md flex items-center mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Sign Out
        </motion.button>
        <p className="opacity-70 text-sm">© 2024 Memory Game | Powered by Orange ID</p>
      </footer>
    </motion.div>
  );
};

export default HomePage; 