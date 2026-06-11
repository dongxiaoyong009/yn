import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCanvas from '@/components/GameCanvas';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/intro', { replace: true });
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <GameCanvas>
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #FFF5EB 0%, #FFE8CC 100%)' }}
    >
      <div className="text-center animate-pulse">
        <div className="text-5xl font-bold mb-4 tracking-widest" style={{ color: '#4A3728' }}>
          聊斋奇谭
        </div>
        <div className="text-lg tracking-[0.3em]" style={{ color: '#8B7355' }}>
          新国风 · 暖柔治愈
        </div>
        <div className="mt-12 flex justify-center gap-2">
          <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#E8C37D', animationDelay: '0s' }} />
          <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#E8C37D', animationDelay: '0.2s' }} />
          <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#E8C37D', animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
    </GameCanvas>
  );
};

export default Index;