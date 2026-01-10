import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function mount(el: HTMLElement) {
  const root = createRoot(el);
  root.render(<App />);
}

export default { mount };

// chạy standalone
if (import.meta.env.DEV) {
  const el = document.getElementById("root");
  if (el) {
    mount(el);
  }
}
