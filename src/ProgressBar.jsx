import { motion } from "framer-motion";

function ProgressBar({ value, max, className, height = "h-2", colorClass = "bg-amber-500" }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={`w-full bg-slate-700 rounded-full overflow-hidden ${height} ${className}`}>
      <motion.div
        className={`${colorClass} h-full`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      />
    </div>
  );
}

export default ProgressBar; 