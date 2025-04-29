
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, PartyPopper, Mic, CheckCircle, AlertCircle, Star } from 'lucide-react'; // Added Star
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { levelConfig } from '@/data/level-config'; // Import level config for video ID
import YoutubeEmbed from './youtube-embed'; // Import YoutubeEmbed component

// Function to add interactive spans around specific words
const makeInteractive = (text: string) => {
  const interactiveWords = [
      "cutieee", "my love", "kuchupuchuuuu", "jaaan", "love", "magical",
      "mine", "us", "funnn", "babe", "pouch", "Situaa", "💗" // Add more words as needed
    ];
  // Match whole words case-insensitively, ensuring 💗 is matched exactly
  const regex = new RegExp(`(?<!\\w)(${interactiveWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})(?!\\w)`, 'gi');


  const parts = text.split(regex);

  return parts.map((part, index) => {
    // Check if the exact part (case-insensitive, or exact for symbols) is in the list
     const lowerPart = part?.toLowerCase(); // Handle potential undefined part
     if (part === '💗' || (lowerPart && interactiveWords.some(word => word.toLowerCase() === lowerPart))) {
      // Apply the 'interactive-word' class for hover effects
      return <span key={index} className="interactive-word">{part}</span>;
    }
    return part;
  });
};

interface BirthdayLetterProps {
  onLevelComplete: () => void; // Function to call when level is complete
}


