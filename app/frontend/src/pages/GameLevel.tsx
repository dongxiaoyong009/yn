import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LEVELS, loadGameState, saveGameState } from '@/data/gameData';
import { toast } from 'sonner';
import GameCanvas from '@/components/GameCanvas';
import audioManager from '@/utils/audioManager';

const ITEMS_PER_PAGE = 5;
const LEVEL_CUTSCENES: Record<
  number,
  { src: string; fallbackTitle: string; fallbackBody: string }
> = {
  1: {
    src: '/assets/level1-story-progress.mp4',
    fallbackTitle: '第一关剧情推进',
    fallbackBody: '过场加载失败，正在进入寻物...',
  },
  2: {
    src: '/assets/level2-ending.mp4',
    fallbackTitle: '第二关结束剧情',
    fallbackBody: '过场加载失败，正在进入下一关...',
  },
};

const GameLevel = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const level = LEVELS.find((l) => l.id === Number(levelId));
  const levelCutscene = level ? LEVEL_CUTSCENES[level.id] : undefined;

  const [gameState, setGameState] = useState(loadGameState());
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [currentLives, setCurrentLives] = useState(gameState.lives);
  const [currentHints, setCurrentHints] = useState(gameState.hints);
  const [hintItem, setHintItem] = useState<string | null>(null);
  const [magnetActive, setMagnetActive] = useState(false);
  const [feedback, setFeedback] = useState<{ x: number; y: number; type: 'success' | 'error' } | null>(null);
  const [page, setPage] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showResult, setShowResult] = useState<'win' | 'lose' | null>(null);
  const [showPause, setShowPause] = useState(false);
  const [showStartDialogue, setShowStartDialogue] = useState(true);
  const [showLevelIntroVideo, setShowLevelIntroVideo] = useState(false);
  const [levelIntroVideoError, setLevelIntroVideoError] = useState(false);
  const [levelIntroVideoNeedsStart, setLevelIntroVideoNeedsStart] = useState(false);
  const [pendingNextLevelAfterVideo, setPendingNextLevelAfterVideo] = useState<number | null>(null);
  const [showReviveAd, setShowReviveAd] = useState(false);
  const [reviveAdCountdown, setReviveAdCountdown] = useState(5);
  const [showBuyHint, setShowBuyHint] = useState(false);
  const [showBuyKnife, setShowBuyKnife] = useState(false);
  const [buyHintQty, setBuyHintQty] = useState(1);
  const [buyKnifeQty, setBuyKnifeQty] = useState(1);
  const [knifeAnimating, setKnifeAnimating] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const levelIntroVideoRef = useRef<HTMLVideoElement>(null);
  const lastActionRef = useRef<number>(Date.now());
  const autoHintTriggeredRef = useRef<boolean>(false);
  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);

  // Play game BGM on mount
  useEffect(() => {
    audioManager.playBgm('game');
    return () => {
      // Don't stop - let next page handle it
    };
  }, []);

  // Auto-hint after 30s idle
  useEffect(() => {
    if (!level) return;
    const interval = setInterval(() => {
      if (
        Date.now() - lastActionRef.current > 30000 &&
        !autoHintTriggeredRef.current &&
        !showResult &&
        !showStartDialogue &&
        !showLevelIntroVideo
      ) {
        const remaining = level.items.filter((i) => !foundIds.includes(i.id));
        if (remaining.length > 0) {
          autoHintTriggeredRef.current = true;
          setHintItem(remaining[0].id);
          toast.info('自动提示已激活');
          setTimeout(() => setHintItem(null), 3000);
          setTimeout(() => {
            autoHintTriggeredRef.current = false;
            lastActionRef.current = Date.now();
          }, 5000);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [foundIds, level, showResult, showStartDialogue, showLevelIntroVideo]);

  // Magnet effect timer
  useEffect(() => {
    if (magnetActive) {
      const timer = setTimeout(() => setMagnetActive(false), 15000);
      return () => clearTimeout(timer);
    }
  }, [magnetActive]);

  useEffect(() => {
    if (!showReviveAd) return;
    setReviveAdCountdown(5);

    const interval = setInterval(() => {
      setReviveAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showReviveAd]);

  // Lose check
  useEffect(() => {
    if (currentLives <= 0 && !showResult) {
      setShowResult('lose');
    }
  }, [currentLives, showResult]);

  // Win check
  useEffect(() => {
    if (!level) return;
    if (foundIds.length === level.items.length && !showResult && !showStartDialogue && !showLevelIntroVideo) {
      const newState = { ...gameState };
      if (!newState.completedLevels.includes(level.id)) {
        newState.completedLevels = [...newState.completedLevels, level.id];
      }
      newState.coins += 100;
      newState.lives = currentLives;
      newState.hints = currentHints;
      saveGameState(newState);
      setGameState(newState);
      setTimeout(() => setShowResult('win'), 1200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foundIds, level, showResult, showStartDialogue, showLevelIntroVideo]);

  const handleSceneClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!level || !sceneRef.current || showResult || showStartDialogue || showLevelIntroVideo) return;
      const rect = sceneRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      lastActionRef.current = Date.now();

      // 热区按比例缩放：hitRadius为百分比单位，保证最小48px等效触控区
      const minHitPct = Math.max((48 / rect.width) * 100, (48 / rect.height) * 100);

      const clickedItem = level.items.find((item) => {
        if (foundIds.includes(item.id)) return false;
        const dx = item.x - x;
        const dy = item.y - y;
        // 使用hitRadius和最小触控热区中较大的值
        const effectiveRadius = Math.max(item.hitRadius, minHitPct / 2);
        return Math.sqrt(dx * dx + dy * dy) < effectiveRadius;
      });

      if (clickedItem) {
        setFoundIds((prev) => [...prev, clickedItem.id]);
        setFeedback({ x: clickedItem.x, y: clickedItem.y, type: 'success' });
        setTimeout(() => setFeedback(null), 800);
        toast.success(`找到 ${clickedItem.name}！`, { duration: 1500 });
        if (hintItem === clickedItem.id) setHintItem(null);
        // Play item found sound effect + vibration
        audioManager.onItemFound();
      } else {
        setCurrentLives((prev) => prev - 1);
        setFeedback({ x, y, type: 'error' });
        setTimeout(() => setFeedback(null), 600);
        // Short vibration for wrong tap
        audioManager.vibrate(20);
      }
    },
    [foundIds, level, hintItem, showResult, showStartDialogue, showLevelIntroVideo]
  );

  const finishLevelIntroVideo = useCallback(() => {
    setShowLevelIntroVideo(false);
    setLevelIntroVideoError(false);
    setLevelIntroVideoNeedsStart(false);
    audioManager.fadeIn(600);
    if (pendingNextLevelAfterVideo !== null) {
      const next = pendingNextLevelAfterVideo;
      setPendingNextLevelAfterVideo(null);
      navigate(`/play/${next}`);
      setTimeout(() => window.location.reload(), 100);
      return;
    }
    lastActionRef.current = Date.now();
  }, [navigate, pendingNextLevelAfterVideo]);

  const skipLevelIntroVideo = useCallback(() => {
    if (levelIntroVideoRef.current) {
      levelIntroVideoRef.current.pause();
    }
    finishLevelIntroVideo();
  }, [finishLevelIntroVideo]);

  const startLevelIntroVideoWithSound = useCallback(async () => {
    if (!levelIntroVideoRef.current) return;
    audioManager.fadeOut(600);
    try {
      levelIntroVideoRef.current.muted = false;
      levelIntroVideoRef.current.volume = 1;
      await levelIntroVideoRef.current.play();
      setLevelIntroVideoNeedsStart(false);
    } catch {
      setLevelIntroVideoNeedsStart(true);
    }
  }, []);

  useEffect(() => {
    if (!showLevelIntroVideo || levelIntroVideoError) return;
    void startLevelIntroVideoWithSound();
  }, [showLevelIntroVideo, levelIntroVideoError, startLevelIntroVideoWithSound]);

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="mb-4 text-white">关卡不存在</p>
          <Button onClick={() => navigate('/levels')}>返回章节</Button>
        </div>
      </div>
    );
  }

  const useHint = () => {
    if (currentHints <= 0) {
      setShowBuyHint(true);
      return;
    }
    const remaining = level.items.filter((i) => !foundIds.includes(i.id));
    if (remaining.length === 0) return;
    const target = remaining[Math.floor(Math.random() * remaining.length)];
    setHintItem(target.id);
    setCurrentHints((prev) => prev - 1);
    setTimeout(() => setHintItem(null), 3000);
    lastActionRef.current = Date.now();
  };

  const buyHintWithCoins = () => {
    const totalCost = 500 * buyHintQty;
    if (gameState.coins < totalCost) {
      toast.error(`金币不足，需要${totalCost}金币`);
      return;
    }
    const newState = { ...gameState, coins: gameState.coins - totalCost };
    saveGameState(newState);
    setGameState(newState);
    setCurrentHints((prev) => prev + buyHintQty);
    setShowBuyHint(false);
    setBuyHintQty(1);
    toast.success(`购买成功！放大镜 +${buyHintQty}`);
  };

  const useKnife = () => {
    if (gameState.items <= 0) {
      setShowBuyKnife(true);
      return;
    }
    const remaining = level.items.filter((i) => !foundIds.includes(i.id));
    if (remaining.length === 0) {
      toast.info('所有物品已找到');
      return;
    }
    // Consume 1 knife
    const newState = { ...gameState, items: gameState.items - 1 };
    setGameState(newState);
    saveGameState(newState);
    // Auto-find up to 3 items with animation
    const toFind = remaining.slice(0, 3);
    setKnifeAnimating(true);
    lastActionRef.current = Date.now();
    toast.success('小刀已使用！自动寻找物品中...');
    toFind.forEach((item, idx) => {
      setTimeout(() => {
        setFoundIds((prev) => [...prev, item.id]);
        setFeedback({ x: item.x, y: item.y, type: 'success' });
        toast.success(`找到 ${item.name}！`, { duration: 1200 });
        setTimeout(() => setFeedback(null), 800);
        // Play sound + vibration for each auto-found item
        audioManager.onItemFound();
        if (idx === toFind.length - 1) {
          setKnifeAnimating(false);
        }
      }, (idx + 1) * 800);
    });
  };

  const buyKnifeWithDiamonds = () => {
    const totalCost = 1 * buyKnifeQty;
    if ((gameState.diamonds || 0) < totalCost) {
      toast.error(`钻石不足，需要${totalCost}颗钻石`);
      return;
    }
    const newState = { ...gameState, diamonds: (gameState.diamonds || 0) - totalCost, items: gameState.items + buyKnifeQty };
    saveGameState(newState);
    setGameState(newState);
    setShowBuyKnife(false);
    setBuyKnifeQty(1);
    toast.success(`购买成功！小刀 +${buyKnifeQty}`);
  };

  const reviveByAd = () => {
    setCurrentLives(3);
    setShowResult(null);
    setShowReviveAd(false);
    toast.success('观看广告成功，恢复 3 生命');
  };

  const retry = () => {
    const newState = { ...gameState, lives: 3 };
    saveGameState(newState);
    setGameState(newState);
    setCurrentLives(3);
    setCurrentHints(gameState.hints);
    setFoundIds([]);
    setShowResult(null);
    setShowStartDialogue(true);
    setShowLevelIntroVideo(false);
    setLevelIntroVideoError(false);
    setLevelIntroVideoNeedsStart(false);
    setPendingNextLevelAfterVideo(null);
    setShowReviveAd(false);
    setReviveAdCountdown(5);
    setDialogueIndex(0);
    autoHintTriggeredRef.current = false;
    lastActionRef.current = Date.now();
  };

  const nextLevel = () => {
    const next = level.id + 1;
    if (next > LEVELS.length) {
      navigate('/levels');
    } else if (levelCutscene) {
      setShowResult(null);
      setPendingNextLevelAfterVideo(next);
      setShowLevelIntroVideo(true);
    } else {
      navigate(`/play/${next}`);
      setTimeout(() => window.location.reload(), 100);
    }
  };

  const totalPages = Math.ceil(level.items.length / ITEMS_PER_PAGE);
  const visibleItems = level.items.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <GameCanvas>
    <div className="w-full h-full overflow-hidden relative">
      {/* ===== FULL SCREEN SCENE BACKGROUND - 自适应16:9/18:9/19.5:9 ===== */}
      <div
        ref={sceneRef}
        onClick={handleSceneClick}
        className="absolute inset-0 cursor-pointer scene-hitarea"
        style={{
          backgroundImage: `url(${level.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Hint highlight */}
        {hintItem &&
          level.items.find((i) => i.id === hintItem) &&
          (() => {
            const item = level.items.find((i) => i.id === hintItem)!;
            return (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${item.hitRadius * 4}%`,
                  paddingTop: `${item.hitRadius * 4}%`,
                  borderRadius: '50%',
                  border: '3px solid #E8C37D',
                  boxShadow: '0 0 20px #E8C37D, inset 0 0 20px #E8C37D',
                  animation: 'pulseHint 1s ease-in-out infinite',
                }}
              />
            );
          })()}

        {/* Magnet glow on unfound items */}
        {magnetActive &&
          level.items
            .filter((i) => !foundIds.includes(i.id))
            .map((item) => (
              <div
                key={item.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${item.hitRadius * 3}%`,
                  paddingTop: `${item.hitRadius * 3}%`,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(232,195,125,0.6) 0%, rgba(232,195,125,0) 70%)',
                  animation: 'magnetGlow 1.5s ease-in-out infinite',
                }}
              />
            ))}

        {/* Found item markers */}
        {level.items
          .filter((i) => foundIds.includes(i.id))
          .map((item) => (
            <div
              key={item.id}
              className="absolute pointer-events-none text-2xl"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
                filter: 'drop-shadow(0 0 8px #7EC8A0)',
                color: '#7EC8A0',
              }}
            >
              ✓
            </div>
          ))}

        {/* Click feedback */}
        {feedback && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${feedback.x}%`,
              top: `${feedback.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {feedback.type === 'success' ? (
              <div className="relative">
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(232,195,125,0.8) 0%, rgba(232,195,125,0) 70%)',
                    animation: 'successBurst 0.8s ease-out forwards',
                  }}
                />

              </div>
            ) : (
              <div
                className="text-2xl"
                style={{ animation: 'errorShake 0.4s ease-in-out', color: '#E85D75' }}
              >
                ✗
              </div>
            )}
          </div>
        )}

        {/* Floating petals */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-xl opacity-30"
              style={{
                left: `${(i * 17) % 100}%`,
                top: '-30px',
                animation: `petalFall ${14 + (i % 4)}s linear infinite`,
                animationDelay: `${i * 2}s`,
              }}
            >
              🌸
            </div>
          ))}
        </div>
      </div>

      {/* ===== TOP-LEFT: Lives (刘海屏避让) ===== */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 safe-area-top safe-area-left">
        {/* Heart + life count */}
        <div className="flex items-center gap-1">
          <span className="text-2xl" style={{ color: '#E85D75', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>❤</span>
          <span className="text-lg font-bold text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{currentLives}</span>
        </div>
      </div>

      {/* ===== TOP-RIGHT: Settings gear (enlarged 2x) ===== */}
      <div className="absolute top-2 right-2 z-30 safe-area-top safe-area-right">
        <button
          onClick={() => setShowPause(true)}
          className="w-16 h-16 rounded-full flex items-center justify-center touch-target"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #C9A84C 0%, #8B6914 40%, #6B4F0E 100%)',
            border: '4px solid #E8D5A0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
          }}
        >
          <span className="text-3xl" style={{ color: '#FFF8E0' }}>⚙</span>
        </button>
      </div>

      {/* ===== TOP-CENTER: Level badge (hexagonal/pointed shape) ===== */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 safe-area-top">
        <div
          className="relative px-8 py-2"
          style={{
            background: 'linear-gradient(180deg, #1E2D48 0%, #152238 100%)',
            border: '2.5px solid #C9A84C',
            clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)',
            minWidth: '120px',
            textAlign: 'center',
          }}
        >
          <span
            className="text-base font-bold tracking-wider"
            style={{ color: '#F5E6C8', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            第{level.id}-{Math.ceil(level.id / 2)}关
          </span>
        </div>
      </div>

      {/* ===== TOP-RIGHT: Progress + Diamond + Gold coin counter (刘海屏避让) ===== */}
      <div className="absolute top-5 right-20 z-20 flex items-center gap-3 safe-area-top safe-area-right">
        {/* Progress counter */}
        <div className="flex items-center gap-1">
          <span className="text-xl">🔮</span>
          <span className="text-base font-bold text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
            {foundIds.length}/{level.items.length}
          </span>
        </div>
        {/* Diamond counter */}
        <div className="flex items-center gap-1">
          <span className="text-xl" style={{ filter: 'drop-shadow(0 0 4px rgba(100,200,255,0.6))' }}>💎</span>
          <span className="text-base font-bold text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
            {gameState.diamonds || 0}
          </span>
        </div>
        {/* Gold coin - ornate circular frame */}
        <div className="flex items-center gap-1">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #E8C37D 0%, #C9A84C 40%, #8B6914 100%)',
              border: '2.5px solid #F5DBA3',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)',
            }}
          >
            <span className="text-sm font-bold" style={{ color: '#4A2800' }}>¥</span>
          </div>
          <span className="text-base font-bold" style={{ color: '#F5DBA3', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
            {gameState.coins.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ===== BOTTOM-LEFT: Back button (dark circle with arrow) - 48px touch target ===== */}
      <button
        onClick={() => navigate('/levels')}
        className="absolute bottom-6 left-4 z-30 w-14 h-14 rounded-full flex items-center justify-center touch-target safe-area-bottom safe-area-left"
        style={{
          background: 'radial-gradient(circle at 40% 40%, #3A4A6A 0%, #1A2A4E 60%, #0D1520 100%)',
          border: '2.5px solid #6A8AB0',
          boxShadow: '0 3px 10px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.1)',
        }}
      >
        <span className="text-2xl" style={{ color: '#B0C8E0' }}>←</span>
      </button>

      {/* ===== BOTTOM-CENTER: Item list panel (横向翻页，每页5个) - 精确匹配参考图 ===== */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 safe-area-bottom" style={{ width: 'clamp(360px, 65%, 680px)' }}>
        {/* Main panel - dark blue background with gold/cream border decoration */}
        <div
          className="relative"
          style={{
            background: 'linear-gradient(180deg, #2B3A52 0%, #1E2D45 40%, #1A2840 100%)',
            borderRadius: '4px',
            border: '3px solid #C9A84C',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
            padding: '32px 12px 12px',
          }}
        >
          {/* Gold decorative border lines (top inner) */}
          <div className="absolute top-[6px] left-[6px] right-[6px] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 20%, #E8D5A0 50%, #C9A84C 80%, transparent 100%)' }} />
          {/* Gold decorative border lines (bottom inner) */}
          <div className="absolute bottom-[6px] left-[6px] right-[6px] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 20%, #E8D5A0 50%, #C9A84C 80%, transparent 100%)' }} />

          {/* "物品列表" title badge - cream ribbon behind, dark blue label on top */}
          <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 flex flex-col items-center">
            {/* Cream/gold ribbon background */}
            <div
              className="relative px-10 py-[2px]"
              style={{
                background: 'linear-gradient(180deg, #F5E8C8 0%, #E8D5A0 50%, #D4C090 100%)',
                clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}
            >
              {/* Dark blue label on top of ribbon */}
              <div
                className="px-6 py-1"
                style={{
                  background: 'linear-gradient(180deg, #2B3A52 0%, #1E2D45 100%)',
                  borderRadius: '2px',
                }}
              >
                <span className="text-sm font-bold tracking-[0.25em]" style={{ color: '#F5E6C8' }}>物品列表</span>
              </div>
            </div>
          </div>

          {/* Item cards row with pagination arrows */}
          <div className="flex items-center gap-2">
            {/* Left page arrow - diamond/pointed shape like reference */}
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="flex items-center justify-center w-10 h-10 shrink-0 touch-target"
              style={{ opacity: page === 0 ? 0.3 : 1 }}
            >
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                <path d="M12 2L4 12L12 22" stroke="#E8D5A0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Item cards with blue divider lines between them - supports touch swipe */}
            <div
              className="flex-1 flex items-stretch"
              onTouchStart={(e) => {
                touchStartXRef.current = e.touches[0].clientX;
                touchEndXRef.current = e.touches[0].clientX;
              }}
              onTouchMove={(e) => {
                touchEndXRef.current = e.touches[0].clientX;
              }}
              onTouchEnd={() => {
                const diff = touchStartXRef.current - touchEndXRef.current;
                const threshold = 50;
                if (diff > threshold && page < totalPages - 1) {
                  setPage(page + 1);
                } else if (diff < -threshold && page > 0) {
                  setPage(page - 1);
                }
              }}
            >
              {visibleItems.map((item, idx) => {
                const found = foundIds.includes(item.id);
                return (
                  <div key={item.id} className="flex-1 flex items-stretch">
                    {/* Card */}
                    <div
                      className="flex-1 flex flex-col items-center justify-center relative mx-[3px]"
                      style={{
                        background: found
                          ? 'linear-gradient(180deg, #d4edda 0%, #c3e6cb 100%)'
                          : 'linear-gradient(180deg, #FDF9F0 0%, #F8F2E8 50%, #F0E8DA 100%)',
                        border: found ? '2px solid #7EC8A0' : '2px solid #D4C4A8',
                        borderRadius: '6px',
                        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.15)',
                        padding: '6px 4px 6px',
                        minHeight: '85px',
                        opacity: found ? 0.6 : 1,
                      }}
                    >
                      {/* Item image, or emoji fallback */}
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-14 mb-1 object-contain"
                          draggable={false}
                          style={{ filter: found ? 'grayscale(80%)' : 'none' }}
                        />
                      ) : (
                        <div
                          className="text-2xl mb-1.5"
                          style={{ filter: found ? 'grayscale(80%)' : 'none' }}
                        >
                          {item.icon}
                        </div>
                      )}
                      <div
                        className="text-[11px] font-medium text-center leading-tight"
                        style={{ color: found ? '#7EC8A0' : '#4A3728' }}
                      >
                        {item.name}
                      </div>
                      {found && (
                        <div
                          className="absolute inset-0 flex items-center justify-center rounded"
                          style={{ background: 'rgba(126,200,160,0.15)' }}
                        >
                          <span className="text-2xl font-bold" style={{ color: '#7EC8A0' }}>✓</span>
                        </div>
                      )}
                    </div>
                    {/* Subtle divider line between cards (not after last) */}
                    {idx < visibleItems.length - 1 && (
                      <div className="w-[1.5px] self-stretch my-3" style={{ background: 'linear-gradient(180deg, transparent 0%, #C9B896 20%, #D4C4A8 50%, #C9B896 80%, transparent 100%)' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right page arrow - diamond/pointed shape */}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center justify-center w-10 h-10 shrink-0 touch-target"
              style={{ opacity: page >= totalPages - 1 ? 0.3 : 1 }}
            >
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                <path d="M4 2L12 12L4 22" stroke="#E8D5A0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM-RIGHT: 3 Tool buttons with labels - 48px touch targets ===== */}
      <div className="absolute bottom-4 right-4 z-30 flex items-end gap-3 safe-area-bottom safe-area-right">
        {/* 放大镜 (Hint) */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={useHint}
            className="relative w-14 h-14 rounded-full flex items-center justify-center touch-target"
            style={{
              background: 'radial-gradient(circle at 40% 40%, #3A4A6A 0%, #1A2A4E 60%, #0D1520 100%)',
              border: '2.5px solid #6A8AB0',
              boxShadow: '0 3px 10px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)',
            }}
          >
            <span className="text-2xl">🔍</span>
            {/* Number badge */}
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: '#7EC8A0', color: '#fff', border: '1.5px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
            >
              {currentHints}
            </span>
          </button>
          <span className="text-[10px] font-medium" style={{ color: '#F0E6D3', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>放大镜</span>
        </div>

        {/* 生命 (Life) */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => {
              if (currentLives < 3) {
                setCurrentLives((p) => Math.min(3, p + 1));
                toast.success('观看广告成功，+1 生命');
              } else {
                toast.info('生命已满');
              }
            }}
            className="relative w-14 h-14 rounded-full flex items-center justify-center touch-target"
            style={{
              background: 'radial-gradient(circle at 40% 40%, #3A4A6A 0%, #1A2A4E 60%, #0D1520 100%)',
              border: '2.5px solid #6A8AB0',
              boxShadow: '0 3px 10px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)',
            }}
          >
            <span className="text-2xl">❤️</span>
            {/* Number badge */}
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: '#E85D75', color: '#fff', border: '1.5px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
            >
              {currentLives}
            </span>
          </button>
          <span className="text-[10px] font-medium" style={{ color: '#F0E6D3', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>生命</span>
        </div>

        {/* 小刀 (Knife - auto find 3 items) */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={useKnife}
            disabled={knifeAnimating}
            className="relative w-14 h-14 rounded-full flex items-center justify-center touch-target"
            style={{
              background: 'radial-gradient(circle at 40% 40%, #3A4A6A 0%, #1A2A4E 60%, #0D1520 100%)',
              border: '2.5px solid #6A8AB0',
              boxShadow: '0 3px 10px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)',
              opacity: knifeAnimating ? 0.5 : 1,
            }}
          >
            <span className="text-2xl">🗡️</span>
            {/* Number badge */}
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: '#5b8dd9', color: '#fff', border: '1.5px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
            >
              {gameState.items}
            </span>
          </button>
          <span className="text-[10px] font-medium" style={{ color: '#F0E6D3', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>小刀</span>
        </div>
      </div>

      {/* ===== DIALOGS ===== */}

      {/* Start Dialogue */}
      {(() => {
        const SPEAKER_CONFIG: Record<string, { emoji: string; bg: string; nameColor: string; avatarSrc?: string; isNarrator?: boolean }> = {
          '婴宁':     { emoji: '🦊', avatarSrc: '/assets/character-avatar-yingning.png', bg: '#F4A460', nameColor: '#C8601A' },
          '王母':     { emoji: '👩‍💼', avatarSrc: '/assets/character-avatar-wangpo.png', bg: '#8B9DC3', nameColor: '#3A4A7A' },
          '王子服':   { emoji: '🧑', avatarSrc: '/assets/character-avatar-wangzifu.png', bg: '#7BAE84', nameColor: '#2D6B3A' },
          '鬼母':     { emoji: '👻', avatarSrc: '/assets/character-avatar-ghost-mother.png', bg: '#9B7EC8', nameColor: '#5A2D8A' },
          '恶霸':     { emoji: '😤', avatarSrc: '/assets/character-avatar-bully.png', bg: '#C0504D', nameColor: '#7A1A18' },
          '恶奴头目': { emoji: '😠', avatarSrc: '/assets/character-avatar-bully.png', bg: '#D9742A', nameColor: '#8A3A00' },
          '旁白':     { emoji: '📜', bg: '#A0896A', nameColor: '#5A3A1A', isNarrator: true },
          '内心':     { emoji: '💭', bg: '#B0A0C8', nameColor: '#5A4A7A', isNarrator: true },
          '？？？':   { emoji: '❓', avatarSrc: '/assets/character-avatar-lingmei.png', bg: '#808080', nameColor: '#3A3A3A' },
        };
        const cur = level.dialogue[dialogueIndex];
        const cfg = SPEAKER_CONFIG[cur.speaker] ?? { emoji: '👤', bg: '#A89878', nameColor: '#5A3A1A' };
        const isNarrator = !!cfg.isNarrator;
        return (
          <Dialog open={showStartDialogue} onOpenChange={() => {}}>
            <DialogContent
              style={{ background: '#FFF8F2', border: '3px solid #E8C37D', maxWidth: '640px', padding: '20px 24px' }}
              onPointerDownOutside={(e) => e.preventDefault()}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="text-base font-bold" style={{ color: '#4A3728' }}>第 {level.id} 关</div>
                  <div className="text-sm" style={{ color: '#E8C37D' }}>· {level.name}</div>
                </div>
                <div className="text-xs" style={{ color: '#8B7355' }}>
                  {'★'.repeat(Math.min(level.difficulty, 5))}
                  <span style={{ color: '#C4B5A5' }}>{'★'.repeat(Math.max(0, 5 - level.difficulty))}</span>
                </div>
              </div>

              <div className="w-full" style={{ borderTop: '1px solid #E8C37D', marginBottom: '16px' }} />

              {isNarrator ? (
                <div
                  className="rounded-xl p-4 mb-4 text-center italic"
                  style={{ background: 'rgba(168,137,106,0.12)', border: '1px dashed #A0896A', minHeight: '80px' }}
                >
                  <div className="text-xs font-bold mb-2" style={{ color: cfg.nameColor }}>
                    —— {cur.speaker} ——
                  </div>
                  <p className="text-base leading-relaxed" style={{ color: '#4A3728' }}>
                    {cur.text}
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    <div
                      className="flex items-center justify-center rounded-2xl overflow-hidden"
                      style={{
                        width: '88px',
                        height: '110px',
                        background: `linear-gradient(160deg, ${cfg.bg}CC 0%, ${cfg.bg}66 100%)`,
                        border: `2px solid ${cfg.bg}`,
                        boxShadow: `0 4px 12px ${cfg.bg}55`,
                      }}
                    >
                      {cfg.avatarSrc ? (
                        <img
                          src={cfg.avatarSrc}
                          alt={cur.speaker}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        <span className="text-3xl">{cfg.emoji}</span>
                      )}
                    </div>
                    <div className="text-xs font-bold" style={{ color: cfg.nameColor }}>
                      {cur.speaker}
                    </div>
                  </div>

                  <div className="flex-1 relative">
                    <div
                      className="absolute left-0 top-4"
                      style={{
                        width: 0,
                        height: 0,
                        borderTop: '8px solid transparent',
                        borderBottom: '8px solid transparent',
                        borderRight: `10px solid #E8C37D`,
                        transform: 'translateX(-10px)',
                      }}
                    />
                    <div
                      className="rounded-xl p-4"
                      style={{
                        background: '#FFF5EB',
                        border: `2px solid #E8C37D`,
                        minHeight: '110px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <p className="text-base leading-relaxed" style={{ color: '#4A3728' }}>
                        {cur.text}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-1">
                  {level.dialogue.map((_, i) => (
                    <div
                      key={i}
                      className="rounded-full"
                      style={{
                        width: i === dialogueIndex ? '16px' : '6px',
                        height: '6px',
                        background: i === dialogueIndex ? '#E8C37D' : '#C4B5A5',
                        transition: 'width 0.2s',
                      }}
                    />
                  ))}
                </div>
                <div className="text-xs" style={{ color: '#8B7355' }}>
                  {dialogueIndex + 1} / {level.dialogue.length}
                </div>
              </div>

              {dialogueIndex === level.dialogue.length - 1 && (
                <div className="text-center text-xs mb-2" style={{ color: '#8B7355' }}>
                  提示：在场景中点击寻找 {level.items.length} 件物品
                </div>
              )}

              <Button
                onClick={() => {
                  if (dialogueIndex < level.dialogue.length - 1) {
                    setDialogueIndex(dialogueIndex + 1);
                  } else {
                    setShowStartDialogue(false);
                    lastActionRef.current = Date.now();
                  }
                }}
                className="w-full py-5"
                style={{ background: '#E8C37D', color: '#4A3728', border: '2px solid #4A3728', fontWeight: 'bold' }}
              >
                {dialogueIndex < level.dialogue.length - 1 ? '继续 →' : '⚔ 开始寻物'}
              </Button>
            </DialogContent>
          </Dialog>
        );
      })()}

      {/* Level transition cutscene */}
      {showLevelIntroVideo && (
        <div
          className="absolute inset-0 z-40 bg-black flex items-center justify-center cursor-pointer"
          onClick={() => {
            if (levelIntroVideoNeedsStart) {
              void startLevelIntroVideoWithSound();
              return;
            }
            skipLevelIntroVideo();
          }}
        >
          {!levelIntroVideoError && (
            <video
              ref={levelIntroVideoRef}
              src={levelCutscene?.src}
              preload="auto"
              playsInline
              onEnded={finishLevelIntroVideo}
              onError={() => {
                setLevelIntroVideoError(true);
                setTimeout(() => {
                  finishLevelIntroVideo();
                }, 1500);
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {levelIntroVideoNeedsStart && !levelIntroVideoError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35 px-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  void startLevelIntroVideoWithSound();
                }}
                className="px-8 py-4 rounded-xl text-lg font-bold text-center"
                style={{
                  background: 'rgba(24, 24, 24, 0.72)',
                  color: '#FFF5EB',
                  border: '2px solid #E8C37D',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                }}
              >
                点击播放剧情音频
              </button>
            </div>
          )}

          {levelIntroVideoError && (
            <div className="text-center animate-pulse px-6">
              <div className="text-3xl font-bold mb-3" style={{ color: '#E8C37D' }}>
                {levelCutscene?.fallbackTitle ?? '剧情推进'}
              </div>
              <div className="text-sm" style={{ color: '#FFF5EB' }}>
                {levelCutscene?.fallbackBody ?? '过场加载失败，正在继续...'}
              </div>
            </div>
          )}

          <div className="absolute top-5 right-5 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                skipLevelIntroVideo();
              }}
              className="bg-transparent border-none cursor-pointer p-0 hover:scale-105 active:scale-95 transition-transform"
            >
              <img src="/assets/skip-button.png" alt="跳过剧情" className="h-24 md:h-28 w-auto drop-shadow-lg" />
            </button>
          </div>
        </div>
      )}

      {/* Pause Menu */}
      <Dialog open={showPause} onOpenChange={setShowPause}>
        <DialogContent style={{ background: '#FFF8F2', border: '3px solid #E8C37D' }}>
          <div className="text-center text-2xl font-bold mb-4" style={{ color: '#4A3728' }}>
            暂停
          </div>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setShowPause(false)}
              style={{ background: '#E8C37D', color: '#4A3728' }}
            >
              继续游戏
            </Button>
            <Button
              onClick={retry}
              variant="outline"
              style={{ borderColor: '#E8C37D', color: '#4A3728' }}
            >
              重新开始
            </Button>
            <Button
              onClick={() => navigate('/levels')}
              variant="outline"
              style={{ borderColor: '#E85D75', color: '#E85D75' }}
            >
              退出关卡
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={!!showResult} onOpenChange={() => {}}>
        <DialogContent
          style={{ background: '#FFF8F2', border: '3px solid #E8C37D', maxWidth: '500px' }}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          {showResult === 'win' ? (
            <div className="text-center py-3">
              <div className="text-6xl mb-3">🎉</div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#E8C37D' }}>
                关卡通过！
              </div>
              <div className="text-lg mb-3" style={{ color: '#4A3728' }}>
                {level.name}
              </div>
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className="text-4xl"
                    style={{
                      color: i < (currentLives === 3 ? 3 : currentLives === 2 ? 2 : 1) ? '#E8C37D' : '#C4B5A5',
                      animation: `starPop 0.4s ease-out ${i * 0.2}s both`,
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div
                className="rounded-xl p-3 mb-4"
                style={{ background: '#FFF5EB', border: '1px solid #E8C37D' }}
              >
                <div className="text-sm leading-relaxed" style={{ color: '#4A3728' }}>
                  {level.story}
                </div>
                <div className="mt-2 text-sm font-bold" style={{ color: '#E8C37D' }}>
                  💰 +100 金币
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate('/levels')}
                  variant="outline"
                  className="flex-1"
                  style={{ borderColor: '#E8C37D', color: '#4A3728' }}
                >
                  章节目录
                </Button>
                {level.id < LEVELS.length && (
                  <Button
                    onClick={nextLevel}
                    className="flex-1"
                    style={{ background: '#E8C37D', color: '#4A3728', border: '2px solid #4A3728' }}
                  >
                    下一关 →
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-3">
              <div className="text-6xl mb-3">💔</div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#E85D75' }}>
                关卡失败
              </div>
              <div className="text-sm mb-4" style={{ color: '#8B7355' }}>
                生命耗尽，但秘境之路从不止步
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setShowReviveAd(true)}
                  className="py-5"
                  style={{ background: '#E85D75', color: '#FFF8F2', border: 'none' }}
                >
                  📺 看广告复活 +3 生命
                </Button>
                <Button
                  onClick={retry}
                  variant="outline"
                  style={{ borderColor: '#E8C37D', color: '#4A3728' }}
                >
                  重新挑战
                </Button>
                <Button
                  onClick={() => navigate('/levels')}
                  variant="outline"
                  style={{ borderColor: '#C4B5A5', color: '#8B7355' }}
                >
                  退出
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Placeholder Revive Ad Dialog */}
      <Dialog open={showReviveAd} onOpenChange={setShowReviveAd}>
        <DialogContent
          style={{ background: '#FFF8F2', border: '3px solid #E8C37D', maxWidth: '460px' }}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="text-center py-2">
            <div className="text-2xl font-bold mb-2" style={{ color: '#4A3728' }}>
              广告播放中
            </div>
            <div className="text-sm mb-4" style={{ color: '#8B7355' }}>
              占位广告弹窗，后续可替换为真实广告 SDK
            </div>

            <div
              className="rounded-2xl p-5 mb-4 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1E2D48 0%, #2B3A52 55%, #3A4A6A 100%)',
                border: '2px solid #C9A84C',
              }}
            >
              <div className="text-xs tracking-[0.3em] mb-3" style={{ color: '#E8D5A0' }}>
                SPONSORED
              </div>
              <div className="text-5xl mb-3">📺</div>
              <div className="text-xl font-bold mb-2" style={{ color: '#FFF8F2' }}>
                神秘商铺限时补给
              </div>
              <div className="text-sm leading-relaxed" style={{ color: '#E8D5A0' }}>
                这里是广告占位内容。接入真实广告平台后，可在此展示激励视频或品牌推广素材。
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1" style={{ color: '#8B7355' }}>
                <span>播放进度</span>
                <span>{reviveAdCountdown > 0 ? `${5 - reviveAdCountdown}/5 秒` : '已完成'}</span>
              </div>
              <div
                className="w-full h-3 rounded-full overflow-hidden"
                style={{ background: '#F0E8DA', border: '1px solid #E8C37D' }}
              >
                <div
                  className="h-full transition-all duration-1000"
                  style={{
                    width: `${((5 - reviveAdCountdown) / 5) * 100}%`,
                    background: 'linear-gradient(90deg, #E8C37D 0%, #E85D75 100%)',
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowReviveAd(false)}
                variant="outline"
                className="flex-1"
                style={{ borderColor: '#C4B5A5', color: '#8B7355' }}
              >
                关闭
              </Button>
              <Button
                onClick={reviveByAd}
                disabled={reviveAdCountdown > 0}
                className="flex-1"
                style={{
                  background: reviveAdCountdown > 0 ? '#C4B5A5' : '#E85D75',
                  color: '#FFF8F2',
                  border: 'none',
                }}
              >
                {reviveAdCountdown > 0 ? `请等待 ${reviveAdCountdown}s` : '领取复活 +3 生命'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== Buy Hint Dialog ===== */}
      <Dialog open={showBuyHint} onOpenChange={(open) => { setShowBuyHint(open); if (!open) setBuyHintQty(1); }}>
        <DialogContent
          style={{ background: '#FFF8F2', border: '3px solid #E8C37D', maxWidth: '400px' }}
        >
          <div className="text-center py-2">
            <div className="text-5xl mb-3">🔍</div>
            <div className="text-xl font-bold mb-2" style={{ color: '#4A3728' }}>
              购买放大镜
            </div>
            <div className="text-sm mb-4" style={{ color: '#8B7355' }}>
              放大镜可高亮显示一个隐藏物品的位置
            </div>
            <div
              className="rounded-xl p-4 mb-4"
              style={{ background: '#FFF5EB', border: '1px solid #E8C37D' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔍</span>
                  <span className="text-base font-bold" style={{ color: '#4A3728' }}>放大镜</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, #E8C37D 0%, #C9A84C 40%, #8B6914 100%)',
                      border: '2px solid #F5DBA3',
                    }}
                  >
                    <span className="text-xs font-bold" style={{ color: '#4A2800' }}>¥</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: '#E8C37D' }}>500/个</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setBuyHintQty(Math.max(1, buyHintQty - 1))}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
                  style={{ background: '#E8C37D', color: '#4A3728', border: '2px solid #C9A84C' }}
                >
                  −
                </button>
                <span className="text-2xl font-bold w-10 text-center" style={{ color: '#4A3728' }}>{buyHintQty}</span>
                <button
                  onClick={() => setBuyHintQty(Math.min(10, buyHintQty + 1))}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
                  style={{ background: '#E8C37D', color: '#4A3728', border: '2px solid #C9A84C' }}
                >
                  +
                </button>
              </div>
              <div className="text-sm mt-2 font-bold" style={{ color: '#4A3728' }}>
                合计：<span style={{ color: '#E8C37D' }}>{500 * buyHintQty}</span> 金币
              </div>
            </div>
            <div className="text-xs mb-3" style={{ color: '#8B7355' }}>
              当前金币：<span className="font-bold" style={{ color: '#E8C37D' }}>{gameState.coins}</span>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => { setShowBuyHint(false); setBuyHintQty(1); }}
                variant="outline"
                className="flex-1"
                style={{ borderColor: '#C4B5A5', color: '#8B7355' }}
              >
                取消
              </Button>
              <Button
                onClick={buyHintWithCoins}
                className="flex-1"
                disabled={gameState.coins < 500 * buyHintQty}
                style={{
                  background: gameState.coins >= 500 * buyHintQty ? '#E8C37D' : '#C4B5A5',
                  color: '#4A3728',
                  border: '2px solid #4A3728',
                }}
              >
                确认购买
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== Buy Knife Dialog ===== */}
      <Dialog open={showBuyKnife} onOpenChange={(open) => { setShowBuyKnife(open); if (!open) setBuyKnifeQty(1); }}>
        <DialogContent
          style={{ background: '#FFF8F2', border: '3px solid #E8C37D', maxWidth: '400px' }}
        >
          <div className="text-center py-2">
            <div className="text-5xl mb-3">🗡️</div>
            <div className="text-xl font-bold mb-2" style={{ color: '#4A3728' }}>
              购买小刀
            </div>
            <div className="text-sm mb-4" style={{ color: '#8B7355' }}>
              小刀可自动找到3个隐藏物品
            </div>
            <div
              className="rounded-xl p-4 mb-4"
              style={{ background: '#FFF5EB', border: '1px solid #E8C37D' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🗡️</span>
                  <span className="text-base font-bold" style={{ color: '#4A3728' }}>小刀</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xl" style={{ filter: 'drop-shadow(0 0 4px rgba(100,200,255,0.6))' }}>💎</span>
                  <span className="text-lg font-bold" style={{ color: '#5b8dd9' }}>1/个</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setBuyKnifeQty(Math.max(1, buyKnifeQty - 1))}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
                  style={{ background: '#5b8dd9', color: '#fff', border: '2px solid #3a6bb5' }}
                >
                  −
                </button>
                <span className="text-2xl font-bold w-10 text-center" style={{ color: '#4A3728' }}>{buyKnifeQty}</span>
                <button
                  onClick={() => setBuyKnifeQty(Math.min(10, buyKnifeQty + 1))}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
                  style={{ background: '#5b8dd9', color: '#fff', border: '2px solid #3a6bb5' }}
                >
                  +
                </button>
              </div>
              <div className="text-sm mt-2 font-bold" style={{ color: '#4A3728' }}>
                合计：<span style={{ color: '#5b8dd9' }}>{1 * buyKnifeQty}</span> 钻石
              </div>
            </div>
            <div className="text-xs mb-3" style={{ color: '#8B7355' }}>
              当前钻石：<span className="font-bold" style={{ color: '#5b8dd9' }}>{gameState.diamonds || 0}</span>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => { setShowBuyKnife(false); setBuyKnifeQty(1); }}
                variant="outline"
                className="flex-1"
                style={{ borderColor: '#C4B5A5', color: '#8B7355' }}
              >
                取消
              </Button>
              <Button
                onClick={buyKnifeWithDiamonds}
                className="flex-1"
                disabled={(gameState.diamonds || 0) < 1 * buyKnifeQty}
                style={{
                  background: (gameState.diamonds || 0) >= 1 * buyKnifeQty ? '#5b8dd9' : '#C4B5A5',
                  color: '#fff',
                  border: '2px solid #3a6bb5',
                }}
              >
                确认购买
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes pulseHint {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes magnetGlow {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
        }
        @keyframes successBurst {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        @keyframes petalBurst {
          0% { transform: rotate(var(--rotation)) translateY(0) scale(0); opacity: 1; }
          100% { transform: rotate(var(--rotation)) translateY(-60px) scale(1); opacity: 0; }
        }
        @keyframes errorShake {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          25% { transform: translate(-50%, -50%) rotate(-15deg); }
          75% { transform: translate(-50%, -50%) rotate(15deg); }
        }
        @keyframes petalFall {
          0% { transform: translateY(-30px) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        @keyframes starPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
    </GameCanvas>
  );
};

export default GameLevel;
