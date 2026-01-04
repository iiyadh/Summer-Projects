const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });

const app  = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, maxPayload: 1024 * 1024 });
const clients = new Map();

app.set('trust proxy', 1);
app.disable('x-powered-by');

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

app.use(helmet());
app.use(compression());

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: Number(process.env.RATE_LIMIT_MAX || 300),
        standardHeaders: 'draft-7',
        legacyHeaders: false,
    })
);

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}))

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(cookieParser());


app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/recovery', require('./routes/passwordRoute'));
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/friends', require('./routes/friendsRoute'));
app.use('/api/chats', require('./routes/chatsRoutes'));

app.use(notFound);
app.use(errorHandler);

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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});