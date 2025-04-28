import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart } from 'lucide-react'; // Using Heart icon
import { cn } from '@/lib/utils';

interface BirthdayLetterProps {
  letterContent: string;
}

// Keywords/phrases to identify romantic sentences for highlighting
const romanticPhrases = [
  "my cutieee pookieee kuchupuchuuuu",
  "meri jaaan",
  "My love",
  "this pandit has been touched by your embrace",
  "Rab ne bana di jodi",
  "something magical about you",
  "drew me more and more towards you",
  "i would call you “mine”",
  "from you and me to us",
  "journey we have ahead of us",
  "I wish to hold your hand",
  "hold your hand “once and for all”",
  "celebrate together",
  "our life",
  "The high school romance",
  "a lot to come my love",
  "I am sure nothing can ever top that",
  "it truly was an experience love",
  "it all holdssss a very very deep place in my heard",
  "I had the best 1 month of my life with you",
  "love this is filled with emotions and my love for you",
  "I love youu babe I lovee you aaa lott 💗",
  "If you would have no one by your side you will find me",
  "I promise to be always yours babe!",
  "always yours babe"
];

// Function to parse the letter and wrap romantic phrases
const parseLetterContent = (content: string) => {
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');
  return paragraphs.map((paragraph, pIndex) => {
    let currentSegment = paragraph;
    const segments: React.ReactNode[] = [];
    let keyIndex = 0; // Unique key for React elements

    // Sort phrases by length descending to match longer phrases first
    const sortedPhrases = [...romanticPhrases].sort((a, b) => b.length - a.length);

    while (currentSegment.length > 0) {
      let foundPhrase = false;
      for (const phrase of sortedPhrases) {
        const index = currentSegment.toLowerCase().indexOf(phrase.toLowerCase());
        if (index !== -1) {
          // Add the text before the phrase
          if (index > 0) {
            segments.push(<span key={`text-${pIndex}-${keyIndex++}`}>{currentSegment.substring(0, index)}</span>);
          }
          // Add the highlighted phrase
          segments.push(
            <span
              key={`phrase-${pIndex}-${keyIndex++}`}
              className="romantic-phrase group relative inline-block cursor-pointer text-primary font-semibold transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_5px_hsl(var(--primary))]">
              {currentSegment.substring(index, index + phrase.length)}
              <Heart className="inline-block w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:animate-ping-once animate-pulse-fast text-primary/80" fill="currentColor" />
            </span>
          );
          currentSegment = currentSegment.substring(index + phrase.length);
          foundPhrase = true;
          break; // Move to the next part of the segment
        }
      }
      // If no phrase was found in the remaining segment, add it as regular text
      if (!foundPhrase) {
        segments.push(<span key={`text-${pIndex}-${keyIndex++}`}>{currentSegment}</span>);
        currentSegment = ""; // Exit loop
      }
    }

    return (
      <p key={`p-${pIndex}`} className="text-foreground mb-4 text-base md:text-lg leading-relaxed font-serif">
        {segments}
      </p>
    );
  });
};


const BirthdayLetter: React.FC<BirthdayLetterProps> = ({ letterContent }) => {
  const parsedContent = parseLetterContent(letterContent);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-gradient-to-br from-background to-secondary animate-fade-in">
       <Card className="w-full max-w-2xl shadow-2xl rounded-xl border-2 border-primary bg-white/95 backdrop-blur-md overflow-hidden relative">
         {/* Floating hearts decoration */}
         {[...Array(5)].map((_, i) => (
           <Heart
             key={i}
             className="absolute text-primary/30 animate-float"
             style={{
               width: `${Math.random() * 20 + 15}px`,
               height: `${Math.random() * 20 + 15}px`,
               top: `${Math.random() * 100}%`,
               left: `${Math.random() * 100}%`,
               animationDelay: `${Math.random() * 2}s`,
               animationDuration: `${Math.random() * 3 + 3}s`,
               zIndex: 0,
             }}
             fill="currentColor"
           />
         ))}

        <CardHeader className="text-center border-b border-primary/20 bg-accent/30 relative z-10">
          <CardTitle className="text-3xl font-bold text-primary tracking-tight flex items-center justify-center gap-2">
             <Heart className="w-8 h-8 animate-pulse" fill="currentColor"/>
             Happiest Birthday, My Pookie!
             <Heart className="w-8 h-8 animate-pulse" fill="currentColor"/>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8 relative z-10">
          <ScrollArea className="h-[60vh] pr-4">
            {parsedContent}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default BirthdayLetter;

// Add necessary animations to globals.css or here if preferred
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

@keyframes ping-once {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.7; }
  100% { transform: scale(1); opacity: 0; }
}
.animate-ping-once {
  animation: ping-once 0.6s cubic-bezier(0, 0, 0.2, 1);
}

.animate-pulse-fast {
   animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Add a subtle pulse to the romantic phrase text on hover */
.romantic-phrase:hover {
   animation: pulse-text 1.5s ease-in-out infinite;
}

@keyframes pulse-text {
   0%, 100% {
      text-shadow: 0 0 3px hsla(var(--primary), 0.5);
   }
   50% {
     text-shadow: 0 0 8px hsla(var(--primary), 0.8);
   }
}

`;

// Inject styles (optional, could be in globals.css)
if (typeof window !== 'undefined') {
  const styleSheetId = 'birthday-letter-styles';
  if (!document.getElementById(styleSheetId)) {
      const styleSheet = document.createElement("style");
      styleSheet.id = styleSheetId;
      styleSheet.type = "text/css";
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
   }
}
