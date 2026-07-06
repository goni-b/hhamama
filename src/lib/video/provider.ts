// src/lib/video/provider.ts — ממשק ספק הווידאו (פרק 5.7)
// בפאזות ה-mock: אדפטר YouTube (IFrame API) לצפייה והתקדמות אמיתית. Bunny — פאזה 9.

export interface PlayerHandlers {
  onProgress: (positionSec: number, durationSec: number) => void;
  onEnded?: () => void;
  onReady?: (durationSec: number) => void;
}

export interface VideoProviderAdapter {
  getEmbedUrl(videoId: string): string;
  getThumbnailUrl(videoId: string): string;
  /** מחבר נגן לאלמנט; מחזיר פונקציית ניקוי + שליטת seek. */
  bindPlayer(
    el: HTMLElement,
    videoId: string,
    handlers: PlayerHandlers,
  ): {
    destroy: () => void;
    seekTo: (sec: number) => void;
  };
}

/* ---------- YouTube IFrame API ---------- */
let ytApiPromise: Promise<void> | null = null;

function loadYtApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const w = window as unknown as { YT?: { Player: unknown }; onYouTubeIframeAPIReady?: () => void };
  if (w.YT && w.YT.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise<void>((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const youtubeAdapter: VideoProviderAdapter = {
  getEmbedUrl(videoId) {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`;
  },
  getThumbnailUrl(videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  },
  bindPlayer(el, videoId, handlers) {
    let player: any = null;
    let poll: ReturnType<typeof setInterval> | null = null;
    let destroyed = false;

    // צריך div ריק שה-API יחליף ב-iframe
    const mount = document.createElement("div");
    el.appendChild(mount);

    loadYtApi().then(() => {
      if (destroyed) return;
      const YT = (window as any).YT;
      player = new YT.Player(mount, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: () => {
            const dur = player.getDuration?.() ?? 0;
            handlers.onReady?.(dur);
            poll = setInterval(() => {
              if (!player?.getCurrentTime) return;
              const pos = player.getCurrentTime();
              const dur2 = player.getDuration?.() ?? dur;
              handlers.onProgress(pos, dur2);
            }, 1000);
          },
          onStateChange: (e: any) => {
            // 0 = ended
            if (e.data === 0) handlers.onEnded?.();
          },
        },
      });
    });

    return {
      destroy: () => {
        destroyed = true;
        if (poll) clearInterval(poll);
        try {
          player?.destroy?.();
        } catch {
          /* ignore */
        }
      },
      seekTo: (sec: number) => {
        try {
          player?.seekTo?.(sec, true);
        } catch {
          /* ignore */
        }
      },
    };
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

const adapters: Record<string, VideoProviderAdapter> = {
  youtube: youtubeAdapter,
  // vimeo / bunny — פאזה 9
};

export function getVideoAdapter(provider: string): VideoProviderAdapter {
  return adapters[provider] ?? youtubeAdapter;
}
