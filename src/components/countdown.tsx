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

const calculateTimeLeft = (targetDate: Date): TimeLeft | null => {
  const difference = +targetDate - +new Date();

  if (difference <= 0) {
    return null; // Time is up or has passed
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

// Individual Flip Unit Component
interface FlipUnitProps {
  currentValue: number;
  previousValue: number; // Now non-nullable, controlled by parent
  label: string;
}

const FlipUnit: React.FC<FlipUnitProps> = memo(({ currentValue, previousValue, label }) => {
  const isInitialMount = useRef(true); // Track initial mount
  const [isFlipping, setIsFlipping] = useState(false);

  const formattedValue = String(currentValue).padStart(2, '0');
  const formattedPreviousValue = String(previousValue).padStart(2, '0');

  useEffect(() => {
     // Don't animate on initial mount
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }

    // Only trigger flip if the value actually changed
    if (currentValue !== previousValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 480); // Match animation duration in CSS
      return () => clearTimeout(timer);
    }
  }, [currentValue, previousValue]);


  return (
    <div className="flex flex-col items-center text-center w-16 h-24 md:w-24 md:h-32 perspective-[500px]">
      <div className="relative w-full h-1/2 overflow-hidden rounded-t-lg">
        {/* Top Half (Static - shows previous value until flip starts) */}
        <div className="absolute inset-0 bg-primary/80 text-primary-foreground flex items-end justify-center pb-1">
          <span className="text-3xl md:text-5xl font-bold tabular-nums">{formattedPreviousValue}</span>
        </div>
        {/* Top Half (Flipping - rotates down with previous value) */}
        <div
          className={cn(
            "absolute inset-0 bg-primary text-primary-foreground flex items-end justify-center pb-1 origin-bottom transform-style-3d backface-hidden",
            isFlipping ? 'animate-flip-down' : ''
          )}
          style={{ zIndex: 2 }}
        >
          <span className="text-3xl md:text-5xl font-bold tabular-nums">{formattedPreviousValue}</span>
        </div>
         {/* Top Half (Static - shows new value after flip completes) */}
        <div className="absolute inset-0 bg-primary/80 text-primary-foreground flex items-end justify-center pb-1">
          <span className="text-3xl md:text-5xl font-bold tabular-nums">{formattedValue}</span>
        </div>
      </div>
      <div className="relative w-full h-1/2 overflow-hidden rounded-b-lg">
         {/* Bottom Half (Static - shows previous value initially) */}
        <div className="absolute inset-0 bg-primary text-primary-foreground flex items-start justify-center pt-1">
          <span className="text-3xl md:text-5xl font-bold tabular-nums">{formattedPreviousValue}</span>
        </div>
        {/* Bottom Half (Flipping - reveals new value rotating up) */}
        <div
           className={cn(
            "absolute inset-0 bg-primary/80 text-primary-foreground flex items-start justify-center pt-1 origin-top transform-style-3d backface-hidden",
             isFlipping ? 'animate-flip-up' : ''
           )}
        >
           <span className="text-3xl md:text-5xl font-bold tabular-nums">{formattedValue}</span>
         </div>
          {/* Bottom Half (Static - shows new value after flip) */}
         <div className="absolute inset-0 bg-primary text-primary-foreground flex items-start justify-center pt-1">
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
  const [currentTimeLeft, setCurrentTimeLeft] = useState<TimeLeft | null>(() => calculateTimeLeft(targetDate));
  // Use ref for previous time to avoid re-renders caused by setting previous state
  const previousTimeLeftRef = useRef<TimeLeft | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to hold interval ID

  // Store current time as previous before the next update
  useEffect(() => {
      previousTimeLeftRef.current = currentTimeLeft;
  });


  useEffect(() => {
     // Function to handle the interval tick
    const tick = () => {
       const newTimeLeft = calculateTimeLeft(targetDate);
       setCurrentTimeLeft(newTimeLeft);

       if (newTimeLeft === null) {
         console.log("Countdown interval detected completion."); // Debug log
         onComplete();
         if (intervalRef.current) {
           clearInterval(intervalRef.current);
         }
       }
    };

    // Immediately check if the time is already up on mount
    const initialTimeLeft = calculateTimeLeft(targetDate);
    setCurrentTimeLeft(initialTimeLeft); // Set initial time

    if (initialTimeLeft === null) {
      console.log("Countdown initial check detected completion."); // Debug log
      onComplete();
      return; // Don't start the interval if already complete
    }

    // Start the interval
    intervalRef.current = setInterval(tick, 1000);

    // Clear interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetDate, onComplete]); // Dependencies


  if (currentTimeLeft === null) {
    return null; // Render nothing if countdown is complete
  }

  // Get the previous time values, defaulting to current if no previous (initial render)
  const prevTime = previousTimeLeftRef.current ?? currentTimeLeft;

  return (
      <div className="flex justify-center items-start space-x-2 sm:space-x-4 md:space-x-6 p-4">
        {(Object.keys(currentTimeLeft) as Array<keyof TimeLeft>).map((interval) => (
          <FlipUnit
            key={interval}
            currentValue={currentTimeLeft[interval]}
            previousValue={prevTime[interval]} // Pass previous value
            label={interval}
          />
        ))}
      </div>
  );
};

// Add necessary CSS for perspective and backface-visibility if not in globals.css
const styles = `
.perspective-\\[500px\\] { perspective: 500px; }
.transform-style-3d { transform-style: preserve-3d; }
.backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }

@keyframes flip-down {
  0% { transform: rotateX(0deg); }
  100% { transform: rotateX(-90deg); }
}
.animate-flip-down {
  animation: flip-down 0.5s ease-in forwards; /* Use forwards to keep end state */
}

@keyframes flip-up {
  0% { transform: rotateX(90deg); }
  100% { transform: rotateX(0deg); }
}
.animate-flip-up {
  animation: flip-up 0.5s ease-out forwards; /* Use forwards */
  /* Delay slightly less than flip-down to overlap smoothly */
  /* animation-delay: 0.45s; */
}
`;

// Inject styles (ensure this runs only once)
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
