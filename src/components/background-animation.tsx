
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

// Prioritize hearts VERY heavily, make them larger
const ICON_PRIORITY = [
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 10 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 10 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 10 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 10 Hearts
    Star, Flower2, Star, Flower2, Star, Flower2, Star, Flower2, Star, Flower2, // 10 Others (less frequent)
];

const BackgroundAnimation: React.FC = () => {
  const [icons, setIcons] = useState<AnimatedIcon[]>([]);
  const [isClient, setIsClient] = useState(false);
  const numIcons = 50; // Use a moderate number, focus on size

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

        let size;
        if (IconComponent === Heart) {
          size = Math.random() * 25 + 15; // Hearts: 15px to 40px (Larger)
        } else {
          size = Math.random() * 15 + 5; // Others: 5px to 20px (Smaller)
        }

        const top = `${Math.random() * 110 - 10}%`; // Allow further off-screen start/end
        const left = `${Math.random() * 110 - 10}%`;
        const animationDuration = `${Math.random() * 12 + 8}s`; // Duration 8s to 20s
        const animationDelay = `${Math.random() * 10}s`; // Delay 0s to 10s
        const zIndex = 0; // Keep all background icons behind content
        const opacity = IconComponent === Heart ? (Math.random() * 0.4 + 0.3) : (Math.random() * 0.3 + 0.1); // Hearts: 0.3 to 0.7 opacity, Others: 0.1 to 0.4

        let colorClass = '';
        let animationClass = '';

        switch (IconComponent) {
            case Heart:
                // Use more prominent pinks for hearts
                 const heartColorRand = Math.random();
                if (heartColorRand < 0.7) {
                    colorClass = 'text-primary/60'; // Main pink, slightly more opaque
                } else if (heartColorRand < 0.9) {
                    colorClass = 'text-primary/75'; // Even more opaque pink
                } else {
                    colorClass = 'text-accent/50'; // Coral touch, medium opacity
                }
                animationClass = 'animate-float'; // Hearts always float
                break;
            case Star:
                colorClass = 'text-secondary/30'; // Soft lavender stars
                animationClass = 'animate-twinkle';
                break;
             case Flower2: // Rose/Flower icon
                 const flowerColorRand = Math.random();
                 if (flowerColorRand < 0.5) {
                    colorClass = 'text-secondary/40'; // Lavender flowers
                 } else {
                    colorClass = 'text-accent/40'; // Coral/Pinkish flowers
                 }
                animationClass = Math.random() < 0.3 ? 'animate-float' : 'animate-twinkle'; // Mostly twinkle
                break;
            default:
                 colorClass = 'text-muted-foreground/20'; // Very subtle default
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

     // Regenerate periodically for a more dynamic feel (optional)
     const interval = setInterval(generateIcons, 20000); // Regenerate every 20 seconds
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
