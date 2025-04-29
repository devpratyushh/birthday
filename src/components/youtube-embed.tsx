
'use client';
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any; // Define YT namespace
  }
}

interface YoutubeEmbedProps {
  embedId: string;
  onEnd?: () => void; // Optional callback for when video ends
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ embedId, onEnd }) => {
  const playerRef = useRef<any>(null); // Ref to store the player instance

  useEffect(() => {
    // Function to create player
    const createPlayer = () => {
      playerRef.current = new window.YT.Player(`youtube-player-${embedId}`, {
        height: '100%',
        width: '100%',
        videoId: embedId,
        playerVars: {
          // 'autoplay': 1, // Consider removing autoplay or making it conditional
          'controls': 1,
          'rel': 0, // Don't show related videos at the end
          'showinfo': 0, // Hide video title and uploader
          'modestbranding': 1, // Hide YouTube logo
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    };

    // Load the IFrame Player API code asynchronously.
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      // This function will be called when the API is ready
      window.onYouTubeIframeAPIReady = () => {
        console.log("YouTube API Ready");
        createPlayer();
      };
    } else {
      // If API is already loaded, create player directly
      // Check if player already exists for this embedId to avoid duplicates
       if (!document.getElementById(`youtube-player-${embedId}`)?.dataset.loaded) {
          createPlayer();
          const playerDiv = document.getElementById(`youtube-player-${embedId}`);
          if(playerDiv) playerDiv.dataset.loaded = 'true';
       }
    }

    // Cleanup function
    return () => {
        // Attempt to destroy the player instance if it exists
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
           try {
                playerRef.current.destroy();
                console.log(`Player ${embedId} destroyed.`);
           } catch (e) {
                console.error("Error destroying YouTube player:", e);
           }
            playerRef.current = null;
         }
         // Clean up the global function if this is the last player unmounting
         // This logic might need refinement if multiple players are used simultaneously
         // const players = document.querySelectorAll('[id^="youtube-player-"]');
         // if (players.length === 0) {
         //    window.onYouTubeIframeAPIReady = undefined;
         // }
    };
  }, [embedId]); // Re-run effect if embedId changes


  function onPlayerReady(event: any) {
    console.log(`Player ${embedId} ready.`);
    // You could autoplay here if desired: event.target.playVideo();
  }

  function onPlayerStateChange(event: any) {
    // YT.PlayerState.ENDED is 0
    if (event.data === window.YT.PlayerState.ENDED) {
      console.log(`Video ${embedId} ended.`);
      onEnd?.(); // Call the onEnd callback if provided
    }
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
        {/* The div where the player will be injected */}
      <div id={`youtube-player-${embedId}`} className="absolute top-0 left-0 w-full h-full"></div>
    </div>
  );
};

export default YoutubeEmbed;
