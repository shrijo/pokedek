# qr-sync-website

This project is a simple web application that allows real-time communication between a sender and a receiver using QR codes. The receiver page displays a QR code that can be scanned to access the sender page on a smartphone. The sender page includes a text field where users can input text, which will be displayed in real-time on the receiver page.

## Project Structure

```
qr-sync-website
├── src
│   ├── index.html          # Main entry point of the website
│   ├── receiver.html       # Receiver page displaying the QR code
│   ├── sender.html         # Sender page with a text field
│   ├── css
│   │   └── styles.css      # Styles for the website
│   ├── js
│   │   ├── receiver.js     # Logic for the receiver page
│   │   └── sender.js       # Logic for the sender page
│   └── utils
│       └── websocket.js    # WebSocket connection setup
├── package.json            # npm configuration file
└── README.md               # Project documentation
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd qr-sync-website
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Open `src/index.html` in your web browser to access the application.

## Usage

- Scan the QR code displayed on the receiver page to open the sender page on your smartphone.
- Enter text in the sender page's text field to see it appear in real-time on the receiver page.

## License

This project is licensed under the MIT License.