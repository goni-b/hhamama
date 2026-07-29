//#region node_modules/.nitro/vite/services/ssr/assets/provider-ndGpaDO1.js
var ytApiPromise = null;
function loadYtApi() {
	if (typeof window === "undefined") return Promise.resolve();
	const w = window;
	if (w.YT && w.YT.Player) return Promise.resolve();
	if (ytApiPromise) return ytApiPromise;
	ytApiPromise = new Promise((resolve) => {
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
var youtubeAdapter = {
	getEmbedUrl(videoId) {
		return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`;
	},
	getThumbnailUrl(videoId) {
		return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
	},
	bindPlayer(el, videoId, handlers) {
		let player = null;
		let poll = null;
		let destroyed = false;
		const mount = document.createElement("div");
		el.appendChild(mount);
		loadYtApi().then(() => {
			if (destroyed) return;
			player = new window.YT.Player(mount, {
				videoId,
				width: "100%",
				height: "100%",
				playerVars: {
					rel: 0,
					modestbranding: 1,
					playsinline: 1
				},
				events: {
					onReady: () => {
						const dur = player.getDuration?.() ?? 0;
						handlers.onReady?.(dur);
						poll = setInterval(() => {
							if (!player?.getCurrentTime) return;
							const pos = player.getCurrentTime();
							const dur2 = player.getDuration?.() ?? dur;
							handlers.onProgress(pos, dur2);
						}, 1e3);
					},
					onStateChange: (e) => {
						if (e.data === 0) handlers.onEnded?.();
					}
				}
			});
		});
		return {
			destroy: () => {
				destroyed = true;
				if (poll) clearInterval(poll);
				try {
					player?.destroy?.();
				} catch {}
			},
			seekTo: (sec) => {
				try {
					player?.seekTo?.(sec, true);
				} catch {}
			}
		};
	}
};
var adapters = {
	youtube: youtubeAdapter,
	vimeo: {
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
			const post = (method, value) => {
				iframe.contentWindow?.postMessage(JSON.stringify(value !== void 0 ? {
					method,
					value
				} : { method }), "https://player.vimeo.com");
			};
			const onMessage = (e) => {
				if (destroyed || e.origin !== "https://player.vimeo.com") return;
				let msg;
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
					const v = msg.data ?? msg.value;
					if (v?.duration) duration = Number(v.duration);
					handlers.onProgress(Number(v?.seconds) || 0, duration);
				} else if (msg.event === "finish") handlers.onEnded?.();
			};
			window.addEventListener("message", onMessage);
			return {
				destroy: () => {
					destroyed = true;
					window.removeEventListener("message", onMessage);
					iframe.remove();
				},
				seekTo: (sec) => post("seekTo", sec)
			};
		}
	}
};
function getVideoAdapter(provider) {
	return adapters[provider] ?? youtubeAdapter;
}
/**
* מקבל קישור מלא (YouTube / Vimeo בכל הצורות) או מזהה גולמי, ומחזיר ספק+מזהה.
* מחזיר null כשאי אפשר לזהות.
*/
function parseVideoUrl(input) {
	const s = input.trim();
	if (!s) return null;
	if (/^[\w-]{11}$/.test(s)) return {
		provider: "youtube",
		videoId: s
	};
	if (/^\d{6,12}$/.test(s)) return {
		provider: "vimeo",
		videoId: s
	};
	let url;
	try {
		url = new URL(s.startsWith("http") ? s : `https://${s}`);
	} catch {
		return null;
	}
	const host = url.hostname.replace(/^www\./, "");
	if (host === "youtu.be") {
		const id = url.pathname.slice(1).split("/")[0];
		return /^[\w-]{11}$/.test(id) ? {
			provider: "youtube",
			videoId: id
		} : null;
	}
	if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
		const v = url.searchParams.get("v");
		if (v && /^[\w-]{11}$/.test(v)) return {
			provider: "youtube",
			videoId: v
		};
		const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/);
		return m ? {
			provider: "youtube",
			videoId: m[1]
		} : null;
	}
	if (host === "vimeo.com") {
		const m = url.pathname.match(/^\/(?:video\/)?(\d{6,12})/);
		return m ? {
			provider: "vimeo",
			videoId: m[1]
		} : null;
	}
	if (host === "player.vimeo.com") {
		const m = url.pathname.match(/^\/video\/(\d{6,12})/);
		return m ? {
			provider: "vimeo",
			videoId: m[1]
		} : null;
	}
	return null;
}
//#endregion
export { parseVideoUrl as n, getVideoAdapter as t };
