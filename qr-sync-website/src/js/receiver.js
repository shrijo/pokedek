// This file handles the logic for the receiver page, including generating the QR code and updating the display with incoming messages.

const qrCodeContainer = document.getElementById('qr-code');
const messageDisplay = document.getElementById('message-display');
const websocket = new WebSocket('ws://your-websocket-url');

// Generate QR code
function generateQRCode(url) {
    const qrCode = new QRCode(qrCodeContainer, {
        text: url,
        width: 128,
        height: 128,
    });
}

// Listen for messages from the sender
websocket.onmessage = function(event) {
    const message = event.data;
    messageDisplay.innerText = message;
};

// Initialize the receiver
function initReceiver() {
    const senderUrl = 'http://your-sender-page-url'; // Replace with your sender page URL
    generateQRCode(senderUrl);
}

window.onload = initReceiver;