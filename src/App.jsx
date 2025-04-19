import { useState, useEffect } from 'react';
import Card from './Card.jsx';
import bg2 from './assets/bg2.jpg';
import { faBitcoin,faCss3Alt,faEthereum,faGithub,faHtml5,faJava,faLinux,faReact } from '@fortawesome/free-brands-svg-icons';

function App() {
  const icons = [faBitcoin, faCss3Alt, faEthereum, faGithub, faHtml5, faJava, faLinux, faReact];
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [flipBackSignal, setFlipBackSignal] = useState(0);
  const [disableClicks, setDisableClicks] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(90); 
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null); 

  useEffect(() => {
    const shuffled = [...icons, ...icons]
      .map((icon, index) => ({ icon, id: index + Math.random() }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  useEffect(() => {
    if (gameOver || !isRunning) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          clearInterval(interval);
          setGameOver(true);
          setResult('lose');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, isRunning]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      setDisableClicks(true);

      if (cards[first].icon === cards[second].icon) {
        setMatchedCards(prev => [...prev, first, second]);
        setTimeout(() => {
          setFlippedCards([]);
          setDisableClicks(false);
        }, 1000);
      } else {
        setTimeout(() => {
          setFlipBackSignal(prev => prev + 1);
          setFlippedCards([]);
          setDisableClicks(false);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (cards.length > 0 && matchedCards.length === cards.length) {
      setGameOver(true);
      setIsRunning(false);
      setResult('win');
    }
  }, [matchedCards, cards]);

  const handleCardClick = (index) => {
    if (disableClicks || flippedCards.includes(index) || matchedCards.includes(index) || gameOver || !isRunning) return;
    if (flippedCards.length < 2) {
      setFlippedCards(prev => [...prev, index]);
    }
  };

  const restartGame = () => {
    const shuffled = [...icons, ...icons]
      .map((icon, index) => ({ icon, id: index + Math.random() }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedCards([]);
    setFlipBackSignal(0);
    setDisableClicks(false);
    setGameOver(false);
    setResult(null);
    setIsRunning(false);
    setTimer(90);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg2})` }}
    >
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black bg-opacity-60 px-6 py-3 rounded-xl text-yellow-300 shadow-md text-lg z-10">
        <span>⏱ Time: {timer}s</span>
        <button onClick={() => setIsRunning(true)} className="bg-green-600 px-3 py-1 rounded hover:bg-green-700">▶️ Play</button>
        <button onClick={() => setIsRunning(false)} className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-700">⏸️ Pause</button>
        <button onClick={restartGame} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">🔁 Restart</button>
      </div>

      {/* Game Over Popup */}
      {gameOver && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-10 py-6 rounded-2xl text-2xl shadow-xl z-50 text-center">
          {result === 'win' ? "🎉 You Win!" : "💀 Time's Up! You Lose!"}
          <button
            onClick={restartGame}
            className="block mt-4 mx-auto bg-yellow-400 text-black px-6 py-2 rounded-xl hover:bg-yellow-500 transition"
          >
            🔁 Restart Game
          </button>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 p-10 max-w-screen-lg mx-auto items-center justify-center">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            icon={card.icon}
            onClick={() => handleCardClick(index)}
            flipBackTrigger={flipBackSignal}
            canFlip = {isRunning && !gameOver}
          />
        ))}
      </div>
    </div>
  );
}

export default App;