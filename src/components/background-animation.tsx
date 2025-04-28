
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

// Prioritize hearts VERY heavily, make them larger and more numerous
const ICON_PRIORITY = [
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 10 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 20 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 30 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 40 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 50 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 60 Hearts!
    Star, Flower2, Star, Flower2, Star, Flower2, Star, Flower2 // 8 Others (very low frequency)
];

const BackgroundAnimation: React.FC = () => {
  const [icons, setIcons] = useState<AnimatedIcon[]>([]);
  const [isClient, setIsClient] = useState(false);
  const numIcons = 68; // Increased total number for density, matching ICON_PRIORITY length

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
          size = Math.random() * 35 + 25; // Hearts: 25px to 60px (Even Larger Range)
        } else {
          size = Math.random() * 15 + 5; // Others: 5px to 20px (Smaller)
        }

        const top = `${Math.random() * 110 - 10}%`; // Allow further off-screen start/end
        const left = `${Math.random() * 110 - 10}%`;
        const animationDuration = `${Math.random() * 12 + 10}s`; // Duration 10s to 22s (Slower, more graceful float)
        const animationDelay = `${Math.random() * 18}s`; // Delay 0s to 18s (More variation)
        const zIndex = 0; // Keep all background icons behind content
         // Hearts more opaque, others less
        const opacity = IconComponent === Heart ? (Math.random() * 0.5 + 0.45) : (Math.random() * 0.25 + 0.1); // Hearts: 0.45 to 0.95 opacity, Others: 0.1 to 0.35

        let colorClass = '';
        let animationClass = '';

        switch (IconComponent) {
            case Heart:
                // Use more prominent pinks and corals for hearts
                 const heartColorRand = Math.random();
                if (heartColorRand < 0.5) {
                    colorClass = 'text-primary/75'; // Main pink, more opaque
                } else if (heartColorRand < 0.85) {
                    colorClass = 'text-accent/65'; // Coral touch, good opacity
                } else {
                    colorClass = 'text-primary-highlight/55'; // Brighter highlight pink, medium opacity
                }
                animationClass = 'animate-float'; // Hearts always float
                break;
            case Star:
                colorClass = 'text-secondary/30'; // Soft lavender stars, slightly more subtle
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
     const interval = setInterval(generateIcons, 22000); // Regenerate every 22 seconds
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
          strokeWidth={Icon === Star ? 0.4 : 0} // Even thinner stroke for stars
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;
