
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ImageResolution, VideoAspectRatio } from "../types";

// --- API Key Management ---

// The user-provided API key for default use across the application.
const DEFAULT_API_KEY = 'AIzaSyAtm7Rkm8H6CENJyHRSLXvq7z4r2A06Vi4'; 

export const getStoredApiKey = (): string => {
  // Prioritize user-saved key, then the default key, then an empty string
  return localStorage.getItem('user_gemini_api_key') || DEFAULT_API_KEY || '';
};

export const setStoredApiKey = (key: string) => {
  localStorage.setItem('user_gemini_api_key', key);
};

export const removeStoredApiKey = () => {
  localStorage.removeItem('user_gemini_api_key');
};

const getClient = (): GoogleGenAI => {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error("API Key não configurada. Por favor, vá em Configurações e adicione sua chave da API do Google Gemini.");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to ensure API key selection for paid models (Veo/Pro Images)
// Now specifically checks if a custom key is set, otherwise tries the window auth
const ensurePaidApiKey = async (): Promise<string> => {
  const storedKey = getStoredApiKey();
  if (storedKey && storedKey !== DEFAULT_API_KEY) return storedKey; // Use user-stored if available and not the default

  const win = window as any;
  if (win.aistudio) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await win.aistudio.openSelectKey();
    }
    // After selection, the key should be available via process.env.API_KEY, which defaults to the selected one.
    // However, our `getStoredApiKey` already handles fallbacks, so we just let it fetch again.
    const selectedKey = getStoredApiKey();
    if (selectedKey && selectedKey !== DEFAULT_API_KEY) return selectedKey;
  }
  return DEFAULT_API_KEY; // Fallback to our default if all else fails
};

// --- API Key Validation (Test Connection) ---
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  if (!apiKey) return false;
  try {
    const ai = new GoogleGenAI({ apiKey });
    // Attempt a simple, low-cost API call to validate the key
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'ping',
      config: { maxOutputTokens: 1 }, // Minimal output for validation
    });
    // If we get a response, even an empty one, the key is likely valid
    return !!response; 
  } catch (error) {
    console.error("API Key validation failed:", error);
    return false;
  }
};

// --- Weekly Content Generation ---
export const generateWeeklyContent = async (
  business: string,
  segment: string,
  city: string,
  tone: string,
  style: string,
  count: number
) => {
  const ai = getClient();
  
  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        text: { type: Type.STRING },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
        cta: { type: Type.STRING },
        imagePrompt: { type: Type.STRING },
      },
      required: ["title", "text", "hashtags", "cta", "imagePrompt"]
    }
  };

  const prompt = `Gere ${count} posts para redes sociais para:
  Negócio: ${business}
  Segmento: ${segment}
  Cidade: ${city}
  Tom: ${tone}
  Estilo: ${style}
  
  Para cada post gere um título, texto (máx 450 caracteres), 10 hashtags, um CTA (chamada para ação) e um prompt detalhado para geração de imagem. Responda em Português do Brasil.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.7,
    },
  });

  return JSON.parse(response.text || "[]");
};

// --- Ad Creative Generation ---
export const generateAdCreatives = async (
  product: string,
  audience: string,
  offer: string,
  platform: string
) => {
  const ai = getClient();

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      copies: {
        type: Type.OBJECT,
        properties: {
          short: { type: Type.ARRAY, items: { type: Type.STRING } },
          long: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      },
      headlines: { type: Type.ARRAY, items: { type: Type.STRING } },
      ctas: { type: Type.ARRAY, items: { type: Type.STRING } },
      imagePrompts: { type: Type.ARRAY, items: { type: Type.STRING } },
      videoScripts: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  };

  const prompt = `Crie criativos profissionais de anúncios para:
  Produto: ${product}
  Público Alvo: ${audience}
  Oferta: ${offer}
  Plataforma: ${platform}
  
  Gere 5 copies curtas, 5 copies longas, 10 títulos (headlines), 5 CTAs, 10 prompts de imagem e 3 roteiros curtos de vídeo (10-20s). Responda em Português do Brasil.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Using Pro for better creative writing reasoning
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema
    },
  });

  return JSON.parse(response.text || "{}");
};

