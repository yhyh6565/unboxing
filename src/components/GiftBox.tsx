import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Theme } from '@/types/game';

interface GiftBoxProps {
  theme: Theme;
  isRevealed: boolean;
  answerText: string;
  authorName?: string;
  showAuthor?: boolean;
  onClick: () => void;
  index: number;
}

const GiftBox = ({
  theme,
  isRevealed,
  answerText,
  authorName,
  showAuthor = true,
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
      }, 300);
    } else {
      // Click revealed answer to flip back
      onClick();
    }
  };

  const boxColors = theme === 'christmas' 
    ? ['bg-primary', 'bg-secondary'] 
    : ['bg-primary', 'bg-secondary'];

  const ribbonColor = theme === 'christmas' ? 'bg-accent' : 'bg-accent';

  return (
    <motion.div
      className="relative cursor-pointer w-40 h-40 sm:w-48 sm:h-48"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
      style={{ perspective: 1000 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Card container for flip effect */}
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front - Gift Box */}
        <motion.div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden' }}
          animate={isHovered && !isRevealed ? { y: -5, rotate: [-2, 2, -2] } : { y: 0, rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`
              w-full h-full relative
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
          {isHovered && !isRevealed && (
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

        {/* Back - Answer Card */}
        <div
          className="absolute inset-0 pixel-card flex items-center justify-center p-4"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-center w-full">
            <div className="text-sm text-foreground leading-relaxed">
              "{answerText}"
            </div>
            {showAuthor && authorName && (
              <div className="border-t border-border pt-3 mt-3">
                <span className="text-xs text-accent">— {authorName}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Explosion particles */}
      {showParticles && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-accent"
              initial={{ 
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
                scale: 1 
              }}
              animate={{ 
                x: Math.cos((i * 30 * Math.PI) / 180) * 80,
                y: Math.sin((i * 30 * Math.PI) / 180) * 80,
                scale: 0,
                opacity: 0
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
};

export default GiftBox;
