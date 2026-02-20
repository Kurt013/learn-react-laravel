import "./App.css";
import "@mantine/core/styles.css";
import api from "./middleware/api";
import { MantineProvider } from "@mantine/core";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    api
      .get("/up")
      .then((response) => {
        console.log("lezzgaur", response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider></MantineProvider> 
    </QueryClientProvider>
  );
}

export default App;
