
import React, { useState, useRef, useEffect } from 'react';
import { generateTrends, analyzeProductTrend } from '../services/geminiService';
import { TrendReport, ProductTrendAnalysis, TrendHistoryItem } from '../types';

export const Trends: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'market' | 'product' | 'history'>('market');
  const [loading, setLoading] = useState(false);
  
  // Market Trends State
  const [marketData, setMarketData] = useState<TrendReport | null>(null);
  const [marketInputs, setMarketInputs] = useState({ segment: '', city: '' });

  // Product Analysis State
  const [productData, setProductData] = useState<ProductTrendAnalysis | null>(null);
  const [productInputs, setProductInputs] = useState({ description: '', location: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // History State
  const [history, setHistory] = useState<TrendHistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('trend_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (item: TrendHistoryItem) => {
    const newHistory = [item, ...history].slice(0, 50); // Keep last 50 items
    setHistory(newHistory);
    localStorage.setItem('trend_history', JSON.stringify(newHistory));
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('trend_history', JSON.stringify(newHistory));
  };

  const restoreHistoryItem = (item: TrendHistoryItem) => {
    if (item.type === 'market') {
      setMarketInputs({ segment: item.inputs.segment || '', city: item.inputs.city || '' });
      setMarketData(item.result as TrendReport);
      setActiveTab('market');
    } else {
      setProductInputs({ description: item.inputs.description || '', location: item.inputs.location || '' });
      setProductData(item.result as ProductTrendAnalysis);
      setImagePreview(null); // Images are not stored in history to save space
      setActiveTab('product');
    }
  };

  const fetchMarketTrends = async () => {
    if (!marketInputs.segment) return;
    setLoading(true);
    try {
      const res = await generateTrends(marketInputs.segment, marketInputs.city);
      setMarketData(res);
      
      saveToHistory({
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: 'market',
        querySummary: `${marketInputs.segment} ${marketInputs.city ? `- ${marketInputs.city}` : ''}`,
        inputs: marketInputs,
        result: res
      });
    } catch (e) {
      console.error(e);
      alert('Falha ao buscar tendências. Verifique sua chave API.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeProduct = async () => {
    if (!productInputs.description && !imagePreview) return;
    setLoading(true);
    try {
      // Pass imagePreview (base64) if available
      const res = await analyzeProductTrend(productInputs.description, productInputs.location, imagePreview || undefined);
      setProductData(res);

      saveToHistory({
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: 'product',
        querySummary: productInputs.description.substring(0, 30) + (productInputs.description.length > 30 ? '...' : ''),
        inputs: productInputs,
        result: res
      });

    } catch (e) {
      console.error(e);
      alert("Erro ao analisar produto. Verifique sua chave API.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 border-green-400';
    if (score >= 50) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', { 
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-4 bg-royal-800/50 p-1 rounded-xl w-fit mx-auto mb-6">
        <button 
          onClick={() => setActiveTab('market')}
          className={`px-6 py-2 rounded-lg font-bold transition-all text-sm flex items-center ${activeTab === 'market' ? 'bg-neon-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <i className="fas fa-globe-americas mr-2"></i> Tendências
        </button>
        <button 
          onClick={() => setActiveTab('product')}
          className={`px-6 py-2 rounded-lg font-bold transition-all text-sm flex items-center ${activeTab === 'product' ? 'bg-neon-blue text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <i className="fas fa-search-dollar mr-2"></i> Analisador
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2 rounded-lg font-bold transition-all text-sm flex items-center ${activeTab === 'history' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <i className="fas fa-history mr-2"></i> Histórico
        </button>
      </div>

      {/* HISTORY VIEW */}
      {activeTab === 'history' && (
        <div className="animate-fade-in space-y-4">
            <h3 className="text-xl font-bold text-white mb-4 pl-2">Histórico de Pesquisas</h3>
            {history.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-royal-800 rounded-2xl border border-royal-700">
                    <i className="fas fa-history text-4xl mb-3 opacity-30"></i>
                    <p>Nenhuma pesquisa recente encontrada.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => restoreHistoryItem(item)}
                            className="bg-royal-800 p-4 rounded-xl border border-royal-700 hover:border-neon-purple cursor-pointer transition-all group relative"
                        >
                             <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                                        item.type === 'market' ? 'bg-neon-purple/20 text-neon-purple' : 'bg-neon-blue/20 text-neon-blue'
                                    }`}>
                                        {item.type === 'market' ? 'Mercado' : 'Produto'}
                                    </span>
                                    <span className="text-gray-500 text-xs">{formatDate(item.timestamp)}</span>
                                </div>
                                <button 
                                    onClick={(e) => deleteHistoryItem(e, item.id)}
                                    className="text-gray-600 hover:text-red-400 transition-colors p-1"
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                             </div>
                             <p className="font-bold text-white truncate pr-6">{item.querySummary}</p>
                             <div className="mt-2 flex items-center text-xs text-gray-400 group-hover:text-neon-purple transition-colors">
                                 Ver Resultado <i className="fas fa-arrow-right ml-2"></i>
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}

      {/* MARKET TRENDS VIEW */}
      {activeTab === 'market' && (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-end bg-royal-800 p-4 md:p-6 rounded-2xl gap-4">
                <div className="flex flex-col md:flex-row gap-4 flex-1 md:mr-4">
                    <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">Segmento da Indústria</label>
                        <input 
                            value={marketInputs.segment}
                            placeholder="ex: Moda, Tecnologia"
                            className="w-full bg-royal-900 border border-royal-700 p-2 rounded text-white text-sm"
                            onChange={e => setMarketInputs({...marketInputs, segment: e.target.value})}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">Localização</label>
                        <input 
                            value={marketInputs.city}
                            placeholder="ex: Rio de Janeiro, São Paulo"
                            className="w-full bg-royal-900 border border-royal-700 p-2 rounded text-white text-sm"
                            onChange={e => setMarketInputs({...marketInputs, city: e.target.value})}
                        />
                    </div>
                </div>
                <button 
                    onClick={fetchMarketTrends}
                    disabled={loading || !marketInputs.segment}
                    className="bg-neon-purple px-6 py-2.5 rounded md:h-[42px] font-bold hover:bg-purple-600 disabled:opacity-50 h-12 transition-colors"
                >
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Buscar Tendências'}
                </button>
            </div>

            {marketData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-royal-800 p-4 md:p-6 rounded-2xl border-l-4 border-neon-purple">
                        <h3 className="font-bold text-lg md:text-xl mb-4 text-white">🔥 Tendências Gerais</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                            {marketData.generalTrends?.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                    </div>
                    
                    <div className="bg-royal-800 p-4 md:p-6 rounded-2xl border-l-4 border-neon-blue">
                        <h3 className="font-bold text-lg md:text-xl mb-4 text-white">#️⃣ Hashtags Virais</h3>
                        <div className="flex flex-wrap gap-2">
                            {marketData.hashtags?.map((t, i) => (
                                <span key={i} className="bg-royal-900 text-neon-blue px-3 py-1 rounded-full text-sm">#{t}</span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-royal-800 p-4 md:p-6 rounded-2xl border-l-4 border-neon-pink">
                        <h3 className="font-bold text-lg md:text-xl mb-4 text-white">💡 Ideias de Conteúdo para Hoje</h3>
                        <ul className="space-y-3">
                            {marketData.contentSuggestions?.map((t, i) => (
                                <li key={i} className="flex gap-3 items-start text-gray-300 text-sm">
                                    <i className="fas fa-lightbulb text-yellow-400 mt-1"></i>
                                    <span>{t}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-royal-800 p-4 md:p-6 rounded-2xl border-l-4 border-green-400">
                        <h3 className="font-bold text-lg md:text-xl mb-4 text-white">🚀 Conceitos Virais</h3>
                        <ul className="space-y-3">
                            {marketData.viralIdeas?.map((t, i) => (
                                <li key={i} className="flex gap-3 items-start text-gray-300 text-sm">
                                    <i className="fas fa-video text-green-400 mt-1"></i>
                                    <span>{t}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
      )}

      {/* PRODUCT ANALYZER VIEW */}
      {activeTab === 'product' && (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Section */}
                <div className="lg:col-span-1 bg-royal-800 p-4 md:p-6 rounded-2xl border border-royal-700 space-y-4 h-fit">
                    <div 
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors relative overflow-hidden group ${imagePreview ? 'border-neon-blue p-0' : 'border-gray-600 hover:border-gray-500'}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {imagePreview ? (
                            <>
                              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-white text-xs"><i className="fas fa-edit"></i> Trocar Imagem</span>
                              </div>
                            </>
                        ) : (
                            <div className="py-8">
                                <i className="fas fa-camera text-3xl text-gray-500 mb-2"></i>
                                <p className="text-gray-400 text-xs">Adicionar Foto do Produto (Opcional)</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                    
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Descrição do Produto</label>
                        <textarea 
                            placeholder="Descreva o produto, curso ou serviço..."
                            className="w-full bg-royal-900 border border-royal-700 p-3 rounded-lg text-white text-sm outline-none focus:border-neon-blue h-32 resize-none"
                            value={productInputs.description}
                            onChange={e => setProductInputs({...productInputs, description: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Localização (Contexto)</label>
                        <input 
                            placeholder="ex: Brasil, Global, São Paulo"
                            className="w-full bg-royal-900 border border-royal-700 p-3 rounded-lg text-white text-sm outline-none focus:border-neon-blue"
                            value={productInputs.location}
                            onChange={e => setProductInputs({...productInputs, location: e.target.value})}
                        />
                    </div>

                    <button 
                        onClick={analyzeProduct}
                        disabled={loading || (!productInputs.description && !imagePreview)}
                        className="w-full bg-neon-blue hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-neon-blue/20"
                    >
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Analisar Potencial'}
                    </button>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-2 space-y-6">
                    {productData ? (
                        <>
                            {/* Score Card */}
                            <div className="bg-royal-800 rounded-2xl border border-royal-700 p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <h3 className="text-gray-400 text-sm font-bold uppercase mb-1">Score de Tendência</h3>
                                        <p className="text-xs text-gray-500">{productData.trendScoreReason}</p>
                                    </div>
                                    <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${getScoreColor(productData.trendScore)}`}>
                                        <span className="text-2xl font-bold text-white">{productData.trendScore}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Value Proposition & Social */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-royal-800 p-5 rounded-2xl border border-royal-700">
                                    <h4 className="text-neon-purple font-bold mb-3"><i className="fas fa-gem mr-2"></i> Proposta de Valor</h4>
                                    <p className="text-sm text-gray-300 leading-relaxed">{productData.valueProposition}</p>
                                </div>
                                <div className="bg-royal-800 p-5 rounded-2xl border border-royal-700">
                                    <h4 className="text-neon-blue font-bold mb-3"><i className="fas fa-hashtag mr-2"></i> Resumo Social</h4>
                                    <p className="text-sm text-gray-300 leading-relaxed">{productData.socialSummary}</p>
                                </div>
                            </div>
                            
                            {/* Google Trends Insight */}
                            <div className="bg-gradient-to-r from-royal-800 to-royal-900 p-5 rounded-2xl border border-royal-700">
                                <h4 className="text-white font-bold mb-3 flex items-center">
                                    <i className="fab fa-google text-red-500 mr-2"></i> Insights de Busca (Trends)
                                </h4>
                                <p className="text-sm text-gray-300 italic border-l-2 border-red-500 pl-3">{productData.googleTrendsInsight}</p>
                            </div>

                            {/* Upsells / Cross Sells */}
                            <div className="space-y-4">
                                <h4 className="text-white font-bold text-lg">💰 Produtos Sugeridos (Upsell/Cross-sell)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {productData.suggestedUpsells.map((item, idx) => (
                                        <div key={idx} className="bg-royal-800 border border-royal-700 p-4 rounded-xl hover:border-neon-blue transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-white text-sm">{item.name}</span>
                                                <span className="text-xs bg-royal-900 px-2 py-1 rounded text-neon-blue border border-neon-blue/30">{item.type}</span>
                                            </div>
                                            <p className="text-xs text-gray-400">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Similar Products */}
                            <div className="bg-royal-800 p-5 rounded-2xl border border-royal-700">
                                <h4 className="text-gray-300 font-bold mb-3 text-sm uppercase">Concorrentes / Similares</h4>
                                <div className="flex flex-wrap gap-2">
                                    {productData.similarProducts.map((prod, i) => (
                                        <span key={i} className="px-3 py-1 bg-royal-900 rounded-full text-xs text-gray-400 border border-royal-700">{prod}</span>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-40 py-12 lg:py-0 border-2 border-dashed border-royal-700 rounded-2xl">
                            <i className="fas fa-chart-pie text-6xl mb-4"></i>
                            <p className="text-center px-6">Envie uma foto ou descrição para a IA analisar o potencial de mercado.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
