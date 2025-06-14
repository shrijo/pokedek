import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReceiverPage from "./pages/Receiver";
import SenderPage from "./pages/Sender";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/receiver" element={<ReceiverPage />} />
        <Route path="/sender/:userId" element={<SenderPage />} />
        <Route path="*" element={<h1>404 - Page not found</h1>} />
      </Routes>
    </Router>
  );
}
