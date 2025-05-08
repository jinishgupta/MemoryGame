import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faClock, faRotate, faHome } from "@fortawesome/free-solid-svg-icons";
import Confetti from "./Confetti.jsx";

function GameOver({ result, timer, pairs, onRestart, onHome }) {
  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {result === "win" && <Confetti />}
      
      <motion.div 
        className="modal-content text-center"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        {result === "win" ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, times: [0, 0.7, 1] }}
          >
            <FontAwesomeIcon 
              icon={faTrophy} 
              size="4x" 
              className="text-yellow-300 mb-4" 
            />
            <motion.h2 
              className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: 3 }}
            >
              You Win!
            </motion.h2>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon 
              icon={faClock} 
              size="4x" 
              className="text-red-400 mb-4" 
            />
            <h2 className="text-3xl font-bold mb-3 text-red-400">Time's Up!</h2>
          </motion.div>
        )}
        
        <div className="bg-slate-700/70 p-4 rounded-lg mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white">Time remaining:</span>
            <span className={result === "win" ? "text-green-300" : "text-red-400"}>
              {timer} seconds
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white">Pairs matched:</span>
            <span className="text-yellow-300">{pairs} pairs</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <motion.button 
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
          >
            <FontAwesomeIcon icon={faRotate} className="mr-2" /> Restart
          </motion.button>
          <motion.button 
            className="btn btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" /> Home
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GameOver; 