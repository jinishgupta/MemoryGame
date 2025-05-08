import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Card({ icon, onClick, isFlipped, canFlip, isMatched, shake }) {
  const handleClick = () => {
    if (canFlip && !isFlipped) {
      onClick();
    }
  };

  return (
    <motion.div 
      className="flip-card"
      whileHover={canFlip && !isFlipped ? { scale: 1.05 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        x: shake ? [0, -10, 10, -10, 10, 0] : 0
      }}
      transition={{ 
        duration: 0.3,
        x: shake ? { duration: 0.5 } : {}
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <motion.div
        className="flip-card-inner w-full h-full"
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
          boxShadow: isMatched ? "0 0 15px 5px rgba(167, 243, 208, 0.7)" : "none"
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="flip-card-front">
          <motion.span 
            className="text-2xl font-bold"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3, repeatType: "loop" }}
          >
            <span className="text-yellow-300">Match</span>
            <span className="text-white">Up</span>
          </motion.span>
        </div>
        <div className="flip-card-back">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isFlipped ? 1 : 0.8, 
              opacity: isFlipped ? 1 : 0,
              rotate: isMatched ? [0, 5, -5, 5, -5, 0] : 0
            }}
            transition={{ 
              delay: 0.2,
              duration: 0.3,
              rotate: { duration: 0.5, repeat: isMatched ? 1 : 0 }
            }}
          >
            <FontAwesomeIcon 
              icon={icon} 
              size="4x" 
              className={isMatched ? "text-green-300" : "text-yellow-300"} 
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Card;