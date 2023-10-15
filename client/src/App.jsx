import { ChakraProvider, Button, Container } from "@chakra-ui/react";
import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Chatpage from "./pages/Chatpage";

function App() {
  return (
    <div className="App">
      <ChakraProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/chats" element={<Chatpage />} />
          </Routes>
      </ChakraProvider>
    </div>
  );
}

export default App;
