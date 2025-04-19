import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Card({ icon, onClick, flipBackTrigger, canFlip }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  function handleFlip() {
    if (!isAnimating && !isFlipped && canFlip) {
      setIsFlipped(true);
      setIsAnimating(true);
      onClick(); 
    }
  }

  // Flip back when parent triggers it
  useEffect(() => {
    if (isFlipped) {
      setIsFlipped(false);
    }
  }, [flipBackTrigger]);

  return (
    <div className="flex items-center justify-center cursor-pointer">
      <div className="flip-card w-[170px] h-[170px] rounded-md" onClick={handleFlip}>
        <motion.div
          className="flip-card-inner w-[100%] h-[100%]"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 360 }}
          transition={{ duration: 0.4 }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <div className="flip-card-front w-[150px] h-[180px] bg-gradient-to-br from-black to-red-600 flex items-center justify-center rounded-xl">
            <p className='text-2xl font-bold text-yellow-400 -rotate-45'>MatchUp</p>
          </div>
          <div className="flip-card-back w-[150px] h-[180px] bg-gradient-to-br from-black to-red-600 flex items-center justify-center rounded-xl">
            <FontAwesomeIcon icon={icon} size="4x" style={{ color: "#FFD43B" }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Card;