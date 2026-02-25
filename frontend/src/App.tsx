import "./App.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import ProtectedRoutes from "./ProtectedRoutes";
import AuthTabs from "./pages/auth/AuthTabs";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />}></Route>
          </Route>
          <Route path="/login" element={<AuthTabs />} />
        </Routes>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
