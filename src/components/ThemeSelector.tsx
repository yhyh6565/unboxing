import { motion } from 'framer-motion';
import { TreePine, Sun } from 'lucide-react';
import { Theme } from '@/types/game';

interface ThemeSelectorProps {
  value: Theme;
  onChange: (theme: Theme) => void;
}

const ThemeSelector = ({ value, onChange }: ThemeSelectorProps) => {
  const themes: { id: Theme; label: string; icon: typeof TreePine; description: string }[] = [
    { id: 'christmas', label: 'Christmas', icon: TreePine, description: 'Gifts under the tree' },
    { id: 'horse', label: '2026 Horse', icon: Sun, description: 'Lucky bags & sunrise' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {themes.map((theme) => {
        const Icon = theme.icon;
        const isSelected = value === theme.id;
        
        return (
          <motion.button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id)}
            className={`
              relative p-4 text-left transition-colors
              ${isSelected 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card text-card-foreground hover:bg-muted'}
            `}
            style={{
              boxShadow: isSelected
                ? `6px 6px 0 0 hsl(var(--accent)), inset -4px -4px 0 0 hsl(var(--pixel-shadow) / 0.3)`
                : `4px 4px 0 0 hsl(var(--pixel-shadow)), inset -4px -4px 0 0 hsl(var(--pixel-shadow) / 0.2)`,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className="w-8 h-8 mb-2" />
            <div className="font-pixel text-[10px] uppercase">{theme.label}</div>
            <div className="font-pixel text-[8px] mt-1 opacity-70">{theme.description}</div>
            
            {isSelected && (
              <motion.div
                className="absolute top-2 right-2 w-3 h-3 bg-accent"
                layoutId="theme-indicator"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default ThemeSelector;
