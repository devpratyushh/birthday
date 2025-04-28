
'use client';
import React, { useEffect, useState } from 'react';
import { Heart, Star, Flower2 } from 'lucide-react'; // Added Flower2

interface AnimatedIcon {
  id: number;
  icon: React.ElementType;
  style: React.CSSProperties;
  colorClass: string;
  animationClass: string;
}

// Prioritize hearts heavily, add some stars and flowers - Significantly increased hearts
const ICON_PRIORITY = [
    Heart, Heart, Heart, Flower2, Heart, Star, Heart, Heart, Heart, Heart,
    Heart, Heart, Heart, Star, Heart, Flower2, Heart, Heart, Heart, Heart, Heart,
    Heart, Flower2, Heart, Heart, Star, Heart, Heart, Heart, Flower2, Heart, Heart,
    Heart, Star, Heart, Flower2, Heart, Heart, Heart, Heart, Heart, Heart, Star, Heart,
    Flower2, Heart, Heart, Heart, Heart, Flower2, Heart, Star, Heart, Heart, Heart, Heart,
];

const BackgroundAnimation: React.FC = () => {
  const [icons, setIcons] = useState<AnimatedIcon[]>([]);
  const [isClient, setIsClient] = useState(false);
  const numIcons = 80; // Increased number for a denser effect with more hearts

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

        const size = Math.random() * 18 + 6; // Slightly smaller range for density (6px to 24px)
        const top = `${Math.random() * 110 - 10}%`; // Allow further off-screen start/end
        const left = `${Math.random() * 110 - 10}%`;
        const animationDuration = `${Math.random() * 15 + 10}s`; // Duration 10s to 25s (slower overall)
        const animationDelay = `${Math.random() * 15}s`; // Delay 0s to 15s
        const zIndex = 0; // Keep all background icons behind content
        const opacity = Math.random() * 0.4 + 0.1; // Opacity 0.1 to 0.5 (Subtler)

        let colorClass = '';
        let animationClass = '';

        switch (IconComponent) {
            case Heart:
                // Use different shades of pink/primary/accent for hearts
                const heartColorRand = Math.random();
                if (heartColorRand < 0.75) { // Higher chance of primary pink
                    colorClass = 'text-primary/40'; // Main pink, semi-transparent
                } else if (heartColorRand < 0.9) {
                    colorClass = 'text-primary/55'; // Slightly darker pink
                } else {
                    colorClass = 'text-accent/30'; // Softer coral touch, more transparent
                }
                animationClass = Math.random() < 0.8 ? 'animate-float' : 'animate-twinkle'; // Mostly float
                break;
            case Star:
                colorClass = 'text-secondary/25'; // Soft lavender stars, even less prominent
                animationClass = 'animate-twinkle';
                break;
             case Flower2: // Rose/Flower icon
                 const flowerColorRand = Math.random();
                 if (flowerColorRand < 0.5) {
                    colorClass = 'text-secondary/35'; // Lavender flowers, bit more visible
                 } else {
                    colorClass = 'text-accent/35'; // Coral/Pinkish flowers
                 }
                animationClass = Math.random() < 0.5 ? 'animate-float' : 'animate-twinkle'; // Equal mix
                break;
            default:
                 colorClass = 'text-muted-foreground/15'; // Very subtle default
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

     // Regenerate periodically for a more dynamic feel (optional, can impact performance)
     const interval = setInterval(generateIcons, 25000); // Regenerate every 25 seconds
     return () => clearInterval(interval); // Cleanup interval

  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      {icons.map(({ id, icon: Icon, style, colorClass, animationClass }) => (
        <Icon
          key={id}
          className={`lucide ${colorClass} ${animationClass}`}
          style={style}
          // Fill hearts and flowers, stroke stars
          fill={Icon === Star ? "none" : "currentColor"}
          strokeWidth={Icon === Star ? 0.5 : 0} // Thinner stroke for stars
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;
