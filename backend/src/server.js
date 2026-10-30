// IMPORTING ESSENTIAL LIBRARIES
import express from 'express'; // REQUIREMENT: Core framework for building the web API. IMPORTANCE: Handles HTTP requests, routing, and middleware.
import cors from 'cors'; // REQUIREMENT: Security middleware. IMPORTANCE: Allows the frontend (running on a different port/domain) to safely communicate with this backend.
import dotenv from 'dotenv'; // REQUIREMENT: Configuration management. IMPORTANCE: Loads environment variables (like database URLs and secrets) from a .env file.
import { createServer } from 'http'; // REQUIREMENT: Node.js native HTTP module. IMPORTANCE: Necessary to wrap the Express app so it can support both standard HTTP and WebSockets (Socket.IO).
import { Server } from 'socket.io'; // REQUIREMENT: Real-time communication library. IMPORTANCE: Enables instant, bi-directional communication (like chat or live notifications) between server and clients.

// IMPORTING ROUTE HANDLERS
import authRoutes from './routes/authRoutes.js'; // REQUIREMENT: User identity logic. IMPORTANCE: Manages signup, login, and security tokens.
import discussionRoutes from './routes/discussionRoutes.js'; // REQUIREMENT: Community features logic. IMPORTANCE: Handles creating and fetching forum posts.
import aiRoutes from './routes/aiRoutes.js'; // REQUIREMENT: Artificial Intelligence integration. IMPORTANCE: Manages requests to AI models for the assistant feature.
import missionRoutes from './routes/missionRoutes.js'; // REQUIREMENT: Gamification/Task logic. IMPORTANCE: Handles user goals and mission tracking.

// CONFIGURATION
dotenv.config(); // REQUIREMENT: Execution of env loading. IMPORTANCE: Must be called early to ensure all following code can access configuration variables.

const app = express(); // REQUIREMENT: Express application instance. IMPORTANCE: The main object used to define routes and middleware.
const httpServer = createServer(app); // REQUIREMENT: HTTP server instance. IMPORTANCE: Acts as the foundation for both the Express API and the Socket.IO server.

// SOCKET.IO INITIALIZATION
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // REQUIREMENT: Security setting. IMPORTANCE: Restricts WebSocket connections to only the trusted frontend URL.
    methods: ["GET", "POST"] // REQUIREMENT: Allowed HTTP verbs. IMPORTANCE: Defines how the frontend can interact during the initial handshake.
  }
});

// MIDDLEWARE SETUP
app.use(cors()); // REQUIREMENT: Enable Cross-Origin Resource Sharing. IMPORTANCE: Essential for modern web apps where frontend and backend are decoupled.
app.use(express.json()); // REQUIREMENT: Body parser. IMPORTANCE: Automatically converts incoming JSON request bodies into JavaScript objects for easy access in routes.

// API ROUTE MOUNTING
app.use('/api/auth', authRoutes); // REQUIREMENT: Auth endpoint prefix. IMPORTANCE: Organizes all authentication-related requests under /api/auth.
app.use('/api/discussions', discussionRoutes); // REQUIREMENT: Discussion endpoint prefix. IMPORTANCE: Organizes forum/community logic.
app.use('/api/ai', aiRoutes); // REQUIREMENT: AI endpoint prefix. IMPORTANCE: Handles all interaction with the AI assistant.
app.use('/api/missions', missionRoutes); // REQUIREMENT: Missions endpoint prefix. IMPORTANCE: Manages user tasks and rewards.

// BASE ROUTE
app.get('/', (req, res) => {
  res.json({ message: "Welcome to GrowBro API" }); // REQUIREMENT: Health check/Landing. IMPORTANCE: Provides a simple way to verify the server is running.
});

// SOCKET.IO REAL-TIME LOGIC
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id); // REQUIREMENT: Connection monitoring. IMPORTANCE: Helps track active users and debug connection issues.

  socket.on('join_room', (room) => {
    socket.join(room); // REQUIREMENT: Room isolation. IMPORTANCE: Allows users to group together (e.g., in a specific chat) so messages don't go to everyone.
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.room).emit('receive_message', data); // REQUIREMENT: Message broadcasting. IMPORTANCE: Sends a message from one user to all others in the same room instantly.
  });

  socket.on('disconnect', () => {
    console.log('User disconnected'); // REQUIREMENT: Cleanup monitoring. IMPORTANCE: Signals when a user has left the real-time session.
  });
});

// SERVER STARTUP
const PORT = process.env.PORT || 5000; // REQUIREMENT: Network port selection. IMPORTANCE: Uses a configured port or defaults to 5000.
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // REQUIREMENT: Startup confirmation. IMPORTANCE: Informs the developer that the backend is ready to receive traffic.
});
