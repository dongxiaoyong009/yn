import { ReactNode, useEffect, useState, useRef } from 'react';

interface GameCanvasProps {
  children: ReactNode;
  className?: string;
}

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const ASPECT_RATIO = GAME_WIDTH / GAME_HEIGHT;

/**
 * Fixed 16:9 landscape game canvas.
 * Uses width/height sizing (not transform) to fit the viewport while maintaining aspect ratio.
 * Centers with black letterboxing on non-matching viewports.
 * Works correctly inside iframes (App Viewer) and standalone browsers.
 */
const GameCanvas = ({ children, className = '' }: GameCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: GAME_WIDTH, height: GAME_HEIGHT });

  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let w: number, h: number;
      if (vw / vh > ASPECT_RATIO) {
        // Viewport is wider than 16:9 → height-limited
        h = vh;
        w = vh * ASPECT_RATIO;
      } else {
        // Viewport is taller than 16:9 → width-limited
        w = vw;
        h = vw / ASPECT_RATIO;
      }

      setSize({ width: Math.floor(w), height: Math.floor(h) });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden"
    >
      <div
        className={`relative overflow-hidden ${className}`}
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default GameCanvas;