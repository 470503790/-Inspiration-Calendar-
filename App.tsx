import React, { useState, useRef, useEffect } from 'react';
import { PosterTheme, PosterData, GenerationStatus } from './types';
import { generateDailyText, generatePosterImage } from './services/geminiService';
import Poster from './components/Poster';
import Controls from './components/Controls';
import { Sparkles, Sun, Moon } from 'lucide-react';

// Declare html2canvas globally as it's loaded via CDN
declare const html2canvas: any;

const App: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [theme, setTheme] = useState<PosterTheme>(PosterTheme.MINIMALIST);
  const [posterData, setPosterData] = useState<PosterData | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  const posterRef = useRef<HTMLDivElement>(null);

  // Initialize with a default poster on first load if no API key issues
  useEffect(() => {
    // Optional: Auto generate on mount? Maybe better to let user choose first.
  }, []);

  const handleGenerate = async () => {
    setStatus('generating_text');
    setError(null);
    try {
      // 1. Generate Text
      const textContent = await generateDailyText(date, theme);
      
      setStatus('generating_image');
      // 2. Generate Image
      // Pass the text content to image generator to ensure relevance
      const imageUrl = await generatePosterImage(textContent, theme);

      setStatus('finalizing');
      // Artificial delay to allow the user to see the "Finalizing" state and for images to prep
      await new Promise(resolve => setTimeout(resolve, 800));

      setPosterData({
        ...textContent,
        date,
        theme,
        imageUrl
      });
      setStatus('complete');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate content. Please check your API Key or try again.");
      setStatus('error');
    }
  };

  const handleDownload = async () => {
    if (!posterRef.current || !posterData) return;
    
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2, // Higher quality
        useCORS: true, // Important for external images if any, though ours are base64
        backgroundColor: null,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `inspiration-calendar-${date.toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download image.");
    }
  };

  const handleShare = async () => {
    if (!posterRef.current || !posterData) return;

    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) return;

        const filesArray = [
          new File([blob], `inspiration-${posterData.date.toISOString().split('T')[0]}.png`, {
            type: 'image/png',
            lastModified: new Date().getTime(),
          }),
        ];

        const shareData = {
          files: filesArray,
          title: '灵感日历',
          text: `Here is my daily inspiration for ${date.toDateString()}`,
        };

        // Check if native sharing is available
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
          } catch (err) {
            if ((err as Error).name !== 'AbortError') {
               console.error('Error sharing:', err);
               // If share fails but not due to cancellation, try clipboard
               copyToClipboard(blob);
            }
          }
        } else {
          // Fallback to clipboard
          copyToClipboard(blob);
        }
      }, 'image/png');
    } catch (err) {
      console.error("Share generation failed", err);
    }
  };

  const copyToClipboard = async (blob: Blob) => {
    try {
      // ClipboardItem might not be available in all TS environments without specific lib settings, cast to any if needed
      const ClipboardItem = (window as any).ClipboardItem;
      if (ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        alert('Image copied to clipboard!');
      } else {
        throw new Error('ClipboardItem API unavailable');
      }
    } catch (err) {
      console.warn("Clipboard write failed, falling back to download", err);
      alert("Sharing not supported. Downloading image instead.");
      handleDownload();
    }
  };

  // Helper to check if any generation activity is happening
  const isGenerating = status === 'generating_text' || status === 'generating_image' || status === 'finalizing';

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#f3f4f6] dark:bg-gray-900 p-4 md:p-8 flex flex-col items-center transition-colors duration-300">
        {/* Header */}
        <header className="mb-8 text-center relative w-full max-w-6xl">
          {/* Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="fixed top-4 right-4 md:absolute md:top-0 md:right-0 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-gray-600 dark:text-yellow-400 transition-all hover:scale-110 border border-gray-100 dark:border-gray-700 z-50"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="flex items-center justify-center gap-3 mb-2 pt-2 md:pt-0">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
               <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-gray-800 dark:text-gray-100 tracking-tight transition-colors">
              灵感日历
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-light transition-colors">
            Daily Inspiration Calendar Generator
          </p>
        </header>

        {/* Main Content Grid */}
        <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 self-start">
             <Controls 
               date={date}
               setDate={setDate}
               theme={theme}
               setTheme={setTheme}
               onGenerate={handleGenerate}
               onDownload={handleDownload}
               isGenerating={isGenerating}
             />
             {error && (
               <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300 text-sm transition-colors">
                 {error}
               </div>
             )}
             
             {/* Granular Progress Messages */}
             {status === 'generating_text' && (
               <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300 animate-pulse bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2">
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                 正在寻找今日灵感... (Fetching inspiration quotes...)
               </div>
             )}
             {status === 'generating_image' && (
               <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300 animate-pulse bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2">
                 <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                 正在绘制艺术背景... (Creating artwork...)
               </div>
             )}
             {status === 'finalizing' && (
               <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300 animate-pulse bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                 正在完成海报... (Finalizing poster...)
               </div>
             )}
          </div>

          {/* Right Column: Poster Preview */}
          <div className="lg:col-span-8 flex flex-col items-center">
             <div className="w-full max-w-[600px] transform hover:scale-[1.01] transition-transform duration-500">
                <Poster 
                  ref={posterRef} 
                  data={posterData} 
                  loading={isGenerating}
                  onShare={handleShare}
                />
             </div>
             
             <div className="mt-6 text-gray-400 dark:text-gray-500 text-xs text-center max-w-md transition-colors">
                <p>Content generated by Gemini 2.5 Flash & Flash Image.</p>
                <p>AI generated content may be inaccurate.</p>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;