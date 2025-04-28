
'use client';

import { useState, useEffect } from 'react';
import { Countdown } from '@/components/countdown';
import { VerticalTimeline } from '@/components/vertical-timeline'; // Import VerticalTimeline
import BirthdayLetter from '@/components/birthday-letter';
import BackgroundAnimation from '@/components/background-animation';
import { timelineEvents } from '@/data/timeline-events'; // Import timeline data
import { PartyPopper } from 'lucide-react'; // For balloons (or use SVGs)

// Target date: April 30th, 2025, 00:00:00 IST
const TARGET_DATE = new Date('2025-04-30T00:00:00+05:30').getTime();

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [headingText, setHeadingText] = useState('Anandita');
  const [headingState, setHeadingState] = useState<'initial' | 'strike' | 'final'>('initial');

  useEffect(() => {
    // Client-side check
    setIsClient(true);

    // Heading animation sequence
    const timer1 = setTimeout(() => {
      setHeadingState('strike');
      const timer2 = setTimeout(() => {
        setHeadingText('Babe');
        setHeadingState('final');
      }, 700); // Time for strikethrough visibility + fade out

      return () => clearTimeout(timer2);
    }, 2000); // Start animation after 2 seconds

    // Countdown timer logic
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference <= 0) {
        if (!showLetter) { // Only set state if changing
          setShowLetter(true);
          setTimeLeft(0);
        }
      } else {
         if (showLetter) { // Only set state if changing
           setShowLetter(false);
         }
        setTimeLeft(difference);
      }
    };

    calculateTimeLeft(); // Initial calculation
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup function
    return () => {
      clearInterval(timer);
      clearTimeout(timer1);
      // No need to clear timer2 here as it's cleared within timer1's cleanup
    };
  }, [showLetter]); // Re-run effect if showLetter changes might be needed

  // Avoid rendering potentially mismatched content on the server
  if (!isClient) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-background p-4 md:p-8">
        <BackgroundAnimation />
        <div className="z-10 w-full max-w-4xl text-center">
          <div className="text-2xl text-foreground">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center relative overflow-hidden bg-background p-4 md:p-8 pt-16 md:pt-24">
      <BackgroundAnimation />
      <div className="z-10 w-full max-w-5xl text-center">
        {showLetter ? (
          <BirthdayLetter />
        ) : (
          <>
            {/* Countdown Section */}
            <div className="mb-16 md:mb-24 flex flex-col items-center">
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-primary animate-fade-in relative">
                 <span className={`heading-text ${headingState}`}>
                   {headingText}
                 </span>
                 's Birthday Surprise!
               </h1>
               <p className="text-lg md:text-xl text-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                 Counting down until the special moment...
               </p>
               <div className="relative"> {/* Container for countdown and balloons */}
                 {/* Balloons */}
                 <div className="absolute -top-10 -left-16 -right-16 -bottom-10 flex items-center justify-center opacity-80 pointer-events-none">
                    <PartyPopper className="text-pink-400 w-16 h-16 animate-balloon-float-1 absolute -left-5 top-0"/>
                    <PartyPopper className="text-purple-400 w-12 h-12 animate-balloon-float-2 absolute -right-5 top-5"/>
                     <PartyPopper className="text-yellow-400 w-14 h-14 animate-balloon-float-3 absolute left-10 bottom-0"/>
                     <PartyPopper className="text-blue-400 w-10 h-10 animate-balloon-float-1 absolute right-10 bottom-5 animation-delay-300"/>
                 </div>
                 {/* Countdown */}
                 {timeLeft !== null ? (
                   <Countdown targetTimestamp={TARGET_DATE} />
                 ) : (
                   <div className="text-xl text-foreground">Calculating time...</div>
                 )}
               </div>
            </div>

            {/* Timeline Section */}
            <div className="w-full px-4 md:px-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-10 md:mb-12 text-secondary-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
                Our Journey So Far...
              </h2>
              <VerticalTimeline events={timelineEvents} />
            </div>
          </>
        )}
      </div>
       {/* Optional Footer */}
       {!showLetter && (
         <footer className="z-10 mt-16 md:mt-24 text-center text-muted-foreground text-sm animate-fade-in" style={{ animationDelay: '0.6s' }}>
           Made with love ❤️
         </footer>
       )}
    </main>
  );
}
