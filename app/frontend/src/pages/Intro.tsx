import { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadGameState, saveGameState } from '@/data/gameData';
import GameCanvas from '@/components/GameCanvas';
import { getPreloadedVideoSrc } from '@/utils/imagePreloader';
import { assetPath } from '@/utils/assetPath';

const INTRO_VIDEO_SRC = assetPath('/assets/intro-animation.mp4');

const Intro = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [needsManualStart, setNeedsManualStart] = useState(false);
  const hasNavigated = useRef(false);
  const videoSrc = getPreloadedVideoSrc(INTRO_VIDEO_SRC);
  const canSkip = videoStarted;

  const handleFinish = useCallback(() => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    const state = loadGameState();
    saveGameState({ ...state, hasSeenIntro: true });
    navigate('/identity', { replace: true });
  }, [navigate]);

  const handleSkip = () => {
    if (!canSkip) return;
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
    if (!videoRef.current || !videoReady) return;
    try {
      videoRef.current.muted = false;
      videoRef.current.volume = 1;
      await videoRef.current.play();
      setNeedsManualStart(false);
    } catch {
      setNeedsManualStart(true);
    }
  }, [videoReady]);

  useEffect(() => {
    if (videoError || !videoReady) return;
    void startVideoWithSound();
  }, [videoError, videoReady, startVideoWithSound]);

  const updateBufferedProgress = () => {
    const video = videoRef.current;
    if (!video) return;

    if (Number.isFinite(video.duration) && video.duration > 0 && video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      setVideoProgress(Math.min(99, Math.max(0, Math.round((bufferedEnd / video.duration) * 100))));
      return;
    }

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setVideoProgress((current) => Math.max(current, 30));
    }
  };

  const handleVideoReady = () => {
    setVideoReady(true);
    setVideoProgress(100);
  };

  const handleContainerClick = () => {
    if (needsManualStart && videoReady) {
      void startVideoWithSound();
      return;
    }
    if (canSkip) {
      handleSkip();
    }
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
          src={videoSrc}
          preload="auto"
          playsInline
          onLoadedData={handleVideoReady}
          onCanPlay={handleVideoReady}
          onProgress={updateBufferedProgress}
          onPlaying={() => {
            setVideoStarted(true);
            setNeedsManualStart(false);
          }}
          onWaiting={updateBufferedProgress}
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

      {!videoError && !videoReady && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black">
          <div className="w-64">
            <div className="mb-3 text-center text-sm tracking-wider" style={{ color: '#E8C37D' }}>
              开场动画加载中...
            </div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(232, 195, 125, 0.25)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.max(8, videoProgress)}%`,
                  background: '#E8C37D',
                }}
              />
            </div>
            <div className="mt-2 text-center text-xs" style={{ color: 'rgba(255, 245, 235, 0.72)' }}>
              {videoProgress}%
            </div>
          </div>
        </div>
      )}

      {needsManualStart && videoReady && !videoError && !videoStarted && (
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
          disabled={!canSkip}
          className="bg-transparent border-none p-0 transition-transform disabled:opacity-0 disabled:pointer-events-none hover:scale-105 active:scale-95"
        >
          <img
            src={assetPath('/assets/skip-button.png')}
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
          {canSkip ? '点击任意位置跳过' : '正在准备开场动画'}
        </span>
      </div>
    </div>
    </GameCanvas>
  );
};

export default Intro;
