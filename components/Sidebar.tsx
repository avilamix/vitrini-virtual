
import React from 'react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'dashboard', icon: 'fa-home', label: 'Painel' },
  { id: 'avatar', icon: 'fa-fingerprint', label: 'Novo Avatar' },
  { id: 'content', icon: 'fa-pen-nib', label: 'Conteúdo Semanal' },
  { id: 'ads', icon: 'fa-bullhorn', label: 'Anúncios' },
  { id: 'trends', icon: 'fa-chart-line', label: 'Tendências' },
  { id: 'veo', icon: 'fa-film', label: 'Estúdio de Vídeo (Veo)' },
  { id: 'pro-images', icon: 'fa-image', label: 'Imagens Pro' },
  { id: 'settings', icon: 'fa-cog', label: 'Configurações' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, onClose }) => {
  return (
    <div className={`
      fixed top-0 left-0 h-screen w-64 bg-royal-900 border-r border-royal-800 z-50 flex flex-col
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0
    `}>
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
          VITRINE<br/>VIRTUAL
        </h1>
        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id
                ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50'
                : 'text-gray-400 hover:bg-royal-800 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} w-6 text-center`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-royal-800">
        <div className="flex items-center space-x-3 p-2 rounded-lg bg-royal-800/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-purple-600 flex items-center justify-center">
            <i className="fas fa-user text-white"></i>
          </div>
          <div className="text-sm">
            <p className="text-white font-medium">Business Pro</p>
            <p className="text-gray-400 text-xs">Plano Premium</p>
          </div>
        </div>
      </div>
    </div>
  );
};
