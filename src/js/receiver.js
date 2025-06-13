// This file handles the logic for the receiver page, including generating the QR code and updating the display with incoming messages.

const qrCodeContainer = document.getElementById('qr-code');
const messageDisplay = document.getElementById('message-display');
const receivedText = document.getElementById('received-text');
const ws = new WebSocket(`ws://${window.location.hostname}:3000`);

// Generate QR code with the sender page URL
const senderURL = `http://${window.location.hostname}:3000/sender.html`;
QRCode.toCanvas(document.getElementById('qrcode'), senderURL, function (error) {
    if (error) console.error(error);
});

// Listen for messages from the sender
ws.onmessage = (event) => {
    receivedText.textContent = event.data;
};

// Initialize the receiver
function initReceiver() {
}

window.onload = initReceiver;