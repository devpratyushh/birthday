"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BookOpen, GraduationCap, Pencil, Heart, Gift, School, MessageSquare, Handshake, Clock } from 'lucide-react'; // Reuse icons

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  imageUrl?: string; // Optional: Image URL for placeholder
}

interface HorizontalTimelineProps {
  events: TimelineEvent[];
}

const PlaceholderImage = ({ title }: { title: string }) => (
  <div className="w-full aspect-video bg-secondary rounded-md flex items-center justify-center text-muted-foreground text-center p-4">
    <p>Image for "{title}"</p>
  </div>
);

// Icon mapping (same as vertical timeline)
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

  // Calculate icon positions relative to the content container
   useEffect(() => {
    if (timelineContentRef.current) {
      const cardElements = timelineContentRef.current.querySelectorAll('.timeline-card');
      const positions: number[] = [];
      let cumulativeWidth = 0; // Start before the first card's center

      cardElements.forEach((card, index) => {
        const cardWidth = card.getBoundingClientRect().width;
        const gap = index > 0 ? 16 : 0; // Corresponds to gap-4 (1rem = 16px)
        // Position icon in the middle of the card horizontally
        const iconPos = cumulativeWidth + gap + cardWidth / 2;
        positions.push(iconPos);
        cumulativeWidth += cardWidth + gap;
      });
      setIconPositions(positions);
    }
  }, [events]); // Recalculate if events change


  // Scroll horizontally based on vertical scroll
   useEffect(() => {
    const container = timelineContainerRef.current;
    const content = timelineContentRef.current;

    if (!container || !content) return;

    // Determine the maximum scroll distance for the timeline
    const maxTimelineScroll = content.scrollWidth - container.clientWidth;
    // Determine the vertical distance over which the horizontal scroll should occur
    // Adjust these values based on where the timeline is on the page and desired sensitivity
    const scrollStartThreshold = container.offsetTop - window.innerHeight * 0.8; // Start scrolling when timeline is 80% into view
    const scrollEndThreshold = container.offsetTop + container.offsetHeight - window.innerHeight * 0.2; // End scrolling when timeline is 20% from leaving view
    const scrollDistance = scrollEndThreshold - scrollStartThreshold;


    const handleScroll = () => {
      const scrollY = window.scrollY;

       if (scrollY >= scrollStartThreshold && scrollY <= scrollEndThreshold) {
         // Calculate the progress of vertical scroll within the designated area (0 to 1)
         const scrollProgress = (scrollY - scrollStartThreshold) / scrollDistance;

         // Calculate the target horizontal scroll position
         const targetScrollLeft = scrollProgress * maxTimelineScroll;

          // Apply elastic scroll (simple lerp for now, can be enhanced)
         const currentScrollLeft = container.scrollLeft;
         const lerpedScrollLeft = currentScrollLeft + (targetScrollLeft - currentScrollLeft) * 0.1; // Adjust lerp factor for elasticity

         container.scrollLeft = lerpedScrollLeft;

         // **Alternative: Direct scroll without lerp**
         // container.scrollLeft = targetScrollLeft;

       } else if (scrollY < scrollStartThreshold) {
         // Scroll to beginning if above threshold
         container.scrollLeft = 0;
       } else if (scrollY > scrollEndThreshold) {
         // Scroll to end if below threshold
         container.scrollLeft = maxTimelineScroll;
       }

    };

    window.addEventListener('scroll', handleScroll);
    // Initial call to set position based on load state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
    // Dependencies: recalculate if container/content dimensions change significantly (usually handled by layout updates)
  }, [events]); // Rerun if events change, might affect scrollWidth


  return (
    <div ref={timelineContainerRef} className="horizontal-timeline relative w-full">
      {/* The visible "focus ring" - purely decorative */}
      {/* <div className="timeline-focus-ring" aria-hidden="true"></div> */}
       {/* Central Line */}
      <div className="horizontal-timeline-line" aria-hidden="true"></div>

      <div ref={timelineContentRef} className="timeline-content relative">
          {/* Map through events to create cards */}
        {events.map((event, index) => (
           <div key={index} className="inline-block align-top timeline-card"> {/* Use inline-block for proper spacing with nowrap */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/90 backdrop-blur-sm border-primary/50 h-full flex flex-col">
                <CardHeader className="pb-3">
                   <CardTitle className="text-xl font-semibold text-foreground">{event.title}</CardTitle>
                  <CardDescription className="text-xs font-semibold text-primary uppercase tracking-wider pt-1">{event.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                   {event.imageUrl ? (
                     <Image
                       src={event.imageUrl}
                       alt={event.title}
                       width={300} // Match card width potentially
                       height={180}
                       className="rounded-md mb-3 object-cover w-full aspect-video"
                       placeholder="blur"
                       blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/epv2AAAAABJRU5ErkJggg=="
                       onError={(e) => { e.currentTarget.style.display = 'none'; }}
                     />
                   ) : (
                      <PlaceholderImage title={event.title} />
                   )}
                  <p className="text-sm text-muted-foreground mt-2 flex-grow">{event.description}</p>
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
               style={{ left: `${pos}px` }}
             >
               {events[index].icon || getIcon(events[index].title)}
             </div>
         ))}
    </div>
  );
};
