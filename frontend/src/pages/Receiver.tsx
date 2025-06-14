// src/pages/Receiver.tsx
import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import QRCode from "qrcode.react";
import { v4 as uuidv4 } from "uuid";

interface User {
  id: string;
  x: number;
  y: number;
  color: string;
}

// Replace with your backend URL (make sure socket.io server is running)
const socket: Socket = io(import.meta.env.VITE_SERVER_URL);

export default function Receiver() {
  const [users, setUsers] = useState<User[]>([]);

  const colors = ["red", "green", "blue", "orange", "purple"];

  // Add initial user on mount
  useEffect(() => {
    const firstUserId = uuidv4();
    setUsers([{ id: firstUserId, x: 50, y: 50, color: colors[0] }]);
  }, []);

  // Listen for 'move' events from sockets and update user positions
  useEffect(() => {
    socket.on("move", ({ userId, x, y }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, x, y } : user))
      );
    });

    return () => {
      socket.off("move");
    };
  }, []);

  // Add new user with different color and initial position
  function addUser() {
    setUsers((prevUsers) => {
      const newUserId = uuidv4();
      return [
        ...prevUsers,
        {
          id: newUserId,
          x: 50,
          y: 50,
          color: colors[prevUsers.length % colors.length],
        },
      ];
    });
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1>Receiver</h1>

      {/* Add User button */}
      <button
        onClick={addUser}
        style={{ marginBottom: 20, padding: "10px 20px" }}
      >
        Add User
      </button>

      {/* Canvas area */}
      <div
        style={{
          position: "relative",
          width: 400,
          height: 400,
          border: "2px solid black",
          marginBottom: 30,
          backgroundColor: "#f0f0f0",
          touchAction: "none",
        }}
      >
        {/* Squares representing users */}
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              position: "absolute",
              width: 40,
              height: 40,
              backgroundColor: user.color,
              left: user.x,
              top: user.y,
              borderRadius: 4,
              transition: "left 0.1s ease, top 0.1s ease",
              boxShadow: "0 0 5px rgba(0,0,0,0.3)",
            }}
          />
        ))}
      </div>

      <h2>QR Codes for Users</h2>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {users.map((user) => (
          <div key={user.id} style={{ textAlign: "center" }}>
            <QRCode
              value={`${window.location.origin}/sender/${user.id}`}
              size={128}
              includeMargin
            />
            <div style={{ marginTop: 8, fontSize: 14 }}>
              User ID: {user.id.substring(0, 6)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
