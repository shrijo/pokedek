// frontend/src/pages/Receiver.tsx
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

  useEffect(() => {
    // Add first user once on mount
    const firstUserId = uuidv4();
    setUsers([{ id: firstUserId, x: 50, y: 50, color: colors[0] }]);
  }, []);

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
    <div style={{ padding: 20 }}>
      <h1>Receiver</h1>
      <button onClick={addUser}>Add User</button>
      <div
        style={{
          position: "relative",
          width: 400,
          height: 400,
          border: "1px solid black",
          marginTop: 20,
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
              transition: "left 0.1s, top 0.1s",
            }}
          />
        ))}
      </div>

      <h2>QR Codes for Users</h2>
      <div style={{ display: "flex", gap: 20 }}>
        {users.map((user) => (
          <div key={user.id} style={{ textAlign: "center" }}>
            <QRCode
              value={`${window.location.origin}/sender/${user.id}`}
              size={128}
              includeMargin
            />
            <div>User: {user.id.substring(0, 6)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
