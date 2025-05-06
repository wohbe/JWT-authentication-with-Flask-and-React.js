import React, { useEffect, useState } from "react";

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [activeUser, setActiveUser] = useState(localStorage.getItem("userEmail") || "");

  async function authenticateUser() {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });
      if (response.ok) {
      const data = await response.json();
      localStorage.setItem("authToken", data.access_token);
      localStorage.setItem("userEmail", credentials.email);
      setActiveUser(credentials.email);
    } else {
      alert(await response.json().error || "Login failed");
      setActiveUser("");
    }
    } catch (error) {
      console.log("Authentication failed:", error);
      alert("Unable to login");
    }
  }

  async function verifyAuth() {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });
    if (response.ok) {
      const data = await response.json();
      setActiveUser(data.user || localStorage.getItem("userEmail"));
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      setActiveUser("");
    }
    } catch (error) {
      console.log("Verification failed:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      setActiveUser("");
    }
  }

  useEffect(() => {
  if (localStorage.getItem("authToken")) {
    verifyAuth();
  }
  }, []);

  function handleInput(e) {
    setCredentials({
      ...credentials,
      [e.target.getAttribute("datakey")]: e.target.value,
    });
  }

  function submitForm(e) {
    e.preventDefault();
    document.getElementById("passwordField").value = "";
    document.getElementById("emailField").value = "";
    authenticateUser();
  }

  const LogoutButton = (
    <button
      type="button"
      className="btn btn-danger mx-1"
      onClick={() => {
        localStorage.removeItem("authToken");
        setActiveUser("");
      }}
    >
      Sign Out
    </button>
  );

  return (
    <div className="login-container">
      <form className="login-form">
        <h3>Sign In</h3>
        
        <div className="mb-3">
          <label htmlFor="emailField" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            id="emailField"
            datakey="email"
            onChange={handleInput}
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="passwordField" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="passwordField"
            datakey="password"
            onChange={handleInput}
          />
        </div>
        
        <button type="submit" className="btn btn-primary" onClick={submitForm}>
          Sign In
        </button>
        
        {activeUser && LogoutButton}
      </form>
     <div className="mt-4">
      {!activeUser ? 
        <h3>Please sign in to continue</h3> : 
        <h3>Welcome, {activeUser}!</h3>
      }
     </div>
    </div>
  );
};