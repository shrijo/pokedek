import { useParams, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL);

export default function Sender() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const userId = params.get("user");

  useEffect(() => {
    socket.emit("join", { experienceId: id, userId });
  }, [id, userId]);

  const move = (dx, dy) => {
    socket.emit("move", { userId, dx, dy });
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 style={{ fontSize: 20, fontWeight: "bold" }}>Sender {userId}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 60px)", gap: 8, marginTop: 16 }}>
        <button onClick={() => move(0, -10)} style={{ gridColumnStart: 2, padding: 16 }}>⬆️</button>
        <button onClick={() => move(-10, 0)} style={{ padding: 16 }}>⬅️</button>
        <button onClick={() => move(10, 0)} style={{ padding: 16 }}>➡️</button>
        <button onClick={() => move(0, 10)} style={{ gridColumnStart: 2, padding: 16 }}>⬇️</button>
      </div>
    </div>
  );
}
