import { Volume2, VolumeX, Github, Linkedin, Mail, Move, Download } from 'lucide-react';
import { usePortfolioStore } from '../store';

export function Interface() {
  const { audioEnabled, toggleAudio, currentSection } = usePortfolioStore();

  const handleRecenter = () => {
    if (window.recenterCamera) {
      window.recenterCamera();
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-4 right-4 pointer-events-auto flex gap-2">
        <button
          onClick={handleRecenter}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          title="Recenter View"
        >
          <Move className="w-6 h-6" />
        </button>
        <button
          onClick={toggleAudio}
          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          {audioEnabled ? (
            <Volume2 className="w-6 h-6 text-white" />
          ) : (
            <VolumeX className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
      
      {/* Navigation - Now positioned in bottom right for mobile */}
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <nav className="flex flex-col gap-1.5">
          {['intro', 'projects', 'skills', 'experience'].map((section) => (
            <button
              key={section}
              className={`px-3 py-1.5 rounded-full transition-colors text-xs whitespace-nowrap ${
                currentSection === section
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/15'
              }`}
              onClick={() => usePortfolioStore.getState().setCurrentSection(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Contact Links */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <div className="flex gap-3">
          <a
            href="https://github.com/Ksmith18skc"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors group"
            title="GitHub"
          >
            <Github className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors" />
          </a>
          <a
            href="https://www.linkedin.com/in/korymsmith/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors group"
            title="LinkedIn"
          >
            <Linkedin className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors" />
          </a>
          <a
            href="mailto:korysmith@arizona.edu"
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors group"
            title="Email"
          >
            <Mail className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}
          // <a
          //   href="https://drive.google.com/file/d/1e7rILT-tXvDyJK-IQztFl6Z7einrFS93/view?usp=drive_link"
          //   download
          //   className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors group"
          //   title="Download Resume"
          // >
          //   <Download className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors" />
          // </a>