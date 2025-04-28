"use client";

import { useState } from 'react';
import { Countdown } from '@/components/countdown';
import { Timeline } from '@/components/timeline';
import BirthdayLetter from '@/components/birthday-letter';
import BackgroundAnimation from '@/components/background-animation';
import { Separator } from '@/components/ui/separator';
import { Heart } from 'lucide-react'; // Icon for separator

// Define the target date: April 30th, 2024, 00:00:00 IST
// Note: JavaScript Date month is 0-indexed, so April is 3.
// We need to consider the Indian Standard Time (IST) offset UTC+5:30
// Easiest way is usually to define in UTC and let browser handle local time,
// but since the requirement is specific (00:00 AM IST), let's be explicit.
// April 30, 2024 00:00:00 IST is April 29, 2024 18:30:00 UTC
const targetDate = new Date(Date.UTC(2024, 3, 29, 18, 30, 0)); // 3 is April

// --- Letter Content (Extracted from request) ---
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
    title: "First Encounter (Sarkari School)",
    description: "The day life changed when I unexpectedly met someone special (very gora!) in school.",
    // imageUrl: "https://picsum.photos/400/225?random=1" // Placeholder
  },
  {
    date: "A Few Days Later",
    title: "The Confession",
    description: "Gathered the courage to confess my feelings, drawn by something magical about you.",
     // imageUrl: "https://picsum.photos/400/225?random=2"
  },
    {
    date: "Late Night Talks",
    title: "All Night Conversation",
    description: "Even though the proposal didn't go as planned, we talked the entire night. The start of many long conversations.",
    // imageUrl: "https://picsum.photos/400/225?random=3"
  },
  {
    date: "Exam Season",
    title: "High School Romance Begins",
    description: "Whispering 'Btw Hi', asking 'cafe hai kya?', exchanging pouches, and sharing chocolates during exams. The best month!",
   // imageUrl: "https://picsum.photos/400/225?random=4"
  },
    {
    date: "Study Sessions",
    title: "ITF & English Lit",
    description: "Finding excuses to talk, like teaching ITF or discussing English literature... leading to 4-hour chats!",
    // imageUrl: "https://picsum.photos/400/225?random=5"
  },
  {
    date: "Now",
    title: "From 'You & Me' to 'Us'",
    description: "It's been a journey, but nothing compared to the one ahead. Holding your hand, once and for all.",
    // imageUrl: "https://picsum.photos/400/225?random=6"
  },
    {
    date: "April 30th",
    title: "Happy Birthday, Anandita!",
    description: "Celebrating the first of many birthdays together. Welcome to adulting! Love youuuu babe!",
    // imageUrl: "https://picsum.photos/400/225?random=7"
  },
];
// --- End Timeline Events ---


export default function Home() {
  const [showLetter, setShowLetter] = useState(new Date() >= targetDate);

  const handleCountdownComplete = () => {
    setShowLetter(true);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 relative z-10">
       <BackgroundAnimation />

      {!showLetter ? (
        <div className="flex flex-col items-center w-full space-y-12">
           <h1 className="text-4xl md:text-5xl font-extrabold text-center text-primary drop-shadow-lg mt-8">
            For My Dearest Pookie ❤️
          </h1>
           <Countdown targetDate={targetDate} onComplete={handleCountdownComplete} />

           <Separator className="my-8 max-w-sm mx-auto bg-primary/50 h-1" />
           <h2 className="text-3xl font-bold text-center text-secondary-foreground mb-6">Our Little Journey</h2>
           <Timeline events={timelineEvents} />
        </div>
      ) : (
        <BirthdayLetter letterContent={letterContent} />
      )}
    </main>
  );
}
