"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

export const Countdown: React.FC<CountdownProps> = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft(targetDate));
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);
      if (!newTimeLeft && !isComplete) {
        setIsComplete(true);
        onComplete();
      }
    }, 1000);

    // Clear timeout if the component is unmounted or countdown completes
    return () => clearTimeout(timer);
  }, [timeLeft, targetDate, onComplete, isComplete]);

  if (isComplete || !timeLeft) {
    return null; // Don't render the countdown if it's complete
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-primary bg-accent/50">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold text-primary">Counting down to your special day!</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center space-x-4 text-center p-6">
        {Object.entries(timeLeft).map(([interval, value]) => (
          <div key={interval} className="flex flex-col items-center p-2 bg-background rounded-lg shadow-inner min-w-[60px]">
            <span className="text-4xl font-bold text-primary tabular-nums">
              {value < 10 ? `0${value}` : value}
            </span>
            <span className="text-xs uppercase text-muted-foreground pt-1">{interval}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
