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

const socket: Socket = io(import.meta.env.VITE_SERVER_URL);

export default function Receiver() {
  const [users, setUsers] = useState<User[]>([]);

  const colors = ["red", "green", "blue", "orange", "purple"];

  // Create the first user initially on mount
  useEffect(() => {
    const firstUserId = uuidv4();
    setUsers([{ id: firstUserId, x: 50, y: 50, color: colors[0] }]);
  }, []);

  // Listen to move commands with dx, dy deltas
  useEffect(() => {
    socket.on(
      "move",
      ({ userId, dx, dy }: { userId: string; dx: number; dy: number }) => {
        setUsers((prevUsers) => {
          const userExists = prevUsers.some((user) => user.id === userId);
          if (!userExists) {
            console.warn(`Received move for unknown userId: ${userId}`);
            return prevUsers; // Ignore unknown user moves
          }

          return prevUsers.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  x: Math.min(Math.max(user.x + dx, 0), 360), // Clamp inside 400-40
                  y: Math.min(Math.max(user.y + dy, 0), 360),
                }
              : user
          );
        });
      }
    );

    return () => {
      socket.off("move");
    };
  }, []);

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

      <button
        onClick={addUser}
        style={{ marginBottom: 20, padding: "10px 20px" }}
      >
        Add User
      </button>

      <div
        style={{
          position: "relative",
          width: 400,
          height: 400,
          border: "2px solid black",
          marginBottom: 30,
          backgroundColor: "#f0f0f0",
        }}
      >
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
              boxShadow: "0 0 5px rgba(0,0,0,0.3)",
              transition: "left 0.1s ease, top 0.1s ease",
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
