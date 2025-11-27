import React, { forwardRef } from 'react';
import { PosterData, PosterTheme } from '../types';
import { formatDateComponents } from '../utils/dateUtils';
import { Sparkles, Feather, Palette, Command, Brush, Droplets, Zap, Quote, Share2, Disc, Box, Grid, Aperture, Sun } from 'lucide-react';

interface PosterProps {
  data: PosterData | null;
  loading: boolean;
  onShare?: () => void;
}

// Enhanced SVG Patterns and Gradients
const TEXTURES = {
  noise: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`,
  paper: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.2'/%3E%3C/svg%3E")`,
  canvas: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='canvasFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23canvasFilter)' opacity='0.15'/%3E%3C/svg%3E")`,
  ricePaper: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='rice'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23rice)' opacity='0.12'/%3E%3C/svg%3E")`,
  grid: `linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)`,
  dots: `radial-gradient(circle, #000 1.5px, transparent 1.5px)`,
  scanline: `linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)`,
};

// Comprehensive Theme Styling Strategy
const getThemeStyles = (theme: PosterTheme) => {
  switch (theme) {
    case PosterTheme.MINIMALIST:
      return {
        wrapper: 'bg-[#f4f4f4] text-gray-800',
        container: 'bg-white m-6 md:m-8 p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col h-[calc(100%-3rem)] md:h-[calc(100%-4rem)] relative overflow-hidden',
        imageWrapper: 'relative w-full aspect-[4/3] overflow-hidden mb-6 order-2 md:order-1 grayscale-[10%]', 
        imageStyle: 'opacity-100 object-cover hover:scale-105 transition-transform duration-[2s]', 
        overlay: 'hidden',
        header: 'flex flex-row items-baseline justify-between mb-6 border-b-2 border-black pb-4 order-1 md:order-2',
        fontDate: 'font-sans font-bold text-6xl md:text-7xl tracking-tighter text-black',
        fontMeta: 'font-sans font-medium tracking-wide text-xs uppercase text-gray-500',
        fontQuote: 'font-serif text-2xl md:text-3xl leading-relaxed text-gray-800 mt-4 order-3',
        footer: 'mt-auto pt-4 border-t border-gray-100 flex justify-between items-end text-xs text-gray-400 font-sans tracking-widest order-4',
        accentColor: 'text-black',
        texture: TEXTURES.noise,
        datePosition: 'top-left'
      };

    case PosterTheme.WATERCOLOR:
      return {
        wrapper: 'bg-[#fffdf9] text-slate-700',
        container: 'p-6 md:p-10 flex flex-col h-full relative z-10',
        imageWrapper: 'absolute inset-0 z-0',
        imageStyle: 'opacity-80 mix-blend-multiply transition-transform duration-[3s] hover:scale-110', 
        overlay: 'bg-gradient-to-t from-[#fffdf9] via-[#fffdf9]/50 to-transparent',
        header: 'flex justify-between items-start mb-auto',
        fontDate: 'font-serif font-black text-7xl md:text-8xl text-slate-800 mix-blend-multiply opacity-90',
        fontMeta: 'font-serif italic text-slate-500 text-lg',
        fontQuote: 'font-calligraphy text-3xl md:text-4xl text-slate-700 leading-normal drop-shadow-sm',
        footer: 'border-t border-slate-300/50 mt-6 pt-4 backdrop-blur-sm',
        accentColor: 'text-indigo-500',
        texture: TEXTURES.paper,
        datePosition: 'top-left'
      };

    case PosterTheme.CYBERPUNK:
      return {
        wrapper: 'bg-[#050505] text-cyan-50 border-x-2 border-cyan-900',
        container: 'p-6 md:p-8 flex flex-col h-full relative z-30',
        imageWrapper: 'absolute inset-0 z-0',
        imageStyle: 'opacity-60 mix-blend-screen saturate-150 contrast-125', 
        overlay: 'bg-gradient-to-t from-black via-black/80 to-transparent',
        header: 'flex flex-col items-start mb-auto relative',
        fontDate: 'font-tech text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-600 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]',
        fontMeta: 'font-tech tracking-widest text-pink-500 text-sm mt-2 flex items-center gap-2',
        fontQuote: 'font-sans font-light text-lg md:text-xl tracking-wide leading-relaxed text-cyan-100 border-l-2 border-pink-500 pl-4 bg-black/40 backdrop-blur-sm py-4 pr-4',
        footer: 'border-t border-cyan-900/50 mt-6 pt-4 bg-black/60 backdrop-blur-md p-4 text-cyan-400',
        accentColor: 'text-pink-500',
        texture: null, // Scanlines handled separately
        datePosition: 'top-left',
        extra: 'glitch'
      };

    case PosterTheme.INK_WASH:
      return {
        wrapper: 'bg-[#f4f3ef] text-gray-900 border-[16px] border-[#f4f3ef] shadow-inner',
        container: 'p-8 md:p-12 h-full flex flex-row-reverse relative overflow-hidden ring-1 ring-gray-200 inset-2',
        imageWrapper: 'absolute inset-0 z-0',
        imageStyle: 'grayscale contrast-125 brightness-110 mix-blend-multiply opacity-70',
        overlay: 'bg-gradient-to-r from-[#f4f3ef] via-[#f4f3ef]/40 to-transparent',
        header: 'writing-vertical-rl text-right flex items-center justify-start h-full ml-auto pl-6 border-l border-gray-400/30',
        fontDate: 'font-calligraphy text-8xl md:text-9xl text-black leading-none py-4 opacity-90',
        fontMeta: 'font-serif writing-vertical-rl tracking-[0.2em] text-gray-600 text-sm my-4 font-bold',
        fontQuote: 'font-serif font-bold text-xl md:text-2xl text-gray-800 leading-loose writing-vertical-rl tracking-widest',
        footer: 'absolute bottom-8 left-8 right-auto bg-[#f4f3ef]/90 p-4 border border-gray-300 rounded-sm shadow-sm max-w-[200px]',
        accentColor: 'text-red-700',
        texture: TEXTURES.ricePaper,
        datePosition: 'vertical-right'
      };

    case PosterTheme.OIL_PAINTING:
      return {
        wrapper: 'bg-[#2b241b] text-[#eaddcf]',
        container: 'p-10 md:p-12 flex flex-col h-full border-[16px] border-[#1a1510] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]',
        imageWrapper: 'absolute inset-0 z-0',
        imageStyle: 'opacity-80 saturate-125 contrast-110', 
        overlay: 'bg-gradient-to-t from-[#2b241b] via-[#2b241b]/60 to-transparent',
        header: 'flex flex-col items-center mt-auto mb-8 text-center',
        fontDate: 'font-serif text-6xl md:text-7xl text-[#d4af37] drop-shadow-md font-bold',
        fontMeta: 'font-sans tracking-[0.3em] uppercase text-[#a89b85] text-xs mt-3 font-bold border-t border-[#d4af37]/30 pt-2',
        fontQuote: 'font-serif italic text-2xl md:text-3xl text-center leading-relaxed text-[#f3e9d2] drop-shadow-md mt-6',
        footer: 'border-t border-[#d4af37]/20 pt-4 mx-8 opacity-70 flex justify-center',
        accentColor: 'text-[#d4af37]',
        texture: TEXTURES.canvas,
        datePosition: 'bottom-center'
      };

    case PosterTheme.PHOTOREALISTIC:
      return {
        wrapper: 'bg-black text-white',
        container: 'p-8 flex flex-col h-full justify-end',
        imageWrapper: 'absolute inset-0 z-0',
        imageStyle: 'opacity-100',
        overlay: 'bg-gradient-to-t from-black via-black/50 to-transparent',
        header: 'mb-8 relative z-20',
        fontDate: 'font-sans font-bold text-7xl md:text-8xl tracking-tighter leading-none',
        fontMeta: 'font-sans font-light text-gray-300 text-xl flex items-center gap-2 mt-1',
        fontQuote: 'font-sans font-extralight text-2xl md:text-3xl leading-snug tracking-wide text-gray-100',
        footer: 'flex justify-between items-end border-t border-white/20 pt-6 text-sm text-gray-400',
        accentColor: 'text-white',
        texture: null,
        datePosition: 'bottom-left'
      };
      
    case PosterTheme.RETRO_POP:
      return {
        wrapper: 'bg-yellow-400 text-black border-4 border-black',
        container: 'p-6 md:p-8 flex flex-col h-full relative z-20',
        imageWrapper: 'absolute top-2 left-2 right-2 h-[50%] z-0 border-4 border-black bg-white overflow-hidden',
        imageStyle: 'opacity-100 grayscale contrast-125',
        overlay: 'bg-indigo-500/20 mix-blend-multiply', 
        header: 'mt-[50%] pt-8 mb-4 flex flex-col items-start relative',
        fontDate: 'font-sans font-black text-7xl md:text-8xl italic text-white drop-shadow-[4px_4px_0px_#000] -rotate-2 inline-block',
        fontMeta: 'font-sans font-bold text-lg bg-black text-white px-3 py-1 transform skew-x-[-12deg] mt-2 inline-block shadow-[4px_4px_0px_rgba(255,255,255,0.5)]',
        fontQuote: 'font-sans font-bold text-xl md:text-2xl bg-white border-4 border-black p-4 shadow-[8px_8px_0px_rgba(0,0,0,1)] leading-tight transform rotate-1 mt-4',
        footer: 'mt-auto flex justify-between items-center border-t-4 border-black pt-4 font-bold bg-white px-4 -mx-2',
        accentColor: 'text-red-600',
        texture: TEXTURES.dots,
        datePosition: 'center-split'
      };

    case PosterTheme.CLAY_3D:
      return {
        wrapper: 'bg-[#f0f4f8] text-slate-600',
        container: 'm-6 p-8 flex flex-col h-[calc(100%-3rem)] bg-[#f0f4f8] rounded-[2.5rem] shadow-[20px_20px_60px_#cdd4db,-20px_-20px_60px_#ffffff]',
        imageWrapper: 'absolute inset-0 z-0 m-10 md:m-12 rounded-[2rem] overflow-hidden opacity-100 shadow-[inset_5px_5px_10px_rgba(0,0,0,0.1),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] border-8 border-[#f0f4f8]',
        imageStyle: 'opacity-80 blur-[0.5px]',
        overlay: 'hidden',
        header: 'flex flex-col items-center mb-12 relative z-20',
        fontDate: 'font-sans font-black text-7xl md:text-8xl text-[#8da9c4] drop-shadow-[2px_2px_4px_rgba(255,255,255,1),-2px_-2px_4px_rgba(0,0,0,0.1)]',
        fontMeta: 'font-sans font-bold text-slate-400 tracking-wider bg-[#f0f4f8] px-4 py-1 rounded-full shadow-[5px_5px_10px_#cdd4db,-5px_-5px_10px_#ffffff]',
        fontQuote: 'font-sans font-bold text-xl md:text-2xl text-slate-600 text-center leading-relaxed drop-shadow-sm bg-[#f0f4f8]/80 backdrop-blur-sm p-4 rounded-xl mt-auto shadow-[5px_5px_10px_#cdd4db,-5px_-5px_10px_#ffffff]',
        footer: 'mt-auto flex justify-center text-[#8da9c4]',
        accentColor: 'text-[#ff8fa3]',
        texture: null,
        datePosition: 'top-center'
      };
      
    case PosterTheme.BLUEPRINT:
      return {
        wrapper: 'bg-[#0a4da6] text-blue-100 font-mono',
        container: 'p-8 h-full flex flex-col m-2 border-2 border-white/30 relative overflow-hidden',
        imageWrapper: 'absolute inset-0 z-0',
        imageStyle: 'grayscale contrast-[1.5] invert opacity-40 mix-blend-screen', 
        overlay: 'bg-[#0a4da6]/50', 
        header: 'border-b border-white/50 pb-4 mb-4 flex flex-col items-start relative z-10',
        fontDate: 'font-tech text-6xl md:text-8xl text-white tracking-tighter',
        fontMeta: 'font-tech text-xs text-blue-200 tracking-[0.2em] uppercase mt-2 flex gap-4',
        fontQuote: 'font-tech text-lg md:text-xl text-blue-50 border-l border-white/50 pl-4 py-2 mt-8 max-w-[80%]',
        footer: 'border-t border-white/50 pt-4 mt-auto flex justify-between items-center text-xs opacity-80',
        accentColor: 'text-yellow-400',
        texture: TEXTURES.grid,
        datePosition: 'top-left'
      };

    default:
      return {
        wrapper: 'bg-white',
        container: 'p-8',
        imageWrapper: 'absolute inset-0',
        imageStyle: '',
        overlay: 'bg-white/80',
        header: '',
        fontDate: 'font-serif text-6xl',
        fontMeta: 'font-sans',
        fontQuote: 'font-serif',
        footer: '',
        accentColor: 'text-gray-500',
        texture: null,
        datePosition: 'top-left'
      };
  }
};

