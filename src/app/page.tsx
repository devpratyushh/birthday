
'use client';

import { useState, useEffect } from 'react';
import { Countdown } from '@/components/countdown';
import { VerticalTimeline } from '@/components/vertical-timeline';
import BirthdayLetter from '@/components/birthday-letter';
import BackgroundAnimation from '@/components/background-animation';
import { timelineEvents } from '@/data/timeline-events';
import { PartyPopper } from 'lucide-react'; // For balloons

// Target date: April 30th, 2025, 00:00:00 IST
const TARGET_DATE = new Date('2025-04-30T00:00:00+05:30').getTime();

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [headingText, setHeadingText] = useState('Anandita');
  const [headingState, setHeadingState] = useState<'initial' | 'strike' | 'final'>('initial');

  useEffect(() => {
    setIsClient(true);

    const headingTimer = setTimeout(() => {
      setHeadingState('strike');
      const replaceTimer = setTimeout(() => {
        setHeadingText('Babe'); // Change text to Babe
        setHeadingState('final'); // Trigger fade-in for Babe
      }, 600); // Duration for strike-through animation + small delay

      return () => clearTimeout(replaceTimer);
    }, 1500); // Start animation slightly earlier

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference <= 0) {
        if (!showLetter) {
          setShowLetter(true);
          setTimeLeft(0);
        }
        // No need to clear interval here, handle below
      } else {
         if (showLetter) {
           setShowLetter(false);
         }
        setTimeLeft(difference);
      }
        return difference; // Return difference to check for clearing interval
    };

    const initialDifference = calculateTimeLeft(); // Initial calculation
     if (initialDifference <= 0) {
        setShowLetter(true); // Show letter immediately if date has passed
     }

    const timer = setInterval(() => {
       const diff = calculateTimeLeft();
        if (diff <= 0) {
           clearInterval(timer); // Stop timer when countdown finishes
        }
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(timer);
      clearTimeout(headingTimer);
    };
  }, [showLetter]);

  if (!isClient) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-background p-4 md:p-8">
        <BackgroundAnimation />
        <div className="z-10 w-full max-w-4xl text-center">
          {/* Simple loading state */}
          <div className="text-xl text-muted-foreground">Loading Pookie's Surprise...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center relative overflow-hidden bg-background p-4 md:p-8 pt-16 md:pt-24">
      <BackgroundAnimation />
      <div className="z-10 w-full max-w-5xl text-center flex flex-col items-center"> {/* Center content */}
        {showLetter ? (
          <BirthdayLetter />
        ) : (
          <>
            {/* Countdown Section */}
            <div className="mb-16 md:mb-24 flex flex-col items-center">
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-primary animate-fade-in">
                  <span className="heading-text-wrapper"> {/* Wrapper for positioning */}
                     <span className={`heading-text ${headingState === 'strike' ? 'strike' : ''} ${headingState === 'final' ? 'final' : ''} transition-opacity duration-500 ${headingState === 'strike' ? 'opacity-100' : (headingState === 'final' ? 'opacity-100' : 'opacity-100')}`}>
                         {headingText === 'Anandita' && headingState !== 'final' ? 'Anandita' : ''}
                         {headingText === 'Babe' && headingState === 'final' ? 'Babe' : ''}
                     </span>
                 </span>
                 's Birthday Surprise!
               </h1>
               <p className="text-lg md:text-xl text-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                 Happy Birthdayy Pookieee!! 🎉
               </p>
               <div className="relative w-full flex justify-center mt-4"> {/* Container for countdown and balloons */}
                 {/* Balloons - Positioned around the countdown */}
                  <PartyPopper className="absolute -left-10 sm:-left-16 -top-8 sm:-top-12 text-pink-400/80 w-12 h-12 sm:w-16 sm:h-16 animate-balloon-float-1 transform -rotate-12"/>
                  <PartyPopper className="absolute -right-10 sm:-right-16 -top-4 sm:-top-8 text-purple-400/80 w-10 h-10 sm:w-12 sm:h-12 animate-balloon-float-2 transform rotate-6"/>
                  <PartyPopper className="absolute left-4 sm:left-8 -bottom-8 sm:-bottom-12 text-yellow-400/80 w-11 h-11 sm:w-14 sm:h-14 animate-balloon-float-3 transform rotate-10"/>
                  <PartyPopper className="absolute right-4 sm:right-8 -bottom-4 sm:-bottom-8 text-blue-400/80 w-9 h-9 sm:w-10 sm:h-10 animate-balloon-float-1 animation-delay-300 transform -rotate-8"/>

                 {/* Countdown */}
                 {timeLeft !== null ? (
                    // Ensure Countdown component itself doesn't have conflicting width/margins
                   <Countdown targetTimestamp={TARGET_DATE} />
                 ) : (
                   <div className="text-xl text-foreground py-10">Calculating time...</div> // Added padding
                 )}
               </div>
            </div>

            {/* Timeline Section */}
            <div className="w-full px-4 md:px-0 mt-12 md:mt-16"> {/* Added margin-top */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-10 md:mb-12 text-secondary-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
                Our Journey So Far...
              </h2>
              <VerticalTimeline events={timelineEvents} />
            </div>
          </>
        )}
      </div>
       {/* Optional Footer - Adjusted margin */}
       {!showLetter && (
         <footer className="z-10 mt-20 md:mt-28 text-center text-muted-foreground text-sm animate-fade-in" style={{ animationDelay: '0.6s' }}>
           Made with love for my Pookie ❤️
         </footer>
       )}
    </main>
  );
}
