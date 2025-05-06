import React from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Signup } from "../components/Signup.jsx";
import { Login } from "../components/Login.jsx";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	let navigate = useNavigate();

	const handleRestrictedPage = () => {
		const token = localStorage.getItem("authToken");
		if (token) {
			navigate("/private");
		} else {
			alert("You need to log in first.");
		}
	}
  
	return (
	  <div className="text-center mt-5">
		<div className="container d-inline-flex justify-content-between">
		  <Signup />
		  <Login />
		</div>
		<button
		  type="button"
		  className="btn btn-warning"
		  onClick={handleRestrictedPage}
		>
		  Restricted page
		</button>
	  </div>
	);
  };