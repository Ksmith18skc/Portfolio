/**
 * Kory Smith AI Agent Widget
 * Drop-in embeddable chat widget for portfolio sites
 * 
 * Usage:
 * 1. Include: <script src="agent-widget.js"></script>
 * 2. Include: <link rel="stylesheet" href="agent-widget.css">
 * 3. Initialize: <script>KoryAgent.init({ serverUrl: 'YOUR_SERVER_URL' });</script>
 */

const KoryAgent = (function() {
    let ws = null;
    let sessionId = generateSessionId();
    let messages = [];
    let isOpen = false;
    let isConnected = false;

    const config = {
        serverUrl: 'http://localhost:8081', // Update for production
        reconnectDelay: 3000,
        avatarText: 'KS',
        agentName: "Kory's AI Assistant",
        agentTagline: 'Ask about skills, projects & more',
        placeholder: "Ask about Kory's experience...",
        welcomeTitle: '👋 Hi there!',
        welcomeMessage: "I'm Kory's AI assistant. Ask me anything about his background, skills, or projects.",
        suggestedQuestions: [
            '💻 What are your technical skills?',
            '🚀 Tell me about your projects',
            '🎯 What kind of roles are you seeking?'
        ]
    };

    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Initialize the widget
     * @param {Object} options - Configuration options
     */
    function init(options = {}) {
        Object.assign(config, options);
        injectWidget();
        setupEventListeners();
        connect();
    }

    /**
     * Inject the widget HTML into the page
     */
    function injectWidget() {
        const widgetHTML = `
            <div id="kory-agent-widget">
                <div class="agent-window" id="agentWindow">
                    <div class="agent-header">
                        <div class="agent-avatar">${config.avatarText}</div>
                        <div class="agent-info">
                            <h3>${config.agentName}</h3>
                            <p>${config.agentTagline}</p>
                        </div>
                        <div class="agent-status" id="agentStatus"></div>
                    </div>

                    <div class="agent-messages" id="agentMessages">
                        <div class="agent-welcome">
                            <h4>${config.welcomeTitle}</h4>
                            <p>${config.welcomeMessage}</p>
                            <div class="agent-suggestions">
                                ${config.suggestedQuestions.map(q => `
                                    <button class="agent-suggestion" onclick="KoryAgent.send('${q.replace(/^[^\s]+\s/, '')}')">${q}</button>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="agent-input">
                        <input 
                            type="text" 
                            id="agentInput" 
                            placeholder="${config.placeholder}"
                        />
                        <button onclick="KoryAgent.send()">Send</button>
                    </div>
                </div>

                <button class="agent-fab" id="agentFab" onclick="KoryAgent.toggle()">
                    <svg viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                    </svg>
                    <span class="close-icon">✕</span>
                    <span class="agent-badge" id="agentBadge">1</span>
                </button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        const input = document.getElementById('agentInput');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') send();
            });
        }
    }

    /**
     * Connect to WebSocket server
     */
    function connect() {
        const url = new URL(config.serverUrl);
        const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${url.host}/ws`;

        console.log('[Agent Widget] Connecting to:', wsUrl);
        updateStatus('connecting');

        try {
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('[Agent Widget] Connected');
                isConnected = true;
                updateStatus('connected');
            };

            ws.onmessage = (event) => {
                handleMessage(event.data);
            };

            ws.onerror = (error) => {
                console.error('[Agent Widget] Error:', error);
                updateStatus('disconnected');
            };

            ws.onclose = () => {
                console.log('[Agent Widget] Disconnected');
                isConnected = false;
                updateStatus('disconnected');
                
                // Auto-reconnect
                setTimeout(() => {
                    if (!isConnected) connect();
                }, config.reconnectDelay);
            };
        } catch (error) {
            console.error('[Agent Widget] Connection failed:', error);
            updateStatus('disconnected');
        }
    }

    /**
     * Update connection status indicator
     */
    function updateStatus(status) {
        const statusEl = document.getElementById('agentStatus');
        if (statusEl) {
            statusEl.className = 'agent-status ' + (status === 'connected' ? '' : 'disconnected');
        }
    }

    let currentMessage = '';
    let messageElement = null;

    /**
     * Handle incoming WebSocket messages
     */
    function handleMessage(data) {
        const messagesContainer = document.getElementById('agentMessages');
        
        if (data === 'done') {
            // Message complete
            const typing = document.querySelector('.agent-typing');
            if (typing) typing.remove();
            
            currentMessage = '';
            messageElement = null;
            
            const sendBtn = document.querySelector('.agent-input button');
            if (sendBtn) sendBtn.disabled = false;
            
            scrollToBottom();
        } else if (data.startsWith('chunk:')) {
            // Stream chunk
            const chunk = data.substring(6);
            currentMessage += chunk;
            
            if (!messageElement) {
                const typing = document.querySelector('.agent-typing');
                if (typing) typing.remove();
                
                const welcome = document.querySelector('.agent-welcome');
                if (welcome) welcome.remove();
                
                const msgDiv = document.createElement('div');
                msgDiv.className = 'agent-message agent';
                msgDiv.innerHTML = `
                    <div class="agent-message-avatar">${config.avatarText}</div>
                    <div class="agent-message-content"></div>
                `;
                messagesContainer.appendChild(msgDiv);
                messageElement = msgDiv.querySelector('.agent-message-content');
            }
            
            messageElement.innerHTML = formatMessage(currentMessage);
            scrollToBottom();
        }
    }

    /**
     * Format message text (links, line breaks)
     */
    function formatMessage(text) {
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        text = text.replace(/\n/g, '<br>');
        return text;
    }

    /**
     * Toggle widget open/closed
     */
    function toggle() {
        isOpen = !isOpen;
        const window = document.getElementById('agentWindow');
        const fab = document.getElementById('agentFab');
        const badge = document.getElementById('agentBadge');
        
        if (isOpen) {
            window.classList.add('open');
            fab.classList.add('open');
            badge.classList.remove('show');
        } else {
            window.classList.remove('open');
            fab.classList.remove('open');
        }
    }

    /**
     * Send a message
     * @param {string} message - Message to send (optional, will use input value if not provided)
     */
    function send(message) {
        const input = document.getElementById('agentInput');
        const text = message || (input ? input.value.trim() : '');
        
        if (!text || !isConnected) return;
        
        // Remove welcome if present
        const welcome = document.querySelector('.agent-welcome');
        if (welcome) welcome.remove();
        
        // Add user message
        const messagesContainer = document.getElementById('agentMessages');
        const userMsg = document.createElement('div');
        userMsg.className = 'agent-message user';
        userMsg.innerHTML = `
            <div class="agent-message-avatar">YOU</div>
            <div class="agent-message-content">${text}</div>
        `;
        messagesContainer.appendChild(userMsg);
        
        // Add typing indicator
        const typingMsg = document.createElement('div');
        typingMsg.className = 'agent-message agent';
        typingMsg.innerHTML = `
            <div class="agent-message-avatar">${config.avatarText}</div>
            <div class="agent-typing active">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        messagesContainer.appendChild(typingMsg);
        
        scrollToBottom();
        
        // Send to WebSocket
        messages.push({ role: 'user', content: text });
        ws.send(JSON.stringify({
            session_id: sessionId,
            messages: messages
        }));
        
        // Clear input
        if (input) {
            input.value = '';
            input.focus();
        }
        
        const sendBtn = document.querySelector('.agent-input button');
        if (sendBtn) sendBtn.disabled = true;
    }

    /**
     * Scroll messages to bottom
     */
    function scrollToBottom() {
        const container = document.getElementById('agentMessages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    /**
     * Open the widget programmatically
     */
    function open() {
        if (!isOpen) toggle();
    }

    /**
     * Close the widget programmatically
     */
    function close() {
        if (isOpen) toggle();
    }

    // Public API
    return {
        init,
        toggle,
        send,
        open,
        close,
        connect
    };
})();
