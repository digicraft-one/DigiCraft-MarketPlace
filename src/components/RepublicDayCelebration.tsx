import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

// Glowing Orb Component with enhanced animations
const GlowingOrb = ({ color, delay, duration, x }: { color: string; delay: number; duration: number; x: number }) => {
  const scale = 0.3 + Math.random() * 0.2; // Even smaller size variation
  const innerColor = color === '#FFFFFF' ? color : `${color}88`; // More transparent
  const outerColor = color === '#FFFFFF' ? 'rgba(255,255,255,0.15)' : `${color}15`; // Much more transparent

  return (
    <motion.div
      initial={{ 
        y: -20, 
        x, 
        opacity: 0,
        scale 
      }}
      animate={{
        y: ['0vh', '100vh'],
        x: [x - 50, x + 20, x - 30, x + 50], // Gentle swaying
        opacity: [0, 0.7, 0.7, 0], // Reduced max opacity
        scale: [scale, scale * 1.2, scale * 0.9, scale * 1.1]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute top-0 pointer-events-none"
    >
      <motion.div 
        className="relative"
        animate={{
          opacity: [0.5, 1, 0.5], // Pulsing effect
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Outer glow */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl" // Increased blur
          style={{ 
            background: outerColor,
            width: '16px',
            height: '16px',
            transform: 'translate(-25%, -25%) scale(2.5)'
          }}
        />
        {/* Inner glow */}
        <div 
          className="absolute rounded-full blur-xl" // Increased blur
          style={{ 
            background: innerColor,
            width: '10px',
            height: '10px',
            transform: 'translate(0%, 0%)'
          }}
        />
        {/* Core */}
        <div 
          className="rounded-full"
          style={{ 
            background: color,
            width: '6px',
            height: '6px',
            opacity: 0.7, // Reduced core opacity
            boxShadow: `0 0 6px ${color}88, 0 0 10px ${color}44, 0 0 15px ${color}22` // More subtle shadow
          }}
        />
      </motion.div>
    </motion.div>
  );
};

// Generate random glowing orbs
const PermanentOrbs = () => {
  const [orbs, setOrbs] = useState<Array<{
    id: number;
    color: string;
    delay: number;
    duration: number;
    x: number;
  }>>([]);

  useEffect(() => {
    const generateOrbs = () => {
      const windowWidth = window.innerWidth;
      return Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        color: ['#FF9933', '#FFFFFF', '#138808'][Math.floor(Math.random() * 3)],
        delay: Math.random() * 20,
        duration: 25 + Math.random() * 35, // Slower movement
        x: (windowWidth * (i % 30)) / 30 + (Math.random() * 50 - 25)
      }));
    };

    setOrbs(generateOrbs());

    const handleResize = () => {
      setOrbs(generateOrbs());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {orbs.map((orb) => (
        <GlowingOrb key={orb.id} {...orb} />
      ))}
    </div>
  );
};

const RepublicDayCelebration = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    // Update on resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const createTricolorCelebration = () => {
      const count = isMobile ? 100 : 150;
      
      function fire(particleRatio: number, opts: confetti.Options) {
        // Mobile: Fire from bottom center
        if (isMobile) {
          confetti({
            particleCount: Math.floor(count * particleRatio),
            spread: 60,
            origin: { y: 0.9, x: 0.5 },
            ...opts,
          });
        } 
        // Desktop: Fire from both bottom corners
        else {
          // Left corner
          confetti({
            particleCount: Math.floor(count * particleRatio * 0.5),
            spread: 50,
            origin: { y: 0.9, x: 0.1 },
            angle: 60,
            ...opts,
          });
          
          // Right corner
          confetti({
            particleCount: Math.floor(count * particleRatio * 0.5),
            spread: 50,
            origin: { y: 0.9, x: 0.9 },
            angle: 120,
            ...opts,
          });
        }
      }

      // Saffron
      fire(0.25, {
        colors: ['#FF9933'],
        shapes: ['square'],
        ticks: 600,
        gravity: 1.2,
        scalar: 1.2,
        drift: isMobile ? 0 : -0.5,
        startVelocity: isMobile ? 55 : 75,
      });

      // White
      setTimeout(() => {
        fire(0.35, {
          colors: ['#FFFFFF'],
          shapes: ['circle'],
          ticks: 600,
          gravity: 1.3,
          scalar: 1.1,
          drift: 0,
          startVelocity: isMobile ? 45 : 65,
        });
      }, 200);

      // Green
      setTimeout(() => {
        fire(0.25, {
          colors: ['#138808'],
          shapes: ['square'],
          ticks: 600,
          gravity: 1.4,
          scalar: 1,
          drift: isMobile ? 0 : 0.5,
          startVelocity: isMobile ? 35 : 55,
        });
      }, 400);
    };

    createTricolorCelebration();
    const interval = setInterval(createTricolorCelebration, 5000);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      clearInterval(interval);
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isMobile]); // Add isMobile to dependencies

  return (
    <>
      {/* Permanent Orbs - outside AnimatePresence */}
      <PermanentOrbs />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/50 overflow-hidden"
          >
            {/* Main celebration content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="relative text-center max-w-4xl mx-4"
            >
              {/* Card Container */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
                {/* Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
                
                {/* Content Container */}
                <div className="px-8 py-10 md:px-12 md:py-12">
                  {/* Ashoka Chakra */}
                  <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-8">
                    <motion.div
                      className="absolute inset-0 bg-blue-500/20 rounded-full filter blur-2xl"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="relative z-10"
                    >
                      <img 
                        src="/ashok.png" 
                        alt="Ashoka Chakra"
                        className="w-full h-full drop-shadow-2xl"
                      />
                    </motion.div>
                  </div>

                  {/* Typography Container */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-8"
                  >
                    {/* Main Title */}
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                      <motion.div 
                        className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent inline-block"
                        animate={{ 
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                      >
                        Happy Republic Day
                      </motion.div>
                    </h1>

                    {/* Subtitle with gradient */}
                    <div className="space-y-3">
                      <motion.p
                        className="text-xl md:text-2xl font-medium text-white/90"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <span className="font-semibold">Celebrating 76 Years of</span>
                        <br />
                        <span className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent font-bold">
                          Constitutional Democracy
                        </span>
                      </motion.p>
                    </div>

                    {/* Bottom Text */}
                    <p className="text-base md:text-lg text-white/80 font-medium tracking-wide uppercase">
                      <span className="inline-block px-4 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                        Unity in Diversity • Strength in Democracy • Pride in Heritage
                      </span>
                    </p>
                  </motion.div>
                </div>

                {/* Bottom Accent Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#138808] via-white to-[#FF9933]" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RepublicDayCelebration; 