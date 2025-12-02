import { PosterData, PosterTheme } from '../types'

interface CloudResponse {
  text: PosterData
  image: string
}

export const requestPosterFromCloud = async (
  date: string,
  theme: PosterTheme
): Promise<PosterData> => {
  const { result } = await uniCloud.callFunction<CloudResponse>({
    name: 'generatePoster',
    data: { date, theme }
  })

  if (!result || result.code !== 0 || !result.data) {
    const message = (result && (result as any).message) || '生成失败'
    throw new Error(message)
  }

  return {
    ...result.data.text,
    date,
    theme,
    imageUrl: result.data.image
  }
}
