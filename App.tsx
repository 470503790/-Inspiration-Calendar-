
import React, { useState, useRef, useEffect } from 'react';
import { PosterTheme, PosterData, GenerationStatus } from './types';
import { generateDailyText, generatePosterImage } from './services/geminiService';
import Poster from './components/Poster';
import Controls from './components/Controls';
import { Sparkles, Sun, Moon, Key, X } from 'lucide-react';

// Declare html2canvas globally as it's loaded via CDN
declare const html2canvas: any;

const App: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [theme, setTheme] = useState<PosterTheme>(PosterTheme.MINIMALIST);
  const [posterData, setPosterData] = useState<PosterData | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // API Key Management
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  
  const posterRef = useRef<HTMLDivElement>(null);

  // Initialize checks
  useEffect(() => {
    // Check local storage for key
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      // If no key, show modal eventually (or rely on user clicking Generate which will trigger it)
      // Showing it immediately makes it clear what is needed
      setShowKeyModal(true);
    }
  }, []);

  const handleSaveKey = (inputKey: string) => {
    const key = inputKey.trim();
    if (key) {
      setApiKey(key);
      localStorage.setItem('gemini_api_key', key);
      setShowKeyModal(false);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      setShowKeyModal(true);
      return;
    }

    setStatus('generating_text');
    setError(null);
    try {
      // 1. Generate Text
      const textContent = await generateDailyText(date, theme, apiKey);
      
      setStatus('generating_image');
      // 2. Generate Image
      // Pass the text content to image generator to ensure relevance
      const imageUrl = await generatePosterImage(textContent, theme, apiKey);

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
      const msg = err.message || "Failed to generate content.";
      
      // Simple check for auth errors
      if (msg.includes('400') || msg.includes('401') || msg.includes('API key')) {
        setError("Invalid API Key or Quota exceeded. Please check your key.");
        setShowKeyModal(true);
      } else {
        setError(msg + " Please try again.");
      }
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
        
        {/* API Key Modal */}
        {showKeyModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100 dark:border-gray-700 relative">
                <button 
                  onClick={() => setShowKeyModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                      <Key size={24} />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 dark:text-white">Enter Gemini API Key</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                   This app requires a Gemini API Key to generate personalized content. Your key is stored locally in your browser and never sent to our servers.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); handleSaveKey((e.currentTarget.elements.namedItem('key') as HTMLInputElement).value); }}>
                   <input 
                     name="key"
                     type="password" 
                     placeholder="AIzaSy..." 
                     defaultValue={apiKey}
                     className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                     autoFocus
                   />
                   <button 
                     type="submit"
                     className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/30"
                   >
                     Save API Key
                   </button>
                </form>
                <div className="mt-4 text-center">
                   <a 
                     href="https://aistudio.google.com/app/apikey" 
                     target="_blank" 
                     rel="noreferrer"
                     className="text-xs text-blue-500 hover:underline"
                   >
                     Get a free API Key from Google AI Studio
                   </a>
                </div>
             </div>
          </div>
        )}

        {/* Header */}
        <header className="mb-8 text-center relative w-full max-w-6xl">
          <div className="absolute top-4 right-4 md:top-0 md:right-0 flex gap-2 z-50">
             {/* Key Button */}
             <button
               onClick={() => setShowKeyModal(true)}
               className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-300 transition-all hover:scale-110 border border-gray-100 dark:border-gray-700"
               title="Update API Key"
             >
               <Key size={20} />
             </button>
             {/* Dark Mode Toggle */}
             <button
               onClick={() => setIsDarkMode(!isDarkMode)}
               className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-gray-600 dark:text-yellow-400 transition-all hover:scale-110 border border-gray-100 dark:border-gray-700"
               aria-label="Toggle Dark Mode"
             >
               {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
          </div>

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
