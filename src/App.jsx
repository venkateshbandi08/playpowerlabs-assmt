import React from "react";
import TimeConverter from "./pages/Home";
import "./index.css";
import "./App.css";
import { ThemeProvider } from "./components/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <TimeConverter />
    </ThemeProvider>
  );
};

export default App;
