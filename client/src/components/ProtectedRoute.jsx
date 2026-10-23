import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const response = await fetch(`${API_URL}/me`, {
        credentials: "include"
      });

      if (response.ok) {
        setAuthenticated(true);
      }

      setLoading(false);
    }

    checkUser();
  }, []);

  if (loading) {
    return <p>Checking login...</p>;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;