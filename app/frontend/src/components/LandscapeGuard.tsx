import { useState, useEffect } from 'react';

/**
 * 强制横屏遮罩组件
 * 当用户竖屏使用手机时，显示全屏遮罩提示旋转手机
 * 横屏后自动隐藏
 */
const LandscapeGuard = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // 检测是否为移动设备（触摸屏）且竖屏
      const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isPortraitMode = window.innerHeight > window.innerWidth;
      setIsPortrait(isMobile && isPortraitMode);
    };

    checkOrientation();

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // 使用 screen.orientation API（如果可用）
    if (screen.orientation) {
      screen.orientation.addEventListener('change', checkOrientation);
    }

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      if (screen.orientation) {
        screen.orientation.removeEventListener('change', checkOrientation);
      }
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#1a1028]">
      {/* 旋转手机图标动画 */}
      <div className="mb-8 animate-pulse">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 手机外框 - 竖屏状态 */}
          <g className="animate-[rotatePhone_2s_ease-in-out_infinite]" style={{ transformOrigin: '60px 60px' }}>
            <rect
              x="35"
              y="15"
              width="50"
              height="90"
              rx="8"
              stroke="#E8C37D"
              strokeWidth="3"
              fill="none"
            />
            {/* 屏幕 */}
            <rect
              x="40"
              y="25"
              width="40"
              height="65"
              rx="2"
              fill="#E8C37D"
              fillOpacity="0.15"
            />
            {/* 底部按钮 */}
            <circle cx="60" cy="98" r="4" stroke="#E8C37D" strokeWidth="2" fill="none" />
          </g>
          {/* 旋转箭头 */}
          <path
            d="M95 45 C 105 55, 105 65, 95 75"
            stroke="#E8C37D"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            className="animate-pulse"
          />
          <path
            d="M95 75 L 90 70 M95 75 L 100 70"
            stroke="#E8C37D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 提示文字 */}
      <p className="text-[#E8C37D] text-xl font-medium tracking-wider mb-2">
        请旋转手机
      </p>
      <p className="text-[#C4B5A5] text-sm">
        横屏体验更佳
      </p>
    </div>
  );
};

export default LandscapeGuard;