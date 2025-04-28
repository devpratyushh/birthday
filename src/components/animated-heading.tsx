
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

const AnimatedHeading: React.FC = () => {
  const [displayText, setDisplayText] = useState('Anandita');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showStrikethrough, setShowStrikethrough] = useState(true);

  useEffect(() => {
    const strikethroughDuration = 500; // Duration of strikethrough animation in ms
    const fadeDuration = 400; // Duration of fade animation in ms
    const delayBeforeFade = 1800; // Delay before starting the fade out (should align with strikethrough animation end)

    // Timer to start fade out after the strikethrough animation is supposed to finish
    const fadeTimeoutId = setTimeout(() => {
      setIsFadingOut(true); // Start fade out

      // Timer to change text and fade back in
      setTimeout(() => {
        setDisplayText('Babe');
        setShowStrikethrough(false); // Hide strikethrough for "Babe"
        setIsFadingOut(false); // Reset fading state to trigger fade-in
      }, fadeDuration); // Wait for fade-out to finish

    }, delayBeforeFade); // Start fade slightly after strikethrough starts

    // Cleanup timeouts on component unmount
    return () => {
      clearTimeout(fadeTimeoutId);
    };
  }, []);

  return (
    <div className="text-center space-y-2 mb-4 md:mb-6"> {/* Added margin bottom */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-pink-400 drop-shadow-lg animate-fade-in inline-flex items-center gap-2">
        Happy Birthdayy
        <Heart className="w-8 h-8 md:w-10 md:h-10 text-primary animate-pulse inline-block" fill="currentColor" />
      </h1>
       <p className="text-lg md:text-xl text-muted-foreground animate-fade-in animation-delay-300 font-serif relative inline-block">
         To my dearest{' '}
         <span className="inline-block relative h-8"> {/* Ensure container has height */}
           {/* Text container */}
           <span
             className={cn(
               'absolute inset-0 flex items-center justify-center transition-opacity duration-400', // Center text vertically
               isFadingOut ? 'animate-fade-out-up opacity-0' : 'animate-fade-in-down opacity-100',
               'inline-block'
             )}
             style={{ animationFillMode: 'forwards' }} // Keep end state of animation
           >
              {/* Strikethrough element - only shown for Anandita */}
             {showStrikethrough && (
                <span className="strikethrough-animated absolute left-0 top-1/2 w-full h-[2px] bg-destructive origin-left"></span>
             )}
             {displayText}
           </span>
         </span>
         !
       </p>
    </div>
  );
};

// Add animation-delay helper and other styles if not present in Tailwind config or globals.css
// Ensure globals.css has the necessary keyframes (fade-in, pulse, strikethrough, fade-out-up, fade-in-down)
const styles = `
.animation-delay-300 { animation-delay: 300ms; }
`;
if (typeof window !== 'undefined') {
  const styleSheetId = 'animated-heading-styles-inline'; // Use a different ID if needed
  if (!document.getElementById(styleSheetId)) {
      const styleSheet = document.createElement("style");
      styleSheet.id = styleSheetId;
      styleSheet.type = "text/css";
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
   }
}


export default AnimatedHeading;

