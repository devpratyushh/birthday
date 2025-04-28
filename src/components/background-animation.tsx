
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

// Prioritize hearts, add some stars and flowers - Increased hearts and flowers
const ICON_PRIORITY = [
    Heart, Heart, Flower2, Heart, Star, Heart, Flower2, Heart, Heart,
    Heart, Heart, Star, Heart, Flower2, Heart, Heart, Heart, Star, Heart,
    Flower2, Heart, Heart, Flower2, Heart, Star, Heart, Heart, Flower2, Heart,
    Heart, Star, Heart, Flower2, Heart, Heart, Heart, Flower2, Heart, Star,
];

const BackgroundAnimation: React.FC = () => {
  const [icons, setIcons] = useState<AnimatedIcon[]>([]);
  const [isClient, setIsClient] = useState(false);
  const numIcons = 60; // Increased number for denser effect

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

        const size = Math.random() * 20 + 8; // Size range 8px to 28px
        const top = `${Math.random() * 105 - 5}%`; // Allow slightly off-screen start/end
        const left = `${Math.random() * 105 - 5}%`;
        const animationDuration = `${Math.random() * 13 + 8}s`; // Duration 8s to 21s
        const animationDelay = `${Math.random() * 12}s`; // Delay 0s to 12s
        const zIndex = 0; // Keep all background icons behind content
        const opacity = Math.random() * 0.45 + 0.15; // Opacity 0.15 to 0.6

        let colorClass = '';
        let animationClass = '';

        switch (IconComponent) {
            case Heart:
                // Use different shades of pink/primary/accent for hearts
                const heartColorRand = Math.random();
                if (heartColorRand < 0.6) { // Increase chance of primary pink
                    colorClass = 'text-primary/40';
                } else if (heartColorRand < 0.9) {
                    colorClass = 'text-primary/55';
                } else {
                    colorClass = 'text-accent/35'; // Brighter coral touch
                }
                animationClass = Math.random() < 0.7 ? 'animate-float' : 'animate-twinkle'; // More float than twinkle
                break;
            case Star:
                colorClass = 'text-secondary/30'; // Soft lavender stars, slightly less prominent
                animationClass = 'animate-twinkle';
                break;
             case Flower2: // Rose/Flower icon
                 const flowerColorRand = Math.random();
                 if (flowerColorRand < 0.5) {
                    colorClass = 'text-secondary/40'; // Lavender flowers
                 } else {
                    colorClass = 'text-accent/40'; // Coral/Pinkish flowers
                 }
                animationClass = Math.random() < 0.6 ? 'animate-float' : 'animate-twinkle'; // Mix of float/twinkle
                break;
            default:
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
          className={`lucide ${colorClass} ${animationClass}`}
          style={style}
          // Fill hearts and flowers, but not stars (or use stroke for stars)
          fill={Icon === Star ? "none" : "currentColor"}
          strokeWidth={Icon === Star ? 1 : 0} // Add stroke only to stars for a different look
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;
