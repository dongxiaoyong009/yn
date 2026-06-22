import { ReactNode, useEffect, useState, useRef } from 'react';

interface GameCanvasProps {
  children: ReactNode;
  className?: string;
}

const ASPECT_RATIO = 16 / 9;

/**
 * Calculate the correct canvas size for the current viewport.
 * Used both for initial state and on resize.
 */
function calculateSize() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let w: number, h: number;
  if (vw / vh > ASPECT_RATIO) {
    h = vh;
    w = vh * ASPECT_RATIO;
  } else {
    w = vw;
    h = vw / ASPECT_RATIO;
  }

  return { width: Math.floor(w), height: Math.floor(h) };
}

/**
 * Fixed 16:9 landscape game canvas.
 * Uses width/height sizing (not transform) to fit the viewport while maintaining aspect ratio.
 * Centers with black letterboxing on non-matching viewports.
 * Works correctly inside iframes (App Viewer) and standalone browsers.
 */
const GameCanvas = ({ children, className = '' }: GameCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Initialize with actual viewport size to prevent first-frame jitter
  const [size, setSize] = useState(calculateSize);

  useEffect(() => {
    const updateSize = () => {
      setSize(calculateSize());
    };

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