const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

let socketsConnected = new Set();

io.on('connection', (socket) => {
  socketsConnected.add(socket.id);
  io.emit("clients-total", socketsConnected.size);

  socket.on('join', (username) => {
    socket.broadcast.emit('chat-message', {
      name: 'System',
      message: `${username || 'Anonymous'} joined the chat`,
      dateTime: new Date()
    });
  });

  socket.on('message', (data) => {
    socket.broadcast.emit('chat-message', data);
  });

  // ✅ NEW: Handle file upload
  socket.on('file-upload', (fileData) => {
    socket.broadcast.emit('file-receive', fileData);
  });

  socket.on('disconnect', () => {
    socketsConnected.delete(socket.id);
    io.emit("clients-total", socketsConnected.size);
  });
});
