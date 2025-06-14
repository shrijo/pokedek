// src/pages/Receiver.tsx
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import QRCode from "qrcode.react";
import { v4 as uuidv4 } from "uuid";

interface User {
  id: string;
  color: string;
  x: number;
  y: number;
}

const socket: Socket = io(import.meta.env.VITE_SERVER_URL);
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const SQUARE_SIZE = 50;

export default function Receiver() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    if (users.length === 0) {
      const firstUser: User = {
        id: uuidv4(),
        color: "#00bcd4",
        x: CANVAS_WIDTH / 2 - SQUARE_SIZE / 2,
        y: CANVAS_HEIGHT / 2 - SQUARE_SIZE / 2,
      };
      setUsers([firstUser]);
      socket.emit("join", firstUser);
    }
  }, []);

  useEffect(() => {
    socket.on("move", ({ userId, dx, dy }) => {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                x: Math.min(Math.max(u.x + dx, 0), CANVAS_WIDTH - SQUARE_SIZE),
                y: Math.min(Math.max(u.y + dy, 0), CANVAS_HEIGHT - SQUARE_SIZE),
              }
            : u
        )
      );
    });

    socket.on("join", (newUser: User) => {
      setUsers((prev) =>
        prev.find((u) => u.id === newUser.id) ? prev : [...prev, newUser]
      );
    });

    return () => {
      socket.off("move");
      socket.off("join");
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    users.forEach(({ x, y, color }) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
    });
  }, [users]);

  function addUser() {
    const newUser: User = {
      id: uuidv4(),
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      x: Math.random() * (CANVAS_WIDTH - SQUARE_SIZE),
      y: Math.random() * (CANVAS_HEIGHT - SQUARE_SIZE),
    };
    setUsers((prev) => [...prev, newUser]);
    socket.emit("join", newUser);
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          flexGrow: sidebarVisible ? 0 : 1,
          width: sidebarVisible ? "70%" : "100%",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
      </div>

      {sidebarVisible && (
        <div
          style={{
            width: "30%",
            padding: 16,
            backgroundColor: "#1a1a1a",
            borderLeft: "1px solid #333",
            overflowY: "auto",
          }}
        >
          <h1 style={{ fontSize: 12, marginBottom: 8 }}>Pokedek Receiver</h1>

          <button
            onClick={() => setSidebarVisible(false)}
            style={{ marginBottom: 12 }}
          >
            Hide Sidebar
          </button>

          <button onClick={addUser} style={{ marginBottom: 12 }}>
            Add User
          </button>

          <div>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  backgroundColor: "#2a2a2a",
                  padding: 8,
                  borderRadius: 6,
                  marginBottom: 12,
                  border: "1px solid #444",
                }}
              >
                <p>User: {user.id.slice(0, 6)}</p>
                <QRCode
                  value={`${window.location.origin}/sender/${user.id}`}
                  size={96}
                  bgColor="#fff"
                  fgColor="#000"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {!sidebarVisible && (
        <button
          onClick={() => setSidebarVisible(true)}
          style={{
            position: "fixed",
            top: 12,
            right: 12,
            zIndex: 100,
          }}
        >
          Show Sidebar
        </button>
      )}
    </div>
  );
}
