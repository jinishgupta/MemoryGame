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

function App() {
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
      
      <div className="game-container">
        <AnimatePresence>
          {!gameStarted ? (
            <StartScreen 
              onStartGame={startGame} 
              onSelectDifficulty={(diff) => {
                setDifficulty(diff);
                playSound('click');
              }}
              selectedDifficulty={difficulty}
            />
          ) : (
            <>
              <GameHeader 
                timer={timer}
                pairs={matchedPairs}
                totalPairs={totalPairs}
                isRunning={isRunning}
                onPause={() => {
                  setIsRunning(false);
                  playSound('click');
                }}
                onPlay={() => {
                  setIsRunning(true);
                  playSound('click');
                }}
                onRestart={() => {
                  playSound('click');
                  restartGame();
                }}
                onHome={() => {
                  playSound('click');
                  returnToHome();
                }}
                difficulty={difficulty}
              />
              
              <motion.div 
                className="card-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
              >
                {cards.map((card, index) => (
                  <Card
                    key={card.id}
                    icon={card.icon}
                    onClick={() => handleCardClick(index)}
                    isFlipped={flippedCards.includes(index) || matchedCards.includes(index)}
                    isMatched={matchedCards.includes(index)}
                    canFlip={isRunning && !gameOver}
                    shake={shakeCard?.includes(index)}
                  />        
                ))}
              </motion.div>
              
              {gameOver && (
                <GameOver 
                  result={result}
                  timer={timer}
                  pairs={matchedPairs}
                  onRestart={() => {
                    playSound('click');
                    restartGame();
                  }}
                  onHome={() => {
                    playSound('click');
                    returnToHome();
                  }}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;