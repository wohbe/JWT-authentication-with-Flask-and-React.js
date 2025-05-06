import React, { useState } from "react";

export const Signup = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [registeredEmail, setRegisteredEmail] = useState("");

  async function registerAccount() {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log("Registration failed:", error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    document.getElementById("emailInput").value = "";
    document.getElementById("passwordInput").value = "";
    setRegisteredEmail(credentials.email);
    registerAccount();
  }

  return (
    <div className="register-container">
      <form className="register-form">
        <h3>Register New Account</h3>
        
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            id="emailInput"
            datakey="email"
            onChange={e => setCredentials({...credentials, [e.target.getAttribute("datakey")]: e.target.value})}
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="passwordInput" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="passwordInput"
            datakey="password"
            onChange={e => setCredentials({...credentials, [e.target.getAttribute("datakey")]: e.target.value})}
          />
        </div>
        
        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
          Create Account
        </button>
      </form>
      
      {registeredEmail && <h3>Account created for {registeredEmail}</h3>}
    </div>
  );
};