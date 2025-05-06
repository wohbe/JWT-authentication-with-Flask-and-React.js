import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export const Privated = () => {
  const [protect, setProtect] = useState();
  let navigate = useNavigate();

  const hasToken = !!localStorage.getItem("authToken");
  if (!hasToken) {
    return <Navigate to="/" />;
  }

  async function isPrivate() {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setProtect(200);
      } else {
        setProtect(response.status);
      }
    } catch (error) {
      console.log("Error in private fetch", { Error: error });
      setProtect(401);
    }
  }

  useEffect(() => {
    isPrivate();

    const handleStorageChange = (e) => {
      if (!localStorage.getItem("authToken")) {
        setProtect(401);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (protect !== undefined && protect !== 200) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center">
      <h1 className="text-center mb-4">Restricted area</h1>
      <div className="text-center">
        <button
          type="button"
          className="btn btn-success mx-1"
          onClick={() => {
            navigate(`/`);
          }}
        >
          Home
        </button>
        <button
          type="button"
          className="btn btn-danger mx-1"
          onClick={() => {
            localStorage.removeItem("authToken"), navigate(`/`);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};