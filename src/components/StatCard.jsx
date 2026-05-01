import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color = 'gold', delay = 0 }) => {
  const isTeal = color === 'teal';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`glass-panel animate-float`}
      style={{ 
        padding: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px',
        borderLeft: `4px solid ${isTeal ? 'var(--color-teal)' : 'var(--color-gold)'}`
      }}
    >
      <div style={{
        background: isTeal ? 'rgba(0, 128, 128, 0.1)' : 'rgba(212, 175, 55, 0.1)',
        padding: '16px',
        borderRadius: '12px',
        color: isTeal ? 'var(--color-teal)' : 'var(--color-gold)'
      }}>
        <Icon size={32} />
      </div>
      <div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>{title}</p>
        <h3 style={{ fontSize: '1.8rem', color: 'var(--color-text-primary)' }}>{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;
