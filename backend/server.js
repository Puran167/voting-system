require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const voterRoutes = require('./routes/voterRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const votingRoutes = require('./routes/votingRoutes');
const otpRoutes = require('./routes/otpRoutes');

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'];
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Attach Socket.IO instance to every request so controllers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/voters', voterRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/voting', votingRoutes);
app.use('/api/otp', otpRoutes);

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  let usingInMemory = false;
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB Atlas connection failed:', err.message);
    console.log('Falling back to in-memory MongoDB...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create({ instance: { launchTimeout: 60000 } });
    await mongoose.connect(mongoServer.getUri());
    console.log('Connected to in-memory MongoDB (data will not persist across restarts)');
    usingInMemory = true;
  }

  // Seed default accounts when using in-memory DB so login always works
  if (usingInMemory) {
    const User = require('./models/User');
    const existing = await User.countDocuments();
    if (existing === 0) {
      await User.create([
        { name: 'Admin', email: 'admin@voting.com', voterId: 'ADMIN001', fingerprintId: 'FPADMIN001', password: 'admin123', role: 'admin' },
        { name: 'Neha Gupta', email: 'neha.gupta04@gmail.com', voterId: 'VOT1001', fingerprintId: 'FP2001', password: 'voter123', role: 'voter' },
      ]);
      console.log('Seeded default accounts:');
      console.log('  Admin  -> Voter ID: ADMIN001 | Password: admin123');
      console.log('  Voter  -> Voter ID: VOT1001  | Password: voter123');
    }
  }

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
