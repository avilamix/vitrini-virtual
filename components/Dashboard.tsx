
import React from 'react';

interface DashboardProps {
  setView: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const stats = [
    { label: 'Posts Agendados', value: '12', color: 'text-neon-blue' },
    { label: 'Aprovação Pendente', value: '4', color: 'text-yellow-400' },
    { label: 'Tendências Detectadas', value: '89', color: 'text-neon-pink' },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="bg-gradient-to-r from-royal-800 to-indigo-900 rounded-3xl p-6 md:p-8 shadow-lg border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <i className="fas fa-rocket text-9xl text-white"></i>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Olá, Bem-vindo(a) à Vitrine Virtual!</h2>
        <p className="text-gray-300 max-w-xl text-sm md:text-base">Seu assistente de marketing com IA está pronto. O que você gostaria de criar hoje?</p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setView('content')}
            className="bg-neon-purple hover:bg-purple-600 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-neon-purple/20 text-center"
          >
            Criar Conteúdo Semanal
          </button>
          <button 
            onClick={() => setView('veo')}
            className="bg-royal-900 hover:bg-royal-800 px-6 py-3 rounded-xl font-bold transition-all border border-neon-blue text-neon-blue text-center"
          >
            Estúdio de Vídeo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-royal-800 p-4 md:p-6 rounded-2xl border border-royal-700">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{s.label}</h3>
            <p className={`text-3xl md:text-4xl font-bold mt-2 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-royal-800 p-4 md:p-6 rounded-2xl border border-royal-700">
        <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg md:text-xl font-bold">Atividades Recentes</h3>
             <button className="text-sm text-neon-blue hover:underline">Ver Tudo</button>
        </div>
        <div className="space-y-4">
             {[1,2,3].map((_, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 bg-royal-900/50 rounded-xl">
                     <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                         <i className="fas fa-check"></i>
                     </div>
                     <div className="flex-1 min-w-0">
                         <p className="font-medium text-white truncate">Conteúdo aprovado para Instagram</p>
                         <p className="text-xs text-gray-500">há 2 horas</p>
                     </div>
                     <span className="text-xs bg-royal-800 px-2 py-1 rounded text-gray-300 shrink-0">Publicado</span>
                 </div>
             ))}
        </div>
      </div>
    </div>
  );
};
