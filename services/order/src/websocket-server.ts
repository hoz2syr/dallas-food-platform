import { Server } from 'socket.io';
import http from 'http';

export function setupWebSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-order-room', (orderId: string) => {
      socket.join(`order-${orderId}`);
      console.log(`Client joined order room: order-${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
