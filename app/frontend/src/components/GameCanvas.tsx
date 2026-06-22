import { ReactNode, useEffect, useState, useRef } from 'react';

interface GameCanvasProps {
  children: ReactNode;
  className?: string;
}

const ASPECT_RATIO = 16 / 9;
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

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
 * The visible viewport is fitted to 16:9, then the game UI is rendered on a
 * fixed 1920x1080 design stage and scaled as one unit. This keeps fixed-size
 * buttons, text, hit areas, and absolute-positioned UI visually proportional
 * when the browser viewport changes.
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
        <div
          className="absolute left-0 top-0 overflow-hidden"
          style={{
            width: `${DESIGN_WIDTH}px`,
            height: `${DESIGN_HEIGHT}px`,
            transform: `scale(${size.width / DESIGN_WIDTH})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameCanvas;
