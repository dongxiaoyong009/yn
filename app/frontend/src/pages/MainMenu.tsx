import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { loadGameState, saveGameState, resetGameState, DAILY_GIFTS } from '@/data/gameData';
import { toast } from 'sonner';
import GameCanvas from '@/components/GameCanvas';
import audioManager from '@/utils/audioManager';
import BackpackPanel from '@/components/BackpackPanel';

// All 24 chapters data
const ALL_CHAPTERS = [
  { id: 1, name: '婴宁', icon: '🦋' },
  { id: 2, name: '画皮', icon: '🎭' },
  { id: 3, name: '聂小倩', icon: '👻' },
  { id: 4, name: '牛郎织女', icon: '🌌' },
  { id: 5, name: '白蛇传', icon: '🐍' },
  { id: 6, name: '孟姜女', icon: '🏯' },
  { id: 7, name: '梁山伯', icon: '🦋' },
  { id: 8, name: '祝英台', icon: '📜' },
  { id: 9, name: '八仙过海', icon: '⛵' },
  { id: 10, name: '嫦娥奔月', icon: '🌙' },
  { id: 11, name: '后羿射日', icon: '🏹' },
  { id: 12, name: '女娲补天', icon: '🌈' },
  { id: 13, name: '精卫填海', icon: '🐦' },
  { id: 14, name: '夸父追日', icon: '☀️' },
  { id: 15, name: '愚公移山', icon: '⛰️' },
  { id: 16, name: '哪吒闹海', icon: '🔥' },
  { id: 17, name: '红拂传', icon: '💃' },
  { id: 18, name: '孔雀东南飞', icon: '🦚' },
  { id: 19, name: '牡丹亭', icon: '🌺' },
  { id: 20, name: '西游记', icon: '🐵' },
  { id: 21, name: '山海经', icon: '📖' },
  { id: 22, name: '封神榜', icon: '⚡' },
  { id: 23, name: '白鹤报恩', icon: '🕊️' },
  { id: 24, name: '青蛇劫法海', icon: '🐉' },
];

// Precise clickable regions extracted from the chapter grid artwork (1920x1080).
// Using per-card bounds avoids the "equal-width grid" drift that caused hover
// highlights to bleed outside the visible chapter cards.
const CHAPTER_COLS = [
  { left: 365, width: 173 },
  { left: 553, width: 176 },
  { left: 747, width: 176 },
  { left: 940, width: 176 },
  { left: 1136, width: 175 },
  { left: 1328, width: 175 },
];

const CHAPTER_ROWS = [
  { top: 215, height: 183 },
  { top: 410, height: 182 },
  { top: 604, height: 180 },
  { top: 795, height: 182 },
];

