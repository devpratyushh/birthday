
'use client';
import React, { useEffect, useState } from 'react';
import { Heart, Star } from 'lucide-react'; // Simplified icons for background

interface AnimatedIcon {
  id: number;
  icon: React.ElementType;
  style: React.CSSProperties;
  colorClass: string;
  animationClass: string;
}

const ICONS = [Heart, Star];
// Increase heart frequency dramatically
const ICON_PRIORITY = [
    Heart, Heart, Heart, Heart, Heart, Heart, Star, Heart, Heart, Heart, Star, Heart
];

const BackgroundAnimation: React.FC = () => {
  const [icons, setIcons] = useState<AnimatedIcon[]>([]);
  const [isClient, setIsClient] = useState(false);
  const numIcons = 45; // Increased number for denser hearts

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const generateIcons = () => {
      const newIcons: AnimatedIcon[] = [];
      const iconTypesCount = ICON_PRIORITY.length;
      for (let i = 0; i < numIcons; i++) {
        const IconComponent = ICON_PRIORITY[i % iconTypesCount];

        const size = Math.random() * 22 + 10; // Size range 10px to 32px
        const top = `${Math.random() * 105 - 5}%`; // Allow slightly off-screen start/end
        const left = `${Math.random() * 105 - 5}%`;
        const animationDuration = `${Math.random() * 12 + 7}s`; // Duration 7s to 19s
        const animationDelay = `${Math.random() * 10}s`; // Delay 0s to 10s
        const zIndex = 0; // Keep all background icons behind content
        const opacity = Math.random() * 0.4 + 0.2; // Opacity 0.2 to 0.6

        let colorClass = '';
        let animationClass = '';

        switch (IconComponent) {
            case Heart:
                // Use different shades of pink/primary/accent for hearts
                const heartColorRand = Math.random();
                if (heartColorRand < 0.4) {
                    colorClass = 'text-primary/30';
                } else if (heartColorRand < 0.7) {
                    colorClass = 'text-primary/45';
                } else {
                    colorClass = 'text-accent/25'; // Touch of coral
                }
                animationClass = Math.random() < 0.7 ? 'animate-float' : 'animate-twinkle'; // Some hearts twinkle too
                break;
            case Star:
                colorClass = 'text-accent/40'; // Slightly brighter stars
                animationClass = 'animate-twinkle';
                break;
            default: // Fallback, though shouldn't be needed with current setup
                 colorClass = 'text-muted-foreground/20';
                 animationClass = 'animate-twinkle';
        }


        newIcons.push({
          id: i,
          icon: IconComponent,
          style: {
            width: `${size}px`,
            height: `${size}px`,
            top,
            left,
            animationDelay,
            animationDuration,
            zIndex,
            opacity: opacity,
            position: 'absolute', // Ensure position is absolute
          },
          colorClass: colorClass,
          animationClass: animationClass,
        });
      }
      setIcons(newIcons);
    };

     generateIcons();

     // Optional: Regenerate icons periodically for more dynamic feel (can be performance intensive)
     // const interval = setInterval(generateIcons, 30000); // Regenerate every 30 seconds
     // return () => clearInterval(interval);

  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      {icons.map(({ id, icon: Icon, style, colorClass, animationClass }) => (
        <Icon
          key={id}
          className={`lucide ${colorClass} ${animationClass}`} // Removed absolute here, handled by style
          style={style}
          fill="currentColor" // Fill hearts and stars
          strokeWidth={0} // No stroke for cleaner look
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;
