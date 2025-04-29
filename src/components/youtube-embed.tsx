
'use client';
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any; // Define YT namespace
    YT_API_LOADED?: boolean; // Flag to track API loading state
  }
}

interface YoutubeEmbedProps {
  embedId: string;
  onEnd?: () => void; // Optional callback for when video ends
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ embedId, onEnd }) => {
  const playerRef = useRef<any>(null); // Ref to store the player instance
  const playerDivId = `youtube-player-${embedId}-${Math.random().toString(36).substring(7)}`; // Unique ID for the div

  useEffect(() => {
    // Function to create player
    const createPlayer = () => {
       // Ensure the target div exists before creating the player
       const playerDiv = document.getElementById(playerDivId);
       if (!playerDiv) {
            console.error(`Player div '${playerDivId}' not found.`);
            return; // Exit if target div doesn't exist
        }
        // Check if player is already created for this unique div
        if (playerDiv.dataset.ytPlayerLoaded === 'true') {
            console.log(`Player for div ${playerDivId} already loaded.`);
            return;
        }

        console.log(`Creating player for ${embedId} in div ${playerDivId}`);
        try {
            playerRef.current = new window.YT.Player(playerDivId, { // Use the unique ID
                height: '100%',
                width: '100%',
                videoId: embedId,
                playerVars: {
                  // 'autoplay': 1, // Autoplay can be problematic, enable cautiously
                  'controls': 1,
                  'rel': 0, // Don't show related videos at the end
                  'showinfo': 0, // Hide video title and uploader
                  'modestbranding': 1, // Hide YouTube logo
                  'playsinline': 1 // Important for iOS playback
                },
                events: {
                  'onReady': onPlayerReady,
                  'onStateChange': onPlayerStateChange,
                  'onError': onPlayerError // Add error handling
                }
            });
             playerDiv.dataset.ytPlayerLoaded = 'true'; // Mark this specific div as having a player
        } catch (e) {
             console.error(`Error creating YouTube player for ${embedId}:`, e);
        }
    };

    // Callback when player is ready
    const onPlayerReady = (event: any) => {
        console.log(`Player ${embedId} (div: ${playerDivId}) ready.`);
        // event.target.playVideo(); // Uncomment if you want autoplay on ready
    };

    // Callback for player state changes
    const onPlayerStateChange = (event: any) => {
        if (event.data === window.YT?.PlayerState?.ENDED) { // Check YT and PlayerState existence
            console.log(`Video ${embedId} (div: ${playerDivId}) ended.`);
            onEnd?.(); // Call the onEnd callback if provided
        }
    };

     // Callback for player errors
     const onPlayerError = (event: any) => {
         console.error(`YouTube Player Error for ${embedId} (div: ${playerDivId}): Code ${event.data}`);
         // You could display a message to the user here
     };


    // --- API Loading and Player Initialization Logic ---
    if (typeof window !== 'undefined') {
        // If API is ready, create player
        if (window.YT && window.YT.Player) {
            createPlayer();
        }
        // If API is loading (script exists, callback defined, but YT object not ready)
        else if (window.onYouTubeIframeAPIReady && !window.YT_API_LOADED) {
             console.log("YouTube API is loading, waiting...");
             // The existing callback will eventually trigger player creation.
             // We might need to ensure our createPlayer is called by it.
             // A more robust approach might involve a queue or event listener.
              // Let's augment the existing callback (if safe) or wait.
             const originalCallback = window.onYouTubeIframeAPIReady;
             window.onYouTubeIframeAPIReady = () => {
                originalCallback?.(); // Call original if it existed
                if (!playerRef.current) { // Create player if not already created by another instance
                     createPlayer();
                }
             };

        }
        // If API script needs to be loaded
        else if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            console.log("Loading YouTube API script...");
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);

            // Define the global callback *before* the script loads
            window.onYouTubeIframeAPIReady = () => {
                console.log("YouTube API Ready (Initial Load)");
                window.YT_API_LOADED = true; // Mark API as loaded
                createPlayer(); // Create this instance's player
            };
        }
    }

    // Cleanup function
    return () => {
        // Attempt to destroy the player instance if it exists
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
           try {
                playerRef.current.destroy();
                console.log(`Player ${embedId} (div: ${playerDivId}) destroyed.`);
           } catch (e) {
                console.error("Error destroying YouTube player:", e);
           }
            playerRef.current = null;
         }
         // Clean up the loaded marker on the specific div
         const playerDiv = document.getElementById(playerDivId);
         if (playerDiv) {
             delete playerDiv.dataset.ytPlayerLoaded;
         }
         // It's generally unsafe to remove the global callback or script tag
         // as other components might rely on them.
    };
  // Add playerDivId to dependencies to re-run if the ID changes (though it shouldn't normally)
  }, [embedId, onEnd, playerDivId]);


  return (
    <div className="relative w-full h-full overflow-hidden bg-black rounded-lg"> {/* Added bg-black for loading */}
        {/* The div where the player will be injected - Use the unique ID */}
      <div id={playerDivId} className="absolute top-0 left-0 w-full h-full">
         {/* Optional: Add a loading indicator here */}
         <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Loading Video...
         </div>
      </div>
    </div>
  );
};

export default YoutubeEmbed;
