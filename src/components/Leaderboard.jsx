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
  faSearch,
  faTimes,
  faUsers,
  faRankingStar
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
  const [timeFilter, setTimeFilter] = useState('all');

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

  return (
    <motion.div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-600 overflow-hidden max-h-[90vh]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-900 to-slate-800 p-6 relative">
          <motion.button
            className="absolute top-4 right-4 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-full"
            onClick={onBack}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </motion.button>
          
          <h2 className="text-2xl font-bold text-white flex items-center mb-4">
            <FontAwesomeIcon icon={faTrophy} className="text-yellow-400 mr-3" />
            Leaderboard
          </h2>
          
          {/* Filter options */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-grow max-w-xs">
              <input
                type="text"
                placeholder="Search players..."
                className="bg-slate-700 text-white w-full rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
              />
            </div>
            
            <select
              className="bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:border-orange-500"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
        
        {/* Leaderboard content */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 140px)" }}>
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 bg-slate-900 p-4 font-medium text-white border-b border-slate-700">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-7 sm:col-span-6">Player</div>
            <div className="col-span-4 sm:col-span-5 text-right">ORNG Points</div>
          </div>
          
          {/* Table body */}
          <div>
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
                  <div className="col-span-1 flex items-center justify-center">
                    {index === 0 ? (
                      <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
                    ) : index === 1 ? (
                      <FontAwesomeIcon icon={faTrophy} className="text-slate-300" />
                    ) : index === 2 ? (
                      <FontAwesomeIcon icon={faTrophy} className="text-amber-700" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="col-span-7 sm:col-span-6 font-medium truncate flex items-center">
                    {player.id === localStorage.getItem('orngPlayerId') && (
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    )}
                    {player.name}
                    {player.id === localStorage.getItem('orngPlayerId') && timeFilter === 'all' && (
                      <span className="ml-2 text-xs bg-slate-700 px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  
                  <div className="col-span-4 sm:col-span-5 text-right font-bold text-orange-300 flex items-center justify-end">
                    <FontAwesomeIcon icon={faCoins} className="text-yellow-400 mr-1.5 text-sm" />
                    {player.points.toLocaleString()}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                No players found. Adjust your search criteria.
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with stats */}
        <div className="bg-slate-900 p-5 border-t border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm">
            <div className="bg-slate-800 px-4 py-2 rounded-lg flex items-center">
              <FontAwesomeIcon icon={faUsers} className="text-blue-400 mr-2" />
              <span className="text-slate-300">
                Total Players: <span className="text-white font-medium">{leaderboard.length}</span>
              </span>
            </div>
            
            <div className="bg-slate-800 px-4 py-2 rounded-lg flex items-center">
              <FontAwesomeIcon icon={faRankingStar} className="text-orange-400 mr-2" />
              <span className="text-slate-300">
                Your Rank: <span className="text-white font-medium">{playerRank.rank}</span>
              </span>
            </div>
            
            <button
              onClick={onBack}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Leaderboard; 