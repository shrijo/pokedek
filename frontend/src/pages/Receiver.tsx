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

  // Add initial user on mount
  useEffect(() => {
    if (users.length === 0) {
      const firstUser: User = {
        id: uuidv4(),
        color: "#007bff", // blue
        x: CANVAS_WIDTH / 2 - SQUARE_SIZE / 2,
        y: CANVAS_HEIGHT / 2 - SQUARE_SIZE / 2,
      };
      setUsers([firstUser]);
      socket.emit("join", firstUser);
    }
  }, []);

  // Listen for moves from server
  useEffect(() => {
    socket.on(
      "move",
      ({ userId, dx, dy }: { userId: string; dx: number; dy: number }) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  x: Math.min(
                    Math.max(user.x + dx, 0),
                    CANVAS_WIDTH - SQUARE_SIZE
                  ),
                  y: Math.min(
                    Math.max(user.y + dy, 0),
                    CANVAS_HEIGHT - SQUARE_SIZE
                  ),
                }
              : user
          )
        );
      }
    );

    // Listen for new user join from server
    socket.on("join", (newUser: User) => {
      setUsers((prev) => {
        if (prev.find((u) => u.id === newUser.id)) return prev;
        return [...prev, newUser];
      });
    });

    return () => {
      socket.off("move");
      socket.off("join");
    };
  }, []);

  // Draw users on canvas
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

  // Add new user button handler
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
        overflow: "hidden",
      }}
    >
      {/* Canvas Container */}
      <div
        style={{
          flexGrow: sidebarVisible ? 0 : 1,
          width: sidebarVisible ? "70%" : "100%",
          height: "100%",
          backgroundColor: "#f0f0f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{
            border: "1px solid black",
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </div>

      {/* Sidebar */}
      {sidebarVisible && (
        <div
          style={{
            width: "30%",
            height: "100%",
            backgroundColor: "#fff",
            boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
            padding: 20,
            boxSizing: "border-box",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1>Pokedek Receiver</h1>

          <button
            onClick={() => setSidebarVisible(false)}
            style={{
              marginBottom: 20,
              padding: "10px 20px",
              cursor: "pointer",
              alignSelf: "flex-end",
            }}
          >
            Hide Sidebar
          </button>

          <button
            onClick={addUser}
            style={{
              padding: "10px 20px",
              marginBottom: 20,
              cursor: "pointer",
            }}
          >
            Add User
          </button>

          <div>
            <h2>QR Codes</h2>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  marginBottom: 20,
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  backgroundColor: "#fafafa",
                }}
              >
                <p>User: {user.id.substring(0, 6)}</p>
                <QRCode
                  value={`${window.location.origin}/sender/${user.id}`}
                  size={128}
                  bgColor="#fff"
                  fgColor="#000"
                  includeMargin={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show sidebar button when hidden */}
      {!sidebarVisible && (
        <button
          onClick={() => setSidebarVisible(true)}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            padding: "10px 15px",
            fontSize: 16,
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          Show Sidebar
        </button>
      )}
    </div>
  );
}
