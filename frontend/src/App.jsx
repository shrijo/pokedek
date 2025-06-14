import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Receiver from "./pages/Receiver";
import Sender from "./pages/Sender";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/experience/:id/receiver", element: <Receiver /> },
  { path: "/experience/:id/sender", element: <Sender /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
