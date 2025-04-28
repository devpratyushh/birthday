
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
// Increased hearts to ~90 out of 100
const ICON_PRIORITY = [
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 10 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 20 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 30 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 40 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 50 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 60 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 70 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 80 Hearts
    Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, Heart, // 90 Hearts!
    Star, Flower2, Star, Flower2, Star, Flower2, Star, Flower2, Star, Flower2 // 10 Others
];

const BackgroundAnimation: React.FC = () => {
  const [icons, setIcons] = useState<AnimatedIcon[]>([]);
  const [isClient, setIsClient] = useState(false);
  const numIcons = 100; // Increased total number for density, matching ICON_PRIORITY length

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
          // Significantly larger hearts: 35px to 75px
          size = Math.random() * 40 + 35;
        } else {
          // Slightly larger others: 8px to 25px
          size = Math.random() * 17 + 8;
        }

        const top = `${Math.random() * 115 - 15}%`; // Allow further off-screen start/end
        const left = `${Math.random() * 115 - 15}%`;
        // Slightly slower animations: 12s to 25s
        const animationDuration = `${Math.random() * 13 + 12}s`;
        const animationDelay = `${Math.random() * 20}s`; // Wider delay range
        const zIndex = 0; // Keep all background icons behind content
         // Hearts more opaque, others less - INCREASED OPACITY AGAIN
        const opacity = IconComponent === Heart ? (Math.random() * 0.35 + 0.60) : (Math.random() * 0.3 + 0.30); // Hearts: 0.60 to 0.95 opacity, Others: 0.30 to 0.60

        let colorClass = '';
        let animationClass = '';

        switch (IconComponent) {
            case Heart:
                // Use more prominent pinks and corals for hearts
                 const heartColorRand = Math.random();
                if (heartColorRand < 0.6) { // More primary pink
                    colorClass = 'text-primary/90'; // Main pink, very opaque
                } else if (heartColorRand < 0.9) { // More accent coral
                    colorClass = 'text-accent/80'; // Coral touch, high opacity
                } else {
                    colorClass = 'text-primary-highlight/75'; // Brighter highlight pink, good opacity
                }
                animationClass = 'animate-float'; // Hearts always float
                break;
            case Star:
                colorClass = 'text-secondary/60'; // Soft lavender stars, slightly more visible
                animationClass = 'animate-twinkle';
                break;
             case Flower2: // Rose/Flower icon
                 const flowerColorRand = Math.random();
                 if (flowerColorRand < 0.5) {
                    colorClass = 'text-secondary/65'; // Lavender flowers, more visible
                 } else {
                    colorClass = 'text-accent/65'; // Coral/Pinkish flowers, more visible
                 }
                animationClass = Math.random() < 0.3 ? 'animate-float' : 'animate-twinkle'; // Mostly twinkle
                break;
            default:
                 colorClass = 'text-muted-foreground/40'; // Very subtle default, slightly more visible
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
     const interval = setInterval(generateIcons, 25000); // Regenerate every 25 seconds (matches longest animation duration)
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
          strokeWidth={Icon === Star ? 0.3 : 0} // Even thinner stroke for stars
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;
