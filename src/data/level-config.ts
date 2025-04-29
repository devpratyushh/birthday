
// src/data/level-config.ts

export interface LevelConfig {
  levelOne: {
    videoId: string; // YouTube video ID for the prompt video
  };
  levelTwo: {
    videoId: string; // YouTube video ID for the proposal
  };
  levelThree: {
    imageUrl: string; // URL for the final image
    meetLink: string; // Google Meet link
  };
}

// Helper function to extract video ID from URL
const extractVideoId = (url: string): string => {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            // Handle short URLs like https://youtu.be/VIDEO_ID
            return urlObj.pathname.substring(1);
        } else if (urlObj.hostname.includes('youtube.com')) {
            // Handle standard URLs like https://www.youtube.com/watch?v=VIDEO_ID
            const videoId = urlObj.searchParams.get('v');
            return videoId || ''; // Return empty string if 'v' param is not found
        }
        return ''; // Return empty string for non-YouTube URLs
    } catch (e) {
        console.error("Invalid URL provided for video ID extraction:", url, e);
        return ''; // Return empty string on error
    }
};


// Replace placeholder values with actual IDs and URLs
export const levelConfig: LevelConfig = {
  levelOne: {
    videoId: extractVideoId('https://www.youtube.com/watch?v=K8bbr8FzlJI'), // Extracted ID for Level 1 prompt video
  },
  levelTwo: {
    videoId: extractVideoId('https://www.youtube.com/watch?v=x5R0RWU1O1M'), // Extracted ID for Level 2 proposal video
  },
  levelThree: {
    imageUrl: 'https://i.imgur.com/t8I7H8D.jpeg', // Updated image URL for Level 3
    meetLink: 'https://meet.google.com/skt-pyix-qmv', // Updated Google Meet link (added https://)
  },
};
