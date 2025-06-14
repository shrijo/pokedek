// frontend/src/pages/Sender.tsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_SERVER_URL);

export default function Sender() {
  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch && userId) {
        socket.emit("move", {
          userId,
          x: touch.clientX,
          y: touch.clientY,
        });
      }
    };

    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      socket.disconnect();
    };
  }, [userId]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Controller for user {userId}</h1>
      <p>Move your finger on the screen to move your square.</p>
    </div>
  );
}
