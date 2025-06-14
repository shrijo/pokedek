// src/pages/Sender.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_SERVER_URL);

const MOVE_DELTA = 5; // pixels per step
const MOVE_INTERVAL = 100; // ms between moves while holding

export default function Sender() {
  const { userId } = useParams<{ userId: string }>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  if (!userId) {
    return <div>Error: Missing userId in URL</div>;
  }

  // Function to send a move command to the server
  function sendMove(dx: number, dy: number) {
    socket.emit("move", { userId, dx, dy });
  }

  // Start continuous movement in given direction
  function startMoving(dx: number, dy: number) {
    if (intervalRef.current) return; // prevent multiple intervals
    sendMove(dx, dy); // initial move immediately
    intervalRef.current = setInterval(() => {
      sendMove(dx, dy);
    }, MOVE_INTERVAL);
  }

  // Stop movement
  function stopMoving() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  // Handlers for mouse and touch events
  const handlers = {
    onMouseDown: (dx: number, dy: number) => () => startMoving(dx, dy),
    onMouseUp: stopMoving,
    onMouseLeave: stopMoving,
    onTouchStart: (dx: number, dy: number) => (e: React.TouchEvent) => {
      e.preventDefault();
      startMoving(dx, dy);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.preventDefault();
      stopMoving();
    },
  };

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 300,
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h1>Sender</h1>
      <p>User ID: {userId.substring(0, 6)}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 80px)",
          gap: 10,
          justifyContent: "center",
        }}
      >
        <div />
        <button
          style={{ padding: 20 }}
          {...handlers.onMouseDown(0, -MOVE_DELTA)}
          onMouseUp={handlers.onMouseUp}
          onMouseLeave={handlers.onMouseLeave}
          onTouchStart={handlers.onTouchStart(0, -MOVE_DELTA)}
          onTouchEnd={handlers.onTouchEnd}
        >
          ↑
        </button>
        <div />

        <button
          style={{ padding: 20 }}
          {...handlers.onMouseDown(-MOVE_DELTA, 0)}
          onMouseUp={handlers.onMouseUp}
          onMouseLeave={handlers.onMouseLeave}
          onTouchStart={handlers.onTouchStart(-MOVE_DELTA, 0)}
          onTouchEnd={handlers.onTouchEnd}
        >
          ←
        </button>
        <div />
        <button
          style={{ padding: 20 }}
          {...handlers.onMouseDown(MOVE_DELTA, 0)}
          onMouseUp={handlers.onMouseUp}
          onMouseLeave={handlers.onMouseLeave}
          onTouchStart={handlers.onTouchStart(MOVE_DELTA, 0)}
          onTouchEnd={handlers.onTouchEnd}
        >
          →
        </button>

        <div />
        <button
          style={{ padding: 20 }}
          {...handlers.onMouseDown(0, MOVE_DELTA)}
          onMouseUp={handlers.onMouseUp}
          onMouseLeave={handlers.onMouseLeave}
          onTouchStart={handlers.onTouchStart(0, MOVE_DELTA)}
          onTouchEnd={handlers.onTouchEnd}
        >
          ↓
        </button>
        <div />
      </div>
    </div>
  );
}
