import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Theme } from '@/types/game';

interface GiftBoxProps {
  theme: Theme;
  isRevealed: boolean;
  answerText: string;
  authorName: string;
  onClick: () => void;
  index: number;
}

const GiftBox = ({
  theme,
  isRevealed,
  answerText,
  authorName,
  onClick,
  index,
}: GiftBoxProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const handleClick = () => {
    if (!isRevealed) {
      setShowParticles(true);
      setTimeout(() => {
        onClick();
        setShowParticles(false);
      }, 500);
    }
  };

  const boxColors = theme === 'christmas' 
    ? ['bg-primary', 'bg-secondary'] 
    : ['bg-primary', 'bg-secondary'];

  const ribbonColor = theme === 'christmas' ? 'bg-accent' : 'bg-accent';

  return (
    <motion.div
      className="relative cursor-pointer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="box"
            className="relative"
            animate={isHovered ? { y: -5, rotate: [-2, 2, -2] } : { y: 0 }}
            transition={{ duration: 0.3 }}
            exit={{ scale: 1.5, opacity: 0, rotate: 15 }}
          >
            {/* Gift Box */}
            <div
              className={`
                w-32 h-32 sm:w-40 sm:h-40 relative
                ${boxColors[index % 2]}
              `}
              style={{
                boxShadow: `
                  6px 6px 0 0 hsl(var(--pixel-shadow)),
                  inset -6px -6px 0 0 hsl(var(--pixel-shadow) / 0.3),
                  inset 6px 6px 0 0 hsl(var(--foreground) / 0.2)
                `,
              }}
            >
              {/* Ribbon Horizontal */}
              <div className={`absolute top-1/2 left-0 right-0 h-4 ${ribbonColor} -translate-y-1/2`} />
              {/* Ribbon Vertical */}
              <div className={`absolute left-1/2 top-0 bottom-0 w-4 ${ribbonColor} -translate-x-1/2`} />
              {/* Bow */}
              <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 ${ribbonColor}`} />
              
              {/* Question Mark */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-pixel text-foreground/80 z-10">?</span>
              </div>
            </div>

            {/* Floating sparkles on hover */}
            {isHovered && (
              <>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-accent" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -left-2"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                </motion.div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            className="pixel-card w-48 sm:w-56 min-h-40"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="text-center">
              <div className="text-[10px] sm:text-xs font-pixel text-foreground mb-4 leading-relaxed">
                "{answerText}"
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <span className="text-[8px] font-pixel text-accent">— {authorName}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explosion particles */}
      <AnimatePresence>
        {showParticles && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-accent"
                initial={{ 
                  x: 64, 
                  y: 64,
                  scale: 1 
                }}
                animate={{ 
                  x: 64 + Math.cos((i * 30 * Math.PI) / 180) * 100,
                  y: 64 + Math.sin((i * 30 * Math.PI) / 180) * 100,
                  scale: 0,
                  opacity: 0
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GiftBox;
