import { useState, useCallback } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import SplashScreen from '@/components/SplashScreen';
import LevelLoader from '@/components/LevelLoader';
import PageTransition from '@/components/PageTransition';
import Index from './pages/Index';
import Intro from './pages/Intro';
import IdentitySelect from './pages/IdentitySelect';
import MainMenu from './pages/MainMenu';
import LevelSelect from './pages/LevelSelect';
import GameLevel from './pages/GameLevel';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

// Wrapper that forces GameLevel to remount when levelId changes
const GameLevelWrapper = () => {
  const { levelId } = useParams();
  const numericLevelId = Number(levelId);
  return (
    <LevelLoader levelId={numericLevelId}>
      <GameLevel key={levelId} />
    </LevelLoader>
  );
};

const App = () => {
  const [assetsReady, setAssetsReady] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setAssetsReady(true);
  }, []);

  if (!assetsReady) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PageTransition><Index /></PageTransition>} />
            <Route path="/intro" element={<PageTransition><Intro /></PageTransition>} />
            <Route path="/identity" element={<PageTransition><IdentitySelect /></PageTransition>} />
            <Route path="/menu" element={<PageTransition><MainMenu /></PageTransition>} />
            <Route path="/levels" element={<PageTransition><LevelSelect /></PageTransition>} />
            <Route path="/play/:levelId" element={<PageTransition><GameLevelWrapper /></PageTransition>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
