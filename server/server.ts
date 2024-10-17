import express, { Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
app.use(express.json());
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

// Store document states in memory
const documents: { [id: string]: string } = {};

// List to track wallet requests and approvals
const walletRequests: { walletAddress: string, status: 'pending' | 'approved' | 'rejected' }[] = [];
const approvedWallets: Set<string> = new Set();

// API to request wallet approval
app.post('/api/request-approval', (req: Request, res: Response) => {
  console.log("request from: ", req.body);
  const { walletAddress } = req.body;
  
  // Check if wallet has already been requested
  const existingRequest = walletRequests.find(req => req.walletAddress === walletAddress);
  if (existingRequest) {
    res.json({ status: existingRequest.status });
  } else {
    // Add the new wallet request to the list with a pending status
    walletRequests.push({ walletAddress, status: 'pending' });
    console.log("walletRequests: ", walletRequests);
    res.json({ status: 'pending' });
  }
});
 
// API to fetch pending requests (for admin)
app.get('/api/pending-requests', (req: Request, res: Response) => {
  const pendingRequests = walletRequests.filter(req => req.status === 'pending');
  res.json(pendingRequests);
});

// API to approve a wallet request
app.post('/api/approve-wallet', (req: Request, res: Response) => {
  const { walletAddress } = req.body;

  // Find the wallet request and mark it as approved
  const walletRequest = walletRequests.find(req => req.walletAddress === walletAddress);
  if (walletRequest) {
    walletRequest.status = 'approved';
    approvedWallets.add(walletAddress); // Add to approved list
    res.json({ status: 'approved' });
  } else {
    res.status(404).json({ error: 'Wallet request not found' });
  }
});

// API to reject a wallet request
app.post('/api/reject-wallet', (req: Request, res: Response) => {
  const { walletAddress } = req.body;

  // Find the wallet request and mark it as rejected
  const walletRequest = walletRequests.find(req => req.walletAddress === walletAddress);
  if (walletRequest) {
    walletRequest.status = 'rejected';
    res.json({ status: 'rejected' });
  } else {
    res.status(404).json({ error: 'Wallet request not found' });
  }
});

// WebSocket connection for collaboration
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join-room', (roomId, walletAddress) => {
    socket.join(roomId);
    console.log(`User with wallet ${walletAddress} joined room ${roomId}`);

    // Send the current document content to the newly connected user
    const currentContent = documents[roomId] || "Collaborative document content";
    socket.emit('document-update', currentContent);

    // Check if the wallet address is approved
    const isApproved = approvedWallets.has(walletAddress);
    socket.emit('wallet-status', isApproved ? 'approved' : 'not approved');
  });

  socket.on('ai-image-generated', (data) => {
    console.log("data: ", data);
    const { roomId, imageUrl } = data;

    // Broadcast the generated image URL to all users in the room
    io.to(roomId).emit('ai-image-generated', imageUrl);
  });

  socket.on('edit-document', (data) => {
    const { roomId, content, walletAddress } = data;

    // Only allow edits if the wallet address is approved
    if (approvedWallets.has(walletAddress)) {
      // Update the document state on the server
      documents[roomId] = content;

      // Broadcast the updated content to all users in the room except the sender
      socket.to(roomId).emit('document-update', content);
    } else {
      socket.emit('error', 'Wallet address not approved for editing.');
    }
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
