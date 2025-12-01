import AppRouter from "./router/AppRouter";
import { AppProvider } from "./store/AppContext";

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
