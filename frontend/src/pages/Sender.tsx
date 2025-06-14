// src/pages/Sender.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_SERVER_URL);

export default function Sender() {
  const { userId } = useParams<{ userId: string }>();
  const [intervals, setIntervals] = useState<{
    [key: string]: NodeJS.Timeout | null;
  }>({});

  const move = (dx: number, dy: number) => {
    if (userId) socket.emit("move", { userId, dx, dy });
  };

  const startMoving = (direction: string) => {
    const [dx, dy] =
      direction === "up"
        ? [0, -5]
        : direction === "down"
        ? [0, 5]
        : direction === "left"
        ? [-5, 0]
        : [5, 0];

    move(dx, dy);
    const id = setInterval(() => move(dx, dy), 100);
    setIntervals((prev) => ({ ...prev, [direction]: id }));
  };

  const stopMoving = (direction: string) => {
    const id = intervals[direction];
    if (id) clearInterval(id);
    setIntervals((prev) => ({ ...prev, [direction]: null }));
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: 6,
    padding: 12,
    width: 80,
    height: 80,
    margin: 8,
    fontSize: 12,
    touchAction: "none",
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "#fff",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div>
        <button
          style={buttonStyle}
          onTouchStart={() => startMoving("up")}
          onTouchEnd={() => stopMoving("up")}
        >
          ↑
        </button>
      </div>
      <div>
        <button
          style={buttonStyle}
          onTouchStart={() => startMoving("left")}
          onTouchEnd={() => stopMoving("left")}
        >
          ←
        </button>
        <button
          style={buttonStyle}
          onTouchStart={() => startMoving("down")}
          onTouchEnd={() => stopMoving("down")}
        >
          ↓
        </button>
        <button
          style={buttonStyle}
          onTouchStart={() => startMoving("right")}
          onTouchEnd={() => stopMoving("right")}
        >
          →
        </button>
      </div>
    </div>
  );
}
