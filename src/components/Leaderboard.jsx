import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faArrowLeft, 
  faMedal, 
  faCrown, 
  faCoins, 
  faUserCircle,
  faQuestionCircle,
  faRedo,
  faSort,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { 
  getLeaderboard,
  getTopPlayers,
  getPlayerRank,
  getCurrentPlayerName,
  POINTS
} from '../utils/leaderboard';

const Leaderboard = ({ onBack }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerRank, setPlayerRank] = useState({ rank: 0, points: 0 });
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPointsInfo, setShowPointsInfo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rank'); // 'rank' or 'points'

  // Load leaderboard data on component mount
  useEffect(() => {
    const loadLeaderboard = () => {
      setLoading(true);
      
      // Get top players
      const topPlayers = getTopPlayers(25);
      setLeaderboard(topPlayers);
      
      // Get player's rank
      const rank = getPlayerRank();
      setPlayerRank(rank);
      
      // Get player's name
      const name = getCurrentPlayerName();
      setPlayerName(name);
      
      setLoading(false);
    };
    
    loadLeaderboard();
  }, []);

  // Filter leaderboard by search term
  const filteredLeaderboard = leaderboard.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle refresh leaderboard
  const handleRefresh = () => {
    const topPlayers = getTopPlayers(25);
    setLeaderboard(topPlayers);
    
    const rank = getPlayerRank();
    setPlayerRank(rank);
  };
  
  // Get medal for top 3 players
  const getMedal = (index) => {
    switch(index) {
      case 0:
        return <FontAwesomeIcon icon={faCrown} className="text-yellow-400" />;
      case 1:
        return <FontAwesomeIcon icon={faMedal} className="text-gray-400" />;
      case 2:
        return <FontAwesomeIcon icon={faMedal} className="text-amber-700" />;
      default:
        return null;
    }
  };
  
  // Get CSS class for player row
  const getRowClass = (playerId) => {
    return playerId === localStorage.getItem('orngPlayerId')
      ? 'bg-indigo-900/50 border-l-4 border-indigo-500'
      : 'bg-slate-800/50 hover:bg-slate-700/50';
  };

  // Main function to get current player ID
  const getCurrentPlayerId = () => {
    return localStorage.getItem('orngPlayerId');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-800 py-8 px-4 overflow-y-auto">
      <div className="container max-w-4xl mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center mb-6">
          <motion.button
            onClick={onBack}
            className="flex items-center text-white px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Home
          </motion.button>
          
          <motion.button
            onClick={handleRefresh}
            className="flex items-center text-white px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faRedo} className="mr-2" />
            Refresh
          </motion.button>
        </div>

        {/* Title */}
        <motion.div 
          className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-8 mb-8 shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-300 text-4xl mr-4" />
              <h1 className="text-3xl font-bold text-white">ORNG Points Leaderboard</h1>
            </div>
            
            <div>
              <div className="bg-black/30 px-5 py-3 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faCoins} className="text-yellow-300 mr-2" />
                <span className="text-white font-medium mr-2">Your Points:</span>
                <span className="text-2xl font-bold text-yellow-300">{playerRank.points}</span>
                <div className="ml-3 pl-3 border-l border-gray-600">
                  <span className="text-white font-medium mr-2">Rank:</span>
                  <span className="text-xl font-bold text-white">#{playerRank.rank}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Points info tooltip */}
        <motion.div 
          className="bg-slate-800 rounded-xl p-5 mb-6 relative border border-slate-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCoins} className="text-yellow-400 text-xl mr-3" />
              <h2 className="text-xl font-bold text-white">ORNG Points System</h2>
            </div>
            
            <motion.button
              onClick={() => setShowPointsInfo(!showPointsInfo)}
              className="text-slate-300 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon 
                icon={faQuestionCircle} 
                className="text-xl" 
              />
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showPointsInfo && (
              <motion.div 
                className="mt-4 bg-slate-900 p-4 rounded-lg text-slate-300"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="mb-2">Earn ORNG points by winning games:</p>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>• Easy difficulty win:</span>
                    <span className="font-semibold text-orange-400">{POINTS.EASY_WIN} points</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• Medium difficulty win:</span>
                    <span className="font-semibold text-orange-400">{POINTS.MEDIUM_WIN} points</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• Hard difficulty win:</span>
                    <span className="font-semibold text-orange-400">{POINTS.HARD_WIN} points</span>
                  </li>
                  <li className="flex justify-between border-t border-slate-700 pt-2 mt-2">
                    <span>• Daily Challenge bonus:</span>
                    <span className="font-semibold text-yellow-400">{POINTS.DAILY_MULTIPLIER}x multiplier</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• Streak bonus (per day):</span>
                    <span className="font-semibold text-green-400">+{POINTS.STREAK_BONUS} points</span>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Search and sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <button
            onClick={() => setSortBy(sortBy === 'rank' ? 'points' : 'rank')}
            className="bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-600"
          >
            <FontAwesomeIcon icon={faSort} className="mr-2" />
            Sort by {sortBy === 'rank' ? 'Points' : 'Rank'}
          </button>
        </div>

        {/* Leaderboard table */}
        <motion.div 
          className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 bg-slate-900 p-4 font-medium text-white border-b border-slate-700 sticky top-0 z-10">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-7">Player</div>
            <div className="col-span-4 text-right">ORNG Points</div>
          </div>
          
          {/* Table body */}
          <div className="max-h-[560px] overflow-y-auto scrollable-container">
            {loading ? (
              <div className="text-center py-8 text-slate-400">
                Loading leaderboard...
              </div>
            ) : filteredLeaderboard.length > 0 ? (
              filteredLeaderboard.map((player, index) => (
                <motion.div 
                  key={player.id}
                  className={`grid grid-cols-12 gap-4 p-4 border-b border-slate-700 text-white ${getRowClass(player.id)}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.3 }}
                >
                  <div className="col-span-1 flex justify-center items-center">
                    {getMedal(index) || <span className="text-slate-400">#{index + 1}</span>}
                  </div>
                  
                  <div className="col-span-7 flex items-center">
                    {player.id === getCurrentPlayerId() ? (
                      <FontAwesomeIcon icon={faUserCircle} className="text-orange-400 mr-2" />
                    ) : (
                      <div className="w-5 mr-2"></div>
                    )}
                    <span className={player.id === getCurrentPlayerId() ? 'font-bold text-orange-300' : ''}>
                      {player.name}
                      {player.id === getCurrentPlayerId() && ' (You)'}
                    </span>
                  </div>
                  
                  <div className="col-span-4 text-right font-bold flex justify-end items-center">
                    <FontAwesomeIcon icon={faCoins} className="text-yellow-400 mr-2" />
                    <span>{player.points.toLocaleString()}</span>
                  </div>
                </motion.div>
              ))
            ) : searchTerm ? (
              <div className="text-center py-8 text-slate-400">
                No players found matching "{searchTerm}"
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 text-5xl mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">No players on the leaderboard yet</h3>
                <p className="text-slate-400 mb-4">Win games to earn ORNG points and be the first to appear here!</p>
                <p className="text-sm text-slate-500">The leaderboard shows real players only.</p>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Player's rank if not in top 25 */}
        {playerRank.rank > 25 && (
          <motion.div 
            className="mt-6 bg-indigo-900/50 p-4 rounded-lg border border-indigo-700 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUserCircle} className="text-orange-400 mr-3 text-xl" />
              <div>
                <p className="text-white">Your position</p>
                <p className="text-xl font-bold text-white">{playerName} <span className="text-orange-300">(#{playerRank.rank})</span></p>
              </div>
            </div>
            
            <div className="flex items-center bg-black/30 px-4 py-2 rounded-lg">
              <FontAwesomeIcon icon={faCoins} className="text-yellow-400 mr-2" />
              <span className="text-lg font-bold text-white">{playerRank.points}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard; 