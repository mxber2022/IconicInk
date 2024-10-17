import express, { Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

// CORS middleware for Express
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from Next.js frontend
  methods: ['GET', 'POST'],
  credentials: true, // Enable cookies or credentials if necessary
}));

// CORS configuration for Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Store document states in memory (you may use a database in a real application)
const documents: { [id: string]: string } = {};

// API route to get the document
app.get('/api/document/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const content = documents[id] || "Collaborative document content"; // Return existing content or default content
  res.json({ id, content });
});

// WebSocket connection for collaboration
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);

    // Send the current document content to the newly connected user
    const currentContent = documents[roomId] || "Collaborative document content";
    socket.emit('document-update', currentContent);
  });

  socket.on('edit-document', (data) => {
    const { roomId, content } = data;

    // Update the document state on the server
    documents[roomId] = content;

    // Broadcast the updated content to all users in the room except the sender
    socket.to(roomId).emit('document-update', content);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
