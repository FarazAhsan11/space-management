import AppRouter from "./router/AppRouter";
import { AppProvider } from "./store/AppContext";
import { Toaster } from "sonner";
export default function App() {
  return (
    <AppProvider>
      <AppRouter />
      <Toaster richColors />
    </AppProvider>
  );
}
