"use client";

import { useState, useEffect, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  let timeLeft: TimeLeft | null = null;

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

// Individual Flip Unit Component
interface FlipUnitProps {
  currentValue: number;
  previousValue: number | null; // Keep track of the previous value for animation
  label: string;
}

const FlipUnit: React.FC<FlipUnitProps> = memo(({ currentValue, previousValue, label }) => {
  const [displayValue, setDisplayValue] = useState(currentValue);
  const [isFlipping, setIsFlipping] = useState(false);
  const formattedValue = String(currentValue).padStart(2, '0');
  const formattedPreviousValue = String(previousValue ?? currentValue).padStart(2, '0');

  useEffect(() => {
    if (previousValue !== null && currentValue !== previousValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setDisplayValue(currentValue);
        setIsFlipping(false);
      }, 450); // Slightly less than animation duration to ensure smooth transition
      return () => clearTimeout(timer);
    } else if (previousValue === null) {
       // Initial load, set directly without animation
       setDisplayValue(currentValue);
    }
  }, [currentValue, previousValue]);


  return (
    <div className="flex flex-col items-center text-center w-16 h-24 md:w-24 md:h-32 perspective-[500px]">
      <div className="relative w-full h-1/2">
        {/* Top Half (Static) */}
        <div className="absolute inset-0 bg-primary/80 text-primary-foreground rounded-t-lg flex items-center justify-center overflow-hidden">
          <span className="text-3xl md:text-5xl font-bold tabular-nums">{formattedValue}</span>
        </div>
        {/* Top Half (Flipping) */}
        <div
          className={cn(
            "absolute inset-0 bg-primary text-primary-foreground rounded-t-lg flex items-center justify-center overflow-hidden origin-bottom transform-style-3d backface-hidden",
            isFlipping ? 'animate-flip-down' : ''
          )}
          style={{ zIndex: 2 }} // Ensure flipping part is on top during animation
        >
          <span className="text-3xl md:text-5xl font-bold tabular-nums">{formattedPreviousValue}</span>
        </div>
      </div>
      <div className="relative w-full h-1/2">
         {/* Bottom Half (Static - shows new value after flip) */}
        <div className="absolute inset-0 bg-primary text-primary-foreground rounded-b-lg flex items-center justify-center overflow-hidden">
          <span className="text-3xl md:text-5xl font-bold tabular-nums">{formattedValue}</span>
        </div>
        {/* Bottom Half (Flipping - reveals new value) */}
        <div
           className={cn(
            "absolute inset-0 bg-primary/80 text-primary-foreground rounded-b-lg flex items-center justify-center overflow-hidden origin-top transform-style-3d backface-hidden",
             isFlipping ? 'animate-flip-up' : ''
           )}
            style={{ transform: isFlipping ? 'rotateX(90deg)' : 'rotateX(0deg)' }}
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
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calculateTimeLeft(targetDate));
  const [previousTimeLeft, setPreviousTimeLeft] = useState<TimeLeft | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Calculate initial state synchronously
    const initialTimeLeft = calculateTimeLeft(targetDate);
    setTimeLeft(initialTimeLeft);
    if (!initialTimeLeft) {
       setIsComplete(true);
       // Ensure onComplete is called if already past the date on load
       if (+new Date() >= +targetDate) {
         onComplete();
       }
    }

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setPreviousTimeLeft(timeLeft); // Store current time as previous
      setTimeLeft(newTimeLeft);

      if (!newTimeLeft && !isComplete) {
        setIsComplete(true);
        onComplete();
        clearInterval(timer); // Stop the timer once complete
      }
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate, onComplete, isComplete, timeLeft]); // Added timeLeft to dependency array for previousTimeLeft update


  if (isComplete || !timeLeft) {
    return null; // Don't render the countdown if it's complete
  }

  return (
      <div className="flex justify-center items-start space-x-2 sm:space-x-4 md:space-x-6 p-4">
        {(Object.keys(timeLeft) as Array<keyof TimeLeft>).map((interval) => (
          <FlipUnit
            key={interval}
            currentValue={timeLeft[interval]}
            previousValue={previousTimeLeft ? previousTimeLeft[interval] : null}
            label={interval}
          />
        ))}
      </div>
  );
};

// Add necessary CSS for perspective and backface-visibility in globals.css or here
const styles = `
.perspective-\\[500px\\] { perspective: 500px; }
.transform-style-3d { transform-style: preserve-3d; }
.backface-hidden { backface-visibility: hidden; }
`;

// Inject styles (optional, could be in globals.css)
if (typeof window !== 'undefined') {
  const styleSheetId = 'countdown-styles';
  if (!document.getElementById(styleSheetId)) {
      const styleSheet = document.createElement("style");
      styleSheet.id = styleSheetId;
      styleSheet.type = "text/css";
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
   }
}
