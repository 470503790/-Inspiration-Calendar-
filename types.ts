export enum PosterTheme {
  MINIMALIST = '极简',
  WATERCOLOR = '水彩',
  CYBERPUNK = '赛博朋克',
  INK_WASH = '水墨',
  OIL_PAINTING = '油画',
  PHOTOREALISTIC = '写实',
  RETRO_POP = '波普',
  CLAY_3D = '黏土',
  BLUEPRINT = '蓝图'
}

export interface DailyContent {
  quote: string;
  author: string;
  luckyItem: string;
  luckyColor: string;
  poem?: string;
  lunarDate: string;
  solarTerm: string;
  yi: string;
  ji: string;
}

export interface PosterData extends DailyContent {
  date: string;
  theme: PosterTheme;
  imageUrl?: string;
}

export type GenerationStatus =
  | 'idle'
  | 'generating_text'
  | 'generating_image'
  | 'finalizing'
  | 'complete'
  | 'error'
  | 'saving';
