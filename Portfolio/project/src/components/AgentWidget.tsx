import { useEffect } from 'react';

export function AgentWidget() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/agent-widget.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = '/agent-widget.js';
    script.async = true;

    script.onload = () => {
      if (window.KoryAgent) {
        const serverUrl = import.meta.env.VITE_AGENT_SERVER_URL || 'http://localhost:8081';

        window.KoryAgent.init({
          serverUrl: serverUrl,
          avatarText: 'KS',
          agentName: "Kory's AI Assistant",
          agentTagline: 'Ask about skills, projects & more',
          placeholder: "Ask about Kory's experience...",
          welcomeTitle: '👋 Hi there!',
          welcomeMessage: "I'm Kory's AI assistant. Ask me anything about his background, skills, or projects!",
          suggestedQuestions: [
            '💻 What are your technical skills?',
            '🚀 Tell me about your projects',
            '🎯 What kind of roles are you seeking?',
            '🎓 Tell me about your education'
          ]
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  return null;
}

declare global {
  interface Window {
    KoryAgent?: {
      init: (config: any) => void;
      open: () => void;
      close: () => void;
      toggle: () => void;
      send: (message: string) => void;
    };
  }
}
