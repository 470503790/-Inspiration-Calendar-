import { PosterTheme } from './types'

export const THEME_PROMPTS: Record<PosterTheme, string> = {
  [PosterTheme.MINIMALIST]: 'minimalist, clean lines, negative space, soft pastel colors, zen aesthetic, vector art style',
  [PosterTheme.WATERCOLOR]: 'soft watercolor painting, artistic, dreamy, paper texture, fluid strokes, pastel tones',
  [PosterTheme.CYBERPUNK]: 'cyberpunk, neon lights, futuristic city, glowing vibrant colors, synthwave, digital art',
  [PosterTheme.INK_WASH]:
    'traditional Chinese ink wash painting, black and white with subtle red accents, calligraphy style, mountain and river',
  [PosterTheme.OIL_PAINTING]: 'impressionist oil painting, textured brushstrokes, vivid colors, van gogh style, artistic masterpiece',
  [PosterTheme.PHOTOREALISTIC]: 'cinematic photography, 8k resolution, highly detailed, dramatic lighting, depth of field, nature',
  [PosterTheme.RETRO_POP]:
    'pop art style, halftone patterns, vibrant bold colors, comic book aesthetic, roy lichtenstein style, retro 80s poster, bold outlines, ben-day dots',
  [PosterTheme.CLAY_3D]:
    'cute clay 3d render, soft lighting, pastel colors, plasticine texture, playful, isometric view, c4d style, blender 3d, rounded shapes',
  [PosterTheme.BLUEPRINT]: 'architectural blueprint, cyanotype, technical drawing, white lines on blue background, schematic, detailed engineering, grid paper, plan view'
}

export const WEEKDAYS_ZH = ['日', '一', '二', '三', '四', '五', '六']
export const MONTHS_ZH = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
