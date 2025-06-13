const ws = new WebSocket(`ws://${window.location.hostname}:3000`);
const textInput = document.getElementById("text-input");

textInput.addEventListener("input", (e) => {
  ws.send(e.target.value);
});
