
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
const ICON_PRIORITY = [Heart, Heart, Heart, Star, Star, BookOpen, Pencil, GraduationCap]; // Prioritize Hearts and Stars

const BackgroundAnimation: React.FC = () => {
  const [icons, setIcons] = useState<AnimatedIcon[]>([]);
  const [isClient, setIsClient] = useState(false);
  const numIcons = 35; // Slightly increased number of icons for more density

  useEffect(() => {
    setIsClient(true); // Ensure this runs only on the client
  }, []);

  useEffect(() => {
    if (!isClient) return; // Don't generate icons on the server

    const generateIcons = () => {
      const newIcons: AnimatedIcon[] = [];
      const iconTypesCount = ICON_PRIORITY.length; // Use priority array length
      for (let i = 0; i < numIcons; i++) {
        // Choose an icon based on priority list
        const IconComponent = ICON_PRIORITY[i % iconTypesCount]; // Cycle through priority list

        const size = Math.random() * 18 + 10; // Size between 10px and 28px
        const top = `${Math.random() * 100}%`;
        const left = `${Math.random() * 100}%`;
        const animationDuration = `${Math.random() * 10 + 6}s`; // Duration 6s to 16s (slower overall)
        const animationDelay = `${Math.random() * 8}s`; // Delay 0s to 8s
        const zIndex = Math.floor(Math.random() * 2); // z-index 0 or 1 (keep behind content)
        const opacity = Math.random() * 0.5 + 0.15; // Slightly higher minimum opacity (0.15 to 0.65)

        let colorClass = '';
        let animationClass = '';

        // Assign colors and animations based on icon type
        switch (IconComponent) {
            case Heart:
                colorClass = 'text-primary/40'; // Slightly more visible pink
                animationClass = 'animate-float';
                break;
            case Star:
                colorClass = 'text-accent/50'; // Slightly more visible coral/gold
                animationClass = 'animate-twinkle';
                break;
            case BookOpen:
                 colorClass = 'text-secondary-foreground/25'; // Muted secondary color
                 animationClass = 'animate-float'; // Can use float or a new slow drift
                 break;
            case Pencil:
                 colorClass = 'text-muted-foreground/30'; // Muted greyish
                 animationClass = 'animate-twinkle'; // Can use twinkle or drift
                 break;
            case GraduationCap:
                colorClass = 'text-foreground/20'; // Very subtle foreground
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
