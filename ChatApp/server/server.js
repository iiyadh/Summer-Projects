const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
require('dotenv').config();
require('mongoose').connect(process.env.DB_URL).then(()=>{
    console.log('Connected to MongoDB');
})

const app  = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});
const clients = new Map();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}))

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/recovery', require('./routes/passwordRoute'));
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/friends', require('./routes/friendsRoute'));
app.use('/api/chats', require('./routes/chatsRoutes'));

// WebSocket connection handler
wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection attempt');
    
    let userId = null;

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);

            
            if (data.type === 'authenticate') {
                const token = data.token;
                
                try {
                    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                    userId = payload.userId;
                    
                    // Store the connection
                    clients.set(userId, ws);
                    
                    console.log(`User ${userId} authenticated via WebSocket`);
                    
                    // Send confirmation
                    ws.send(JSON.stringify({
                        type: 'authenticated',
                        success: true,
                        userId: userId
                    }));

                    // Notify user is online
                    broadcastUserStatus(userId, 'online');
                    
                } catch (err) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Invalid token'
                    }));
                    ws.close();
                }
            }

            // Handle chat messages
            else if (data.type === 'message') {
                if (!userId) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Not authenticated'
                    }));
                    return;
                }

                const { chatId, content, participants } = data;

                // Broadcast to all participants in the chat
                participants.forEach(participantId => {
                    if (participantId !== userId) {
                        const participantWs = clients.get(participantId);
                        if (participantWs && participantWs.readyState === WebSocket.OPEN) {
                            participantWs.send(JSON.stringify({
                                type: 'new_message',
                                chatId,
                                message: {
                                    sender: userId,
                                    content,
                                    timestamp: new Date()
                                }
                            }));
                        }
                    }
                });
            }

            // Handle typing indicator
            else if (data.type === 'typing') {
                if (!userId) return;

                const { chatId, participants, isTyping } = data;
                
                participants.forEach(participantId => {
                    if (participantId !== userId) {
                        const participantWs = clients.get(participantId);
                        if (participantWs && participantWs.readyState === WebSocket.OPEN) {
                            participantWs.send(JSON.stringify({
                                type: 'user_typing',
                                chatId,
                                userId,
                                isTyping
                            }));
                        }
                    }
                });
            }

        } catch (err) {
            console.error('Error processing message:', err);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Invalid message format'
            }));
        }
    });

    ws.on('close', () => {
        if (userId) {
            clients.delete(userId);
            console.log(`User ${userId} disconnected`);
            broadcastUserStatus(userId, 'offline');
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Helper function to broadcast user status
function broadcastUserStatus(userId, status) {
    const message = JSON.stringify({
        type: 'user_status',
        userId,
        status
    });

    clients.forEach((client, clientId) => {
        if (clientId !== userId && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

server.listen(process.env.PORT,()=>{
    console.log('Server is running on port ' + process.env.PORT);
})