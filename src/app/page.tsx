
'use client';

import { useState, useEffect } from 'react';
import { Countdown } from '@/components/countdown';
import { VerticalTimeline } from '@/components/vertical-timeline'; // Changed import
import BirthdayLetter from '@/components/birthday-letter';
import BackgroundAnimation from '@/components/background-animation';
import { Separator } from '@/components/ui/separator';
import AnimatedHeading from '@/components/animated-heading';

// Define the target date: April 30th, 2025, 00:00:00 IST
// Note: JavaScript Date month is 0-indexed, so April is 3.
// IST is UTC+5:30
// April 30, 2025 00:00:00 IST === April 29, 2025 18:30:00 UTC
// Use Date.UTC to avoid timezone issues during initialization
const targetDate = new Date(Date.UTC(2025, 3, 29, 18, 30, 0)); // Month 3 is April

// --- Letter Content ---
const letterContent = `
Hailo Hailoo!
Hailoo to my cutieee pookieee kuchupuchuuuu, Hiii Anandita, kaisi hai meri jaaan!
Dur dur se udte udte khabar aai hai ki aaj kisi ka bday and to humne v socha ki thoda Happie Happie Birthdayyy hum v bol dee anddd yoo welcome to adulting, life’s gonna change a lot for both of us in the next couple of years, so brace yourself for all the fun things life has to offer – Oh shitt I sound like sandeep maheshwari but from chor bazaar lol (tried to be funny part 1 😂)
Life has never been same since I unexpectedly met someone (very gora) in my sarkari school and things aren’t the same since the first “ye aage kyu hai” to you yelling “pandittt”, My love, this pandit has been touched by your embrace and couldn’t thank god enough for this cozzz – “Rab ne bana di jodi”.
From the very first time I saw you to that confession in just two days, there was something magical about you which drew me more and more towards you, talking an entire night even though my “proposal” didn’t work out as I expected. Wait.. I know my expectations were crazy to go and ask out someone who I have just met but you know Anandita there was something about you which made me believe that if i did the right efforts and right things i would have you, i would call you “mine” and look here we are – from you and me to us, It has been a long journey but nothing in front of the journey we have ahead of us and I wish to hold your hand, to hold your hand “once and for all”.
It’s just the beginning of the many more birthdays we would celebrate together, with the little nok-jhok with the little kalesh and aaa lot of funnn which we have together in this journey called life or better “our life”.
The high school romance which I always used to talk about has just began there’s a lot to come my love and yrr when I look back at the time we had together I am sure nothing can ever top that, from being in despression ki kal ke exam ke lie kch to padhe hi nahi hai to the fact that i would be able to see you, it truly was an experience love, from whispering “Btw Hi” to the “cafe hai kya” to the cute little pouch exchange we had it all holdssss a very very deep place in my heard and how could i forget the chocolates we shared during the exams, I had the best 1 month of my life with you and not to mention me trying to talk to you chche wo ITF padhane ke bahane ya english literature ki random baate and guess what we talked like 4 hours loll sooo yk it ki hm kitna bolte hai and agar hm avi nahi ruke to pages badh jayengi and yk me gareeb blinkit wale paishe le lenge extra lol.
Ik Anandita this is not the prettiest letter one could give neither this is the best but love this is filled with emotions and my love for you, I don’t know when I will get to see you next but until then its your 2010 was Situaa saying “I love youu babe I lovee you aaa lott 💗” , I have said this quite a lot and I am saying this again If you would have no one by your side you will find me, I don’t want to be very dramatic coz ik actions greater than wordsss and amidst all the daily chaos I promise to be always yours babe!
`;
// --- End Letter Content ---