const BirthdayLetter: React.FC<BirthdayLetterProps> = ({ onLevelComplete }) => {
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0); // Track failed attempts
  const maxAttempts = 2;
  const [proceedingAfterFail, setProceedingAfterFail] = useState(false); // State to prevent multiple triggers


  const letterContent = [
      "Hailo Hailoo! Hailoo to my cutieee my love kuchupuchuuuu, Hiii Anandita, kaisi hai meri jaaan!",
      "Dur dur se udte udte khabar aai hai ki aaj kisi ka bday and to humne v socha ki thoda Happie Happie Birthdayyy hum v bol dee anddd yoo welcome to adulting, life’s gonna change a lot for both of us in the next couple of years, so brace yourself for all the fun things life has to offer – Oh shitt I sound like sandeep maheshwari but from chor bazaar lol (tried to be funny part 1 😂)",
      "Life has never been same since I unexpectedly met someone (very gora) in my sarkari school and things aren’t the same since the first “ye aage kyu hai” to you yelling “pandittt”, My love, this pandit has been touched by your embrace and couldn’t thank god enough for this cozzz – “Rab ne bana di jodi”.",
      "From the very first time I saw you to that confession in just two days, there was something magical about you which drew me more and more towards you, talking an entire night even though my “proposal” didn’t work out as I expected. Wait.. I know my expectations were crazy to go and ask out someone who I have just met but you know Anandita there was something about you which made me believe that if i did the right efforts and right things i would have you, i would call you “mine” and look here we are – from you and me to us, It has been a long journey but nothing in front of the journey we have ahead of us and I wish to hold your hand, to hold your hand “once and for all”.",
      "It’s just the beginning of the many more birthdays we would celebrate together, with the little nok-jhok with the little kalesh and aaa lot of funnn which we have together in this journey called life or better “our life”.",
      "The high school romance which I always used to talk about has just began there’s a lot to come my love and yrr when I look back at the time we had together I am sure nothing can ever top that, from being in despression ki kal ke exam ke lie kch to padhe hi nahi hai to the fact that i would be able to see you, it truly was an experience love, from whispering “Btw Hi” to the “cafe hai kya” to the cute little pouch exchange we had it all holdssss a very very deep place in my heard and how could i forget the chocolates we shared during the exams, I had the best 1 month of my life with you and not to mention me trying to talk to you chche wo ITF padhane ke bahane ya english literature ki random baate and guess what we talked like 4 hours loll sooo yk it ki hm kitna bolte hai and agar hm avi nahi ruke to pages badh jayengi and yk me gareeb blinkit wale paishe le lenge extra lol.",
      "Ik Anandita this is not the prettiest letter one could give neither this is the best but love this is filled with emotions and my love for you, I don’t know when I will get to see you next but until then its your 2010 was Situaa saying “I love youu babe I lovee you aaa lott 💗” , I have said this quite a lot and I am saying this again If you would have no one by your side you will find me, I don’t want to be very dramatic coz ik actions greater than wordsss and amidst all the daily chaos I promise to be always yours babe!"
    ];


  useEffect(() => {
    const viewportElement = viewportRef.current;
    if (!viewportElement) return;

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = viewportElement;
        // Check if scrolled near the bottom (e.g., within 50px)
        if (scrollHeight - scrollTop - clientHeight < 50) {
           if (!showPrompt) { // Only set state if it's not already shown
               setShowPrompt(true);
           }
        } else {
           // Optional: Hide prompt if scrolled back up (keep it shown once scrolled)
           // if (showPrompt) {
           //    setShowPrompt(false);
           // }
        }
    };

    viewportElement.addEventListener('scroll', handleScroll);
    return () => viewportElement.removeEventListener('scroll', handleScroll);
  }, [showPrompt]); // Re-run effect if showPrompt changes

  // Setup Speech Recognition
   useEffect(() => {
    // Check if SpeechRecognition is available (using webkit prefix for broader compatibility)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
       console.error("Speech recognition not supported in this browser.");
       toast({
           variant: "destructive",
           title: "Browser Not Supported",
           description: "Oops! Speech recognition is needed for the next step, but it's not available in this browser. Please try Chrome or Edge.",
         });
       return;
     }

     recognitionRef.current = new SpeechRecognition();
     const recognition = recognitionRef.current;

     recognition.continuous = false; // Process speech after pause
     recognition.lang = 'en-US'; // Set language
     recognition.interimResults = false; // Only get final results


      recognition.onresult = (event) => {
          const last = event.results.length - 1;
          const command = event.results[last][0].transcript.trim().toLowerCase();
          console.log('Recognized:', command);
          setTranscript(command); // Store transcript

          // Check for the keywords "love" or "you"
           const isCorrectPhrase = command.includes('love') || command.includes('you');

           if (isCorrectPhrase) {
                toast({
                   title: "Perfect! 🥰", // Updated success message
                   description: "💖 Level 2 Unlocked! 💖",
                   className: "bg-green-100 border-green-400 text-green-800", // Custom success style
                 });
                 setFailedAttempts(0); // Reset attempts on success
                 setProceedingAfterFail(false); // Reset proceeding flag
               // Add a small delay before moving to the next level for the toast to be visible
               setTimeout(() => {
                   onLevelComplete(); // Go to next level
               }, 1500); // 1.5 second delay
           } else {
                const newFailedAttempts = failedAttempts + 1;
                setFailedAttempts(newFailedAttempts);

                if (newFailedAttempts < maxAttempts) {
                    toast({
                       variant: "destructive",
                       title: `Try Again?`, // Removed attempts left count
                       description: `Hmm, I heard "${command}". Please say something with "love" or "you". 😊`, // Updated guidance
                     });
                 } else {
                      // Max attempts reached
                      if (!proceedingAfterFail) { // Prevent multiple triggers
                        setProceedingAfterFail(true);
                         toast({
                           title: "It's okay... 😉",
                           description: "Saving that for a special moment! Moving on...",
                           className: "bg-blue-100 border-blue-400 text-blue-800", // Custom info style
                         });
                         // Proceed to the next level after showing the message
                          setTimeout(() => {
                             onLevelComplete(); // Go to next level
                          }, 1500); // 1.5 second delay
                      }
                 }
           }
          setIsListening(false); // Stop listening animation
      };

     recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = "Speech recognition error occurred.";
        let shouldProceed = false;

        if (event.error === 'no-speech') {
            errorMessage = "Didn't hear anything. Please try speaking clearly near the microphone.";
        } else if (event.error === 'audio-capture') {
            errorMessage = "Microphone problem. Ensure it's enabled, connected, and not muted.";
             // Proceed if mic capture fails persistently? Maybe not ideal, depends on desired flow
             shouldProceed = true; // Let's proceed if mic capture fails too
        } else if (event.error === 'not-allowed') {
            errorMessage = "Permission denied. Please allow microphone access in your browser settings and refresh.";
            // Consider proceeding if permission is denied and they can't fix it?
             shouldProceed = true; // Let's proceed if mic is denied
        } else if (event.error === 'network') {
            errorMessage = "Network error. Please check your connection.";
        } else if (event.error === 'service-not-allowed') {
             errorMessage = "Speech service is not allowed. Check browser/OS settings.";
              shouldProceed = true; // Also proceed if service is blocked
        }

         toast({
            variant: "destructive",
            title: "Recognition Failed",
            description: errorMessage,
          });

          if (shouldProceed && !proceedingAfterFail) {
            setProceedingAfterFail(true);
             toast({
                title: "It's okay... 😉",
                description: "Saving that for a special moment! Moving on...",
                className: "bg-blue-100 border-blue-400 text-blue-800",
              });
             setTimeout(() => {
                onLevelComplete();
             }, 1500);
          }

        setIsListening(false); // Stop listening animation
     };

      recognition.onend = () => {
          // Ensure listening state is turned off when recognition ends unexpectedly
         if (isListening) {
             setIsListening(false);
             console.log("Recognition ended unexpectedly.");
         }
      };

      // Cleanup function
     return () => {
       if (recognitionRef.current) {
          recognitionRef.current.stop();
          // Explicitly remove event listeners to prevent memory leaks
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
       }
       recognitionRef.current = null;
     };
   // Add failedAttempts to dependency array if its change should re-setup listeners (usually not needed here)
   }, [onLevelComplete, toast, failedAttempts, isListening, proceedingAfterFail]); // Added proceedingAfterFail


   // Function to handle the voice trigger button click
   const handleVoiceTrigger = async () => {
     if (!recognitionRef.current) {
        toast({ variant: "destructive", title: "Error", description: "Speech recognition not initialized or not supported." });
        return;
     }
      // Don't allow starting if max attempts reached and not successful yet
      if (failedAttempts >= maxAttempts && !proceedingAfterFail) {
          setProceedingAfterFail(true); // Prevent further clicks from triggering this path
          toast({
             title: "Already Moving On",
             description: "We're saving that for later! 😉",
             className: "bg-blue-100 border-blue-400 text-blue-800",
           });
          // Trigger onLevelComplete immediately if they click again after failing
           setTimeout(() => { onLevelComplete(); }, 1500);
          return;
      }

     if (isListening) {
       recognitionRef.current.stop();
       // State will be set to false by the 'onend' or 'onresult' handler
     } else {
        // Request microphone permission
        try {
            // Check permission status first (more robust)
            const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });

            if (permissionStatus.state === 'denied') {
                 toast({
                     variant: "destructive",
                     title: "Microphone Access Denied",
                     description: "Please allow microphone access in your browser settings and refresh the page.",
                     duration: 7000, // Longer duration for permission errors
                 });
                  // Proceed if mic access is denied
                  if (!proceedingAfterFail) {
                      setProceedingAfterFail(true);
                      setTimeout(() => {
                          toast({
                              title: "It's okay... 😉",
                              description: "Saving that for a special moment! Moving on...",
                              className: "bg-blue-100 border-blue-400 text-blue-800",
                          });
                          onLevelComplete();
                      }, 1500); // Add a delay
                  }
                 return;
             }

            // Try getting user media to prompt if needed
            // Only get the stream if permission is 'prompt' or 'granted'
            if (permissionStatus.state !== 'granted') {
                // This will trigger the browser prompt if permission is 'prompt'
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                // We don't need the stream, stop tracks immediately after permission grant
                stream.getTracks().forEach(track => track.stop());
            }


            // Start recognition
            recognitionRef.current.start();
            setIsListening(true);
            setTranscript(''); // Clear previous transcript
             toast({
                title: "Listening...",
                description: `Say something with "love" or "you"! 🎤`, // Updated prompt
                duration: 5000, // Show toast for 5 seconds
             });
        } catch (err: any) {
             console.error("Microphone access error:", err);
             let errorDesc = "Could not access the microphone. Please ensure it's connected and allowed.";
             let shouldProceedOnError = true; // Proceed on most mic errors now

             if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                 errorDesc = "Microphone permission denied. Please allow access in your browser settings and refresh.";
             } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                 errorDesc = "No microphone found. Please connect a microphone.";
             } else if (err.name === 'AbortError') {
                 errorDesc = "Microphone access request was dismissed.";
                 shouldProceedOnError = false; // Maybe don't proceed if they just dismissed it
             } else if (err.name === 'NotReadableError') {
                errorDesc = "Microphone is busy or cannot be read. Try closing other apps using it.";
             } else if (err.name === 'SecurityError') {
                 errorDesc = "Microphone access is blocked due to security settings.";
             }

             toast({
                variant: "destructive",
                title: "Microphone Error",
                description: errorDesc,
                duration: 7000, // Longer duration for permission errors
             });
             setIsListening(false);

              // Proceed if specific errors occur
              if (shouldProceedOnError && !proceedingAfterFail) {
                  setProceedingAfterFail(true);
                  setTimeout(() => {
                       toast({
                         title: "It's okay... 😉",
                         description: "Saving that for a special moment! Moving on...",
                         className: "bg-blue-100 border-blue-400 text-blue-800",
                       });
                      onLevelComplete();
                  }, 1500); // Add delay
              }
        }
     }
   };


  return (
     <div className="relative w-full max-w-3xl mx-auto animate-letter-float-up pt-6"> {/* Added padding-top */}
        {/* Floating Decorations - Increased z-index */}
        <Heart
            className="absolute -top-2 -left-10 w-10 h-10 text-primary/60 animate-gentle-sway opacity-80 z-20"
            style={{ animationDelay: '0.2s', animationDuration: '6s' }}
            fill="currentColor"
            strokeWidth={0}
         />
         <PartyPopper
            className="absolute -top-4 -right-8 w-12 h-12 text-pink-400/70 transform -rotate-12 animate-balloon-float-1 opacity-90 z-20"
             style={{ animationDelay: '0s', animationDuration: '8s' }}
          />
          <Heart
            className="absolute -bottom-8 -right-12 w-14 h-14 text-accent/70 animate-slow-spin-fade opacity-70 z-20"
            style={{ animationDelay: '0.5s', animationDuration: '18s' }}
            fill="currentColor"
            strokeWidth={0}
          />
           <PartyPopper
            className="absolute -bottom-6 -left-14 w-10 h-10 text-purple-400/60 transform rotate-10 animate-balloon-float-3 opacity-85 z-20"
            style={{ animationDelay: '0.3s', animationDuration: '9s' }}
          />
          {/* Smaller hearts and elements */}
           <Star // Replaced one heart with a star
            className="absolute top-1/3 -left-16 w-6 h-6 text-yellow-300/50 animate-twinkle opacity-60 z-20"
            style={{ animationDelay: '0.8s', animationDuration: '7s' }}
            fill="currentColor"
            strokeWidth={0.2} // Give stars a slight stroke
          />
           <Heart
            className="absolute top-1/2 -right-16 w-8 h-8 text-primary/50 animate-float opacity-70 z-20"
            style={{ animationDelay: '1s', animationDuration: '10s' }}
            fill="currentColor"
            strokeWidth={0}
           />
            {/* Add more decorations */}
            <Star
                className="absolute bottom-1/4 -left-8 w-5 h-5 text-secondary/40 animate-twinkle opacity-60 z-20"
                style={{ animationDelay: '1.5s', animationDuration: '9s' }}
                fill="currentColor"
                strokeWidth={0.2}
            />
            <PartyPopper
                className="absolute top-1/4 -right-10 w-7 h-7 text-blue-300/60 transform -rotate-15 animate-balloon-float-2 opacity-75 z-20"
                style={{ animationDelay: '0.6s', animationDuration: '10s' }}
            />


        {/* Scroll Area with Rounded Corners */}
        <div ref={scrollAreaRef} className="h-[80vh] w-full mx-auto rounded-xl overflow-hidden border border-primary/20 shadow-inner bg-card/95 backdrop-blur-md relative z-10">
          <ScrollArea viewportRef={viewportRef} className="h-full w-full rounded-xl"> {/* Pass viewportRef */}
            <Card className="w-full border-none bg-transparent rounded-xl min-h-full flex flex-col"> {/* Make card transparent and ensure it fills height */}
              {/* Sticky Header */}
              <CardHeader className="sticky top-0 z-20 bg-card/90 backdrop-blur-lg text-center border-b border-primary/15 pb-4 pt-6 rounded-t-xl"> {/* Rounded top */}
                  <CardTitle className="text-3xl md:text-4xl font-bold text-primary-highlight drop-shadow-lg"> {/* Use highlight color, bigger shadow */}
                  Level 1: A Special Message For You! 💌
                  </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-base md:text-lg text-card-foreground leading-relaxed space-y-5 p-6 md:p-8 font-serif"> {/* Add flex-grow */}
                  {letterContent.map((paragraph, index) => (
                      <p key={index}>{makeInteractive(paragraph)}</p>
                  ))}

                  {/* Signature */}
                  <p className="text-right font-semibold pt-4 text-primary">
                    With all my love, <br />
                    Your <span className="interactive-word">Situaa</span>
                  </p>

                 {/* Prompt Section - Conditionally Rendered */}
                 {showPrompt && (
                     <div className="mt-12 p-6 border-t border-dashed border-accent/50 text-center space-y-4 animate-fade-in">
                         <h3 className="text-2xl font-semibold text-accent">Next Step!</h3>
                         <p className="text-foreground/90">Watch this first...</p>

                         {/* YouTube Embed Placeholder */}
                          <div className="my-4 rounded-lg overflow-hidden shadow-lg border border-secondary/30 max-w-md mx-auto aspect-video">
                             {/* Use the video ID from levelConfig */}
                             <YoutubeEmbed embedId={levelConfig.levelOne.videoId} />
                          </div>


                         <p className="text-foreground/90 mt-4">
                             Hey <span className="interactive-word">my love</span>, I know you might be waiting for that special moment on snow-capped mountains to confess it, but hearing it from you, especially today on your 18th birthday, would be more special than anything. ❤️ Click below and <strong className="text-interactive-highlight">express</strong> yourself.
                         </p>


                         {/* Voice Trigger Button */}
                          <Button
                             onClick={handleVoiceTrigger}
                             variant="default"
                             size="lg"
                             className={`bg-accent hover:bg-accent/90 text-accent-foreground ${isListening ? 'animate-pulse' : ''} disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed`}
                             disabled={isListening || proceedingAfterFail} // Disable if listening or already proceeding after failure/error
                           >
                             <Mic className="mr-2 h-5 w-5" />
                              {isListening ? 'Listening...' : proceedingAfterFail ? 'Moving on...' : 'Record'}
                          </Button>

                         {/* Optional: Display transcript or status icon */}
                         <div className="mt-2 min-h-[24px]"> {/* Reserve space */}
                            {transcript && !isListening && (
                                <p className="text-sm text-muted-foreground">
                                    Heard: "{transcript}"
                                     {transcript.includes('love') || transcript.includes('you') ? <CheckCircle className="inline ml-1 h-4 w-4 text-green-500"/> : <AlertCircle className="inline ml-1 h-4 w-4 text-red-500"/>}
                                </p>
                             )}
                         </div>
                     </div>
                  )}

              </CardContent>
            </Card>
          </ScrollArea>
        </div>
      </div>
  );
};

export default BirthdayLetter;

    