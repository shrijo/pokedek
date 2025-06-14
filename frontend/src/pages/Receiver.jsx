import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode.react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL);

export default function Receiver() {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const [squares, setSquares] = useState({});
  const [nextUser, setNextUser] = useState(1);

  // join initial user 1
  useEffect(() => {
    socket.emit("join", { experienceId: id, userId: "1" });
    setNextUser(1);

    socket.on("state", (state) => setSquares(state));
    return () => socket.off("state");
  }, [id]);

  // draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Object.values(squares).forEach((sq) => {
      ctx.fillStyle = sq.color;
      ctx.fillRect(sq.x, sq.y, 40, 40);
    });
  }, [squares]);

  const addUser = () => {
    const newUser = String(nextUser + 1);
    setNextUser((u) => u + 1);
    socket.emit("join", { experienceId: id, userId: newUser });
  };

  const qrUrl = `${window.location.origin}/experience/${id}/sender?user=${nextUser}`;

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: "bold" }}>Receiver – Experience {id}</h2>
      <canvas ref={canvasRef} width={600} height={400} style={{ border: "1px solid #ccc", display: "block", marginTop: 12 }} />
      <div style={{ marginTop: 16 }}>
        <h3>Scan to control user {nextUser}</h3>
        <QRCode value={qrUrl} />
      </div>
      <button onClick={addUser} style={{ marginTop: 16, padding: "8px 12px" }}>
        Add user
      </button>
    </div>
  );
}
