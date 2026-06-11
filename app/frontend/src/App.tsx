import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Intro from './pages/Intro';
import IdentitySelect from './pages/IdentitySelect';
import MainMenu from './pages/MainMenu';
import LevelSelect from './pages/LevelSelect';
import GameLevel from './pages/GameLevel';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/identity" element={<IdentitySelect />} />
          <Route path="/menu" element={<MainMenu />} />
          <Route path="/levels" element={<LevelSelect />} />
          <Route path="/play/:levelId" element={<GameLevel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;