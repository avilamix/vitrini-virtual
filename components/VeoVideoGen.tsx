
import React, { useState, useRef } from 'react';
import { generateVeoVideo } from '../services/geminiService';
import { VideoAspectRatio } from '../types';

export const VeoVideoGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>(VideoAspectRatio.PORTRAIT);
  const [loading, setLoading] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleGenerate = async () => {
    if (!imagePreview) return;
    setLoading(true);
    setGeneratedVideoUrl(null);
    try {
      const videoUrl = await generateVeoVideo(imagePreview, prompt, aspectRatio);
      setGeneratedVideoUrl(videoUrl);
    } catch (error) {
      console.error(error);
      alert('Falha na geração do vídeo. Verifique se você selecionou uma chave de API paga.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
        <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-pink to-orange-400">
                Estúdio de Vídeo Veo
            </h2>
            <p className="text-sm md:text-base text-gray-400">Anime imagens estáticas em vídeos cinematográficos usando Veo 3.1</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-royal-800 p-4 md:p-6 rounded-2xl border border-royal-700 space-y-6 h-fit">
                <div 
                    className={`border-2 border-dashed rounded-xl p-6 md:p-8 text-center cursor-pointer transition-colors ${imagePreview ? 'border-neon-purple' : 'border-gray-600 hover:border-gray-500'}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                    ) : (
                        <div className="py-8">
                            <i className="fas fa-cloud-upload-alt text-4xl text-gray-500 mb-3"></i>
                            <p className="text-gray-300 text-sm md:text-base">Clique para enviar imagem de referência</p>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange}
                    />
                </div>

                <div>
                    <label className="text-xs text-gray-400 mb-2 block">Prompt (Opcional)</label>
                    <textarea
                        className="w-full bg-royal-900 border border-royal-700 rounded-lg p-3 text-white focus:border-neon-pink outline-none text-sm"
                        rows={3}
                        placeholder="ex: A água flui suavemente, iluminação cinematográfica..."
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-xs text-gray-400 mb-2 block">Proporção</label>
                    <div className="flex gap-4">
                        <button 
                            className={`flex-1 py-3 rounded-lg border text-sm ${aspectRatio === VideoAspectRatio.PORTRAIT ? 'bg-neon-pink/20 border-neon-pink text-white' : 'border-royal-700 text-gray-400'}`}
                            onClick={() => setAspectRatio(VideoAspectRatio.PORTRAIT)}
                        >
                            <i className="fas fa-mobile-alt mr-2"></i> 9:16 (Stories)
                        </button>
                        <button 
                            className={`flex-1 py-3 rounded-lg border text-sm ${aspectRatio === VideoAspectRatio.LANDSCAPE ? 'bg-neon-pink/20 border-neon-pink text-white' : 'border-royal-700 text-gray-400'}`}
                            onClick={() => setAspectRatio(VideoAspectRatio.LANDSCAPE)}
                        >
                            <i className="fas fa-tv mr-2"></i> 16:9 (Horizontal)
                        </button>
                    </div>
                </div>

                <button 
                    onClick={handleGenerate}
                    disabled={loading || !imagePreview}
                    className="w-full bg-gradient-to-r from-neon-pink to-orange-500 py-4 rounded-xl font-bold text-white hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? (
                        <span><i className="fas fa-spinner fa-spin mr-2"></i> Gerando...</span>
                    ) : 'Gerar Vídeo'}
                </button>
            </div>

            <div className="bg-black/50 rounded-2xl border border-royal-800 flex items-center justify-center p-4 min-h-[300px] lg:min-h-[500px]">
                {generatedVideoUrl ? (
                    <div className="w-full h-full flex flex-col items-center">
                        <video 
                            src={generatedVideoUrl} 
                            controls 
                            autoPlay 
                            loop 
                            className="max-h-[600px] max-w-full rounded-lg shadow-2xl"
                        />
                        <a 
                            href={generatedVideoUrl}
                            download="veo_generation.mp4"
                            className="mt-4 text-neon-pink hover:underline text-sm"
                        >
                            <i className="fas fa-download mr-1"></i> Baixar Vídeo
                        </a>
                    </div>
                ) : (
                    <div className="text-center text-gray-600">
                        <div className="w-20 h-20 rounded-full border-2 border-gray-700 flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-play text-2xl ml-1"></i>
                        </div>
                        <p>Seu vídeo aparecerá aqui</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
