import { BrowserRouter, MemoryRouter } from "react-router-dom";
import AppRoutes from "./router";

type AppProps = {
  /**
   * Dùng cho host app
   */
  initialPath?: string;
  /**
   * basename nếu dùng BrowserRouter
   */
  basename?: string;
};

export default function App({ initialPath, basename }: AppProps) {
  // Nếu có initialPath → đang chạy trong host
  if (initialPath) {
    return (
      <MemoryRouter initialEntries={[initialPath]}>
        <AppRoutes />
      </MemoryRouter>
    );
  }

  // Standalone
  return (
    <BrowserRouter basename={basename}>
      <AppRoutes />
    </BrowserRouter>
  );
}