const MainMenu = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(loadGameState());
  const [showSettings, setShowSettings] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showBackpack, setShowBackpack] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Settings state - sync with audioManager
  const [sound, setSound] = useState(() => Math.round(audioManager.sfxVolume * 100));
  const [music, setMusic] = useState(() => Math.round(audioManager.bgmVolume * 100));
  const [vibration, setVibration] = useState(true);

  // Play menu BGM on mount
  useEffect(() => {
    audioManager.playBgm('menu');
    return () => {
      // Don't stop BGM on unmount - let the next page handle it
    };
  }, []);

  // Sync settings to audioManager
  useEffect(() => {
    audioManager.sfxVolume = sound / 100;
  }, [sound]);

  useEffect(() => {
    audioManager.bgmVolume = music / 100;
  }, [music]);

  // Determine day/night based on actual time (6:00-18:00 = day, else = night)
  const currentHour = new Date().getHours();
  const isDaytime = currentHour >= 6 && currentHour < 18;
  const bgImage = isDaytime ? '/assets/main-menu-daytime-bg.jpg' : '/assets/main-menu-night-bg.jpg';

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (state.lastGiftDate !== today && state.lastGiftDate !== '') {
      const last = new Date(state.lastGiftDate);
      const now = new Date(today);
      const diff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 1) {
        const newState = { ...state, dailyGiftDay: 1 };
        setState(newState);
        saveGameState(newState);
      }
    }
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const canClaimGift = state.lastGiftDate !== today;

  const claimGift = (doubled: boolean) => {
    if (!canClaimGift) return;
    const gift = DAILY_GIFTS[state.dailyGiftDay - 1];
    const amount = doubled ? gift.doubleAmount : gift.baseAmount;
    if (amount === 0) return;

    const newState = { ...state };
    switch (gift.rewardType) {
      case 'coins':
        newState.coins += amount;
        break;
      case 'hints':
        newState.hints += amount;
        break;
      case 'lives':
        newState.lives = Math.min(5, newState.lives + amount);
        break;
      case 'items':
        newState.items += amount;
        break;
      case 'scroll':
      case 'skin':
        newState.coins += 100;
        break;
    }
    newState.lastGiftDate = today;
    newState.dailyGiftDay = state.dailyGiftDay >= 7 ? 1 : state.dailyGiftDay + 1;
    setState(newState);
    saveGameState(newState);
    toast.success(`领取成功：${gift.rewardName} ${amount > 0 ? '+' + amount : ''}${doubled ? ' (双倍)' : ''}`);
    setShowGift(false);
  };

  const handleResetIdentity = () => {
    resetGameState();
    setState(loadGameState());
    setShowResetConfirm(false);
    setShowSettings(false);
    navigate('/identity');
  };

  const identityName = state.playerIdentity === 'lingmei' ? '灵韵' : '说书人';

  const handleChapterClick = (chapterId: number) => {
    if (chapterId === 1) {
      navigate('/levels');
    } else {
      toast.info('此章节尚未开放，敬请期待');
    }
  };

  const handleStartGame = () => {
    navigate('/levels');
  };

  return (
    <GameCanvas>
    <div
      className="w-full h-full relative overflow-hidden select-none"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#000',
      }}
    >
      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDaytime
            ? 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.3) 100%)'
            : 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Floating cherry blossom decorations */}
      <div className="absolute top-8 left-16 text-2xl opacity-60 animate-pulse">🌸</div>
      <div className="absolute top-20 right-24 text-xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}>🌸</div>
      <div className="absolute bottom-32 left-8 text-lg opacity-30 animate-pulse" style={{ animationDelay: '2s' }}>✦</div>
      <div className="absolute top-1/3 right-8 text-sm opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>

      {/* ===== TOP LEFT: Character Badge ===== */}
      <div className="absolute left-2 z-30" style={{ top: '-40px' }}>
        <img
          src="/assets/character-badge-lingmei.png"
          alt={identityName}
          className="w-auto object-contain drop-shadow-lg"
          style={{
            height: '200px',
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
          }}
        />
      </div>

      {/* ===== TOP CENTER: Title Banner ===== */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30">
        <img
          src="/assets/title-banner.png"
          alt="寻物之旅"
          className="object-contain"
          style={{
            width: '320px',
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
          }}
        />
      </div>

      {/* ===== TOP RIGHT: Currency ===== */}
      <div className="absolute top-2 right-3 z-30 flex items-center gap-2">
        {/* Currency bar image */}
        <img
          src="/assets/currency-bar.png"
          alt="金币钻石"
          className="object-contain"
          style={{
            height: '540px',
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
          }}
        />
      </div>

      {/* ===== TOP RIGHT: Settings gear (right of currency bar) ===== */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute z-40 flex items-center justify-center transition-all hover:scale-110"
        style={{
          width: '82px',
          height: '82px',
          background: 'transparent',
          border: 'none',
          padding: 0,
          top: '8px',
          right: '8px',
        }}
      >
        <img
          src="/assets/settings-btn.png"
          alt="设置"
          className="w-full h-full object-contain"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
        />
      </button>

      {/* ===== MAIN CONTENT: Level Grid (full image, 24 clickable areas) ===== */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className="relative"
          style={{
            /* Show the full level-grid-ui.png image maintaining its 1920:1080 (16:9) aspect ratio.
               Size it to fill most of the canvas while leaving room for top/bottom UI */
            width: '100%',
            height: '100%',
          }}
        >
          {/* Full image displayed at 100% of container */}
          <img
            src="/assets/level-grid-ui.png"
            alt="关卡网格"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
          {/* Overlay precise click buttons for each of the 24 visible cards. */}
          <div className="absolute inset-0">
            {ALL_CHAPTERS.map((chapter, i) => {
              const col = CHAPTER_COLS[i % 6];
              const row = CHAPTER_ROWS[Math.floor(i / 6)];
              return (
              <button
                key={chapter.id}
                onClick={() => handleChapterClick(chapter.id)}
                className="absolute transition-all rounded-xl hover:bg-white/10 hover:ring-2 hover:ring-[#E8C37D]/80 active:scale-[0.98]"
                style={{
                  left: `${(col.left / 1920) * 100}%`,
                  top: `${(row.top / 1080) * 100}%`,
                  width: `${(col.width / 1920) * 100}%`,
                  height: `${(row.height / 1080) * 100}%`,
                }}
              />
            );
            })}
          </div>
        </div>
      </div>

      {/* ===== BOTTOM LEFT: Package Button ===== */}
      <div className="absolute bottom-3 -left-2 z-20">
        <button
          onClick={() => setShowBackpack(true)}
          className="relative transition-all hover:scale-110 active:scale-95"
        >
          <img
            src="/assets/backpack-icon.png"
            alt="背包"
            className="object-contain drop-shadow-lg"
            style={{
              height: '160px',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
            }}
          />

        </button>
      </div>

      {/* ===== BOTTOM RIGHT: Start Game Button ===== */}
      <div className="absolute bottom-3 right-3 z-20">
        <button
          onClick={handleStartGame}
          className="relative transition-all hover:scale-105 active:scale-95"
        >
          <img
            src="/assets/start-game-btn.png"
            alt="开始游戏"
            className="object-contain drop-shadow-lg"
            style={{
              height: '160px',
              filter: 'drop-shadow(0 4px 12px rgba(232,93,117,0.5))',
            }}
          />
        </button>
      </div>

      {/* ===== DIALOGS ===== */}

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent style={{ background: '#0F1A30', border: '2px solid #E8C37D', color: '#F0E6D3' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#F5DBA3' }}>⚙ 设置</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div>
              <div className="flex justify-between mb-2 text-sm" style={{ color: '#F0E6D3' }}>
                <span>音效</span>
                <span>{sound}%</span>
              </div>
              <Slider value={[sound]} onValueChange={(v) => setSound(v[0])} max={100} step={5} />
            </div>
            <div>
              <div className="flex justify-between mb-2 text-sm" style={{ color: '#F0E6D3' }}>
                <span>背景音乐</span>
                <span>{music}%</span>
              </div>
              <Slider value={[music]} onValueChange={(v) => setMusic(v[0])} max={100} step={5} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: '#F0E6D3' }}>震动反馈</span>
              <Switch checked={vibration} onCheckedChange={setVibration} />
            </div>
            <div className="pt-3 border-t" style={{ borderColor: '#3A4A6A' }}>
              <Button
                onClick={() => setShowResetConfirm(true)}
                variant="outline"
                className="w-full"
                style={{ borderColor: '#E85D75', color: '#E85D75', background: 'transparent' }}
              >
                重置身份与进度
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Confirm */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent style={{ background: '#0F1A30', border: '2px solid #E85D75', color: '#F0E6D3' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#E85D75' }}>⚠ 确认重置</DialogTitle>
          </DialogHeader>
          <p className="text-sm py-3" style={{ color: '#F0E6D3' }}>
            重置后将清空所有进度，包括身份选择、关卡进度、金币与生命。此操作不可恢复。
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowResetConfirm(false)}
              variant="outline"
              className="flex-1"
              style={{ borderColor: '#3A4A6A', color: '#F0E6D3', background: 'transparent' }}
            >
              取消
            </Button>
            <Button
              onClick={handleResetIdentity}
              className="flex-1"
              style={{ background: '#E85D75', color: '#FFF8F2', border: 'none' }}
            >
              确认重置
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Backpack Dialog */}
      <Dialog open={showBackpack} onOpenChange={setShowBackpack}>
        <DialogContent
          className="p-0 border-0 overflow-hidden"
          style={{
            background: 'transparent',
            maxWidth: '720px',
            width: '95%',
            boxShadow: 'none',
          }}
        >
          <BackpackPanel state={state} onClose={() => setShowBackpack(false)} />
        </DialogContent>
      </Dialog>

      {/* Daily Gift Dialog */}
      <Dialog open={showGift} onOpenChange={setShowGift}>
        <DialogContent style={{ background: '#0F1A30', border: '2px solid #E8C37D', maxWidth: '600px', color: '#F0E6D3' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#F5DBA3' }}>🎁 每日礼包 · 7天循环</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-7 gap-2 py-3">
            {DAILY_GIFTS.map((gift) => {
              const isClaimed = !canClaimGift && gift.day < state.dailyGiftDay;
              const isToday = gift.day === state.dailyGiftDay && canClaimGift;
              const isLocked = gift.day > state.dailyGiftDay || (!canClaimGift && gift.day === state.dailyGiftDay);
              return (
                <div
                  key={gift.day}
                  className="text-center p-2 rounded-lg text-xs relative"
                  style={{
                    background: isToday ? '#E8C37D' : isClaimed ? 'rgba(126,200,160,0.2)' : '#1A2744',
                    border: isToday ? '2px solid #C9A54A' : '1px solid #3A4A6A',
                    color: isToday ? '#2A1F0A' : isLocked ? '#4A5A7A' : '#F0E6D3',
                    opacity: isLocked && !isToday ? 0.6 : 1,
                  }}
                >
                  <div className="font-bold mb-1">第{gift.day}天</div>
                  <div className="text-lg mb-1">
                    {gift.rewardType === 'coins' && '💰'}
                    {gift.rewardType === 'hints' && '💡'}
                    {gift.rewardType === 'lives' && '❤️'}
                    {gift.rewardType === 'items' && '🎁'}
                    {gift.rewardType === 'scroll' && '📜'}
                    {gift.rewardType === 'skin' && '👘'}
                  </div>
                  <div className="text-[10px] leading-tight">{gift.rewardName}</div>
                  <div className="text-[10px] font-bold">×{gift.baseAmount}</div>
                  {isClaimed && <div className="absolute top-1 right-1 text-xs">✓</div>}
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => claimGift(false)}
              disabled={!canClaimGift}
              className="flex-1"
              style={{
                background: canClaimGift ? '#E8C37D' : '#3A4A6A',
                color: canClaimGift ? '#2A1F0A' : '#6B7B8F',
                border: 'none',
                opacity: canClaimGift ? 1 : 0.6,
              }}
            >
              {canClaimGift ? '领取' : '今日已领取'}
            </Button>
            {canClaimGift && DAILY_GIFTS[state.dailyGiftDay - 1].doubleAmount > 0 && (
              <Button
                onClick={() => claimGift(true)}
                className="flex-1"
                style={{
                  background: '#E85D75',
                  color: '#FFF8F2',
                  border: 'none',
                }}
              >
                📺 看广告 ×2
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </GameCanvas>
  );
};

export default MainMenu;
