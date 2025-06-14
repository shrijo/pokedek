import React, { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

type User = {
  id: string;
  color: string;
  position: { x: number; y: number };
};

const colors = ["red", "blue", "green", "orange", "purple"];

export default function ReceiverPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const addNewUser = () => {
    const id = uuidv4();
    const color = colors[users.length % colors.length];
    const newUser: User = {
      id,
      color,
      position: { x: 100 + users.length * 60, y: 100 },
    };

    setUsers((prev) => [...prev, newUser]);

    socket?.emit("add-user", { id, color });
  };

  // Draw users
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    users.forEach((user) => {
      ctx.fillStyle = user.color;
      ctx.fillRect(user.position.x, user.position.y, 50, 50);
    });
  }, [users]);

  // Setup socket
  useEffect(() => {
    const s = io(import.meta.env.VITE_SERVER_URL);
    setSocket(s);

    s.on("move", ({ id, x, y }) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, position: { x, y } } : user
        )
      );
    });

    return () => {
      s.disconnect();
    };
  }, []);

  // Add first user on mount (after socket is ready)
  useEffect(() => {
    if (socket && users.length === 0) {
      addNewUser();
    }
  }, [socket]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Receiver Page</h1>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{ border: "1px solid #ccc" }}
      />
      <div
        style={{
          display: "flex",
          gap: "2rem",
          marginTop: "1rem",
          flexWrap: "wrap",
        }}
      >
        {users.map((user) => (
          <div key={user.id}>
            <p style={{ color: user.color }}>{user.color} player</p>
            <QRCodeCanvas
              value={`${window.location.origin}/sender/${user.id}`}
              size={128}
            />
          </div>
        ))}
      </div>
      <button onClick={addNewUser} style={{ marginTop: "1rem" }}>
        ➕ Add user
      </button>
    </div>
  );
}
