import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LEVELS, loadGameState } from '@/data/gameData';
import GameCanvas from '@/components/GameCanvas';

const LevelSelect = () => {
  const navigate = useNavigate();
  const state = loadGameState();

  const isUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    return state.completedLevels.includes(levelId - 1);
  };

  const isCompleted = (levelId: number) => state.completedLevels.includes(levelId);

  return (
    <GameCanvas>
    <div
      className="w-full h-full p-4 overflow-y-auto"
      style={{
        background: 'linear-gradient(135deg, #FFF5EB 0%, #FFE8CC 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate('/menu')}
            variant="outline"
            className="rounded-full"
            style={{
              background: '#FFF8F2',
              borderColor: '#E8C37D',
              color: '#4A3728',
            }}
          >
            ← 返回
          </Button>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wider" style={{ color: '#4A3728' }}>
              婴宁篇 · 章节目录
            </h1>
            <p className="text-sm mt-1" style={{ color: '#8B7355' }}>
              虐恋反转·鬼怪温情
            </p>
          </div>
          <div
            className="px-4 py-2 rounded-full text-sm font-bold"
            style={{
              background: '#FFF8F2',
              border: '2px solid #E8C37D',
              color: '#4A3728',
            }}
          >
            {state.completedLevels.length} / 10
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {LEVELS.map((level) => {
            const unlocked = isUnlocked(level.id);
            const completed = isCompleted(level.id);

            return (
              <div
                key={level.id}
                onClick={() => unlocked && navigate(`/play/${level.id}`)}
                className={`relative rounded-xl overflow-hidden transition-all ${
                  unlocked ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'
                }`}
                style={{
                  background: '#FFF8F2',
                  border: completed ? '3px solid #7EC8A0' : unlocked ? '3px solid #E8C37D' : '3px solid #C4B5A5',
                  boxShadow: unlocked ? '0 4px 12px rgba(232, 195, 125, 0.3)' : 'none',
                  opacity: unlocked ? 1 : 0.6,
                }}
              >
                <div className="aspect-video relative" style={{ background: '#FFF5EB' }}>
                  <img
                    src={level.background}
                    alt={level.name}
                    className="w-full h-full object-cover"
                    style={{ filter: unlocked ? 'none' : 'grayscale(80%) brightness(0.8)' }}
                  />
                  {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <span className="text-4xl">🔒</span>
                    </div>
                  )}
                  {completed && (
                    <div
                      className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                      style={{ background: '#7EC8A0', color: '#FFF8F2' }}
                    >
                      ✓
                    </div>
                  )}
                  <div
                    className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold"
                    style={{ background: '#E8C37D', color: '#4A3728' }}
                  >
                    第 {level.id} 关
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold mb-1 leading-tight" style={{ color: '#4A3728' }}>
                    {level.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs" style={{ color: '#E8C37D' }}>
                      {'★'.repeat(Math.min(level.difficulty, 5))}
                      <span style={{ color: '#C4B5A5' }}>{'★'.repeat(Math.max(0, 5 - level.difficulty))}</span>
                    </div>
                    <span className="text-xs" style={{ color: '#8B7355' }}>
                      {level.items.length} 物品
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </GameCanvas>
  );
};

export default LevelSelect;