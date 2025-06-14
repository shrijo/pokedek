import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

export default function SenderPage() {
  const { userId } = useParams<{ userId: string }>();
  const socketRef = React.useRef<Socket | null>(null);

  // Send movement to server
  const sendMove = (x: number, y: number) => {
    if (!userId || !socketRef.current) return;
    socketRef.current.emit("move", { id: userId, x, y });
  };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URL);
    socketRef.current = socket;

    // Touch controller for mobile
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const { clientX, clientY } = touch;
      sendMove(clientX, clientY);
    };

    // Mouse controller (fallback for desktop)
    const handleMouseMove = (e: MouseEvent) => {
      sendMove(e.clientX, e.clientY);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mousemove", handleMouseMove);
      socket.disconnect();
    };
  }, [userId]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Controller</h1>
      <p>Move your finger or mouse to control your square.</p>
      <p>
        <strong>User ID:</strong> {userId}
      </p>
    </div>
  );
}
