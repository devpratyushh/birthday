
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

// Replace placeholder values with actual IDs and URLs
export const levelConfig: LevelConfig = {
  levelOne: {
    videoId: 'YOUTUBE_PROMPT_VIDEO_ID_HERE', // TODO: Replace with actual YouTube video ID
  },
  levelTwo: {
    videoId: 'YOUTUBE_PROPOSAL_VIDEO_ID_HERE', // TODO: Replace with actual YouTube video ID
  },
  levelThree: {
    imageUrl: '/placeholder-final-image.jpg', // TODO: Replace with actual image URL (can be relative or absolute)
    meetLink: 'https://meet.google.com/your-meet-link', // TODO: Replace with actual Google Meet link
  },
};
