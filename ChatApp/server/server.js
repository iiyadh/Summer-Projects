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
    origin:"*",
    method:"*",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', require('./routes/AuthRoute'));
app.use('/api/recovery', require('./routes/passwordRoute'));

server.listen(process.env.PORT,()=>{
    console.log('Server is running on port ' + process.env.PORT);
})