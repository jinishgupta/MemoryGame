// Constants for point rewards
export const POINTS = {
  EASY_WIN: 50,
  MEDIUM_WIN: 100,
  HARD_WIN: 150,
  DAILY_MULTIPLIER: 2,
  STREAK_BONUS: 25 // Bonus points per day of streak
};

// Initialize the leaderboard from localStorage or with an empty array
const initializeLeaderboard = () => {
  let leaderboard = localStorage.getItem('orngLeaderboard');
  
  if (!leaderboard) {
    // Initialize with empty array - no mock data
    localStorage.setItem('orngLeaderboard', JSON.stringify([]));
    return [];
  }
  
  // Filter out any mock players (those with IDs starting with 'player')
  const parsedLeaderboard = JSON.parse(leaderboard);
  const realUsers = parsedLeaderboard.filter(player => !player.id.startsWith('player'));
  
  // If the filtered leaderboard is different, update localStorage
  if (realUsers.length !== parsedLeaderboard.length) {
    localStorage.setItem('orngLeaderboard', JSON.stringify(realUsers));
  }
  
  return realUsers;
};

// Get the current player's ID (use a consistent ID for demo)
export const getCurrentPlayerId = () => {
  let playerId = localStorage.getItem('orngPlayerId');
  
  if (!playerId) {
    // Generate a random ID for the player with a prefix indicating it's a real user
    playerId = 'user-' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('orngPlayerId', playerId);
  }
  
  return playerId;
};

// Get the current player's name (use a consistent name for demo)
export const getCurrentPlayerName = () => {
  let playerName = localStorage.getItem('orngPlayerName');
  
  if (!playerName) {
    // Default name
    playerName = "You";
    localStorage.setItem('orngPlayerName', playerName);
  }
  
  return playerName;
};

// Calculate points for a win based on difficulty and whether it's a daily challenge
export const calculatePoints = (difficulty, isDailyChallenge, streak = 0) => {
  // Base points by difficulty
  let points = 0;
  
  switch(difficulty.toLowerCase()) {
    case 'easy':
      points = POINTS.EASY_WIN;
      break;
    case 'medium':
      points = POINTS.MEDIUM_WIN;
      break;
    case 'hard':
      points = POINTS.HARD_WIN;
      break;
    default:
      points = POINTS.MEDIUM_WIN;
  }
  
  // Apply daily challenge multiplier if applicable
  if (isDailyChallenge) {
    points *= POINTS.DAILY_MULTIPLIER;
  }
  
  // Add streak bonus if applicable
  if (streak > 1) {
    points += (streak - 1) * POINTS.STREAK_BONUS;
  }
  
  return points;
};

// Add points to the current player
export const addPointsToPlayer = (points) => {
  const playerId = getCurrentPlayerId();
  const playerName = getCurrentPlayerName();
  const leaderboard = getLeaderboard();
  
  // Find the current player in the leaderboard
  const playerIndex = leaderboard.findIndex(p => p.id === playerId);
  
  if (playerIndex >= 0) {
    // Player already exists in leaderboard
    leaderboard[playerIndex].points += points;
  } else {
    // Add player to leaderboard
    leaderboard.push({
      id: playerId,
      name: playerName,
      points: points
    });
  }
  
  // Sort the leaderboard by points in descending order
  leaderboard.sort((a, b) => b.points - a.points);
  
  // Save the updated leaderboard
  localStorage.setItem('orngLeaderboard', JSON.stringify(leaderboard));
  
  return {
    leaderboard,
    currentPoints: leaderboard.find(p => p.id === playerId).points,
    pointsEarned: points
  };
};

// Get the current player's rank
export const getPlayerRank = () => {
  const playerId = getCurrentPlayerId();
  const leaderboard = getLeaderboard();
  
  // Find the player's position
  const playerIndex = leaderboard.findIndex(p => p.id === playerId);
  
  if (playerIndex === -1) {
    // Player not found
    return {
      rank: 'N/A',
      points: 0
    };
  }
  
  return {
    rank: playerIndex + 1, // +1 because array indices start from 0
    points: leaderboard[playerIndex].points
  };
};

// Get the total ORNG points of the current player
export const getPlayerPoints = () => {
  const playerId = getCurrentPlayerId();
  const leaderboard = getLeaderboard();
  const player = leaderboard.find(p => p.id === playerId);
  
  return player ? player.points : 0;
};

// Get the top players from the leaderboard
export const getTopPlayers = (count = 25) => {
  const leaderboard = getLeaderboard();
  return leaderboard.slice(0, count);
};

// Get the entire leaderboard
export const getLeaderboard = () => {
  return initializeLeaderboard();
};

// Reset the player's points (for testing)
export const resetPlayerPoints = () => {
  const playerId = getCurrentPlayerId();
  const leaderboard = getLeaderboard();
  const playerIndex = leaderboard.findIndex(p => p.id === playerId);
  
  if (playerIndex >= 0) {
    leaderboard[playerIndex].points = 0;
    localStorage.setItem('orngLeaderboard', JSON.stringify(leaderboard));
  }
  
  return leaderboard;
}; 