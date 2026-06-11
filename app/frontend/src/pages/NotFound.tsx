import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #FFF5EB 0%, #FFE8CC 100%)' }}
    >
      <div className="text-center">
        <div className="text-7xl mb-4">🌸</div>
        <h1 className="text-4xl font-bold mb-3" style={{ color: '#4A3728' }}>
          迷途
        </h1>
        <p className="mb-6" style={{ color: '#8B7355' }}>
          这条小径似乎并不存在……
        </p>
        <Button
          onClick={() => navigate('/')}
          style={{ background: '#E8C37D', color: '#4A3728', border: '2px solid #4A3728' }}
        >
          ← 返回秘境
        </Button>
      </div>
    </div>
  );
};

export default NotFound;