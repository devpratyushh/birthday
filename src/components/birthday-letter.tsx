import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart } from 'lucide-react'; // Using Heart icon

interface BirthdayLetterProps {
  letterContent: string;
}

const BirthdayLetter: React.FC<BirthdayLetterProps> = ({ letterContent }) => {
  // Split the letter into paragraphs for better formatting
  const paragraphs = letterContent.split('\n').filter(p => p.trim() !== '');

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
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-foreground mb-4 text-base md:text-lg leading-relaxed font-serif">
                {paragraph}
              </p>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default BirthdayLetter;

// Add fade-in animation to globals.css or here if preferred
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}
`;

// Inject styles (optional, could be in globals.css)
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
