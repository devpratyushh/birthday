
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, PartyPopper } from 'lucide-react'; // Import icons for decoration

// Function to add interactive spans around specific words
const makeInteractive = (text: string) => {
  const interactiveWords = [
      "cutieee", "my love", "kuchupuchuuuu", "jaaan", "love", "magical", // Replaced pookieee
      "mine", "us", "funnn", "babe", "pouch", "Situaa", "💗" // Add more words as needed
    ];
  const regex = new RegExp(`\\b(${interactiveWords.join('|')})\\b`, 'gi');

  const parts = text.split(regex);

  return parts.map((part, index) => {
    // Check if the exact part (case-insensitive) is in the list
    const lowerPart = part.toLowerCase();
    if (interactiveWords.some(word => word.toLowerCase() === lowerPart)) {
      // Apply the 'interactive-word' class for hover effects
      return <span key={index} className="interactive-word">{part}</span>;
    }
    return part;
  });
};


const BirthdayLetter: React.FC = () => {
  const letterContent = [
      "Hailo Hailoo! Hailoo to my cutieee my love kuchupuchuuuu, Hiii Anandita, kaisi hai meri jaaan!", // Replaced pookieee
      "Dur dur se udte udte khabar aai hai ki aaj kisi ka bday and to humne v socha ki thoda Happie Happie Birthdayyy hum v bol dee anddd yoo welcome to adulting, life’s gonna change a lot for both of us in the next couple of years, so brace yourself for all the fun things life has to offer – Oh shitt I sound like sandeep maheshwari but from chor bazaar lol (tried to be funny part 1 😂)",
      "Life has never been same since I unexpectedly met someone (very gora) in my sarkari school and things aren’t the same since the first “ye aage kyu hai” to you yelling “pandittt”, My love, this pandit has been touched by your embrace and couldn’t thank god enough for this cozzz – “Rab ne bana di jodi”.",
      "From the very first time I saw you to that confession in just two days, there was something magical about you which drew me more and more towards you, talking an entire night even though my “proposal” didn’t work out as I expected. Wait.. I know my expectations were crazy to go and ask out someone who I have just met but you know Anandita there was something about you which made me believe that if i did the right efforts and right things i would have you, i would call you “mine” and look here we are – from you and me to us, It has been a long journey but nothing in front of the journey we have ahead of us and I wish to hold your hand, to hold your hand “once and for all”.",
      "It’s just the beginning of the many more birthdays we would celebrate together, with the little nok-jhok with the little kalesh and aaa lot of funnn which we have together in this journey called life or better “our life”.",
      "The high school romance which I always used to talk about has just began there’s a lot to come my love and yrr when I look back at the time we had together I am sure nothing can ever top that, from being in despression ki kal ke exam ke lie kch to padhe hi nahi hai to the fact that i would be able to see you, it truly was an experience love, from whispering “Btw Hi” to the “cafe hai kya” to the cute little pouch exchange we had it all holdssss a very very deep place in my heard and how could i forget the chocolates we shared during the exams, I had the best 1 month of my life with you and not to mention me trying to talk to you chche wo ITF padhane ke bahane ya english literature ki random baate and guess what we talked like 4 hours loll sooo yk it ki hm kitna bolte hai and agar hm avi nahi ruke to pages badh jayengi and yk me gareeb blinkit wale paishe le lenge extra lol.",
      "Ik Anandita this is not the prettiest letter one could give neither this is the best but love this is filled with emotions and my love for you, I don’t know when I will get to see you next but until then its your 2010 was Situaa saying “I love youu babe I lovee you aaa lott 💗” , I have said this quite a lot and I am saying this again If you would have no one by your side you will find me, I don’t want to be very dramatic coz ik actions greater than wordsss and amidst all the daily chaos I promise to be always yours babe!"
    ];


  return (
     <div className="relative w-full max-w-3xl mx-auto animate-letter-float-up"> {/* Relative container for positioning */}
        {/* Floating Decorations */}
        <Heart
            className="absolute -top-10 -left-10 w-10 h-10 text-primary/60 animate-gentle-sway opacity-80"
            style={{ animationDelay: '0.2s', animationDuration: '6s' }}
            fill="currentColor"
            strokeWidth={0}
         />
         <PartyPopper
            className="absolute -top-12 -right-8 w-12 h-12 text-pink-400/70 transform -rotate-12 animate-balloon-float-1 opacity-90"
             style={{ animationDelay: '0s', animationDuration: '8s' }}
          />
          <Heart
            className="absolute -bottom-12 -right-12 w-14 h-14 text-accent/70 animate-slow-spin-fade opacity-70"
            style={{ animationDelay: '0.5s', animationDuration: '18s' }}
            fill="currentColor"
            strokeWidth={0}
          />
           <PartyPopper
            className="absolute -bottom-10 -left-14 w-10 h-10 text-purple-400/60 transform rotate-10 animate-balloon-float-3 opacity-85"
            style={{ animationDelay: '0.3s', animationDuration: '9s' }}
          />
          {/* Smaller heart */}
          <Heart
            className="absolute top-1/3 -left-16 w-6 h-6 text-secondary/50 animate-twinkle opacity-60"
            style={{ animationDelay: '0.8s', animationDuration: '7s' }}
            fill="currentColor"
            strokeWidth={0}
          />


        <ScrollArea className="h-[80vh] w-full mx-auto"> {/* Added ScrollArea */}
            <Card className="w-full mx-auto shadow-xl bg-card/95 backdrop-blur-md border-primary/30 rounded-xl relative z-10"> {/* Added z-10 */}
            <CardHeader className="text-center border-b border-primary/15 pb-4"> {/* Lighter border */}
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary-highlight drop-shadow-lg"> {/* Use highlight color, bigger shadow */}
                A Special Message For You! 💌
                </CardTitle>
            </CardHeader>
            <CardContent className="text-base md:text-lg text-card-foreground leading-relaxed space-y-5 p-6 md:p-8 font-serif"> {/* Changed font slightly */}
                {letterContent.map((paragraph, index) => (
                    <p key={index}>{makeInteractive(paragraph)}</p>
                ))}

                {/* Signature */}
                <p className="text-right font-semibold pt-4 text-primary">
                  With all my love, <br />
                  Your <span className="interactive-word">Situaa</span>
                </p>
            </CardContent>
            </Card>
        </ScrollArea>
      </div>
  );
};

export default BirthdayLetter;
