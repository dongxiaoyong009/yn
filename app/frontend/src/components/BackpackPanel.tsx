import { useState } from 'react';
import { LEVELS } from '@/data/gameData';
import type { GameState } from '@/data/gameData';

interface BackpackPanelProps {
  state: GameState;
  onClose: () => void;
}

interface CollectedItem {
  id: string;
  name: string;
  image?: string;
  icon: string;
  levelId: number;
  levelName: string;
}

export default function BackpackPanel({ state, onClose }: BackpackPanelProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 10;

  // Collect all items from completed levels
  const collectedItems: CollectedItem[] = [];
  for (const levelId of state.completedLevels) {
    const level = LEVELS.find((l) => l.id === levelId);
    if (level) {
      for (const item of level.items) {
        collectedItems.push({
          id: item.id,
          name: item.name,
          image: item.image,
          icon: item.icon,
          levelId: level.id,
          levelName: level.name,
        });
      }
    }
  }

  const totalPages = Math.max(1, Math.ceil(collectedItems.length / ITEMS_PER_PAGE));
  const pageItems = collectedItems.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="relative w-full h-full flex flex-col" style={{ minHeight: '420px' }}>
      {/* Background overlay */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F1A30 0%, #1A2744 50%, #0D1526 100%)',
          border: '2px solid #E8C37D',
          boxShadow: '0 0 30px rgba(232,195,125,0.2), inset 0 0 60px rgba(0,0,0,0.3)',
        }}
      />

      {/* Decorative corner ornaments */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#E8C37D] rounded-tl-lg opacity-60" />
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#E8C37D] rounded-tr-lg opacity-60" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#E8C37D] rounded-bl-lg opacity-60" />
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#E8C37D] rounded-br-lg opacity-60" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-3">
          {/* Hexagonal title badge */}
          <div
            className="relative flex items-center justify-center"
            style={{
              width: '140px',
              height: '36px',
              background: 'linear-gradient(90deg, #E8C37D 0%, #F5DBA3 50%, #E8C37D 100%)',
              clipPath: 'polygon(8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%, 0% 50%)',
            }}
          >
            <span className="text-sm font-bold" style={{ color: '#2A1810' }}>
              📦 收集图鉴
            </span>
          </div>
          <span className="text-xs" style={{ color: '#8B7355' }}>
            已收集 {collectedItems.length} 件
          </span>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
          style={{
            background: 'rgba(232,195,125,0.15)',
            border: '1px solid rgba(232,195,125,0.4)',
          }}
        >
          <span className="text-lg" style={{ color: '#E8C37D' }}>✕</span>
        </button>
      </div>

      {/* Items Grid */}
      <div className="relative z-10 flex-1 px-5 py-2 overflow-hidden">
        {collectedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="text-4xl opacity-50">🎒</div>
            <p className="text-sm" style={{ color: '#8B7355' }}>
              还没有收集到物品
            </p>
            <p className="text-xs" style={{ color: '#6B5B4B' }}>
              完成关卡后，找到的物品会出现在这里
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-3 h-full content-start">
            {pageItems.map((item) => (
              <div
                key={`${item.levelId}-${item.id}`}
                className="relative flex flex-col items-center justify-center rounded-lg p-2 transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,248,242,0.95) 0%, rgba(255,245,235,0.9) 100%)',
                  border: '1px solid rgba(232,195,125,0.5)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.5)',
                  minHeight: '100px',
                }}
              >
                {/* Level indicator dot */}
                <div
                  className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #E8C37D, #D4A853)',
                    color: '#2A1810',
                  }}
                >
                  {item.levelId}
                </div>

                {/* Item image */}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-contain mb-1"
                    draggable={false}
                  />
                ) : (
                  <div className="text-2xl mb-1">{item.icon}</div>
                )}

                {/* Item name */}
                <div
                  className="text-[10px] font-medium text-center leading-tight mt-auto"
                  style={{ color: '#4A3728' }}
                >
                  {item.name}
                </div>
              </div>
            ))}

            {/* Empty slots to fill the grid */}
            {pageItems.length < ITEMS_PER_PAGE &&
              Array.from({ length: ITEMS_PER_PAGE - pageItems.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex flex-col items-center justify-center rounded-lg"
                  style={{
                    background: 'rgba(255,248,242,0.15)',
                    border: '1px dashed rgba(232,195,125,0.2)',
                    minHeight: '100px',
                  }}
                >
                  <div className="text-lg opacity-20">?</div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="relative z-10 flex items-center justify-center gap-4 pb-4 pt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all disabled:opacity-30"
            style={{
              background: 'rgba(232,195,125,0.2)',
              border: '1px solid rgba(232,195,125,0.4)',
            }}
          >
            <span style={{ color: '#E8C37D' }}>◀</span>
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all cursor-pointer"
                style={{
                  background: i === currentPage ? '#E8C37D' : 'rgba(232,195,125,0.3)',
                  transform: i === currentPage ? 'scale(1.3)' : 'scale(1)',
                }}
                onClick={() => setCurrentPage(i)}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all disabled:opacity-30"
            style={{
              background: 'rgba(232,195,125,0.2)',
              border: '1px solid rgba(232,195,125,0.4)',
            }}
          >
            <span style={{ color: '#E8C37D' }}>▶</span>
          </button>
        </div>
      )}

      {/* Bottom stats bar */}
      <div
        className="relative z-10 flex items-center justify-around px-6 py-3 mx-4 mb-4 rounded-lg"
        style={{
          background: 'rgba(232,195,125,0.08)',
          border: '1px solid rgba(232,195,125,0.2)',
        }}
      >
        <div className="flex flex-col items-center">
          <span className="text-xs" style={{ color: '#8B7355' }}>已通关</span>
          <span className="text-sm font-bold" style={{ color: '#E8C37D' }}>
            {state.completedLevels.length}/10
          </span>
        </div>
        <div className="w-px h-6" style={{ background: 'rgba(232,195,125,0.3)' }} />
        <div className="flex flex-col items-center">
          <span className="text-xs" style={{ color: '#8B7355' }}>收集物品</span>
          <span className="text-sm font-bold" style={{ color: '#E8C37D' }}>
            {collectedItems.length}
          </span>
        </div>
        <div className="w-px h-6" style={{ background: 'rgba(232,195,125,0.3)' }} />
        <div className="flex flex-col items-center">
          <span className="text-xs" style={{ color: '#8B7355' }}>完成度</span>
          <span className="text-sm font-bold" style={{ color: '#E8C37D' }}>
            {state.completedLevels.length > 0
              ? Math.round((state.completedLevels.length / 10) * 100)
              : 0}%
          </span>
        </div>
      </div>
    </div>
  );
}