import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./Card.jsx";
import StartScreen from "./StartScreen.jsx";
import GameOver from "./GameOver.jsx";
import GameHeader from "./GameHeader.jsx";
import { playSound, toggleSound, isSoundEnabled } from './sounds.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import {
  faBitcoin, faCss3Alt, faEthereum, faGithub,
  faHtml5, faJava, faLinux, faReact, faJs, 
  faPython, faNode, faDocker, faPhp, faVuejs,
  faAngular, faBootstrap, faUbuntu, faApple
} from "@fortawesome/free-brands-svg-icons";
import { useBedrockPassport } from "@bedrock_org/passport";
import { Login } from "./components/auth";
import { Profile } from "./components/auth";
import HomePage from "./components/HomePage";

function App() {
  const { isLoggedIn } = useBedrockPassport();
  // All available icons for cards
  const allIcons = [
    faBitcoin, faCss3Alt, faEthereum, faGithub, faHtml5, 
    faJava, faLinux, faReact, faJs, faPython, faNode, 
    faDocker, faPhp, faVuejs, faAngular, faBootstrap, 
    faUbuntu, faApple
  ];
  
  // Game state
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [shakeCard, setShakeCard] = useState(null);
  const [disableClicks, setDisableClicks] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const timerRef = useRef(null);
  
  // Difficulty settings
  const difficultySettings = {
    Easy: { time: 90, pairs: 6 },
    Medium: { time: 60, pairs: 8 },
    Hard: { time: 45, pairs: 10 }
  };

  // Window size state for responsiveness
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateShuffledCards = (pairCount) => {
    // Select the specified number of icons
    const selectedIcons = allIcons.slice(0, pairCount);
    let id = 0;
    // Create pairs
    const duplicatedIcons = [...selectedIcons, ...selectedIcons];
    // Return shuffled card objects
    return duplicatedIcons
      .map(icon => ({ icon, id: id++, matchId: icon.iconName }))
      .sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    const { time, pairs } = difficultySettings[difficulty];
    setTimer(time);
    setCards(generateShuffledCards(pairs));
    setFlippedCards([]);
    setMatchedCards([]);
    setGameStarted(true);
    setIsRunning(true);
    setGameOver(false);
    setResult(null);
    playSound('start');
  };

  const restartGame = () => {
    setDisableClicks(true);
    setIsRunning(false);
    setFlippedCards([]);
    setMatchedCards([]);
    setGameOver(false);
    setResult(null);
    
    const { time, pairs } = difficultySettings[difficulty];
    setTimer(time);
    
    setTimeout(() => {
      setCards(generateShuffledCards(pairs));
      setDisableClicks(false);
      setIsRunning(true);
      playSound('start');
    }, 500);
  };

  const returnToHome = () => {
    setGameStarted(false);
    setIsRunning(false);
    setGameOver(false);
    clearInterval(timerRef.current);
    playSound('click');
  };
  
  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    playSound('click');
  };

  // Timer management
  useEffect(() => {
    if (!isRunning || gameOver) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          setGameOver(true);
          setResult("lose");
          playSound('lose');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, gameOver]);

  // Card flipping logic
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      setDisableClicks(true);

      if (cards[first].matchId === cards[second].matchId) {
        // Match found
        playSound('match');
        setMatchedCards(prev => [...prev, first, second]);
        setTimeout(() => {
          setFlippedCards([]);
          setDisableClicks(false);
        }, 800);
      } else {
        // No match, shake cards
        setTimeout(() => {
          playSound('noMatch');
          setShakeCard([first, second]);
          setTimeout(() => {
            setShakeCard(null);
            setFlippedCards([]);
            setDisableClicks(false);
          }, 500);
        }, 800);
      }
    }
  }, [flippedCards, cards]);

  // Check for win condition
  useEffect(() => {
    if (cards.length && matchedCards.length === cards.length) {
      setGameOver(true);
      setIsRunning(false);
      setResult("win");
      playSound('win');
    }
  }, [matchedCards, cards]);

  const handleCardClick = index => {
    if (
      disableClicks ||
      flippedCards.includes(index) ||
      matchedCards.includes(index) ||
      gameOver ||
      !isRunning
    )
      return;

    // Play flip sound
    playSound('flip');
    
    // Flip card
    setFlippedCards(prev => [...prev, index]);
  };

  // Get the total number of pairs for display
  const totalPairs = cards.length / 2;
  const matchedPairs = matchedCards.length / 2;

  // Calculate grid columns based on difficulty and window width
  const getGridColumnsClass = () => {
    if (windowSize.width >= 1024) { // Large screens
      switch(difficulty) {
        case 'Easy': return 'grid-cols-4 lg:grid-cols-6';
        case 'Medium': return 'grid-cols-4 lg:grid-cols-4';
        case 'Hard': return 'grid-cols-5 lg:grid-cols-5';
        default: return 'grid-cols-4 lg:grid-cols-4';
      }
    } else if (windowSize.width >= 640) { // Medium screens
      switch(difficulty) {
        case 'Easy': return 'grid-cols-4 md:grid-cols-4';
        case 'Medium': return 'grid-cols-4 md:grid-cols-4';
        case 'Hard': return 'grid-cols-5 md:grid-cols-5';
        default: return 'grid-cols-4 md:grid-cols-4';
      }
    } else { // Small screens
      switch(difficulty) {
        case 'Easy': return 'grid-cols-3';
        case 'Medium': return 'grid-cols-4';
        case 'Hard': return 'grid-cols-3';
        default: return 'grid-cols-3';
      }
    }
  };
  
  // Calculate max card height based on screen size and difficulty
  const getMaxCardHeight = () => {
    const isLandscape = windowSize.width > windowSize.height;
    const totalPairs = difficultySettings[difficulty].pairs;
    
    if (windowSize.width < 640) {
      return isLandscape ? '60px' : '90px'; 
    } else if (windowSize.width < 1024) {
      return isLandscape ? '90px' : '110px';
    } else {
      return isLandscape ? '120px' : '140px';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-800">
      {/* Sound toggle button */}
      <button 
        className="fixed top-4 right-4 z-50 bg-slate-800 p-3 rounded-full shadow-lg border border-slate-600"
        onClick={handleToggleSound}
        aria-label={soundOn ? "Mute sound" : "Enable sound"}
      >
        <FontAwesomeIcon 
          icon={soundOn ? faVolumeHigh : faVolumeXmark} 
          className={soundOn ? "text-yellow-300" : "text-white"}
          size="lg"
        />
      </button>
      
      {/* Profile component */}
      <div className="fixed top-4 left-4 z-50">
        <Profile />
      </div>
      
      {/* Game states */}
      {!isLoggedIn ? (
        <Login />
      ) : !gameStarted ? (
        <HomePage 
          onStart={startGame} 
          onDifficultyChange={setDifficulty}
          selectedDifficulty={difficulty}
        />
      ) : (
        <div className="h-screen flex flex-col py-2 px-2 sm:py-4 sm:px-4">
          <div className="flex-none">
            <GameHeader 
              timer={timer} 
              pairs={matchedPairs} 
              totalPairs={totalPairs}
              difficulty={difficulty}
              onRestart={restartGame}
              onHome={returnToHome}
            />
          </div>
          
          <motion.div 
            className={`flex-grow grid ${getGridColumnsClass()} gap-2 sm:gap-3 mt-2 sm:mt-4 overflow-hidden pb-2 place-content-center place-items-center`}
            style={{ 
              maxHeight: "calc(100vh - 100px)"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                isFlipped={flippedCards.includes(index) || matchedCards.includes(index)}
                isMatched={matchedCards.includes(index)}
                isShaking={shakeCard?.includes(index)}
                onClick={() => handleCardClick(index)}
                maxHeight={getMaxCardHeight()}
              />
            ))}
          </motion.div>
        </div>
      )}

      {/* Game over screen */}
      <AnimatePresence>
        {gameOver && (
          <GameOver 
            result={result} 
            matchedPairs={matchedPairs}
            totalPairs={totalPairs}
            onRestart={restartGame}
            onHome={returnToHome}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;