
'use client';
import React, { useEffect, useState } from 'react';
import { Heart, Star, BookOpen, Pencil, GraduationCap } from 'lucide-react'; // Added JEE related icons

interface AnimatedIcon {
  id: number;
  icon: React.ElementType;
  style: React.CSSProperties;
  colorClass: string;
  animationClass: string;
}

const ICONS = [Heart, Star, BookOpen, Pencil, GraduationCap]; // Include new icons

const BackgroundAnimation: React.FC = () => {
  const [icons, setIcons] = useState<AnimatedIcon[]>([]);
  const [isClient, setIsClient] = useState(false);
  const numIcons = 30; // Slightly increased number of icons

  useEffect(() => {
    setIsClient(true); // Ensure this runs only on the client
  }, []);

  useEffect(() => {
    if (!isClient) return; // Don't generate icons on the server

    const generateIcons = () => {
      const newIcons: AnimatedIcon[] = [];
      const iconTypesCount = ICONS.length;
      for (let i = 0; i < numIcons; i++) {
        // Choose an icon - slightly more hearts and stars
        let IconComponent;
        const rand = Math.random();
        if (rand < 0.35) IconComponent = Heart;
        else if (rand < 0.65) IconComponent = Star;
        else IconComponent = ICONS[Math.floor(Math.random() * iconTypesCount)];


        const size = Math.random() * 15 + 10; // Size between 10px and 25px
        const top = `${Math.random() * 100}%`;
        const left = `${Math.random() * 100}%`;
        const animationDuration = `${Math.random() * 8 + 5}s`; // Duration 5s to 13s (slower overall)
        const animationDelay = `${Math.random() * 6}s`; // Delay 0s to 6s
        const zIndex = Math.floor(Math.random() * 2); // z-index 0 or 1 (keep behind content)
        const opacity = Math.random() * 0.4 + 0.1; // Lower opacity for subtlety (0.1 to 0.5)

        let colorClass = '';
        let animationClass = '';

        switch (IconComponent) {
            case Heart:
                colorClass = 'text-primary/30'; // Softer pink
                animationClass = 'animate-float';
                break;
            case Star:
                colorClass = 'text-accent/40'; // Softer coral/gold
                animationClass = 'animate-twinkle';
                break;
            case BookOpen:
                 colorClass = 'text-secondary-foreground/20'; // Muted secondary color
                 animationClass = 'animate-float'; // Can use float or a new slow drift
                 break;
            case Pencil:
                 colorClass = 'text-muted-foreground/30'; // Muted greyish
                 animationClass = 'animate-twinkle'; // Can use twinkle or drift
                 break;
            case GraduationCap:
                colorClass = 'text-foreground/15'; // Very subtle foreground
                animationClass = 'animate-float';
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
            opacity: opacity, // Apply random opacity directly
          },
          colorClass: colorClass,
          animationClass: animationClass,
        });
      }
      setIcons(newIcons);
    };

     generateIcons(); // Generate on mount

  }, [isClient]); // Depend on isClient

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      {icons.map(({ id, icon: Icon, style, colorClass, animationClass }) => (
        <Icon
          key={id}
          className={`lucide absolute ${colorClass} ${animationClass}`}
          style={style}
          fill="currentColor"
          strokeWidth={Icon === Heart || Icon === Star ? 0 : 0.5} // Add thin stroke to study icons
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;
