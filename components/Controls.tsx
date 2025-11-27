import React from 'react';
import { PosterTheme } from '../types';
import { Calendar, RefreshCw, Download, Image as ImageIcon, Sparkles, Zap, Brush, Droplets, Aperture, Command, Palette, Disc, Box, Grid } from 'lucide-react';

interface ControlsProps {
  date: Date;
  setDate: (date: Date) => void;
  theme: PosterTheme;
  setTheme: (theme: PosterTheme) => void;
  onGenerate: () => void;
  onDownload: () => void;
  isGenerating: boolean;
}

const THEME_STYLES: Record<PosterTheme, string> = {
  [PosterTheme.MINIMALIST]: 'bg-gray-100 border border-gray-200 text-gray-600',
  [PosterTheme.WATERCOLOR]: 'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 border border-indigo-200 text-indigo-500',
  [PosterTheme.CYBERPUNK]: 'bg-slate-900 border border-cyan-500/50 text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.3)]',
  [PosterTheme.INK_WASH]: 'bg-[#e5e5e5] border border-gray-400 text-gray-800',
  [PosterTheme.OIL_PAINTING]: 'bg-[#2a2015] border border-[#d4af37]/50 text-[#d4af37]',
  [PosterTheme.PHOTOREALISTIC]: 'bg-zinc-900 border border-zinc-700 text-zinc-100',
  [PosterTheme.RETRO_POP]: 'bg-yellow-100 border border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
  [PosterTheme.CLAY_3D]: 'bg-rose-50 border border-rose-200 text-rose-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_4px_rgba(244,63,94,0.1)]',
  [PosterTheme.BLUEPRINT]: 'bg-[#1e3a8a] border border-blue-400/50 text-blue-200',
};

const getThemeIcon = (theme: PosterTheme) => {
  switch (theme) {
    case PosterTheme.CYBERPUNK: return <Zap size={14} />;
    case PosterTheme.INK_WASH: return <Brush size={14} />;
    case PosterTheme.WATERCOLOR: return <Droplets size={14} />;
    case PosterTheme.PHOTOREALISTIC: return <Aperture size={14} />;
    case PosterTheme.MINIMALIST: return <Command size={14} />;
    case PosterTheme.OIL_PAINTING: return <Palette size={14} />;
    case PosterTheme.RETRO_POP: return <Disc size={14} />;
    case PosterTheme.CLAY_3D: return <Box size={14} />;
    case PosterTheme.BLUEPRINT: return <Grid size={14} />;
    default: return <Sparkles size={14} />;
  }
};

const Controls: React.FC<ControlsProps> = ({
  date,
  setDate,
  theme,
  setTheme,
  onGenerate,
  onDownload,
  isGenerating,
}) => {
  const dateString = date.toISOString().split('T')[0];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setDate(new Date(e.target.value));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col relative transition-colors duration-300">
      <h2 className="text-2xl font-serif font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 transition-colors">
        <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
        设置 (Settings)
      </h2>

      <div className="space-y-6 flex-grow">
        {/* Date Picker */}
        <div className={`transition-all duration-500 ease-in-out ${isGenerating ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100'}`}>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2 transition-colors">
            <Calendar size={16} className={isGenerating ? 'animate-pulse' : ''} />
            选择日期 (Date)
          </label>
          <input
            type="date"
            value={dateString}
            onChange={handleDateChange}
            disabled={isGenerating}
            className={`w-full p-3 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-sans ${isGenerating ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
          />
        </div>

        {/* Theme Picker */}
        <div className={`transition-all duration-500 ease-in-out ${isGenerating ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100'}`}>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2 transition-colors">
            <ImageIcon size={16} className={isGenerating ? 'animate-pulse' : ''} />
            艺术风格 (Style)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(PosterTheme).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                disabled={isGenerating}
                className={`p-2.5 text-left text-sm rounded-xl border transition-all flex items-center gap-3 group relative overflow-hidden ${
                  theme === t
                    ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300 shadow-md ring-1 ring-blue-500/20'
                    : 'bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg shadow-sm flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${THEME_STYLES[t]}`}>
                  {getThemeIcon(t)}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">{t.split(' (')[0]}</span>
                    <span className="text-[10px] opacity-60 truncate font-sans">{t.split('(')[1]?.replace(')', '')}</span>
                </div>
                
                {theme === t && (
                    <div className="absolute inset-y-0 right-0 w-1 bg-blue-500 rounded-r-xl"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
            isGenerating
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed translate-y-0 shadow-none'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="animate-spin" /> 生成中...
            </>
          ) : (
            <>
              <RefreshCw /> 生成海报 (Generate)
            </>
          )}
        </button>

        <button
          onClick={onDownload}
          disabled={isGenerating}
          className={`w-full py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Download size={20} />
          下载图片 (Download)
        </button>
      </div>
    </div>
  );
};

export default Controls;