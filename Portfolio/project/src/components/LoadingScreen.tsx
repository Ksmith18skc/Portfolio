import { useEffect, useState, useRef } from 'react';
import { usePortfolioStore } from '../store';
import { Terminal } from 'lucide-react';

const ASCII_ART = `
 ██ ▄█▀ ▒█████   ██▀███ ▓██   ██▓    ▒█████    ██████ 
 ██▄█▒ ▒██▒  ██▒▓██ ▒ ██▒▒██  ██▒   ▒██▒  ██▒▒██    ▒ 
▓███▄░ ▒██░  ██▒▓██ ░▄█ ▒ ▒██ ██░   ▒██░  ██▒░ ▓██▄   
▓██ █▄ ▒██   ██░▒██▀▀█▄   ░ ▐██▓░   ▒██   ██░  ▒   ██▒
▒██▒ █▄░ ████▓▒░░██▓ ▒██▒ ░ ██▒▓░   ░ ████▓▒░▒██████▒▒
▒ ▒▒ ▓▒░ ▒░▒░▒░ ░ ▒▓ ░▒▓░  ██▒▒▒    ░ ▒░▒░▒░ ▒ ▒▓▒ ▒ ░
░ ░▒ ▒░  ░ ▒ ▒░   ░▒ ░ ▒░▓██ ░▒░      ░ ▒ ▒░ ░ ░▒  ░ ░
░ ░░ ░ ░ ░ ░ ▒    ░░   ░ ▒ ▒ ░░     ░ ░ ░ ▒  ░  ░  ░  
░  ░       ░ ░     ░     ░ ░            ░ ░        ░  
                         ░ ░                           
`;

interface BootSequence {
  text: string;
  currentText: string;
}

export function LoadingScreen() {
  const [bootSequences, setBootSequences] = useState<BootSequence[]>([]);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { setLoading } = usePortfolioStore();

  const sequences = [
    'Booting Kory-OS v1.0...',
    'Initializing neural link...',
    'Syncing memory logs...',
    '[SUCCESS] AI/IT Business Stategy Analyst fetched',
    '[SUCCESS] University of Arizona IT Services experience loaded',
    '[SUCCESS] Breault Research Org. Software Engineer Internship data retrieved',
    '[SUCCESS] Proof of Beauty Blockchain Analysis imported',
    'Decrypting skill modules...',
    '[VERIFIED] Frontend Development Experience',
    '[VERIFIED] Backend Development Experience',
    '[VERIFIED] AI and Workflow Automation Experience',
    '[VERIFIED] Tools: Git, Docker, AWS, Azure, Linux',
    '[LOADED] Project archives and 3D interface...',
    'Establishing secure connection...',
    'System Ready. Time to meet Kory...'
  ];

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;
    const containerHeight = container.clientHeight;
    const contentHeight = content.clientHeight;
    const bottomPadding = 100;

    if (contentHeight > containerHeight - bottomPadding) {
      const newTranslateY = -(contentHeight - containerHeight + bottomPadding);
      setTranslateY(newTranslateY);
    }
  }, [bootSequences]);

  useEffect(() => {
    if (currentSequenceIndex >= sequences.length) {
      setTimeout(() => setLoading(false), 300);
      return;
    }

    setBootSequences(prev => [
      ...prev,
      { text: sequences[currentSequenceIndex], currentText: '' }
    ]);

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      setBootSequences(prev => {
        const newSequences = [...prev];
        const lastIndex = newSequences.length - 1;
        if (lastIndex >= 0 && charIndex < newSequences[lastIndex].text.length) {
          newSequences[lastIndex] = {
            ...newSequences[lastIndex],
            currentText: newSequences[lastIndex].text.substring(0, charIndex + 1)
          };
        }
        return newSequences;
      });

      charIndex++;

      if (charIndex >= sequences[currentSequenceIndex].length) {
        clearInterval(typeInterval);
        setTimeout(() => setCurrentSequenceIndex(prev => prev + 1), 50);
      }
    }, 5);

    return () => clearInterval(typeInterval);
  }, [currentSequenceIndex, sequences.length, setLoading]);

  const getTextColor = (text: string): string => {
    if (!text) return 'text-green-500';
    
    if (text.includes('[SUCCESS]')) return 'text-blue-400';
    if (text.includes('[VERIFIED]')) return 'text-yellow-400';
    if (text.includes('[LOADED]')) return 'text-purple-400';
    return 'text-green-500';
  };

  return (
    <div className="fixed inset-0 bg-black text-green-500 font-mono">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-scan" />
      <div className="absolute inset-0 pointer-events-none bg-green-500/5 animate-flicker" />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-center">
        <div className="hidden md:block mb-8 text-[0.6rem] sm:text-xs whitespace-pre font-mono text-green-500 opacity-70">
          {ASCII_ART}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-6 h-6" />
          <h1 className="text-xl">KORY-OS</h1>
          <span className="text-sm ml-auto text-green-400">v1.0</span>
        </div>

        <div ref={containerRef} className="flex-1 overflow-hidden min-h-0 py-4">
          <div
            ref={contentRef}
            className="space-y-1 transition-transform duration-500"
            style={{ transform: `translateY(${translateY}px)` }}
          >
            {bootSequences.map((sequence, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 animate-fadeIn transition-all duration-200 ${
                  index === bootSequences.length - 1 ? 'opacity-100' : 'opacity-70'
                }`}
                style={{
                  transform: `perspective(1000px) translateZ(${
                    (bootSequences.length - index) * -2
                  }px)`
                }}
              >
                <span className="text-green-400 shrink-0">&gt;</span>
                <span 
                  className={`${getTextColor(sequence.text)} whitespace-pre-wrap break-words`}
                  style={{ maxWidth: 'calc(100% - 2rem)' }}
                >
                  {sequence.currentText}
                  {sequence.currentText.length < sequence.text.length && <span className="animate-pulse">_</span>}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 mb-8">
          <div className="h-2 bg-green-900/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${(currentSequenceIndex / sequences.length) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-green-400">
            System Initialization: {Math.round((currentSequenceIndex / sequences.length) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}