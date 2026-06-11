import { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadGameState, saveGameState } from '@/data/gameData';
import GameCanvas from '@/components/GameCanvas';

const Intro = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [needsManualStart, setNeedsManualStart] = useState(false);
  const hasNavigated = useRef(false);

  const handleFinish = useCallback(() => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    const state = loadGameState();
    saveGameState({ ...state, hasSeenIntro: true });
    navigate('/identity', { replace: true });
  }, [navigate]);

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    handleFinish();
  };

  const handleVideoEnd = () => {
    handleFinish();
  };

  const handleVideoError = () => {
    setVideoError(true);
    // Auto-skip after 2 seconds if video fails
    setTimeout(() => {
      handleFinish();
    }, 2000);
  };

  const startVideoWithSound = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      videoRef.current.muted = false;
      videoRef.current.volume = 1;
      await videoRef.current.play();
      setNeedsManualStart(false);
    } catch {
      setNeedsManualStart(true);
    }
  }, []);

  useEffect(() => {
    if (videoError) return;
    void startVideoWithSound();
  }, [videoError, startVideoWithSound]);

  const handleContainerClick = () => {
    if (needsManualStart) {
      void startVideoWithSound();
      return;
    }
    handleSkip();
  };

  return (
    <GameCanvas>
    <div
      className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center cursor-pointer"
      onClick={handleContainerClick}
    >
      {/* Video player - full screen */}
      {!videoError && (
        <video
          ref={videoRef}
          src="/assets/intro-animation.mp4"
          preload="auto"
          playsInline
          onEnded={handleVideoEnd}
          onError={handleVideoError}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Fallback if video fails */}
      {videoError && (
        <div className="text-center animate-pulse">
          <div className="text-4xl font-bold mb-4 tracking-widest" style={{ color: '#E8C37D' }}>
            聊斋奇谭
          </div>
          <div className="text-sm tracking-wider" style={{ color: '#FFF5EB' }}>
            正在进入游戏...
          </div>
        </div>
      )}

      {needsManualStart && !videoError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35">
          <button
            onClick={(e) => {
              e.stopPropagation();
              void startVideoWithSound();
            }}
            className="px-8 py-4 rounded-xl text-lg font-bold"
            style={{
              background: 'rgba(24, 24, 24, 0.72)',
              color: '#FFF5EB',
              border: '2px solid #E8C37D',
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            }}
          >
            点击播放开场音频
          </button>
        </div>
      )}

      {/* Skip button - top right */}
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={(e) => { e.stopPropagation(); handleSkip(); }}
          className="bg-transparent border-none cursor-pointer p-0 hover:scale-105 active:scale-95 transition-transform"
        >
          <img
            src="/assets/skip-button.png"
            alt="跳过"
            className="h-56 md:h-64 w-auto drop-shadow-lg"
            onError={(e) => {
              // Fallback if skip button image doesn't load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = '<span style="color:#E8C37D;font-size:16px;padding:8px 16px;border:1px solid #E8C37D;border-radius:8px;">跳过 →</span>';
            }}
          />
        </button>
      </div>

      {/* Tap anywhere hint at bottom */}
      <div className="absolute bottom-6 inset-x-0 text-center z-10 pointer-events-none">
        <span
          className="text-xs tracking-wider opacity-60"
          style={{ color: '#E8C37D' }}
        >
          点击任意位置跳过
        </span>
      </div>
    </div>
    </GameCanvas>
  );
};

export default Intro;
