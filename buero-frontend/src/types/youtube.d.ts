export {};

declare global {
  /** What the player can be asked once it exists. Only the calls this app makes are declared. */
  type YoutubePlayerHandle = {
    destroy: () => void;
    /** How long the video is, in seconds. Zero until the player has the video's metadata. */
    getDuration?: () => number;
  };

  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId?: string;
          width?: string | number;
          height?: string | number;
          playerVars?: Record<string, string | number>;
          events?: {
            onStateChange?: (event: {
              data: number;
              target: YoutubePlayerHandle;
            }) => void;
            onReady?: (event: { target: YoutubePlayerHandle }) => void;
          };
        },
      ) => YoutubePlayerHandle;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}