// --- Timeline Events ---
const timelineEvents = [
  {
    date: "Unexpected Day",
    title: "First Encounter",
    description: "The day life changed when I unexpectedly met someone special (very gora!) in school.",
    imageUrl: "https://picsum.photos/seed/1/300/180" // Use seeded random for consistency
  },
  {
    date: "A Few Days Later",
    title: "The Confession",
    description: "Gathered the courage to confess my feelings, drawn by something magical about you.",
     imageUrl: "https://picsum.photos/seed/2/300/180"
  },
    {
    date: "Late Night Talks",
    title: "All Night Conversation",
    description: "Even though the proposal didn't go as planned, we talked the entire night. The start of many long conversations.",
    imageUrl: "https://picsum.photos/seed/3/300/180"
  },
  {
    date: "Exam Season",
    title: "High School Romance Begins",
    description: "Whispering 'Btw Hi', asking 'cafe hai kya?', exchanging pouches, and sharing chocolates during exams. The best month!",
   imageUrl: "https://picsum.photos/seed/4/300/180"
  },
    {
    date: "Study Sessions",
    title: "ITF & English Lit Chats",
    description: "Finding excuses to talk, like teaching ITF or discussing English literature... leading to 4-hour chats!",
    imageUrl: "https://picsum.photos/seed/5/300/180"
  },
  {
    date: "Now",
    title: "From 'You & Me' to 'Us'",
    description: "It's been a journey, but nothing compared to the one ahead. Holding your hand, once and for all.",
    imageUrl: "https://picsum.photos/seed/6/300/180"
  },
    {
    date: "April 30th, 2025",
    title: "Happy Birthday!",
    description: "Celebrating the first of many birthdays together. Welcome to adulting! Love youuuu babe!",
    imageUrl: "https://picsum.photos/seed/7/300/180"
  },
];
// --- End Timeline Events ---


export default function Home() {
   // Determine if it's birthday time based on client-side check
   const [isBirthdayTime, setIsBirthdayTime] = useState(false);

   useEffect(() => {
       // Safely check the date on the client after hydration
       const checkDate = () => {
           if (new Date() >= targetDate) {
               setIsBirthdayTime(true);
           } else {
                setIsBirthdayTime(false); // Explicitly set to false if before target date
           }
       };
       checkDate(); // Check immediately on mount

       // Set up interval only if it's not birthday time yet
       let intervalId: NodeJS.Timeout | null = null;
       if (new Date() < targetDate) {
           intervalId = setInterval(() => {
               if (new Date() >= targetDate) {
                   console.log("Target date reached via interval check!");
                   setIsBirthdayTime(true);
                   if(intervalId) clearInterval(intervalId);
               }
           }, 1000 * 30); // Check every 30 seconds
       }

       // Cleanup interval on component unmount
       return () => {
           if (intervalId) clearInterval(intervalId);
       };
   }, []); // Empty dependency array ensures this runs only once on the client after mount


   // Function to be called by Countdown when it finishes
   const handleCountdownComplete = () => {
     console.log("Countdown complete!");
     setIsBirthdayTime(true);
   };


  return (
    <main className="flex flex-col items-center justify-start min-h-screen pt-12 md:pt-16 relative overflow-x-hidden">
       <BackgroundAnimation />

       <div className="z-10 w-full flex flex-col items-center px-4">
         {!isBirthdayTime ? (
           <>
             {/* Animated Heading */}
             <AnimatedHeading />

             {/* Countdown */}
             <div className="my-8 md:my-12">
                {/* Pass targetDate as a prop */}
                <Countdown targetDate={targetDate} onComplete={handleCountdownComplete} />
             </div>


             <Separator className="my-6 md:my-10 max-w-xs md:max-w-sm mx-auto bg-primary/40 h-[2px]" />

             {/* Section Title for Timeline */}
             <h2 className="text-3xl md:text-4xl font-bold text-center text-secondary-foreground mb-8">
               Our Little Journey So Far...
             </h2>

             {/* Vertical Timeline */}
             <div className="w-full max-w-4xl px-4"> {/* Added padding for small screens */}
                <VerticalTimeline events={timelineEvents} />
             </div>

           </>
         ) : (
            // Render BirthdayLetter only after client-side check confirms it's time
             isBirthdayTime && <BirthdayLetter letterContent={letterContent} />
         )}
       </div>
    </main>
  );
}

    