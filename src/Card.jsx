import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Card({ icon, onClick, isFlipped, canFlip }) {
  const handleClick = () => {
    if (canFlip && !isFlipped) {
      onClick();
    }
  };

  return (
    <div className="flex items-center justify-center cursor-pointer">
      <div className="flip-card w-[170px] h-[170px] rounded-md" onClick={handleClick}>
        <motion.div
          className="flip-card-inner w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flip-card-front w-[150px] h-[180px] bg-gradient-to-br from-black to-red-600 flex items-center justify-center rounded-xl">
            <p className="text-2xl font-bold text-yellow-400 -rotate-45">MatchUp</p>
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