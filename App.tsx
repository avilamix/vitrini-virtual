
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import React, { useState } from 'react';
import { WeeklyContent } from './components/WeeklyContent';
import { AdCreative } from './components/AdCreative';
import { Trends } from './components/Trends';
import { ProImageGen } from './components/ProImageGen';
import { VeoVideoGen } from './components/VeoVideoGen';
import { AvatarAnalysis } from './components/AvatarAnalysis';
import { Settings } from './components/Settings';

const App: React.FC = () => {
  const [currentView, setView] = useState('dashboard');
type View =
  | 'dashboard'
  | 'avatar'
  | 'content'
  | 'ads'
  | 'trends'
  | 'pro-images'
  | 'veo'
  | 'calendar'
  | 'settings';

const titles: Record<View | string, string> = {
  dashboard: 'Painel',
  avatar: 'Novo Avatar',
  content: 'Conteúdo Semanal',
  ads: 'Anúncios',
  trends: 'Tendências',
  'pro-images': 'Imagens Pro',
  veo: 'Estúdio de Vídeo',
  calendar: 'Agendamento',
  settings: 'Configurações API',
};

const App: React.FC = () => {
  const [currentView, setView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleSetView = (view: View) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  const getTitle = (view: View | string) => titles[view] || 'Vitrine Virtual';

  // Leitura segura da chave (Vite: prefixar com VITE_ para expor ao cliente)
  const geminiKey = (import.meta as any)?.env?.VITE_GEMINI_API_KEY ?? '';

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setView={handleSetView} />;
      case 'avatar':
        return <AvatarAnalysis />;
      case 'content':
        return <WeeklyContent />;
      case 'ads':
        return <AdCreative />;
      case 'trends':
        return <Trends />;
      case 'pro-images':
        return <ProImageGen />;
      case 'veo':
        return <VeoVideoGen />;
      case 'settings':
        return <Settings />;
      case 'calendar':
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <i className="fas fa-calendar-alt text-6xl mb-4" />
              <p>Módulo de Calendário em Breve</p>
            </div>
          </div>
        );
      default:
        return <Dashboard setView={handleSetView} />;
    }
  };

  return (
    <div className="min-h-screen bg-royal-900 text-white font-sans flex">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        currentView={currentView}
        setView={handleSetView}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen scrollbar-hide transition-all duration-300">
        <header className="flex justify-between items-center mb-8 sticky top-0 bg-royal-900/90 backdrop-blur-sm py-4 z-30">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-white text-xl w-10 h-10 flex items-center justify-center rounded-lg bg-royal-800"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <i className="fas fa-bars" />
            </button>

            <h2 className="text-xl font-medium text-gray-300 capitalize">
              {getTitle(currentView)}
            </h2>

            {/* Aviso discreto se a chave de API não estiver configurada */}
            {!geminiKey && (
              <span className="text-sm text-yellow-400 ml-4">GEMINI API key não configurada</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-royal-800 hover:bg-royal-700 flex items-center justify-center transition-colors relative" aria-label="Notificações">
              <span className="absolute top-2 right-2 w-2 h-2 bg-neon-pink rounded-full" />
              <i className="fas fa-bell text-gray-300" />
            </button>
          </div>
        </header>

        <div className="pb-20 md:pb-0">{renderView()}</div>
      </main>
    </div>
  );
};

export default App;
