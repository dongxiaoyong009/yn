import { useNavigate } from 'react-router-dom';
import { loadGameState, saveGameState, Identity } from '@/data/gameData';
import { useState, useMemo } from 'react';
import GameCanvas from '@/components/GameCanvas';

const IdentitySelect = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Identity | null>(null);
  const [hovering, setHovering] = useState<Identity | null>(null);

  const isDaytime = useMemo(() => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18;
  }, []);

  const bgImage = isDaytime ? '/assets/main-menu-daytime-bg.jpg' : '/assets/main-menu-night-bg.jpg';

  const handleSelect = (identity: Identity) => {
    setSelected(identity);
    const state = loadGameState();
    saveGameState({ ...state, playerIdentity: identity });
    setTimeout(() => {
      navigate('/menu');
    }, 800);
  };

  return (
    <GameCanvas>
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#1A1030',
        }}
      >
        {/* Use img tag to ensure the design image renders */}
        <div className="relative" style={{ aspectRatio: '1/1', height: '85%' }}>
          <img
            src="/assets/identity-select-design.png"
            alt="角色选择"
            className="h-full w-full object-contain"
            draggable={false}
          />

          {/* Left card hotspot - 灵韵女灵媒 */}
          <div
            className="absolute cursor-pointer transition-all duration-300"
            style={{
              left: '6%',
              top: '18%',
              width: '39%',
              height: '70%',
              borderRadius: '12px',
              background: hovering === 'lingmei'
                ? 'rgba(200,120,200,0.15)'
                : 'transparent',
              boxShadow: selected === 'lingmei'
                ? '0 0 40px rgba(232,195,125,0.6), inset 0 0 30px rgba(200,120,200,0.15)'
                : hovering === 'lingmei'
                  ? '0 0 20px rgba(232,195,125,0.3)'
                  : 'none',
              border: selected === 'lingmei'
                ? '2px solid rgba(232,195,125,0.7)'
                : hovering === 'lingmei'
                  ? '1px solid rgba(232,195,125,0.3)'
                  : '1px solid transparent',
            }}
            onClick={() => handleSelect('lingmei')}
            onMouseEnter={() => setHovering('lingmei')}
            onMouseLeave={() => setHovering(null)}
          >
            {selected === 'lingmei' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="px-5 py-2 rounded-full text-sm font-bold tracking-wider animate-pulse"
                  style={{
                    background: 'linear-gradient(135deg, rgba(232,195,125,0.95), rgba(245,219,163,0.95))',
                    color: '#4A3728',
                    boxShadow: '0 4px 15px rgba(232,195,125,0.5)',
                  }}
                >
                  ✓ 已选择
                </div>
              </div>
            )}
          </div>

          {/* Right card hotspot - 江湖说书人 */}
          <div
            className="absolute cursor-pointer transition-all duration-300"
            style={{
              left: '55%',
              top: '18%',
              width: '39%',
              height: '70%',
              borderRadius: '12px',
              background: hovering === 'storyteller'
                ? 'rgba(100,150,220,0.15)'
                : 'transparent',
              boxShadow: selected === 'storyteller'
                ? '0 0 40px rgba(232,195,125,0.6), inset 0 0 30px rgba(100,150,220,0.15)'
                : hovering === 'storyteller'
                  ? '0 0 20px rgba(232,195,125,0.3)'
                  : 'none',
              border: selected === 'storyteller'
                ? '2px solid rgba(232,195,125,0.7)'
                : hovering === 'storyteller'
                  ? '1px solid rgba(232,195,125,0.3)'
                  : '1px solid transparent',
            }}
            onClick={() => handleSelect('storyteller')}
            onMouseEnter={() => setHovering('storyteller')}
            onMouseLeave={() => setHovering(null)}
          >
            {selected === 'storyteller' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="px-5 py-2 rounded-full text-sm font-bold tracking-wider animate-pulse"
                  style={{
                    background: 'linear-gradient(135deg, rgba(232,195,125,0.95), rgba(245,219,163,0.95))',
                    color: '#4A3728',
                    boxShadow: '0 4px 15px rgba(232,195,125,0.5)',
                  }}
                >
                  ✓ 已选择
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${2 + Math.random() * 2}px`,
                height: `${2 + Math.random() * 2}px`,
                background: i % 2 === 0 ? '#E8C37D' : '#D4A0D0',
                opacity: 0.2 + Math.random() * 0.2,
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </GameCanvas>
  );
};

export default IdentitySelect;