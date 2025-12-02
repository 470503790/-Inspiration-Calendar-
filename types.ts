export enum PosterTheme {
  MINIMALIST = '极简 (Minimalist)',
  WATERCOLOR = '水彩 (Watercolor)',
  CYBERPUNK = '赛博朋克 (Cyberpunk)',
  INK_WASH = '水墨 (Ink Wash)',
  OIL_PAINTING = '油画 (Oil Painting)',
  PHOTOREALISTIC = '写实 (Photorealistic)',
  RETRO_POP = '波普 (Retro Pop)',
  CLAY_3D = '黏土 (Clay 3D)',
  BLUEPRINT = '蓝图 (Blueprint)'
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
