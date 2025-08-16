import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  percentageChange: number;
  color: string;
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  percentageChange,
  color,
}) => {
  const isPositive = percentageChange >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`stats-card bg-${color}-500`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white/90">{title}</h3>
        <div className={`p-2 rounded-full bg-${color}-600/30`}>{icon}</div>
      </div>
      
      <div className="flex flex-col">
        <div className="text-3xl font-bold mb-2">{value}</div>
        <div className={`flex items-center text-sm ${isPositive ? 'text-success-400' : 'text-error-400'}`}>
          {isPositive ? (
            <ArrowUp className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 mr-1" />
          )}
          <span>{Math.abs(percentageChange)}%</span>
        </div>
      </div>
      
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl bg-${color}-500/20 -z-10`}></div>
    </motion.div>
  );
};

export default StatsCard;