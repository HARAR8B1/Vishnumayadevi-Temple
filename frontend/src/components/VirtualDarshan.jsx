import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./VirtualDarshan.css";

export default function VirtualDarshan() {
  const audioRef = useRef(null);
  const cardRef = useRef(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Try autoplay on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.7;
    const tryPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setAudioUnlocked(true);
      } catch {
        // Autoplay blocked — user must interact
      }
    };
    tryPlay();
    return () => {
      audio.pause();
    };
  }, []);

  // 3D tilt effect on mouse move
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateY = ((x - cx) / cx) * 18;
      const rotateX = -((y - cy) / cy) * 12;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;
      // Update sheen position
      const sheen = card.querySelector(".sheen");
      if (sheen) {
        sheen.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,215,100,0.22) 0%, transparent 60%)`;
      }
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
      const sheen = card.querySelector(".sheen");
      if (sheen) sheen.style.background = "none";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleUnlock = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.loop = true;
      audio.volume = 0.7;
      await audio.play();
      setIsPlaying(true);
      setAudioUnlocked(true);
    } catch (err) {
      console.error("Could not play audio:", err);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="vd-page">
      {/* Ambient particles */}
      <div className="particle p1" />
      <div className="particle p2" />
      <div className="particle p3" />
      <div className="particle p4" />

      <div className="vd-container">
        {/* Header */}
        <div className="vd-header">
          <div className="vd-diya">🪔</div>
          <h1 className="vd-title">Virtual Darshan</h1>
          <p className="vd-subtitle">
            Experience the divine grace of Maa Vishnumayadevi from wherever you are
          </p>
          <div className="vd-divider">
            <span>✦</span><span>ॐ</span><span>✦</span>
          </div>
        </div>

        {/* 3D Deity Image */}
        <div className="tilt-card" ref={cardRef}>
          <div className="glow" />
          <div className="sheen" />
          <div className="arch-frame">
            <div className="corner tl" />
            <div className="corner tr" />
            <div className="corner bl" />
            <div className="corner br" />
            <div className="img-clip">
              <img
                src="/virtual_darshan.jpg"
                alt="Maa Vishnumayadevi — Virtual Darshan"
                className="deity-img"
                draggable={false}
              />
            </div>
          </div>
          <div className="incense-left">
            <div className="smoke s1" /><div className="smoke s2" /><div className="smoke s3" />
          </div>
          <div className="incense-right">
            <div className="smoke s1" /><div className="smoke s2" /><div className="smoke s3" />
          </div>
        </div>

        {/* Audio player */}
        <div className="vd-audio-panel">
          <div className="vd-audio-icon">🎵</div>
          <div className="vd-audio-info">
            <span className="vd-audio-title">Gayatri Mantra</span>
            <span className="vd-audio-sub">Devotional Chant · Looping</span>
          </div>

          {/* Hidden audio element */}
          <audio
            ref={audioRef}
            loop
            src="/audio/gayatri-mantra-raga-1.mp3"
            preload="auto"
          />

          {!audioUnlocked ? (
            <button className="vd-play-btn" onClick={handleUnlock}>
              ▶ Play Mantra
            </button>
          ) : (
            <button className="vd-play-btn" onClick={togglePlay}>
              {isPlaying ? "⏸ Pause" : "▶ Resume"}
            </button>
          )}
        </div>

        {!audioUnlocked && (
          <p className="vd-audio-note">
            🔔 Click "Play Mantra" above to start the devotional chant
          </p>
        )}

        {/* Back */}
        <Link to="/" className="vd-back-btn">
          ← Return to Home
        </Link>
      </div>
    </div>
  );
}
