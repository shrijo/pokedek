const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
    socket.on('message', (message) => {
        // Broadcast the received message to all connected clients
        server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

console.log('WebSocket server is running on ws://localhost:8080');