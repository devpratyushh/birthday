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
  previousValue: number; // Controlled by parent
  label: string;
}

const FlipUnit: React.FC<FlipUnitProps> = memo(({ currentValue, previousValue, label }) => {
  const isInitialRender = useRef(true); // Track initial render on client
  const [displayPreviousValue, setDisplayPreviousValue] = useState(previousValue);
  const [isFlipping, setIsFlipping] = useState(false);

  const formattedValue = String(currentValue).padStart(2, '0');
  const formattedDisplayPreviousValue = String(displayPreviousValue).padStart(2, '0');


  useEffect(() => {
    // Avoid animation on the very first client render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      setDisplayPreviousValue(currentValue); // Sync initial display
      return;
    }

    // Only trigger flip if the value actually changed since the *last* update
    if (currentValue !== previousValue) {
      setDisplayPreviousValue(previousValue); // Set the value to flip from
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
        setDisplayPreviousValue(currentValue); // Update static parts after flip
      }, 480); // Slightly less than animation duration for smoother transition
      return () => clearTimeout(timer);
    }
  }, [currentValue, previousValue]);


  return (
    <div className="flex flex-col items-center text-center w-16 h-24 md:w-24 md:h-32 perspective-[500px]">
      <div className="relative w-full h-1/2 overflow-hidden rounded-t-lg">
        {/* Static Top Half (New Value) - Always there underneath */}
        <div className="absolute inset-0 bg-primary/80 text-primary-foreground flex items-end justify-center pb-1">
          <span className="text-3xl md:text-5xl font-bold tabular-nums">{formattedValue}</span>
        </div>
        {/* Flipping Top Half (Old Value) - Flips down */}
        <div
          className={cn(
            "absolute inset-0 bg-primary text-primary-foreground flex items-end justify-center pb-1 origin-bottom transform-style-3d backface-hidden",
             // Only add animation class when flipping
            isFlipping ? 'animate-flip-down' : ''
          )}
          style={{ zIndex: isFlipping ? 2 : 1 }} // Ensure flipping part is on top during animation
        >
          <span className="text-3xl md:text-5xl font-bold tabular-nums">{formattedDisplayPreviousValue}</span>
        </div>
      </div>
      <div className="relative w-full h-1/2 overflow-hidden rounded-b-lg">
         {/* Static Bottom Half (Old Value) - Always there underneath */}
         <div className="absolute inset-0 bg-primary text-primary-foreground flex items-start justify-center pt-1">
           <span className="text-3xl md:text-5xl font-bold tabular-nums">{formattedDisplayPreviousValue}</span>
         </div>
        {/* Flipping Bottom Half (New Value) - Flips up */}
        <div
           className={cn(
            "absolute inset-0 bg-primary/80 text-primary-foreground flex items-start justify-center pt-1 origin-top transform-style-3d backface-hidden",
            // Only add animation class when flipping
            isFlipping ? 'animate-flip-up' : ''
           )}
           style={{ zIndex: isFlipping ? 2 : 1 }} // Ensure flipping part is on top
        >
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
  const previousTimeLeftRef = useRef<TimeLeft | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set initial state and flag client mount
  useEffect(() => {
    setIsClient(true);
    const initialTime = calculateTimeLeft(targetTime);
    setCurrentTimeLeft(initialTime);
    previousTimeLeftRef.current = initialTime; // Set initial previous time

    if (initialTime === null) {
      console.log("Countdown initial check detected completion.");
      onComplete();
      return; // Don't start interval if already complete
    }

    // Start the interval
    intervalRef.current = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetTime);
      // Update previous time *before* setting current time for the next render
      previousTimeLeftRef.current = currentTimeLeft;
      setCurrentTimeLeft(newTimeLeft);

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
    // Render nothing or a placeholder on the server or if countdown is complete/not yet calculated
    // You could return a placeholder skeleton here if desired
    return null;
  }

  // Use the ref for previous time. It's updated just before state update.
  const prevTime = previousTimeLeftRef.current ?? currentTimeLeft; // Fallback just in case

  return (
      <div className="flex justify-center items-start space-x-2 sm:space-x-4 md:space-x-6 p-4">
        {(Object.keys(currentTimeLeft) as Array<keyof TimeLeft>).map((interval) => (
          <FlipUnit
            key={interval}
            currentValue={currentTimeLeft[interval]}
            // Ensure prevTime is not null; fallback to current if it is (shouldn't happen after mount)
            previousValue={prevTime?.[interval] ?? currentTimeLeft[interval]}
            label={interval}
          />
        ))}
      </div>
  );
};

// Add necessary CSS for perspective and backface-visibility if not in globals.css
// (Assuming these styles are correctly defined in globals.css or injected elsewhere)
/*
const styles = `
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
`;

if (typeof window !== 'undefined') {
  const styleSheetId = 'countdown-flip-styles';
  if (!document.getElementById(styleSheetId)) {
      const styleSheet = document.createElement("style");
      styleSheet.id = styleSheetId;
      styleSheet.type = "text/css";
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
   }
}
*/
