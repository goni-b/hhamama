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

/* ---------- Vimeo (player.js postMessage API — בלי תלות חיצונית) ---------- */
export const vimeoAdapter: VideoProviderAdapter = {
  getEmbedUrl(videoId) {
    return `https://player.vimeo.com/video/${videoId}?api=1&dnt=1&title=0&byline=0&portrait=0`;
  },
  getThumbnailUrl(videoId) {
    return `https://vumbnail.com/${videoId}.jpg`;
  },
  bindPlayer(el, videoId, handlers) {
    let destroyed = false;
    let duration = 0;
    const playerId = `vimeo-${videoId}-${Math.floor(performance.now())}`;

    const iframe = document.createElement("iframe");
    iframe.src = `${this.getEmbedUrl(videoId)}&player_id=${playerId}`;
    iframe.id = playerId;
    iframe.allow = "autoplay; fullscreen; picture-in-picture";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";
    el.appendChild(iframe);

    const post = (method: string, value?: unknown) => {
      iframe.contentWindow?.postMessage(
        JSON.stringify(value !== undefined ? { method, value } : { method }),
        "https://player.vimeo.com",
      );
    };

    const onMessage = (e: MessageEvent) => {
      if (destroyed || e.origin !== "https://player.vimeo.com") return;
      let msg: {
        event?: string;
        method?: string;
        value?: unknown;
        data?: unknown;
        player_id?: string;
      };
      try {
        msg = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (msg.player_id && msg.player_id !== playerId) return;

      if (msg.event === "ready") {
        post("addEventListener", "playProgress");
        post("addEventListener", "finish");
        post("getDuration");
      } else if (msg.method === "getDuration") {
        duration = Number(msg.value) || 0;
        handlers.onReady?.(duration);
      } else if (msg.event === "playProgress") {
        // בפרוטוקול של Vimeo אירועים מגיעים עם data (לא value)
        const v = (msg.data ?? msg.value) as { seconds?: number; duration?: number };
        if (v?.duration) duration = Number(v.duration);
        handlers.onProgress(Number(v?.seconds) || 0, duration);
      } else if (msg.event === "finish") {
        handlers.onEnded?.();
      }
    };
    window.addEventListener("message", onMessage);

    return {
      destroy: () => {
        destroyed = true;
        window.removeEventListener("message", onMessage);
        iframe.remove();
      },
      seekTo: (sec: number) => post("seekTo", sec),
    };
  },
};

const adapters: Record<string, VideoProviderAdapter> = {
  youtube: youtubeAdapter,
  vimeo: vimeoAdapter,
  // bunny — כשיהיה חשבון (שלב D)
};

export function getVideoAdapter(provider: string): VideoProviderAdapter {
  return adapters[provider] ?? youtubeAdapter;
}

/* ---------- זיהוי קישור מלא (הדבקה בעורך הקורסים) ---------- */
export type ParsedVideo = { provider: "youtube" | "vimeo"; videoId: string };

/**
 * מקבל קישור מלא (YouTube / Vimeo בכל הצורות) או מזהה גולמי, ומחזיר ספק+מזהה.
 * מחזיר null כשאי אפשר לזהות.
 */
export function parseVideoUrl(input: string): ParsedVideo | null {
  const s = input.trim();
  if (!s) return null;

  // מזהים גולמיים: וידאו YouTube הוא 11 תווים; Vimeo — מספרי
  if (/^[\w-]{11}$/.test(s)) return { provider: "youtube", videoId: s };
  if (/^\d{6,12}$/.test(s)) return { provider: "vimeo", videoId: s };

  let url: URL;
  try {
    url = new URL(s.startsWith("http") ? s : `https://${s}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return /^[\w-]{11}$/.test(id) ? { provider: "youtube", videoId: id } : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const v = url.searchParams.get("v");
    if (v && /^[\w-]{11}$/.test(v)) return { provider: "youtube", videoId: v };
    const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/);
    return m ? { provider: "youtube", videoId: m[1] } : null;
  }
  if (host === "vimeo.com") {
    const m = url.pathname.match(/^\/(?:video\/)?(\d{6,12})/);
    return m ? { provider: "vimeo", videoId: m[1] } : null;
  }
  if (host === "player.vimeo.com") {
    const m = url.pathname.match(/^\/video\/(\d{6,12})/);
    return m ? { provider: "vimeo", videoId: m[1] } : null;
  }
  return null;
}
