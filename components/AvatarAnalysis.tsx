
import React, { useState } from 'react';
import { generateAvatarAnalysis } from '../services/geminiService';
import { AvatarAnalysis as AvatarType } from '../types';

export const AvatarAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [productInput, setProductInput] = useState('');
  const [analysis, setAnalysis] = useState<AvatarType | null>(null);

  const handleAnalyze = async () => {
    if (!productInput) return;
    setLoading(true);
    try {
      const result = await generateAvatarAnalysis(productInput);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      alert('Erro ao analisar avatar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-royal-800 to-royal-900 p-4 md:p-8 rounded-3xl border border-royal-700 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl"></div>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Análise de Neuromarketing
        </h2>
        <p className="text-gray-300 mb-6 max-w-2xl text-sm md:text-base">
          Descubra as dores ocultas e os sonhos secretos do seu cliente ideal. Nossa IA cria um perfil psicológico profundo e sugere criativos baseados em emoção.
        </p>

        <div className="space-y-4">
          <textarea
            className="w-full bg-royal-900/80 border border-royal-600 rounded-xl p-4 text-white placeholder-gray-500 focus:border-neon-purple outline-none min-h-[120px] text-sm md:text-base"
            placeholder="Descreva seu produto ou serviço detalhadamente (ex: Tênis de corrida com amortecimento extra para maratonistas iniciantes...)"
            value={productInput}
            onChange={(e) => setProductInput(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !productInput}
            className="bg-neon-purple hover:bg-purple-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-neon-purple/20 w-full md:w-auto flex items-center justify-center gap-2"
          >
            {loading ? (
              <><i className="fas fa-brain fa-spin"></i> Analisando...</>
            ) : (
              <><i className="fas fa-fingerprint"></i> Revelar Avatar Perfeito</>
            )}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="animate-fade-in space-y-6 md:space-y-8">
          {/* Avatar Profile Card */}
          <div className="bg-royal-800 rounded-2xl border-l-4 border-neon-blue p-4 md:p-6 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">👤 {analysis.avatarName}</h3>
                <p className="text-neon-blue text-xs md:text-sm font-medium uppercase tracking-wide">Perfil Comportamental</p>
              </div>
              <div className="w-12 h-12 bg-neon-blue/20 rounded-full flex items-center justify-center shrink-0">
                <i className="fas fa-user-astronaut text-neon-blue text-xl"></i>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-royal-900/50 p-4 rounded-xl">
                  <span className="text-gray-400 text-xs font-bold uppercase block mb-2">Quem é</span>
                  <p className="text-gray-200 text-sm">{analysis.profile}</p>
                </div>
                <div className="bg-royal-900/50 p-4 rounded-xl border border-red-500/20">
                  <span className="text-red-400 text-xs font-bold uppercase block mb-2"><i className="fas fa-fire mr-1"></i> A Dor Oculta (Pain)</span>
                  <p className="text-gray-200 text-sm italic">"{analysis.pain}"</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-royal-900/50 p-4 rounded-xl border border-yellow-500/20">
                  <span className="text-yellow-400 text-xs font-bold uppercase block mb-2"><i className="fas fa-star mr-1"></i> O Sonho Secreto (Dream)</span>
                  <p className="text-gray-200 text-sm italic">"{analysis.dream}"</p>
                </div>
                <div className="bg-royal-900/50 p-4 rounded-xl">
                  <span className="text-neon-purple text-xs font-bold uppercase block mb-2"><i className="fas fa-bolt mr-1"></i> Gatilho Emocional</span>
                  <p className="text-gray-200 text-sm">{analysis.trigger}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Creative Angles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Relief Angle */}
            <div className="bg-royal-800 rounded-2xl border border-royal-700 p-4 md:p-6 hover:border-red-400/50 transition-colors">
              <div className="mb-4 flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg text-red-400"><i className="fas fa-heart-broken"></i></div>
                <h4 className="font-bold text-lg text-white">Alívio Imediato</h4>
              </div>
              <div className="space-y-4">
                <div className="text-sm">
                  <span className="text-gray-500 block text-xs uppercase mb-1">Hook (3 segundos)</span>
                  <p className="text-white font-medium bg-royal-900 p-3 rounded-lg border-l-2 border-red-500">{analysis.angleRelief.hook}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500 block text-xs uppercase mb-1">A Promessa</span>
                  <p className="text-gray-300">{analysis.angleRelief.promise}</p>
                </div>
                <div className="text-sm">
                   <span className="text-gray-500 block text-xs uppercase mb-1">Copy Sugerida</span>
                   <p className="text-gray-400 italic bg-royal-900/50 p-3 rounded-lg">{analysis.angleRelief.copy}</p>
                </div>
              </div>
            </div>

            {/* Happiness Angle */}
            <div className="bg-royal-800 rounded-2xl border border-royal-700 p-4 md:p-6 hover:border-green-400/50 transition-colors">
              <div className="mb-4 flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><i className="fas fa-smile-beam"></i></div>
                <h4 className="font-bold text-lg text-white">Felicidade & Transformação</h4>
              </div>
              <div className="space-y-4">
                <div className="text-sm">
                  <span className="text-gray-500 block text-xs uppercase mb-1">Hook (3 segundos)</span>
                  <p className="text-white font-medium bg-royal-900 p-3 rounded-lg border-l-2 border-green-500">{analysis.angleHappiness.hook}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500 block text-xs uppercase mb-1">A Jornada</span>
                  <p className="text-gray-300">{analysis.angleHappiness.journey}</p>
                </div>
                <div className="text-sm">
                   <span className="text-gray-500 block text-xs uppercase mb-1">Copy Sugerida</span>
                   <p className="text-gray-400 italic bg-royal-900/50 p-3 rounded-lg">{analysis.angleHappiness.copy}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Prompt */}
          <div className="bg-gradient-to-r from-purple-900/40 to-royal-900 p-4 md:p-6 rounded-2xl border border-neon-purple/30">
             <h4 className="text-neon-purple font-bold mb-3 flex items-center gap-2">
               <i className="fas fa-image"></i> Sugestão Visual (Prompt para IA)
             </h4>
             <div className="bg-royal-900 p-4 rounded-xl border border-royal-700 text-gray-300 text-sm font-mono">
               {analysis.imagePrompt}
             </div>
             <div className="mt-4 flex justify-end">
                <button 
                  className="text-xs flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => navigator.clipboard.writeText(analysis.imagePrompt)}
                >
                  <i className="fas fa-copy"></i> Copiar Prompt
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
