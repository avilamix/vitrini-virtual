
import React, { useState } from 'react';
import { generateWeeklyContent, generateStandardImage } from '../services/geminiService';
import { Post } from '../types';

export const WeeklyContent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [formData, setFormData] = useState({
    business: '',
    segment: '',
    city: '',
    tone: 'Profissional',
    style: 'Moderno',
    count: 3
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const results = await generateWeeklyContent(
        formData.business,
        formData.segment,
        formData.city,
        formData.tone,
        formData.style,
        formData.count
      );
      setPosts(results.map((p: any, i: number) => ({ ...p, id: `post-${i}` })));
    } catch (error) {
      console.error(error);
      alert('Falha ao gerar conteúdo');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async (postId: string, prompt: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isGeneratingImage: true } : p));
    try {
      const imageUrl = await generateStandardImage(prompt);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, imageUrl, isGeneratingImage: false } : p));
    } catch (e) {
      console.error(e);
      alert("Falha na geração da imagem");
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, isGeneratingImage: false } : p));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
      <div className="bg-royal-800/50 p-4 md:p-6 rounded-2xl border border-royal-800">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Gerador de Conteúdo Semanal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Nome do Negócio"
            className="bg-royal-900 border border-royal-800 rounded-lg p-3 focus:border-neon-purple outline-none text-sm md:text-base"
            onChange={e => setFormData({...formData, business: e.target.value})}
          />
          <input
            placeholder="Segmento (ex: Moda, Comida)"
            className="bg-royal-900 border border-royal-800 rounded-lg p-3 focus:border-neon-purple outline-none text-sm md:text-base"
            onChange={e => setFormData({...formData, segment: e.target.value})}
          />
          <input
            placeholder="Cidade"
            className="bg-royal-900 border border-royal-800 rounded-lg p-3 focus:border-neon-purple outline-none text-sm md:text-base"
            onChange={e => setFormData({...formData, city: e.target.value})}
          />
          <select
            className="bg-royal-900 border border-royal-800 rounded-lg p-3 focus:border-neon-purple outline-none text-sm md:text-base"
            onChange={e => setFormData({...formData, tone: e.target.value})}
          >
            <option>Profissional</option>
            <option>Amigável</option>
            <option>Divertido</option>
            <option>Urgente</option>
          </select>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-neon-blue to-neon-purple py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Gerar Estratégia'}
        </button>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-royal-800 p-4 md:p-6 rounded-2xl border border-royal-800 flex flex-col md:flex-row gap-6">
             <div className="w-full md:w-1/3 space-y-3">
                <div className="aspect-square bg-royal-900 rounded-xl flex items-center justify-center overflow-hidden relative">
                    {post.isGeneratingImage ? (
                        <div className="text-neon-purple flex flex-col items-center animate-pulse">
                            <i className="fas fa-circle-notch fa-spin text-3xl mb-2"></i>
                            <span className="text-sm">Criando Arte...</span>
                        </div>
                    ) : post.imageUrl ? (
                        <img src={post.imageUrl} alt="Generated" className="w-full h-full object-cover" />
                    ) : (
                        <button 
                            onClick={() => handleGenerateImage(post.id, post.imagePrompt)}
                            className="text-center p-4 hover:text-neon-blue transition-colors group w-full h-full flex flex-col items-center justify-center"
                        >
                            <i className="fas fa-magic text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
                            <p className="text-sm">Gerar Imagem IA</p>
                        </button>
                    )}
                </div>
             </div>
             <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg md:text-xl font-bold text-white">{post.title}</h3>
                    <span className="bg-neon-purple/20 text-neon-purple text-xs px-2 py-1 rounded whitespace-nowrap ml-2">Rascunho</span>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{post.text}</p>
                <div className="flex flex-wrap gap-2">
                    {post.hashtags.map((tag, i) => (
                        <span key={i} className="text-neon-blue text-xs">#{tag}</span>
                    ))}
                </div>

                <div className="mt-3 p-3 bg-royal-900 rounded-lg border border-royal-800">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Prompt de Imagem</span>
                        <button 
                            onClick={() => handleGenerateImage(post.id, post.imagePrompt)}
                            disabled={post.isGeneratingImage || !!post.imageUrl}
                            className={`text-xs px-3 py-1 rounded border transition-all flex items-center justify-center gap-2 ${
                                post.imageUrl 
                                ? 'border-green-500 text-green-500 cursor-default'
                                : 'border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white'
                            }`}
                        >
                            {post.isGeneratingImage ? (
                                <><i className="fas fa-spinner fa-spin"></i> Gerando...</>
                            ) : post.imageUrl ? (
                                <><i className="fas fa-check"></i> Ver Resultado</>
                            ) : (
                                <><i className="fas fa-eye"></i> Gerar Prévia</>
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-300 italic line-clamp-3">"{post.imagePrompt}"</p>
                </div>

                <div className="pt-4 flex gap-3 border-t border-royal-900">
                    <button className="flex-1 bg-green-600/20 text-green-400 py-2 rounded-lg text-sm hover:bg-green-600/30 flex items-center justify-center">
                        <i className="fab fa-whatsapp mr-2"></i> Aprovar
                    </button>
                    <button className="flex-1 bg-red-600/20 text-red-400 py-2 rounded-lg text-sm hover:bg-red-600/30 flex items-center justify-center">
                        <i className="fas fa-trash mr-2"></i> Descartar
                    </button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
