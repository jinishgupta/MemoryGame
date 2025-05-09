import React from 'react';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Card({ card, index, isFlipped, isMatched, isShaking, onClick, icon, flipped, matched, shake, disabled, difficulty }) {
  // Support both API styles
  const cardIcon = icon || (card && card.icon);
  const isCardFlipped = flipped || isFlipped;
  const isCardMatched = matched || isMatched;  
  const isCardShaking = shake || isShaking;
  const cardOnClick = onClick;
  
  // Adjust icon size based on difficulty and screen size
  const getIconSize = () => {
    if (window.innerWidth < 640) {
      return "2x"; // Smaller on mobile
    }
    
    if (difficulty === "Hard") {
      return "2x"; // Smaller for hard difficulty (more cards)
    }
    
    return "3x";
  };

  return (
    <div className="flip-card-container w-full aspect-square">
      <div 
        className={`flip-card ${isCardFlipped ? 'flipped' : ''}`}
        onClick={() => !isCardFlipped && !disabled && cardOnClick()}
      >
        <motion.div 
          className="flip-card-front"
          animate={{ 
            boxShadow: isCardMatched ? "0 0 10px 3px rgba(167, 243, 208, 0.7)" : "none",
            x: isCardShaking ? [0, -5, 5, -5, 5, 0] : 0
          }}
          transition={{ x: isCardShaking ? { duration: 0.5 } : {} }}
          whileHover={!isCardFlipped && !disabled ? { scale: 1.03 } : {}}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="text-center font-bold text-xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3, repeatType: "loop" }}
          >
            <span className="text-yellow-300">Match</span>
            <span className="text-white">Up</span>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flip-card-back"
          animate={{ 
            boxShadow: isCardMatched ? "0 0 15px 5px rgba(167, 243, 208, 0.7)" : "none"
          }}
        >
          <motion.div
            animate={{ 
              scale: isCardFlipped ? 1 : 0.8, 
              opacity: isCardFlipped ? 1 : 0,
              rotate: isCardMatched ? [0, 5, -5, 5, -5, 0] : 0
            }}
            transition={{ 
              duration: 0.3,
              rotate: { duration: 0.5, repeat: isCardMatched ? 1 : 0 }
            }}
          >
            <FontAwesomeIcon 
              icon={cardIcon} 
              size={getIconSize()} 
              className={isCardMatched ? "text-green-300" : "text-yellow-300"} 
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Card;