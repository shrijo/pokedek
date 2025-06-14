import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Receiver from "./pages/Receiver";
import Sender from "./pages/Sender";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* 👈 Add this */}
        <Route path="/receiver" element={<Receiver />} />
        <Route path="/sender/:userId" element={<Sender />} />
        <Route path="*" element={<h1>404 - Page not found</h1>} />
      </Routes>
    </Router>
  );
}

// Simple home component
function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome to Pokedek 👾</h1>
      <p>
        Go to <a href="/receiver">/receiver</a> to start an experience.
      </p>
    </div>
  );
}
