"use client";
import React from 'react';
import { Heart, Star } from 'lucide-react'; // Or use custom SVGs/images

const BackgroundAnimation = () => {
  const items = React.useMemo(() => {
    const elements = [];
    // Add hearts
    for (let i = 0; i < 10; i++) {
      elements.push(
        <Heart
          key={`heart-${i}`}
          className="absolute text-primary/20 animate-float"
          style={{
            width: `${Math.random() * 15 + 10}px`,
            height: `${Math.random() * 15 + 10}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 4 + 4}s`,
            zIndex: 0,
          }}
          fill="currentColor"
        />
      );
    }
    // Add stars
    for (let i = 0; i < 15; i++) {
       elements.push(
        <Star
          key={`star-${i}`}
          className="absolute text-accent/30 animate-twinkle"
          style={{
            width: `${Math.random() * 8 + 5}px`,
            height: `${Math.random() * 8 + 5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
             animationDuration: `${Math.random() * 2 + 1}s`,
            zIndex: 0,
          }}
          fill="currentColor"
        />
      );
    }
    return elements;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {items}
    </div>
  );
};

export default BackgroundAnimation;
