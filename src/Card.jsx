import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Card({ card, index, isFlipped, isMatched, isShaking, onClick, maxHeight = '120px' }) {
  return (
    <motion.div 
      className="aspect-square bg-transparent perspective-1000 h-full"
      style={{ maxHeight, maxWidth: maxHeight }}
      whileHover={!isFlipped ? { scale: 1.03 } : {}}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1, 
        x: isShaking ? [0, -5, 5, -5, 5, 0] : 0
      }}
      transition={{ 
        duration: 0.3,
        x: isShaking ? { duration: 0.5 } : {}
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => !isFlipped && onClick()}
    >
      <motion.div
        className="relative w-full h-full duration-500 preserve-3d"
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
          boxShadow: isMatched ? "0 0 10px 3px rgba(167, 243, 208, 0.7)" : "none"
        }}
        transition={{ duration: 0.5 }}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center shadow-md">
          <motion.span 
            className="text-base font-bold"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3, repeatType: "loop" }}
          >
            <span className="text-yellow-300">Match</span>
            <span className="text-white">Up</span>
          </motion.span>
        </div>
        
        {/* Back of card - shows icon */}
        <div className="absolute w-full h-full backface-hidden bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center shadow-md rotateY-180">
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
              icon={card.icon} 
              size="2x" 
              className={isMatched ? "text-green-300" : "text-yellow-300"} 
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Card;