
"use client";

import { useState, useEffect, memo, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate: Date;
  onComplete: () => void;
}

// Moved calculation logic outside component to avoid direct dependency on `new Date()` during initial render pass
const calculateTimeLeft = (target: number): TimeLeft | null => {
  const difference = target - Date.now(); // Use Date.now() for client-side calculation consistency

  if (difference <= 0) {
    return null; // Time is up or has passed
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

// Individual Flip Unit Component
interface FlipUnitProps {
  currentValue: number;
  label: string;
}

const FlipUnit: React.FC<FlipUnitProps> = memo(({ currentValue, label }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const previousValueRef = useRef(currentValue); // Ref to store the value from the *previous* render
  const [hasMounted, setHasMounted] = useState(false); // Track initial mount

  const formattedValue = String(currentValue).padStart(2, '0');
  // Use the ref's value for the "previous" display during animation
  const formattedPreviousValue = String(previousValueRef.current).padStart(2, '0');

  useEffect(() => {
    setHasMounted(true); // Mark as mounted after first render
  }, []);

  useEffect(() => {
    // Don't animate on initial mount or if value hasn't changed
    if (!hasMounted || currentValue === previousValueRef.current) {
      previousValueRef.current = currentValue; // Keep ref updated even if no animation
      return;
    }

    // Value changed, trigger flip
    setIsFlipping(true);
    const timer = setTimeout(() => {
      setIsFlipping(false);
      // Update the ref *after* the flip animation completes
      previousValueRef.current = currentValue;
    }, 480); // Slightly less than animation duration for smooth visual transition

    return () => clearTimeout(timer);

  }, [currentValue, hasMounted]);


  return (
    <div className="flex flex-col items-center text-center w-16 h-24 md:w-24 md:h-32 perspective-[500px]">
      {/* Top Half */}
      <div className="relative w-full h-1/2 overflow-hidden rounded-t-lg">
        {/* Static Top Half (Current Value) - Always visible underneath */}
        <div className="absolute inset-0 bg-primary/80 text-primary-foreground flex items-end justify-center pb-1">
          <span className="text-3xl md:text-5xl font-bold tabular-nums">{formattedValue}</span>
        </div>
        {/* Flipping Top Half (Previous Value) - Flips down */}
        <div
          className={cn(
            "absolute inset-0 bg-primary text-primary-foreground flex items-end justify-center pb-1 origin-bottom transform-style-3d backface-hidden",
            isFlipping ? 'animate-flip-down' : '' // Only animate when flipping
          )}
           // Ensure flipping part is on top during animation. Use a key to force re-render if necessary, though shouldn't be needed with ref logic.
          style={{ zIndex: 2 }}
          key={`${label}-top-${formattedPreviousValue}`} // Add key to potentially help reset animation state if needed
        >
          {/* Show previous value during the flip */}
          <span className="text-3xl md:text-5xl font-bold tabular-nums">{formattedPreviousValue}</span>
        </div>
      </div>

      {/* Bottom Half */}
      <div className="relative w-full h-1/2 overflow-hidden rounded-b-lg">
         {/* Static Bottom Half (Current Value) - Always visible underneath */}
         <div className="absolute inset-0 bg-primary text-primary-foreground flex items-start justify-center pt-1">
           <span className="text-3xl md:text-5xl font-bold tabular-nums">{formattedValue}</span>
         </div>
        {/* Flipping Bottom Half (Current Value) - Flips up */}
        <div
           className={cn(
            "absolute inset-0 bg-primary/80 text-primary-foreground flex items-start justify-center pt-1 origin-top transform-style-3d backface-hidden",
            isFlipping ? 'animate-flip-up' : '' // Only animate when flipping
           )}
           style={{ zIndex: 2 }} // Ensure flipping part is on top
           key={`${label}-bottom-${formattedValue}`} // Add key
        >
           {/* Show current value */}
           <span className="text-3xl md:text-5xl font-bold tabular-nums">{formattedValue}</span>
         </div>
      </div>
        {/* Shadow effect */}
       <div className="absolute inset-0 rounded-lg shadow-inner shadow-black/20 pointer-events-none"></div>
       {/* Divider line */}
       <div className="absolute top-1/2 left-0 w-full h-px bg-black/30 z-10"></div>
      {/* Label */}
      <span className="text-xs md:text-sm uppercase text-muted-foreground pt-2 font-medium tracking-wider">{label}</span>
    </div>
  );
});

FlipUnit.displayName = 'FlipUnit';


export const Countdown: React.FC<CountdownProps> = ({ targetDate, onComplete }) => {
  const targetTime = targetDate.getTime(); // Get target timestamp once
  const [currentTimeLeft, setCurrentTimeLeft] = useState<TimeLeft | null>(null); // Start null on server
  const [isClient, setIsClient] = useState(false); // Track if client has mounted
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set initial state and flag client mount
  useEffect(() => {
    setIsClient(true);
    const initialTime = calculateTimeLeft(targetTime);
    setCurrentTimeLeft(initialTime);

    if (initialTime === null) {
      console.log("Countdown initial check detected completion.");
      onComplete();
      return; // Don't start interval if already complete
    }

    // Start the interval
    intervalRef.current = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetTime);
      setCurrentTimeLeft(newTimeLeft); // Update state, triggering re-render

      if (newTimeLeft === null) {
        console.log("Countdown interval detected completion.");
        onComplete();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, 1000);

    // Clear interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTime, onComplete]); // Only run once on mount essentially


  if (!isClient || currentTimeLeft === null) {
    // Render a placeholder or skeleton during SSR and initial client render
    // or if countdown is complete
    return (
        <div className="flex justify-center items-start space-x-2 sm:space-x-4 md:space-x-6 p-4">
             {/* Placeholder structure matching FlipUnit */}
            {(['days', 'hours', 'minutes', 'seconds']).map((label) => (
                <div key={label} className="flex flex-col items-center text-center w-16 h-24 md:w-24 md:h-32">
                    <div className="relative w-full h-1/2 bg-primary/60 rounded-t-lg"></div>
                    <div className="relative w-full h-1/2 bg-primary/70 rounded-b-lg"></div>
                     <div className="absolute inset-0 rounded-lg shadow-inner shadow-black/20"></div>
                     <div className="absolute top-1/2 left-0 w-full h-px bg-black/30"></div>
                    <span className="text-xs md:text-sm uppercase text-muted-foreground pt-2 font-medium tracking-wider">{label}</span>
                </div>
            ))}
        </div>
    );
  }


  return (
      <div className="flex justify-center items-start space-x-2 sm:space-x-4 md:space-x-6 p-4">
        {(Object.keys(currentTimeLeft) as Array<keyof TimeLeft>).map((interval) => (
          <FlipUnit
            key={interval}
            currentValue={currentTimeLeft[interval]}
            label={interval}
          />
        ))}
      </div>
  );
};

// Ensure necessary CSS for perspective, backface-visibility, and flip animations
// are defined in globals.css or injected elsewhere.
/* Example CSS (ensure these exist):
.perspective-\\[500px\\] { perspective: 500px; }
.transform-style-3d { transform-style: preserve-3d; }
.backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }

@keyframes flip-down {
  0% { transform: rotateX(0deg); }
  100% { transform: rotateX(-90deg); }
}
.animate-flip-down {
  animation: flip-down 0.5s ease-in forwards;
}

@keyframes flip-up {
  0% { transform: rotateX(90deg); }
  100% { transform: rotateX(0deg); }
}
.animate-flip-up {
  animation: flip-up 0.5s ease-out forwards;
}
*/


    