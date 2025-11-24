
import React, { useState, useEffect } from 'react';
import { getStoredApiKey, setStoredApiKey, removeStoredApiKey } from '../services/geminiService';

export const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = getStoredApiKey();
    if (stored) {
      setApiKey(stored);
      setSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) return;
    setStoredApiKey(apiKey.trim());
    setSaved(true);
    alert('Chave API salva com sucesso! Todos os módulos agora usarão esta chave.');
  };

  const handleRemove = () => {
    removeStoredApiKey();
    setApiKey('');
    setSaved(false);
    alert('Chave API removida.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-royal-800 rounded-2xl border border-royal-700 p-6 md:p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-neon-blue/20 rounded-xl">
            <i className="fas fa-key text-2xl text-neon-blue"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Configuração de API</h2>
            <p className="text-gray-400 text-sm">Gerencie sua conexão com o Google Gemini</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-royal-900/50 p-4 rounded-xl border border-royal-700 text-sm text-gray-300">
            <p className="mb-2"><i className="fas fa-info-circle text-neon-blue mr-2"></i> Por que preciso disso?</p>
            <p>
              Para usar as funcionalidades avançadas do Vitrine Virtual (geração de textos, imagens Pro e vídeos Veo), 
              você precisa de uma Chave de API do Google AI Studio.
            </p>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-3 text-neon-pink hover:underline"
            >
              Obter chave no Google AI Studio <i className="fas fa-external-link-alt text-xs ml-1"></i>
            </a>
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Sua Chave de API (Google Gemini)</label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setSaved(false);
                }}
                placeholder="AIzaSy..."
                className="w-full bg-royal-900 border border-royal-600 rounded-xl p-4 pr-12 text-white focus:border-neon-blue outline-none font-mono transition-colors"
              />
              {saved && (
                <i className="fas fa-check-circle text-green-500 absolute right-4 top-1/2 -translate-y-1/2 text-xl"></i>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-neon-blue hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-neon-blue/20"
            >
              <i className="fas fa-save mr-2"></i> Salvar Configuração
            </button>
            
            {saved && (
              <button
                onClick={handleRemove}
                className="px-6 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 rounded-xl font-bold transition-all"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            )}
          </div>

          {saved && (
            <div className="flex items-center justify-center text-green-400 text-sm mt-4 animate-fade-in">
              <i className="fas fa-shield-alt mr-2"></i> API Key ativa e segura localmente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
