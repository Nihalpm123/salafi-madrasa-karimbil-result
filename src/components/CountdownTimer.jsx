import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CountdownTimer = ({ targetDate, onComplete }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (remaining.days === 0 && remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
      {timeBlocks.map((block, index) => (
        <div key={block.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="panel" style={{ 
            width: '100px', 
            height: '100px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'var(--color-primary)',
            color: '#fff',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={block.value}
                initial={{ y: 20, opacity: 0, rotateX: 90 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                exit={{ y: -20, opacity: 0, rotateX: -90 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
                style={{ fontSize: '3rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}
              >
                {String(block.value).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </div>
          <span style={{ marginTop: '12px', fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
