
import React, { useState } from 'react';
import { generateProImage, enhanceImagePrompt } from '../services/geminiService';
import { ImageResolution } from '../types';

export const ProImageGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<ImageResolution>(ImageResolution.RES_1K);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const templates = [
    { label: 'Fotorealista', value: 'fotografia realista, 8k, alta resolução, iluminação natural, detalhado' },
    { label: 'Cinematográfico', value: 'visual cinematográfico, iluminação dramática, profundidade de campo, 4k, color grading' },
    { label: 'Estúdio', value: 'iluminação de estúdio profissional, fundo infinito, foco nítido, produto comercial' },
    { label: 'Neon Cyberpunk', value: 'estilo cyberpunk, luzes neon, futurista, vibrante, alto contraste' },
    { label: 'Minimalista', value: 'design minimalista, cores pastéis, limpo, moderno, espaço negativo' },
    { label: '3D Render', value: 'renderização 3D, octane render, texturas detalhadas, ray tracing, unreal engine' }
  ];

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setGeneratedImage(null);
    try {
      const imgBase64 = await generateProImage(prompt, resolution);
      setGeneratedImage(imgBase64);
    } catch (error) {
      console.error(error);
      alert('Falha ao gerar imagem. Verifique se você selecionou uma chave de API válida.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt) return;
    setEnhancing(true);
    try {
      const enhanced = await enhanceImagePrompt(prompt);
      setPrompt(enhanced);
    } catch (error) {
      console.error("Erro ao melhorar prompt", error);
    } finally {
      setEnhancing(false);
    }
  };

  const applyTemplate = (templateSuffix: string) => {
    setPrompt(prev => {
      const cleanPrev = prev.trim();
      if (!cleanPrev) return templateSuffix;
      return `${cleanPrev}, ${templateSuffix}`;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-royal-800 rounded-2xl border border-royal-700 overflow-hidden">
        <div className="p-4 md:p-8 border-b border-royal-700 bg-gradient-to-r from-royal-800 to-royal-900">
          <div className="flex items-center mb-6">
             <div className="p-3 bg-neon-purple/20 rounded-xl mr-4 shrink-0">
                 <i className="fas fa-crown text-2xl text-neon-purple"></i>
             </div>
             <div>
                 <h2 className="text-xl md:text-2xl font-bold text-white">Estúdio de Imagem Pro</h2>
                 <p className="text-xs md:text-sm text-gray-400">Desenvolvido com Gemini 3 Pro Image Preview</p>
             </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Descreva sua obra-prima..."
                    className="w-full bg-royal-900 border border-royal-700 rounded-xl pl-4 pr-12 py-3 text-white focus:border-neon-purple outline-none text-sm md:text-base"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button 
                    onClick={handleEnhancePrompt}
                    disabled={!prompt || enhancing}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neon-purple hover:bg-neon-purple/10 rounded-full transition-all"
                    title="Melhorar prompt com IA"
                >
                    <i className={`fas fa-magic ${enhancing ? 'fa-spin' : ''}`}></i>
                </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {templates.map((t) => (
                    <button
                        key={t.label}
                        onClick={() => applyTemplate(t.value)}
                        className="px-3 py-1 bg-royal-900 hover:bg-royal-700 border border-royal-700 rounded-full text-xs text-gray-300 whitespace-nowrap transition-colors"
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <select 
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value as ImageResolution)}
                    className="bg-royal-900 border border-royal-700 rounded-xl px-4 py-3 text-white outline-none flex-1 md:flex-none text-sm md:text-base"
                >
                    <option value={ImageResolution.RES_1K}>Resolução 1K</option>
                    <option value={ImageResolution.RES_2K}>Resolução 2K</option>
                    <option value={ImageResolution.RES_4K}>Resolução 4K</option>
                </select>
                
                <button 
                    onClick={handleGenerate}
                    disabled={loading || !prompt}
                    className="flex-1 bg-neon-purple hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center"
                >
                    {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <span>Gerar <i className="fas fa-magic ml-2"></i></span>}
                </button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 min-h-[300px] md:min-h-[400px] flex items-center justify-center bg-black/40">
            {generatedImage ? (
                <div className="relative group w-full">
                    <img src={generatedImage} alt="Generated" className="w-full rounded-lg shadow-2xl shadow-neon-purple/20" />
                    <a 
                        href={generatedImage} 
                        download="vitrine-pro-image.png"
                        className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-full font-bold opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg text-sm"
                    >
                        <i className="fas fa-download mr-2"></i> Baixar
                    </a>
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    <i className="fas fa-image text-6xl mb-4 opacity-20"></i>
                    <p>Digite um prompt ou selecione um estilo para começar.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
