import { useState, useEffect, useRef } from 'react';
import { preloadResources, getLevelAssets } from '@/utils/imagePreloader';

interface LevelLoaderProps {
  levelId: number;
  children: React.ReactNode;
}

// Track which levels have been loaded this session
const loadedLevels = new Set<number>();

const LevelLoader = ({ levelId, children }: LevelLoaderProps) => {
  const [ready, setReady] = useState(() => loadedLevels.has(levelId));
  const [progress, setProgress] = useState(loadedLevels.has(levelId) ? 100 : 0);
  const loadStartTime = useRef(Date.now());

  useEffect(() => {
    // If already loaded this session, skip entirely
    if (loadedLevels.has(levelId)) {
      setReady(true);
      setProgress(100);
      return;
    }

    let cancelled = false;
    setReady(false);
    setProgress(0);
    loadStartTime.current = Date.now();

    const doLoad = async () => {
      const assets = getLevelAssets(levelId);

      await preloadResources(
        assets,
        (loaded, total) => {
          if (!cancelled) {
            setProgress(total > 0 ? Math.round((loaded / total) * 100) : 100);
          }
        },
        15000
      );

      if (!cancelled) {
        loadedLevels.add(levelId);
        setProgress(100);
        setReady(true);
        const nextLevelId = levelId + 1;
        if (!loadedLevels.has(nextLevelId)) {
          void preloadResources(getLevelAssets(nextLevelId), undefined, 15000).then(() => {
            loadedLevels.add(nextLevelId);
          });
        }
      }
    };

    doLoad();

    return () => {
      cancelled = true;
    };
  }, [levelId]);

  if (ready) {
    // Render children directly - no wrapper div to avoid layout shifts
    return <>{children}</>;
  }

  // Lightweight loading overlay matching the game's dark background
  // Uses same dimensions as GameCanvas children to prevent size jitter
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
      <div className="relative" style={{ width: 'min(100vw, calc(100vh * 16 / 9))', aspectRatio: '16 / 9', background: '#1A2840' }}>
        <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: '#E8C37D',
                  animation: `levelLoaderPulse 1s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <span className="text-sm" style={{ color: '#F5E6C8' }}>
            准备中...
          </span>
          <div className="w-48 h-1.5 overflow-hidden rounded-full" style={{ background: 'rgba(232, 195, 125, 0.25)' }}>
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{ width: `${progress}%`, background: '#E8C37D' }}
            />
          </div>
        </div>
      </div>
      </div>
      <style>{`
        @keyframes levelLoaderPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default LevelLoader;
