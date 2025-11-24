
import React, { useState } from 'react';
import { generateAdCreatives } from '../services/geminiService';
import { AdCreative as AdType } from '../types';

export const AdCreative: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdType | null>(null);
  const [form, setForm] = useState({
    product: '',
    audience: '',
    offer: '',
    platform: 'Instagram'
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateAdCreatives(form.product, form.audience, form.offer, form.platform);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-royal-800 p-4 md:p-6 rounded-2xl border border-royal-700">
          <h2 className="text-xl font-bold mb-4 text-neon-blue">Configuração do Anúncio</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Produto/Serviço</label>
              <input
                className="w-full bg-royal-900 border border-royal-700 rounded-lg p-2.5 text-sm"
                value={form.product}
                onChange={e => setForm({...form, product: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Público Alvo</label>
              <input
                className="w-full bg-royal-900 border border-royal-700 rounded-lg p-2.5 text-sm"
                value={form.audience}
                onChange={e => setForm({...form, audience: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">A Oferta</label>
              <textarea
                className="w-full bg-royal-900 border border-royal-700 rounded-lg p-2.5 text-sm h-24"
                value={form.offer}
                onChange={e => setForm({...form, offer: e.target.value})}
              />
            </div>
            <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-neon-purple hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-all"
            >
                {loading ? 'Pensando...' : 'Gerar Criativos'}
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        {result ? (
            <>
                <div className="bg-royal-800 p-4 md:p-6 rounded-2xl border border-royal-700">
                    <h3 className="text-lg font-bold text-white mb-4"><i className="fas fa-copy mr-2 text-neon-pink"></i> Melhores Títulos</h3>
                    <ul className="space-y-2">
                        {result.headlines?.map((h, i) => (
                            <li key={i} className="flex items-start md:items-center text-sm p-2 bg-royal-900 rounded hover:bg-royal-700 cursor-pointer">
                                <i className="fas fa-check text-green-400 mr-3 mt-1 md:mt-0"></i> <span>{h}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-royal-800 p-4 md:p-6 rounded-2xl border border-royal-700">
                        <h3 className="text-lg font-bold text-white mb-4">Copies Curtas</h3>
                        <div className="space-y-4">
                            {result.copies?.short?.slice(0, 3).map((copy, i) => (
                                <div key={i} className="bg-royal-900 p-3 rounded-lg text-sm text-gray-300">
                                    {copy}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-royal-800 p-4 md:p-6 rounded-2xl border border-royal-700">
                        <h3 className="text-lg font-bold text-white mb-4">Ganchos de Vídeo</h3>
                        <div className="space-y-4">
                            {result.videoScripts?.slice(0, 2).map((script, i) => (
                                <div key={i} className="bg-royal-900 p-3 rounded-lg text-sm text-gray-300 border-l-2 border-neon-blue">
                                    <p className="font-mono text-xs text-neon-blue mb-1">IDEIA DE ROTEIRO {i+1}</p>
                                    {script}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50 py-12 lg:py-0">
                <i className="fas fa-rocket text-6xl mb-4"></i>
                <p className="text-center px-4">Preencha o formulário para decolar suas vendas</p>
            </div>
        )}
      </div>
    </div>
  );
};
