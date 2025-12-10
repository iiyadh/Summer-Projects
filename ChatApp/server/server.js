const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');
require('dotenv').config();
require('mongoose').connect(process.env.DB_URL).then(()=>{
    console.log('Connected to MongoDB');
})

const app  = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

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

server.listen(process.env.PORT,()=>{
    console.log('Server is running on port ' + process.env.PORT);
})