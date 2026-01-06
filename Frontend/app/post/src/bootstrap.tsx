import { createRoot, type Root } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

declare global {
  interface Window {
    __HOST_APP__?: boolean;
  }
}

let root: Root | null = null;

/**
 * Mount cho host app
 */
export function mount(el: HTMLElement, props?: any) {
  if (!root) {
    root = createRoot(el);
  }

  root.render(<App {...props} />);
}

/**
 * Unmount khi host destroy
 */
export function unmount() {
  if (root) {
    root.unmount();
    root = null;
  }
}

/**
 * Detect standalone mode
 * Host app sẽ set window.__HOST_APP__ = true
 */
function isStandalone() {
  return !window.__HOST_APP__;
}

/**
 * Chạy standalone
 */
if (import.meta.env.DEV && isStandalone()) {
  const el = document.getElementById("root");
  if (el) {
    mount(el);
  }
}
