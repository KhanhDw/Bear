import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";

type AppProps = {
  initialPath?: string;
};

export default function App({ initialPath }: AppProps) {
  return (
    <MemoryRouter initialEntries={[initialPath || "/"]}>
      <AppRoutes />
    </MemoryRouter>
  );
}
