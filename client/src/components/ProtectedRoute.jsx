import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const response = await fetch("http://localhost:5000/me", {
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