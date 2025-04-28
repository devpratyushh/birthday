
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
    Star, Flower2, Star, Flower2, Star, // 5 Others (much less frequent)
];

const BackgroundAnimation: React.FC = () => {
  const [icons, setIcons] = useState<AnimatedIcon[]>([]);
  const [isClient, setIsClient] = useState(false);
  const numIcons = 60; // Increased total number for density

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
          size = Math.random() * 30 + 20; // Hearts: 20px to 50px (Significantly Larger)
        } else {
          size = Math.random() * 15 + 5; // Others: 5px to 20px (Smaller)
        }

        const top = `${Math.random() * 110 - 10}%`; // Allow further off-screen start/end
        const left = `${Math.random() * 110 - 10}%`;
        const animationDuration = `${Math.random() * 10 + 10}s`; // Duration 10s to 20s (Slower, more graceful float)
        const animationDelay = `${Math.random() * 15}s`; // Delay 0s to 15s (More variation)
        const zIndex = 0; // Keep all background icons behind content
         // Hearts more opaque, others less
        const opacity = IconComponent === Heart ? (Math.random() * 0.5 + 0.4) : (Math.random() * 0.3 + 0.1); // Hearts: 0.4 to 0.9 opacity

        let colorClass = '';
        let animationClass = '';

        switch (IconComponent) {
            case Heart:
                // Use more prominent pinks and corals for hearts
                 const heartColorRand = Math.random();
                if (heartColorRand < 0.6) {
                    colorClass = 'text-primary/70'; // Main pink, more opaque
                } else if (heartColorRand < 0.9) {
                    colorClass = 'text-accent/60'; // Coral touch, good opacity
                } else {
                    colorClass = 'text-primary-highlight/50'; // Brighter highlight pink, medium opacity
                }
                animationClass = 'animate-float'; // Hearts always float
                break;
            case Star:
                colorClass = 'text-secondary/35'; // Soft lavender stars, slightly more visible
                animationClass = 'animate-twinkle';
                break;
             case Flower2: // Rose/Flower icon
                 const flowerColorRand = Math.random();
                 if (flowerColorRand < 0.5) {
                    colorClass = 'text-secondary/45'; // Lavender flowers
                 } else {
                    colorClass = 'text-accent/45'; // Coral/Pinkish flowers
                 }
                animationClass = Math.random() < 0.3 ? 'animate-float' : 'animate-twinkle'; // Mostly twinkle
                break;
            default:
                 colorClass = 'text-muted-foreground/25'; // Slightly more visible default
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
