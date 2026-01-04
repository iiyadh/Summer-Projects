class WebSocketService {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.messageHandlers = new Map();
        this.isAuthenticated = false;
    }

    connect(token) {
        const isDev = Boolean(import.meta.env?.DEV);
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
        this.ws = new WebSocket(wsUrl);
        this.ws.onopen = () => {
            if (isDev) console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            this.send({
                type: 'authenticate',
                token: token
            });
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'authenticated' && data.success) {
                    this.isAuthenticated = true;
                    if (isDev) console.log('WebSocket authenticated');
                }
                const handlers = this.messageHandlers.get(data.type) || [];
                handlers.forEach(handler => handler(data));
                
            } catch (err) {
                console.error('Error parsing WebSocket message:', err);
            }
        };

        this.ws.onclose = () => {
            if (isDev) console.log('WebSocket disconnected');
            this.isAuthenticated = false;
            this.attemptReconnect(token);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    attemptReconnect(token) {
        const isDev = Boolean(import.meta.env?.DEV);
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            if (isDev) console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
            setTimeout(() => this.connect(token), this.reconnectDelay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket is not connected');
        }
    }

    sendMessage(chatId, content, participants) {
        const isDev = Boolean(import.meta.env?.DEV);
        this.send({
            type: 'message',
            chatId,
            content,
            participants
        });
        if (isDev) console.log(`Sent message to chat ${chatId}`);
    }

    sendTyping(chatId, participants, isTyping) {
        this.send({
            type: 'typing',
            chatId,
            participants,
            isTyping
        });
        
    }

    on(messageType, handler) {
        if (!this.messageHandlers.has(messageType)) {
            this.messageHandlers.set(messageType, []);
        }
        this.messageHandlers.get(messageType).push(handler);
    }

    off(messageType, handler) {
        const handlers = this.messageHandlers.get(messageType);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isAuthenticated = false;
        this.messageHandlers.clear();
    }
}

export default new WebSocketService();
