import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Gift, Users, Sparkles } from 'lucide-react';
import PixelButton from '@/components/PixelButton';
import SnowEffect from '@/components/SnowEffect';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SnowEffect />
      
      {/* Scanline overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-10" />

      {/* Main content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Decorative elements */}
        <motion.div
          className="absolute top-10 left-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-8 h-8 text-accent" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Gift className="w-12 h-12 text-primary" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center mb-8"
        >
          <h1 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-foreground pixel-text-shadow mb-4">
            UNBOX US
          </h1>
          <motion.div
            className="w-48 h-2 bg-accent mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
        </motion.div>

        {/* Subtitle / Rules */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-lg mx-auto mb-12 pixel-card"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-4 h-4 bg-accent flex-shrink-0 mt-1" />
            <p className="font-pixel text-[10px] sm:text-xs leading-relaxed text-muted-foreground">
              Answer anonymously now.
            </p>
          </div>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-4 h-4 bg-secondary flex-shrink-0 mt-1" />
            <p className="font-pixel text-[10px] sm:text-xs leading-relaxed text-muted-foreground">
              We'll unbox (reveal) the writers together at the party!
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 bg-primary flex-shrink-0 mt-1" />
            <p className="font-pixel text-[10px] sm:text-xs leading-relaxed text-muted-foreground">
              Be honest and fun. 🎁
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <PixelButton
            variant="primary"
            size="lg"
            onClick={() => navigate('/create')}
          >
            <span className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Create Room
            </span>
          </PixelButton>
          
          <PixelButton
            variant="secondary"
            size="lg"
            onClick={() => navigate('/join')}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Join Room
            </span>
          </PixelButton>
        </motion.div>

        {/* Floating pixel decorations */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-secondary"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
