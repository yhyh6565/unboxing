import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PixelButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const PixelButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}: PixelButtonProps) => {
  const variants = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent text-accent-foreground',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[8px]',
    md: 'px-6 py-3 text-[10px]',
    lg: 'px-8 py-4 text-xs',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative font-pixel uppercase tracking-wider
        ${variants[variant]} ${sizes[size]}
        transition-all duration-100
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        boxShadow: `
          4px 4px 0 0 hsl(var(--pixel-shadow)),
          inset -4px -4px 0 0 hsl(var(--pixel-shadow) / 0.3),
          inset 4px 4px 0 0 hsl(var(--foreground) / 0.2)
        `,
      }}
      whileHover={!disabled ? { x: 2, y: 2 } : {}}
      whileTap={!disabled ? { x: 4, y: 4 } : {}}
    >
      {children}
    </motion.button>
  );
};

export default PixelButton;
