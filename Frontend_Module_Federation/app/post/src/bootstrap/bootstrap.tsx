import { createRoot, type Root } from "react-dom/client";
import App from "../app/App";
import "./styles/index.css";

declare global {
  interface Window {
    __HOST_APP__?: boolean;
  }
}

let root: Root | null = null;

export function mount(
  el: HTMLElement,
  props?: {
    initialPath?: string;
    basename?: string;
  }
) {
  if (!root) {
    root = createRoot(el);
  }

  root.render(<App {...props} />);
}

export function unmount() {
  if (root) {
    root.unmount();
    root = null;
  }
}

function isStandalone() {
  return !window.__HOST_APP__;
}

if (import.meta.env.DEV && isStandalone()) {
  const el = document.getElementById("root");
  if (el) {
    mount(el);
  }
}
