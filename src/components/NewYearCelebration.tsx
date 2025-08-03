import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

const NewYearCelebration = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Function to create initial celebration confetti
    const createCelebrationConfetti = () => {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 100,
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      // Create a one-time celebratory burst
      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#FFD700'],
        shapes: ['star']
      });

      setTimeout(() => {
        fire(0.2, {
          spread: 60,
          colors: ['#FF0000'],
          shapes: ['circle']
        });
      }, 250);

      setTimeout(() => {
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
          colors: ['#7B31FF'],
          shapes: ['square']
        });
      }, 500);

      setTimeout(() => {
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
          colors: ['#FF69B4']
        });
      }, 750);

      setTimeout(() => {
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
          colors: ['#00FF00']
        });
      }, 1000);
    };

    // Initial confetti burst
    createCelebrationConfetti();

    // Repeat the celebration every 3 seconds for 12 seconds total
    const interval = setInterval(createCelebrationConfetti, 3000);
    
    // Hide after 12 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      clearInterval(interval);
    }, 12000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="text-center px-4"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.5 }}
            >
              Happy New Year
            </motion.h1>
            <motion.div
              className="text-8xl md:text-9xl font-black mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 text-transparent bg-clip-text animate-pulse"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 1.2, type: "spring" }}
            >
              2025
            </motion.div>
            <motion.p 
              className="text-xl md:text-2xl text-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Wishing you a year filled with innovation and success! 🎉
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewYearCelebration; 