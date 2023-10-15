import Express from "express";
import cors from "cors";
import { config } from "dotenv";
import colors from "colors";
// import { logger } from "./middlewares/logEvents.js";
config();
import connectToDatabase from "./database/index.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from './routes/messageRoutes.js';
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import path from 'path';

const app = Express();
app.use(Express.json());
app.use(cors());
// app.use(logger);
connectToDatabase();

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// **************************DEPLOYMENT CODE STARTS****************************

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(Express.static(path.join(__dirname1, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, '../client/dist/index.html'));
  })
} else {
  app.get("/", (req, res) => {
    res.send("API Running Successfully");
  });
}

// **************************DEPLOYMENT CODE END****************************

app.use(notFound);
app.use(errorHandler);


const server = app.listen(process.env.PORT || 5000, (err) => {
  console.log(`Server started on port ${process.env.PORT || 5000}`.yellow.bold);
});

import { Server } from 'socket.io';

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:5173'
  }
});

io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join_chat', (room_id) => {
    socket.join(room_id);
    console.log("User joined room: ", room_id);
  });

  socket.on('new_message', (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users is not defined");

    chat.users.forEach(user => {
      if (user._id === newMessageRecieved.sender._id)  return;
      socket.in(user._id).emit('Message received', newMessageRecieved);
    });
  });

  socket.on('typing', (room) => {
    socket.in(room).emit('typing');
  });

  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing');
  });

  socket.off('setup', (userData) => {
    console.log("Disconnected");
    socket.leave(userData._id);
  })
});