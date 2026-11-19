import { RouterProvider } from "react-router-dom";
import "./App.css";
import { routes } from "./routes/AppRoutes";
import { Toast } from "@heroui/react";
import CounterContextProvider from "./context/CounterContext";
import AuthCountextProvider from "./context/AuthCountext";

function App() {
  return (
    <AuthCountextProvider>
      <CounterContextProvider>
        <Toast.Provider placement="top" />
        <RouterProvider router={routes} />
      </CounterContextProvider>
    </AuthCountextProvider>
  );
}

export default App;