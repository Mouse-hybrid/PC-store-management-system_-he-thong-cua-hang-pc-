import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";
import { ElementSignIn } from "./index.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ElementSignIn />
  </StrictMode>,
);
