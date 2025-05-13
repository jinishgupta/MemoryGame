import { db } from './config';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  updateDoc, 
  arrayUnion, 
  increment, 
  serverTimestamp 
} from 'firebase/firestore';

// User-related functions
export const saveUserToFirebase = async (user) => {
  try {
    console.log("Attempting to save user to Firebase:", user.id);
    const userRef = doc(db, 'users', user.id);
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) {
      // Create new user document
      await setDoc(userRef, {
        id: user.id,
        displayName: user.displayName || 'Anonymous Player',
        email: user.email || '',
        points: 0,
        gamesPlayed: 0,
        gamesWon: 0,
        bestTime: null,
        winRate: 0,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        gameHistory: []
      });
      
      console.log('New user created in Firebase:', user.id);
      return true;
    } else {
      // Update last login
      await updateDoc(userRef, {
        lastLogin: serverTimestamp()
      });
      
      console.log('User login updated in Firebase:', user.id);
      return true;
    }
  } catch (error) {
    console.error('Error saving user to Firebase:', error);
    return false;
  }
};

export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.log('User not found in Firebase');
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Points and stats related functions
export const updateUserPoints = async (userId, points, gameResult) => {
  try {
    console.log(`Updating user ${userId} points in Firebase:`, { 
      pointsToAdd: points,
      isWin: gameResult.isWin,
      difficulty: gameResult.difficulty
    });
    
    const userRef = doc(db, 'users', userId);
    
    // Create a game record
    const gameRecord = {
      timestamp: serverTimestamp(),
      pointsEarned: points,
      result: gameResult.isWin ? 'win' : 'loss',
      difficulty: gameResult.difficulty,
      timeSpent: gameResult.timeSpent || 0
    };
    
    await updateDoc(userRef, {
      points: increment(points),
      gamesPlayed: increment(1),
      gamesWon: gameResult.isWin ? increment(1) : increment(0),
      gameHistory: arrayUnion(gameRecord)
    });
    
    // If this is a winning game with improved time, update best time
    if (gameResult.isWin && gameResult.timeSpent) {
      const userData = await getUserData(userId);
      if (!userData.bestTime || gameResult.timeSpent < userData.bestTime) {
        await updateDoc(userRef, {
          bestTime: gameResult.timeSpent
        });
        console.log(`Updated best time for user ${userId} to ${gameResult.timeSpent} seconds`);
      }
    }
    
    // Calculate and update win rate
    const userData = await getUserData(userId);
    if (userData) {
      const winRate = userData.gamesPlayed > 0 
        ? Math.round((userData.gamesWon / userData.gamesPlayed) * 100) 
        : 0;
        
      await updateDoc(userRef, {
        winRate: winRate
      });
    }
    
    console.log(`User ${userId} points updated successfully: ${points} points added`);
    return true;
  } catch (error) {
    console.error(`Error updating user ${userId} points:`, error);
    return false;
  }
};

// Leaderboard functions
export const getLeaderboard = async (limit = 50) => {
  try {
    const leaderboardQuery = query(
      collection(db, 'users'),
      orderBy('points', 'desc'),
      limit(limit)
    );
    
    const leaderboardSnapshot = await getDocs(leaderboardQuery);
    const leaderboard = [];
    
    leaderboardSnapshot.forEach((doc) => {
      const data = doc.data();
      leaderboard.push({
        id: data.id,
        name: data.displayName,
        points: data.points,
        gamesPlayed: data.gamesPlayed,
        winRate: data.winRate
      });
    });
    
    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

// Game stats synchronization
export const syncLocalStatsWithFirebase = async (userId, localStats) => {
  try {
    const userData = await getUserData(userId);
    
    if (!userData) {
      console.error('User not found for syncing stats');
      return false;
    }
    
    // Merge local stats with Firebase stats
    // We take the higher value for games and wins
    const gamesPlayed = Math.max(localStats.gamesPlayed, userData.gamesPlayed || 0);
    const gamesWon = Math.max(localStats.gamesWon, userData.gamesWon || 0);
    
    // For bestTime, we take the lower value (faster time)
    let bestTime = userData.bestTime;
    if (localStats.bestTime && (!bestTime || localStats.bestTime < bestTime)) {
      bestTime = localStats.bestTime;
    }
    
    // Calculate the win rate
    const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
    
    // Update Firebase with the merged stats
    await updateDoc(doc(db, 'users', userId), {
      gamesPlayed,
      gamesWon,
      bestTime,
      winRate
    });
    
    console.log('Stats synchronized with Firebase');
    return true;
  } catch (error) {
    console.error('Error syncing stats with Firebase:', error);
    return false;
  }
}; 