// src/pages/Sender.tsx
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SenderProps {
  userId: string; // from URL param
}

const socket: Socket = io(import.meta.env.VITE_SERVER_URL);

export default function Sender({ userId }: SenderProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  // Send move events when position changes
  useEffect(() => {
    socket.emit("move", { userId, x: position.x, y: position.y });
  }, [position, userId]);

  // Handle pointer or touch move inside the control box
  function handleMove(
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) {
    e.preventDefault();

    let clientX: number, clientY: number;

    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return;
    }

    // Get the bounding rect of the div
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();

    // Calculate x and y relative to the control div (clamp between 0 and width/height)
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width - 40);
    const y = Math.min(Math.max(clientY - rect.top, 0), rect.height - 40);

    setPosition({ x, y });
  }

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
      <h1>Sender Controller</h1>
      <div
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        style={{
          width: 400,
          height: 400,
          border: "2px solid black",
          backgroundColor: "#eee",
          position: "relative",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        {/* The square representing the user finger */}
        <div
          style={{
            position: "absolute",
            width: 40,
            height: 40,
            backgroundColor: "dodgerblue",
            borderRadius: 6,
            left: position.x,
            top: position.y,
            pointerEvents: "none",
            boxShadow: "0 0 8px rgba(30,144,255,0.7)",
            transition: "left 0.05s ease, top 0.05s ease",
          }}
        />
      </div>
      <p style={{ marginTop: 10 }}>
        Move your finger or mouse inside the box to control your square.
      </p>
    </div>
  );
}
