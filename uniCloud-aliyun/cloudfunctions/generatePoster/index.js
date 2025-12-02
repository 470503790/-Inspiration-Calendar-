'use strict'

const uniAI = require('uni-ai')

const THEME_PROMPTS = {
  '极简 (Minimalist)': 'minimalist, clean lines, negative space, soft pastel colors, zen aesthetic, vector art style',
  '水彩 (Watercolor)': 'soft watercolor painting, artistic, dreamy, paper texture, fluid strokes, pastel tones',
  '赛博朋克 (Cyberpunk)': 'cyberpunk, neon lights, futuristic city, glowing vibrant colors, synthwave, digital art',
  '水墨 (Ink Wash)': 'traditional Chinese ink wash painting, black and white with subtle red accents, calligraphy style, mountain and river',
  '油画 (Oil Painting)': 'impressionist oil painting, textured brushstrokes, vivid colors, van gogh style, artistic masterpiece',
  '写实 (Photorealistic)': 'cinematic photography, 8k resolution, highly detailed, dramatic lighting, depth of field, nature',
  '波普 (Retro Pop)': 'pop art style, halftone patterns, vibrant bold colors, comic book aesthetic, retro 80s poster',
  '黏土 (Clay 3D)': 'cute clay 3d render, soft lighting, pastel colors, plasticine texture, playful',
  '蓝图 (Blueprint)': 'architectural blueprint, cyanotype, technical drawing, white lines on blue background, grid paper'
}

const textSchema = {
  type: 'object',
  properties: {
    quote: { type: 'string' },
    author: { type: 'string' },
    luckyItem: { type: 'string' },
    luckyColor: { type: 'string' },
    poem: { type: 'string' },
    lunarDate: { type: 'string' },
    solarTerm: { type: 'string' },
    yi: { type: 'string' },
    ji: { type: 'string' }
  },
  required: ['quote', 'author', 'luckyItem', 'luckyColor', 'lunarDate', 'solarTerm', 'yi', 'ji']
}

exports.main = async (event = {}, context) => {
  const accessToken = process.env.BAIDU_ACCESS_TOKEN
  if (!accessToken) {
    return { code: 500, message: 'Missing BAIDU_ACCESS_TOKEN' }
  }

  const { date, theme } = event
  if (!theme || !Object.prototype.hasOwnProperty.call(THEME_PROMPTS, theme)) {
    return { code: 400, message: 'Invalid theme' }
  }

  let parsedDate
  if (date === undefined || date === null || date === '') {
    parsedDate = new Date()
  } else {
    const parsedTimestamp = Date.parse(date)
    if (Number.isNaN(parsedTimestamp)) {
      return { code: 400, message: 'Invalid date' }
    }
    parsedDate = new Date(parsedTimestamp)
  }
  const dateStr = parsedDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  const textModel = uniAI.createModel({
    provider: 'baidu',
    model: 'ERNIE-Speed-128K',
    accessToken,
    response_format: { type: 'json_object', schema: textSchema }
  })

  const mediaManager = uniCloud.ai.getMediaManager({
    provider: 'baidu',
    accessToken
  })

  const textPrompt = `Today is ${dateStr}. Generate content for a "Daily Inspiration Calendar" (灵感日历).
  Theme: ${theme}.
  Provide JSON for: quote, author, luckyItem, luckyColor, poem, lunarDate (with GanZhi), solarTerm, yi, ji.`

  let textJson
  try {
    const textRes = await textModel.generate({ prompt: textPrompt })
    textJson = typeof textRes.output_text === 'string' ? JSON.parse(textRes.output_text) : textRes.output
  } catch (error) {
    console.error('Text generation or parsing error:', error)
    return { code: 500, message: 'Failed to generate content' }
  }
  if (!textJson) {
    return { code: 500, message: 'Failed to parse content' }
  }

  const stylePrompt = THEME_PROMPTS[theme]
  const imagePrompt = `A beautiful square illustration without text. Style: ${stylePrompt}. Inspired by: ${textJson.quote}`

  const imageRes = await mediaManager.generateImage({
    prompt: imagePrompt,
    size: '1024x1024'
  })

  let base64Image = ''
  if (Array.isArray(imageRes.output) && imageRes.output.length > 0) {
    base64Image = imageRes.output[0].b64_json || imageRes.output[0].base64 || ''
  } else if (typeof imageRes.output === 'string') {
    base64Image = imageRes.output
  } else if (typeof imageRes.base64 === 'string') {
    base64Image = imageRes.base64
  }

  if (!base64Image) {
    return { code: 500, message: 'Image generation failed' }
  }

  return {
    code: 0,
    message: 'ok',
    data: {
      text: textJson,
      image: base64Image.startsWith('data:') ? base64Image : `data:image/png;base64,${base64Image}`
    }
  }
}
