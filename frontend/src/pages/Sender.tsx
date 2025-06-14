// src/pages/Sender.tsx
import React from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

const socket: Socket = io(import.meta.env.VITE_SERVER_URL);

export default function Sender() {
  const { userId } = useParams<{ userId: string }>();

  if (!userId) return <div>User ID missing in URL</div>;

  function sendMove(dx: number, dy: number) {
    socket.emit("move", { userId, dx, dy });
  }

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 300,
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h1>Sender Controller</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={() => sendMove(0, -10)}>Up</button>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => sendMove(-10, 0)}>Left</button>
          <button onClick={() => sendMove(10, 0)}>Right</button>
        </div>
        <button onClick={() => sendMove(0, 10)}>Down</button>
      </div>
    </div>
  );
}
