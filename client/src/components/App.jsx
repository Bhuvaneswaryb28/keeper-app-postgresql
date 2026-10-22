import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Welcome from "./Welcome";
import Register from "./Register";
import Login from "./Login";
import Keeper from "./Keeper";

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/keeper" element={<ProtectedRoute> <Keeper /></ProtectedRoute>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;