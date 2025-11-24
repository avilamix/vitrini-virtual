
export interface Post {
  id: string;
  title: string;
  text: string;
  hashtags: string[];
  cta: string;
  imagePrompt: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

export interface AdCreative {
  id: string;
  copies: { short: string[]; long: string[] };
  headlines: string[];
  ctas: string[];
  imagePrompts: string[];
  videoScripts: string[];
  generatedImageUrl?: string;
}

export interface Trend {
  category: string;
  items: string[];
}

export interface TrendReport {
  generalTrends: string[];
  hashtags: string[];
  viralIdeas: string[];
  contentSuggestions: string[];
}

export interface ProductUpsell {
  name: string;
  type: 'Físico' | 'Ebook' | 'Curso' | 'Mentoria' | 'Outro';
  description: string;
}

export interface ProductTrendAnalysis {
  trendScore: number; // 0 to 100
  trendScoreReason: string;
  valueProposition: string;
  similarProducts: string[];
  suggestedUpsells: ProductUpsell[];
  googleTrendsInsight: string;
  socialSummary: string;
}

export interface AvatarAnalysis {
  avatarName: string;
  profile: string;
  pain: string;
  dream: string;
  trigger: string;
  angleRelief: {
    hook: string;
    promise: string;
    copy: string;
  };
  angleHappiness: {
    hook: string;
    journey: string;
    copy: string;
  };
  imagePrompt: string;
}

export interface TrendHistoryItem {
  id: string;
  timestamp: number;
  type: 'market' | 'product';
  querySummary: string;
  inputs: {
    segment?: string;
    city?: string;
    description?: string;
    location?: string;
  };
  result: TrendReport | ProductTrendAnalysis;
}

export enum ImageResolution {
  RES_1K = "1K",
  RES_2K = "2K",
  RES_4K = "4K"
}

export enum VideoAspectRatio {
  LANDSCAPE = "16:9",
  PORTRAIT = "9:16"
}