const Poster = forwardRef<HTMLDivElement, PosterProps>(({ data, loading, onShare }, ref) => {
  if (loading) {
    return (
      <div className="w-full aspect-[3/4] md:aspect-[4/5] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col items-center justify-center p-8 border border-gray-100 dark:border-gray-700 animate-pulse relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 dark:via-gray-700/50 to-transparent animate-[shimmer_1.5s_infinite]"></div>
        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-8"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
        <div className="mt-auto w-full h-1/3 bg-gray-100 dark:bg-gray-700/50 rounded-xl"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full aspect-[3/4] md:aspect-[4/5] bg-[#f8f9fa] dark:bg-gray-800/50 rounded-xl shadow-lg flex flex-col items-center justify-center p-8 border-4 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 group hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all">
        <div className="p-4 rounded-full bg-white dark:bg-gray-800 shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <Sparkles size={32} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-400" />
        </div>
        <p className="font-serif text-lg font-medium text-gray-500 dark:text-gray-400">Waiting for Inspiration</p>
        <p className="text-xs mt-2 font-sans opacity-60">Select settings to generate</p>
      </div>
    );
  }

  const { day, year, monthEn, weekdayZh } = formatDateComponents(data.date);
  const styles = getThemeStyles(data.theme);
  
  // Dynamic Icon
  const ThemeIcon = () => {
    switch (data.theme) {
      case PosterTheme.CYBERPUNK: return <Zap size={14} />;
      case PosterTheme.INK_WASH: return <Brush size={14} />;
      case PosterTheme.WATERCOLOR: return <Droplets size={14} />;
      case PosterTheme.PHOTOREALISTIC: return <Aperture size={14} />;
      case PosterTheme.MINIMALIST: return <Command size={14} />;
      case PosterTheme.RETRO_POP: return <Disc size={14} />;
      case PosterTheme.CLAY_3D: return <Box size={14} />;
      case PosterTheme.BLUEPRINT: return <Grid size={14} />;
      default: return <Sparkles size={14} />;
    }
  };

  return (
    <div 
      ref={ref} 
      className={`relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden shadow-2xl transition-all duration-500 group ${styles.wrapper}`}
      id="poster-canvas"
    >
      {/* SVG Filters for Effects */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="watercolor-filter">
             <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
             <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Share Button (ignored by html2canvas) */}
      {onShare && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
          data-html2canvas-ignore="true"
          className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-current border border-white/20 shadow-lg transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0"
          title="Share Poster"
          aria-label="Share Poster"
        >
          <Share2 size={20} />
        </button>
      )}

      {/* Texture Layer */}
      {styles.texture && (
        <div 
          className="absolute inset-0 pointer-events-none z-20" 
          style={{ 
            backgroundImage: styles.texture, 
            backgroundSize: data.theme === PosterTheme.RETRO_POP ? '12px 12px' : 
                            data.theme === PosterTheme.BLUEPRINT ? '40px 40px' : undefined, 
            mixBlendMode: data.theme === PosterTheme.RETRO_POP ? 'multiply' : 'overlay' 
          }}
        ></div>
      )}
      
      {/* Scanlines for Cyberpunk */}
      {data.theme === PosterTheme.CYBERPUNK && (
        <div className="absolute inset-0 pointer-events-none z-20 opacity-20" style={{ background: TEXTURES.scanline, backgroundSize: '100% 4px' }}></div>
      )}

      {/* Decorative Corner Brackets for Cyberpunk */}
      {data.theme === PosterTheme.CYBERPUNK && (
        <>
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400 z-30"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400 z-30"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400 z-30"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400 z-30"></div>
        </>
      )}

      {/* Measurement Lines for Blueprint */}
      {data.theme === PosterTheme.BLUEPRINT && (
        <>
          <div className="absolute top-8 left-0 right-0 h-px bg-white/20 z-20 flex justify-between px-2 text-[10px] font-mono">
              <span>0</span><span>100</span>
          </div>
          <div className="absolute left-8 top-0 bottom-0 w-px bg-white/20 z-20 flex flex-col justify-between py-2 text-[10px] font-mono items-center">
              <span>0</span><span>100</span>
          </div>
          <div className="absolute bottom-20 right-8 w-16 h-16 border border-dashed border-white/40 rounded-full z-20 flex items-center justify-center">
             <div className="w-px h-full bg-white/40"></div>
             <div className="h-px w-full bg-white/40 absolute"></div>
          </div>
        </>
      )}

      {/* Background Image Area */}
      <div className={styles.imageWrapper}>
        {data.imageUrl ? (
            <img 
              src={data.imageUrl} 
              alt="Background" 
              className={`w-full h-full transition-all duration-1000 ${styles.imageStyle}`} 
              style={data.theme === PosterTheme.WATERCOLOR ? { filter: 'url(#watercolor-filter)' } : undefined}
            />
        ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        )}
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 ${styles.overlay}`}></div>
      </div>

      {/* Main Content Container */}
      <div className={`relative z-30 w-full h-full ${styles.container}`}>
          
          {/* Header / Date Section */}
          <div className={styles.header}>
            <div className="flex flex-col">
               <span className={styles.fontDate}>
                  {day}
               </span>
               {/* Enhanced Lunar info for Minimalist theme */}
               {data.theme === PosterTheme.MINIMALIST && (
                 <div className="flex flex-col gap-1 mt-2">
                    <span className="text-gray-500 font-serif text-sm tracking-widest">{data.lunarDate}</span>
                    <span className="text-gray-400 font-sans text-xs uppercase tracking-wide flex items-center gap-2">
                        {data.solarTerm} · {year}
                    </span>
                 </div>
               )}
            </div>
            
            <div className={`flex flex-col items-end ${styles.fontMeta}`}>
               <span className="uppercase text-xl">{monthEn}</span>
               {data.theme !== PosterTheme.MINIMALIST && <span className="opacity-60">{year}</span>}
               {data.theme === PosterTheme.CYBERPUNK && <span className="text-cyan-400 animate-pulse">_SYS.READY</span>}
            </div>
          </div>

          {/* Special Layout for Ink Wash: Vertical Date/Lunar on Right */}
          {(data.theme as PosterTheme) === PosterTheme.INK_WASH ? (
            <div className="flex-grow flex items-start justify-center pt-10">
                 {/* Quote Area for Ink Wash (Vertical) */}
                 <div className={`${styles.fontQuote} h-3/4 flex flex-col-reverse items-center gap-4`}>
                     {data.quote.split('').map((char, i) => (
                       <span key={i} className="rotate-0">{char}</span>
                     ))}
                     <div className="w-px h-16 bg-red-800 opacity-50 my-4"></div>
                 </div>
            </div>
          ) : (
             /* Standard Quote Area */
             <div className="flex-grow flex flex-col justify-center">
                {data.theme === PosterTheme.OIL_PAINTING && <div className="mx-auto w-16 h-px bg-[#d4af37] mb-6 opacity-50"></div>}
                
                <p className={`${styles.fontQuote} relative`}>
                    {data.theme === PosterTheme.PHOTOREALISTIC && <Quote className="inline-block mr-2 mb-2 w-6 h-6 opacity-50" />}
                    {data.quote}
                </p>
                
                {data.theme !== PosterTheme.MINIMALIST && data.theme !== PosterTheme.RETRO_POP && (
                  <p className={`text-center mt-4 text-sm opacity-70 ${styles.accentColor} font-sans uppercase tracking-widest`}>
                     — {data.author} —
                  </p>
                )}
             </div>
          )}

          {/* Footer Section */}
          <div className={styles.footer}>
              {/* Layout for Ink Wash (Red Stamp style) */}
              {(data.theme as PosterTheme) === PosterTheme.INK_WASH ? (
                  <div className="flex flex-col gap-4 items-start w-full">
                      <div className="flex items-start gap-4">
                        <div className="border-[3px] border-red-800 p-3 inline-block text-red-800 font-calligraphy text-2xl leading-none opacity-90 rotate-[-2deg]">
                            {weekdayZh}
                        </div>
                         {/* Expanded Lunar Details for Ink Wash */}
                        <div className="flex flex-col text-xs text-gray-500 font-serif writing-vertical-rl h-24 gap-2 leading-loose">
                           <span className="font-bold text-gray-800">{data.lunarDate}</span>
                           <span>{data.solarTerm}</span>
                        </div>
                      </div>
                      
                      {/* Yi / Ji Stamp */}
                      <div className="flex gap-4 mt-2 border-t border-gray-300 pt-3 w-full">
                         <div className="flex flex-col gap-1 text-[10px] text-gray-600">
                            <span className="font-bold text-red-800 border border-red-800 px-1 rounded-sm self-start">宜</span>
                            <span>{data.yi}</span>
                         </div>
                         <div className="w-px bg-gray-300 h-full"></div>
                         <div className="flex flex-col gap-1 text-[10px] text-gray-600">
                            <span className="font-bold text-gray-800 border border-gray-800 px-1 rounded-sm self-start">忌</span>
                            <span>{data.ji}</span>
                         </div>
                      </div>
                  </div>
              ) : (
                /* Standard Footer */
                <div className="flex flex-col w-full gap-4">
                  {/* Minimalist Extra Info (Yi/Ji) */}
                  {data.theme === PosterTheme.MINIMALIST && (
                    <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4 mb-2">
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-gray-400">Suitable For</span>
                            <span className="text-xs font-serif text-gray-600">{data.yi}</span>
                         </div>
                         <div className="flex flex-col gap-1 text-right">
                            <span className="text-[10px] uppercase font-bold text-gray-400">Avoid</span>
                            <span className="text-xs font-serif text-gray-600">{data.ji}</span>
                         </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs md:text-sm w-full">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 opacity-90">
                        <div className="flex items-center gap-2">
                           <span className={styles.accentColor}><Feather size={14} /></span>
                           <span>{data.luckyItem}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className={styles.accentColor}><Palette size={14} /></span>
                           <span>{data.luckyColor}</span>
                        </div>
                        
                        {/* Lunar Date for Standard Themes */}
                        {data.theme !== PosterTheme.INK_WASH && data.theme !== PosterTheme.MINIMALIST && (
                          <div className="flex items-center gap-2 border-l border-current pl-4 ml-2 opacity-60">
                             <span>{data.lunarDate.split(' ').pop()}</span>
                             <span>{weekdayZh}</span>
                          </div>
                        )}
                    </div>

                    <div className={`flex items-center gap-2 ${styles.accentColor} opacity-90`}>
                        <ThemeIcon />
                        <span className="font-serif tracking-wide hidden md:inline">Inspiration</span>
                    </div>
                  </div>
                </div>
              )}
          </div>
      </div>
    </div>
  );
});

Poster.displayName = 'Poster';
export default Poster;