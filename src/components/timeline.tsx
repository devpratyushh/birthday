"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BookOpen, GraduationCap, Pencil, Heart, Gift, School, MessageSquare, Handshake, Clock } from 'lucide-react'; // Added more icons

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  imageUrl?: string; // Optional: Image URL for placeholder
}

interface TimelineProps {
  events: TimelineEvent[];
}

const PlaceholderImage = ({ title }: { title: string }) => (
  <div className="w-full aspect-video bg-secondary rounded-md flex items-center justify-center text-muted-foreground text-center p-4">
    <p>Image for "{title}"</p>
     {/* Fallback in case image src is missing or broken */}
  </div>
);

const getIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('encounter') || lowerTitle.includes('met')) return <Handshake className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('confession') || lowerTitle.includes('love') || lowerTitle.includes('pookie')) return <Heart className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('conversation') || lowerTitle.includes('talks') || lowerTitle.includes('chats') || lowerTitle.includes('whispering') || lowerTitle.includes('btw hi')) return <MessageSquare className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('exam') || lowerTitle.includes('aspirant') || lowerTitle.includes('jee') || lowerTitle.includes('pencil')) return <Pencil className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('school') || lowerTitle.includes('study') || lowerTitle.includes('itf') || lowerTitle.includes('lit')) return <BookOpen className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('romance') || lowerTitle.includes('us') || lowerTitle.includes('together') || lowerTitle.includes('journey') || lowerTitle.includes('hand')) return <Heart className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('birthday') || lowerTitle.includes('bday') ) return <Gift className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('adulting') || lowerTitle.includes('graduation') || lowerTitle.includes('future')) return <GraduationCap className="w-5 h-5 text-primary" />;
  if (lowerTitle.includes('now') || lowerTitle.includes('day')) return <Clock className="w-5 h-5 text-primary" />; // Added Clock for dates
  return <Heart className="w-5 h-5 text-primary" />; // Default icon
};


export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<boolean[]>([]);

  useEffect(() => {
    // Initialize visibility state based on initial viewport state
    const initialVisibility = events.map((_, index) => {
       const ref = refs.current[index];
       if (!ref) return false;
       const rect = ref.getBoundingClientRect();
       // Check if element is partially or fully in viewport initially
       return rect.top < window.innerHeight && rect.bottom >= 0;
    });
    setVisibleEvents(initialVisibility);


    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = refs.current.findIndex((ref) => ref === entry.target);
          if (index !== -1) {
             setVisibleEvents((prev) => {
               const newState = [...prev];
               // Set visibility based on intersection status
               newState[index] = entry.isIntersecting;
               return newState;
             });
             // Optionally unobserve if you only want the animation once
             // if (entry.isIntersecting) {
             //   observer.unobserve(entry.target);
             // }
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the item is visible
    );

    refs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      refs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  // Rerun effect if events change, though unlikely in this app's context
  }, [events]);


  return (
    <div className="relative w-full max-w-3xl mx-auto py-12 px-4">
      {/* Central line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/30 transform -translate-x-1/2 rounded-full" aria-hidden="true"></div>

      {events.map((event, index) => (
        <div
          key={index}
          ref={(el) => (refs.current[index] = el)}
          className={cn(
            "mb-12 flex items-center w-full transition-all duration-1000 ease-out",
            index % 2 === 0 ? 'justify-start' : 'justify-end',
            visibleEvents[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}
        >
          {/* Timeline Item Card */}
          <div className={cn("w-1/2 relative", index % 2 === 0 ? 'pr-8' : 'pl-8')}>
            {/* Icon Circle positioned over the line */}
            <div className={cn(
                 "absolute top-1/2 -translate-y-1/2 bg-background p-2 rounded-full border-2 border-primary shadow-md z-10",
                 index % 2 === 0 ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2' // Adjust position based on side
             )}>
                {event.icon || getIcon(event.title)}
             </div>

             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background/90 backdrop-blur-sm border-primary/50 relative">
               {/* Pointer Arrow (Optional visual flair) */}
               {/*<div className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-background border-primary/50 transform rotate-45",
                  index % 2 === 0 ? "right-0 -translate-x-[5.5px] border-t-0 border-l-0 border-b border-r" : "left-0 translate-x-[5.5px] border-b-0 border-r-0 border-t border-l",
               )} />*/}

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                   <CardDescription className="text-xs font-semibold text-primary uppercase tracking-wider">{event.date}</CardDescription>
                   {/* Icon is now outside the card */}
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                 {event.imageUrl ? (
                   <Image
                     src={event.imageUrl}
                     alt={event.title}
                     width={400}
                     height={225}
                     className="rounded-md mb-3 object-cover w-full aspect-video"
                     placeholder="blur" // Optional: add blur placeholder
                     blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/epv2AAAAABJRU5ErkJggg==" // Tiny transparent pixel
                     onError={(e) => { e.currentTarget.style.display = 'none'; /* Hide broken image */ }} // Basic error handling
                   />
                 ) : (
                    <PlaceholderImage title={event.title} />
                 )}
                <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
};
