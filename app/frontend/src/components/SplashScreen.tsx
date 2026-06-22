import { useState, useEffect } from 'react';
import { preloadResources, getAllCriticalResources, getBackgroundResources } from '@/utils/imagePreloader';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('正在加载资源...');
  const [loadingPhase, setLoadingPhase] = useState<'images' | 'media' | 'done'>('images');

  useEffect(() => {
    let cancelled = false;

    const doPreload = async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      const allResources = getAllCriticalResources();

      setLoadingPhase('images');
      setStatusText('正在加载图片资源...');

      const result = await preloadResources(
        allResources,
        (loaded, _total) => {
          if (!cancelled) {
            const pct = Math.round((loaded / _total) * 100);
            setProgress(pct);

            // Update phase text based on progress
            const currentIdx = loaded;
            if (currentIdx <= 12) {
              setLoadingPhase('images');
              setStatusText('正在加载图片资源...');
            } else {
              setLoadingPhase('media');
              setStatusText('正在加载音视频资源...');
            }

            if (pct >= 100) {
              setLoadingPhase('done');
              setStatusText('加载完成');
            }
          }
        },
        45000
      );

      if (!cancelled) {
        if (result.failed > 0) {
          setStatusText('部分资源加载失败，正在进入...');
        }
        setProgress(100);
        setLoadingPhase('done');
        setTimeout(() => {
          if (!cancelled) {
            onComplete();
            void preloadResources(getBackgroundResources(), undefined, 30000);
          }
        }, 400);
      }
    };

    doPreload();

    return () => {
      cancelled = true;
    };
  }, [onComplete]);

  // Phase icon
  const getPhaseIcon = () => {
    switch (loadingPhase) {
      case 'images':
        return '🖼️';
      case 'media':
        return '🎵';
      case 'done':
        return '✨';
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #FFF5EB 0%, #FFE8CC 100%)' }}
    >
      {/* Brand Logo */}
      <div className="text-center mb-12">
        <div
          className="text-5xl font-bold mb-3 tracking-widest"
          style={{ color: '#4A3728' }}
        >
          聊斋奇谭
        </div>
        <div
          className="text-base tracking-[0.3em]"
          style={{ color: '#8B7355' }}
        >
          新国风 · 暖柔治愈
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-72 mx-auto">
        <div
          className="h-3 rounded-full overflow-hidden"
          style={{ background: 'rgba(232, 195, 125, 0.3)', border: '1px solid #E8C37D' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #E8C37D 0%, #D4A853 100%)',
              boxShadow: '0 0 8px rgba(232, 195, 125, 0.6)',
            }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs flex items-center gap-1" style={{ color: '#8B7355' }}>
            <span>{getPhaseIcon()}</span>
            <span>{statusText}</span>
          </span>
          <span className="text-xs font-medium" style={{ color: '#4A3728' }}>
            {progress}%
          </span>
        </div>
      </div>

      {/* Decorative dots */}
      <div className="mt-8 flex justify-center gap-2">
        <span
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ background: '#E8C37D', animationDelay: '0s' }}
        />
        <span
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ background: '#E8C37D', animationDelay: '0.2s' }}
        />
        <span
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ background: '#E8C37D', animationDelay: '0.4s' }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
