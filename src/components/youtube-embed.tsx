
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
       // Ensure the target div exists before creating the player
       const playerDiv = document.getElementById(`youtube-player-${embedId}`);
       if (!playerDiv) {
            console.error(`Player div 'youtube-player-${embedId}' not found.`);
            return; // Exit if target div doesn't exist
        }
        // Check if player is already loaded for this ID
        if (playerDiv.dataset.loaded === 'true') {
            console.log(`Player ${embedId} already loaded.`);
            return;
        }

        console.log(`Creating player for ${embedId}`);
      playerRef.current = new window.YT.Player(playerDiv, { // Pass the div element directly
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
      playerDiv.dataset.loaded = 'true'; // Mark as loaded
    };

    // Load the IFrame Player API code asynchronously.
    if (!window.YT || !window.YT.Player) { // Check if YT.Player is also available
      // Avoid adding multiple script tags if API is loading but not ready
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
          console.log("Loading YouTube API...");
          const tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          document.body.appendChild(tag);
      } else {
           console.log("YouTube API script already exists, waiting for it to load...");
      }


      // Define the global callback function if it doesn't exist
       if (!window.onYouTubeIframeAPIReady) {
           window.onYouTubeIframeAPIReady = () => {
             console.log("YouTube API Ready");
             // Attempt to create player again now that API should be ready
             createPlayer();
           };
       } else {
           // If the callback exists but API wasn't ready before, it might mean
           // another component initialized it. We can try creating player directly.
           // Or rely on the existing callback to eventually call createPlayer.
           console.log("onYouTubeIframeAPIReady exists, attempting player creation...");
           if (window.YT && window.YT.Player) { // Double check API readiness
               createPlayer();
           }
       }


    } else {
      // If API is already loaded, create player directly
      console.log("YouTube API already loaded, creating player...");
      createPlayer();
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
         const playerDiv = document.getElementById(`youtube-player-${embedId}`);
          if(playerDiv) delete playerDiv.dataset.loaded; // Clean up loaded status

         // Consider more robust cleanup for the global callback if multiple players are used
    };
  }, [embedId, onEnd]); // Add onEnd to dependency array


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

