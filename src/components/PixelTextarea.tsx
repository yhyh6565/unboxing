import { TextareaHTMLAttributes, forwardRef } from 'react';

interface PixelTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const PixelTextarea = forwardRef<HTMLTextAreaElement, PixelTextareaProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-muted-foreground mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full bg-input text-foreground text-base
            px-4 py-3 outline-none resize-none
            placeholder:text-muted-foreground
            focus:ring-2 focus:ring-accent
            ${className}
          `}
          style={{
            boxShadow: `
              inset 4px 4px 0 0 hsl(var(--pixel-shadow) / 0.3),
              inset -2px -2px 0 0 hsl(var(--foreground) / 0.1)
            `,
          }}
          {...props}
        />
      </div>
    );
  }
);

PixelTextarea.displayName = 'PixelTextarea';

export default PixelTextarea;
