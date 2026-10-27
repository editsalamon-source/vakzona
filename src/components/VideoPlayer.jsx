import React, { useEffect, useRef, useState } from "react";
import CategoryArt from "./CategoryArt";
import Logo from "./Logo";
import CSS from "../css/VideoPlayer.module.css";

// Videó a tanfolyamokhoz: YouTube (youtube-nocookie), Vimeo vagy közvetlen videófájl (mp4/webm).
// `subtitles` = WebVTT-felirat URL-je (csak videófájlnál; YouTube/Vimeo a sajátját mutatja).
// `onEnded` a videó végén fut (YouTube/Vimeo esetén a lejátszó postMessage-eseményéből).
// `poster` módban előbb csak a saját borító látszik lejátszógombbal; a külső lejátszó csak kattintásra töltődik be.
export function parseVideo(url = "") {
  const yt = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { type: "youtube", id: yt[1] };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([\da-f]+))?/);
  if (vimeo) return { type: "vimeo", id: vimeo[1], hash: vimeo[2] || new URL(url).searchParams.get("h") };
  return url ? { type: "file", src: url } : null;
}

function embedSrc(video, autoplay) {
  const ap = autoplay ? 1 : 0;
  if (video.type === "youtube") {
    const origin = encodeURIComponent(window.location.origin);
    return `https://www.youtube-nocookie.com/embed/${video.id}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1&autoplay=${ap}&origin=${origin}`;
  }
  return `https://player.vimeo.com/video/${video.id}?${video.hash ? `h=${video.hash}&` : ""}dnt=1&autoplay=${ap}`;
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor" />
    </svg>
  );
}

function Embed({ video, autoplay, title, onEnded }) {
  const frame = useRef(null);
  const ended = useRef(onEnded);
  ended.current = onEnded;

  useEffect(() => {
    const onMessage = (e) => {
      if (!frame.current || e.source !== frame.current.contentWindow) return;
      let data = e.data;
      try {
        if (typeof data === "string") data = JSON.parse(data);
      } catch (err) {
        return;
      }
      const yt = data?.event === "onStateChange" ? data.info : data?.info?.playerState;
      if (yt === 0 || data?.event === "ended" || data?.event === "finish") ended.current?.();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // feliratkozás a lejátszó eseményeire (YouTube IFrame API, Vimeo Player API)
  const subscribe = () => {
    const win = frame.current?.contentWindow;
    if (!win) return;
    if (video.type === "youtube") {
      win.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), "*");
      win.postMessage(JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"] }), "*");
    } else {
      win.postMessage(JSON.stringify({ method: "addEventListener", value: "ended" }), "*");
      win.postMessage(JSON.stringify({ method: "addEventListener", value: "finish" }), "*");
    }
  };

  return (
    <iframe
      ref={frame}
      className={CSS.media}
      src={embedSrc(video, autoplay)}
      title={title}
      onLoad={subscribe}
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
      allowFullScreen
    />
  );
}

function VideoPlayer({ url, title = "Videó", poster = false, category = null, autoplay = false, subtitles = null, onEnded }) {
  const [started, setStarted] = useState(!poster);
  const video = parseVideo(url);
  useEffect(() => setStarted(!poster), [url, poster]);

  if (!video) {
    return (
      <div className={`${CSS.frame} ${CSS.empty}`}>
        <span className={CSS.logo}><Logo size={56} /></span>
        <p>A videó hamarosan elérhető.</p>
      </div>
    );
  }

  if (!started) {
    return (
      <button type="button" className={`${CSS.frame} ${CSS.poster}`} onClick={() => setStarted(true)}>
        <span className={CSS.grid} />
        <span className={CSS.glow} />
        {category && <CategoryArt slug={category.slug} className={CSS.art} />}
        <span className={CSS.play}><PlayIcon /></span>
        <span className={CSS.posterLabel}>{title}</span>
      </button>
    );
  }

  return (
    <div className={CSS.frame}>
      {video.type === "file" ? (
        <video
          key={video.src}
          className={CSS.media}
          src={video.src}
          controls
          playsInline
          preload="metadata"
          autoPlay={autoplay || poster}
          onEnded={onEnded}
          crossOrigin={subtitles && !subtitles.startsWith("blob:") ? "anonymous" : undefined}
        >
          {subtitles && <track kind="subtitles" srcLang="hu" label="Magyar" src={subtitles} default />}
        </video>
      ) : (
        <Embed key={url} video={video} autoplay={autoplay || poster} title={title} onEnded={onEnded} />
      )}
    </div>
  );
}

export default VideoPlayer;
