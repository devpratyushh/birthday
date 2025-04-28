'use client';
import React, { useEffect, useState } from 'react';
import { Heart, Star } from 'lucide-react'; // Using lucide icons

interface AnimatedIcon {
  id: number;
  icon: React.ElementType;
  style: React.CSSProperties;
  colorClass: string;
  animationClass: string;
}

const BackgroundAnimation: React.FC = () => {
  const [icons, setIcons] = useState<AnimatedIcon[]>([]);
  const [isClient, setIsClient] = useState(false);
  const numIcons = 25; // Increased number of icons

  useEffect(() => {
    setIsClient(true); // Ensure this runs only on the client
  }, []);

  useEffect(() => {
    if (!isClient) return; // Don't generate icons on the server

    const generateIcons = () => {
      const newIcons: AnimatedIcon[] = [];
      for (let i = 0; i < numIcons; i++) {
        const IconComponent = Math.random() > 0.4 ? Heart : Star; // More hearts
        const size = Math.random() * 15 + 10; // Size between 10px and 25px
        const top = `${Math.random() * 100}%`;
        const left = `${Math.random() * 100}%`;
        const animationDuration = `${Math.random() * 5 + 4}s`; // Duration 4s to 9s
        const animationDelay = `${Math.random() * 5}s`; // Delay 0s to 5s
        const zIndex = Math.floor(Math.random() * 3); // z-index 0, 1, or 2

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
          },
          colorClass: IconComponent === Heart ? 'text-primary/20' : 'text-accent/30', // Different subtle colors
          animationClass: IconComponent === Heart ? 'animate-float' : 'animate-twinkle', // Different animations
        });
      }
      setIcons(newIcons);
    };

     generateIcons(); // Generate on mount

    // Optional: Regenerate icons periodically or on interaction?
    // For now, they generate once on mount.

  }, [isClient]); // Depend on isClient to ensure client-side execution

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
          fill="currentColor" // Fill the icons
          strokeWidth={0} // Remove stroke for filled look
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;

// Add keyframes to globals.css
/*
@keyframes float {
  0%, 100% { transform: translateY(0); opacity: 0.7; }
  50% { transform: translateY(-20px); opacity: 1; }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.9); }
  50% { opacity: 0.8; transform: scale(1); }
}

.animate-float {
  animation: float linear infinite;
}

.animate-twinkle {
   animation: twinkle linear infinite;
}
*/