// --- Trend Analysis (General) ---
export const generateTrends = async (segment: string, city: string) => {
  const ai = getClient();

  const prompt = `Pesquise tendências atuais para:
  Segmento: ${segment}
  Cidade: ${city}
  
  Retorne um objeto JSON com:
  - generalTrends (lista de 5 strings)
  - hashtags (lista de 10 strings)
  - viralIdeas (lista de 5 strings)
  - contentSuggestions (lista de 5 ideias específicas para hoje)
  
  Responda em Português do Brasil.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
         type: Type.OBJECT,
         properties: {
            generalTrends: { type: Type.ARRAY, items: { type: Type.STRING } },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            viralIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
            contentSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
         }
      }
    },
  });

  return JSON.parse(response.text || "{}");
};

// --- Product Trend Analysis (Detailed with Image) ---
export const analyzeProductTrend = async (
  productDescription: string, 
  location: string,
  imageBase64?: string
) => {
  const ai = getClient();

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      trendScore: { type: Type.NUMBER, description: "Nota de 0 a 100 indicando o potencial de venda atual" },
      trendScoreReason: { type: Type.STRING, description: "Explicação curta do motivo da nota" },
      valueProposition: { type: Type.STRING, description: "Descrição persuasiva do valor do produto" },
      similarProducts: { type: Type.ARRAY, items: { type: Type.STRING } },
      suggestedUpsells: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['Físico', 'Ebook', 'Curso', 'Mentoria', 'Outro'] },
            description: { type: Type.STRING }
          }
        }
      },
      googleTrendsInsight: { type: Type.STRING, description: "Resumo baseado em dados de busca e interesse atual" },
      socialSummary: { type: Type.STRING, description: "Resumo de como este produto é percebido nas redes sociais hoje" }
    },
    required: ["trendScore", "valueProposition", "similarProducts", "suggestedUpsells", "googleTrendsInsight", "socialSummary"]
  };

  const parts: any[] = [];
  
  // If image exists, clean base64 and add to parts
  if (imageBase64) {
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
    parts.push({
      inlineData: {
        mimeType: "image/jpeg", // Assuming JPEG for simplicity, model handles variations well
        data: cleanBase64
      }
    });
  }

  parts.push({
    text: `Atue como um Analista de Mercado Sênior. Analise o seguinte produto com base na imagem (se fornecida) e na descrição.
    
    Descrição: ${productDescription}
    Localização (Contexto): ${location || "Brasil (Geral)"}

    Objetivo:
    1. Identifique o produto.
    2. Use o Google Search para entender a popularidade atual, sazonalidade e interesse de busca (Google Trends Simulado).
    3. Dê uma nota de 0 a 100 para a tendência.
    4. Sugira produtos complementares (upsell/cross-sell) como Ebooks, Cursos ou outros produtos físicos.
    5. Gere um resumo social.

    Responda estritamente no formato JSON especificado. Responda em Português do Brasil.`
  });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash', // Supports Multimodal + Tools
    contents: { parts: parts },
    config: {
      tools: [{ googleSearch: {} }], // Enable Search Grounding
      responseMimeType: "application/json",
      responseSchema: responseSchema
    },
  });

  return JSON.parse(response.text || "{}");
};

// --- Avatar Analysis (Neuromarketing) ---
export const generateAvatarAnalysis = async (productDescription: string) => {
  const ai = getClient();

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      avatarName: { type: Type.STRING },
      profile: { type: Type.STRING },
      pain: { type: Type.STRING },
      dream: { type: Type.STRING },
      trigger: { type: Type.STRING },
      angleRelief: {
        type: Type.OBJECT,
        properties: {
          hook: { type: Type.STRING },
          promise: { type: Type.STRING },
          copy: { type: Type.STRING }
        }
      },
      angleHappiness: {
         type: Type.OBJECT,
         properties: {
           hook: { type: Type.STRING },
           journey: { type: Type.STRING },
           copy: { type: Type.STRING }
         }
      },
      imagePrompt: { type: Type.STRING }
    }
  };

  const prompt = `
  Você é um Especialista Sênior em Neuromarketing e Estratégia de Conteúdo Viral.
  
  PRODUTO ANALISADO: ${productDescription}

  Execute os 3 passos mentais:
  1. ANÁLISE DO PRODUTO: Entender a proposta de valor real.
  2. CRIAÇÃO DO AVATAR: Definir psicograficamente quem precisa desesperadamente disso (Dores Ocultas, Sonhos Secretos).
  3. GERAÇÃO DE CRIATIVOS: Criar assets focados em felicidade.

  Preencha o JSON com:
  - avatarName: Nome fictício do avatar
  - profile: Idade, Gênero, Profissão, Contexto
  - pain: A Dor Principal (visceral)
  - dream: O Desejo Secreto
  - trigger: O Gatilho Emocional
  - angleRelief: Conceito criativo focado em aliviar a dor (Hook, Promessa, Copy)
  - angleHappiness: Conceito criativo focado em transformação/felicidade (Hook, Jornada, Copy)
  - imagePrompt: Sugestão detalhada para IA generativa

  Responda em Português do Brasil.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // High reasoning needed for psychology
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema
    },
  });

  return JSON.parse(response.text || "{}");
};


// --- Standard Image Gen (Flash) ---
export const generateStandardImage = async (prompt: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: prompt,
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("Não foi possível gerar a imagem");
};

// --- Prompt Enhancement ---
export const enhanceImagePrompt = async (originalPrompt: string): Promise<string> => {
  const ai = getClient();
  const prompt = `Atue como um especialista em Prompts de IA para geração de imagens (como Midjourney ou Gemini). 
  Melhore o seguinte prompt para torná-lo mais descritivo, artístico e detalhado, focando em iluminação, composição e estilo.
  Mantenha a intenção original do usuário. Responda APENAS com o prompt melhorado em Português.
  
  Prompt Original: "${originalPrompt}"`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text?.trim() || originalPrompt;
};

// --- Pro Image Gen (Nano Banana Pro) ---
export const generateProImage = async (prompt: string, size: ImageResolution): Promise<string> => {
    // Explicit check for key availability for premium features
    const apiKey = await ensurePaidApiKey();
    const ai = new GoogleGenAI({ apiKey }); 

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
            parts: [{ text: prompt }]
        },
        config: {
            imageConfig: {
                imageSize: size,
                aspectRatio: "1:1" // Default square for social media
            }
        }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("Não foi possível gerar a imagem");
};

// --- Veo Video Generation ---
export const generateVeoVideo = async (
    imageBase64: string, 
    prompt: string, 
    aspectRatio: VideoAspectRatio
): Promise<string> => {
    const apiKey = await ensurePaidApiKey();
    const ai = new GoogleGenAI({ apiKey });
    
    // Clean base64 header if present
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || "Anime esta imagem de forma cinematográfica",
        image: {
            imageBytes: cleanBase64,
            mimeType: 'image/png', // Assuming PNG or JPEG converted to match input, Veo handles standard types
        },
        config: {
            numberOfVideos: 1,
            aspectRatio: aspectRatio,
            resolution: '720p' // Fast model default
        }
    });

    // Polling
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Falha na geração de vídeo");

    // Fetch the actual bytes
    const response = await fetch(`${downloadLink}&key=${apiKey}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
};