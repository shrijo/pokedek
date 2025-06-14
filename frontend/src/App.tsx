import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReceiverPage from "./pages/ReceiverPage";
import SenderPage from "./pages/SenderPage";

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
