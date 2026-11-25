export {};

declare global {
  /**
   * What the player can be asked once it exists. Only the calls this app makes are declared.
   *
   * The list grew when the lesson player stopped using YouTube's own controls. Hiding them
   * is the point - they carry the logo, the title bar and the share button, every one of
   * which is a way out to youtube.com - but it means the app has to drive playback itself,
   * so everything a control bar needs is asked for here.
   */
  type YoutubePlayerHandle = {
    destroy: () => void;
    /** How long the video is, in seconds. Zero until the player has the video's metadata. */
    getDuration?: () => number;
    getCurrentTime?: () => number;
    getPlayerState?: () => number;
    playVideo?: () => void;
    pauseVideo?: () => void;
    /** `allowSeekAhead` false while a drag is in progress, true when it is let go. */
    seekTo?: (seconds: number, allowSeekAhead: boolean) => void;
    mute?: () => void;
    unMute?: () => void;
    isMuted?: () => boolean;
    setPlaybackRate?: (rate: number) => void;
    /** 0-100. Ignored on iOS, where the level belongs to the hardware buttons. */
    setVolume?: (volume: number) => void;
    getVolume?: () => number;
  };

  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId?: string;
          width?: string | number;
          height?: string | number;
          /**
           * Which YouTube origin serves the player. Set to the nocookie host so that a
           * student who only ever watches a lesson is not given YouTube's tracking cookies.
           */
          host?: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onStateChange?: (event: {
              data: number;
              target: YoutubePlayerHandle;
            }) => void;
            onReady?: (event: { target: YoutubePlayerHandle }) => void;
            onError?: (event: { data: number }) => void;
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
