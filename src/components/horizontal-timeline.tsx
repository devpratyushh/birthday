"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BookOpen, GraduationCap, Pencil, Heart, Gift, School, MessageSquare, Handshake, Clock } from 'lucide-react';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  imageUrl?: string;
}

interface HorizontalTimelineProps {
  events: TimelineEvent[];
}

const PlaceholderImage = ({ title }: { title: string }) => (
  <div className="w-full aspect-video bg-secondary rounded-md flex items-center justify-center text-muted-foreground text-center p-4">
    <p className="text-xs">Image: {title}</p>
  </div>
);

// Icon mapping
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
  if (lowerTitle.includes('now') || lowerTitle.includes('day')) return <Clock className="w-5 h-5 text-primary" />;
  return <Heart className="w-5 h-5 text-primary" />;
};


export const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({ events }) => {
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);
  const timelineContentRef = useRef<HTMLDivElement | null>(null);
  const [iconPositions, setIconPositions] = useState<number[]>([]);
  const animationFrameRef = useRef<number | null>(null); // For smooth scroll animation

  // Calculate icon positions relative to the content container
   const calculateIconPositions = useCallback(() => {
    if (timelineContentRef.current) {
      const cardElements = timelineContentRef.current.querySelectorAll<HTMLDivElement>('.timeline-card');
      const contentRect = timelineContentRef.current.getBoundingClientRect();
      const positions: number[] = [];
      let cumulativeOffset = 0; // Track offset from the start of the content div

      cardElements.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
         // Calculate position relative to the content container's left edge
        const cardCenterRelativeToContent = (cardRect.left - contentRect.left) + (cardRect.width / 2);
        positions.push(cardCenterRelativeToContent);
      });

      // Check if positions actually changed before setting state to avoid infinite loops
      if (JSON.stringify(positions) !== JSON.stringify(iconPositions)) {
         setIconPositions(positions);
      }
    }
  }, [iconPositions]); // Dependency on iconPositions to prevent loops

   useEffect(() => {
      // Calculate positions initially and on resize
     calculateIconPositions();
     window.addEventListener('resize', calculateIconPositions);

     // Use MutationObserver to recalculate if cards change dynamically (e.g., content loading)
     const observer = new MutationObserver(calculateIconPositions);
     if (timelineContentRef.current) {
         observer.observe(timelineContentRef.current, { childList: true, subtree: true });
     }

     return () => {
         window.removeEventListener('resize', calculateIconPositions);
         observer.disconnect();
         if (animationFrameRef.current) {
             cancelAnimationFrame(animationFrameRef.current);
         }
     };
   }, [calculateIconPositions, events]); // Rerun on events change as well


   // Scroll horizontally based on vertical scroll
   useEffect(() => {
    const container = timelineContainerRef.current;
    const content = timelineContentRef.current;

    if (!container || !content) return;

    let targetScrollLeft = container.scrollLeft; // Target position for smooth scroll

    const handleScroll = () => {
      const maxTimelineScroll = content.scrollWidth - container.clientWidth;
       // Use container's position relative to viewport
      const containerRect = container.getBoundingClientRect();
      // More robust calculation for scroll thresholds
      const scrollStartThreshold = window.scrollY + containerRect.top - window.innerHeight * 0.8;
      const scrollEndThreshold = window.scrollY + containerRect.bottom - window.innerHeight * 0.2;
      const scrollDistance = Math.max(1, scrollEndThreshold - scrollStartThreshold); // Avoid division by zero


      const currentScrollY = window.scrollY;

      if (currentScrollY >= scrollStartThreshold && currentScrollY <= scrollEndThreshold) {
        const scrollProgress = Math.max(0, Math.min(1, (currentScrollY - scrollStartThreshold) / scrollDistance));
        targetScrollLeft = scrollProgress * maxTimelineScroll;
      } else if (currentScrollY < scrollStartThreshold) {
        targetScrollLeft = 0;
      } else if (currentScrollY > scrollEndThreshold) {
        targetScrollLeft = maxTimelineScroll;
      }

      // Request animation frame for smooth scrolling
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(smoothScroll);
    };

     const smoothScroll = () => {
        if (!container) return;
        const currentScrollLeft = container.scrollLeft;
        // Lerp for elastic effect - adjust the factor (0.1) for more/less elasticity
        const lerpedScrollLeft = currentScrollLeft + (targetScrollLeft - currentScrollLeft) * 0.1;
        container.scrollLeft = lerpedScrollLeft;

        // Continue animation if not close enough to target
        if (Math.abs(targetScrollLeft - lerpedScrollLeft) > 1) {
            animationFrameRef.current = requestAnimationFrame(smoothScroll);
        }
     }


    window.addEventListener('scroll', handleScroll, { passive: true }); // Use passive listener for performance
    // Initial calculation
    handleScroll();

    return () => {
       window.removeEventListener('scroll', handleScroll);
       if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
       }
    };
  }, [events]); // Rerun if events change


  return (
    <div ref={timelineContainerRef} className="horizontal-timeline relative w-full cursor-grab active:cursor-grabbing">
       {/* Central Line */}
      <div className="horizontal-timeline-line" aria-hidden="true"></div>

      <div ref={timelineContentRef} className="timeline-content relative">
        {events.map((event, index) => (
           <div key={index} className="inline-block align-top timeline-card">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/90 backdrop-blur-sm border-primary/50 h-full flex flex-col">
                <CardHeader className="pb-3">
                   <CardTitle className="text-lg md:text-xl font-semibold text-foreground">{event.title}</CardTitle>
                  <CardDescription className="text-xs font-semibold text-primary uppercase tracking-wider pt-1">{event.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col p-4 pt-0">
                   {event.imageUrl ? (
                     <div className="relative w-full aspect-video mb-3 rounded-md overflow-hidden">
                         <Image
                           src={event.imageUrl}
                           alt={event.title}
                           layout="fill" // Use fill layout for responsiveness within the container
                           objectFit="cover" // Cover the area
                           className="transition-transform duration-300 group-hover:scale-105"
                           placeholder="blur"
                           blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" // Simple blur placeholder
                           onError={(e) => {
                             // Optional: Display placeholder on error
                             // console.error("Failed to load image:", event.imageUrl);
                             // e.currentTarget.style.display = 'none'; // Hide broken image
                             // Or replace with a placeholder component/style
                              e.currentTarget.parentElement?.classList.add('bg-secondary'); // Add bg color on error
                              e.currentTarget.remove(); // Remove the image tag itself
                           }}
                         />
                     </div>
                   ) : (
                      <PlaceholderImage title={event.title} />
                   )}
                  <p className="text-sm text-muted-foreground mt-auto flex-grow">{event.description}</p>
                </CardContent>
              </Card>
           </div>
        ))}
       </div>
        {/* Icons positioned on the line */}
        {iconPositions.map((pos, index) => (
             <div
               key={`icon-${index}`}
               className="horizontal-timeline-icon"
               // Apply left position dynamically. Ensure this value is updated correctly.
               style={{ left: `${pos}px` }}
               title={events[index].title} // Add tooltip for icon
             >
               {events[index].icon || getIcon(events[index].title)}
             </div>
         ))}
    </div>
  );
};
