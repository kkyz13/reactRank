import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
AppContext;
const Login = () => {
  const navigate = useNavigate();
  const Ctx = useContext(AppContext);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [showRegister, setShowRegister] = useState(false);

  const newUserRef = useRef();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const healthCheck = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_MYSERV + "/healthcheck"
      );
      if (response.ok) {
        console.log(response);
        console.log("Server is up and running");
      }
    } catch (error) {
      console.log(error);
      console.log("SHIT");
    }
  };
  const purgeLocal = () => {
    localStorage.clear();
  };
  const handleLogin = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_MYSERV + "/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: usernameRef.current.value,
            password: passwordRef.current.value,
          }),
        }
      );

      if (response.ok) {
        // console.log("successful login");
        const data = await response.json();
        // console.log(data);
        Ctx.setAccessToken(data.access);
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/ranker");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRegister = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_MYSERV + "/auth/register",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: newUserRef.current.value,
            password: newPassword,
          }),
        }
      );

      if (response.ok) {
        // Registration successful, redirect to login
        setShowRegister(false);
        // usernameRef.current.value = "";
        newUserRef.current.value = "";
        setNewPassword("");
        setConfirmPassword("");
        setError("Registration Successful");
      } else {
        const errorData = await response.json();
        console.log(errorData);
        setError("Registration failed: " + errorData.msg);
      }
    } catch (error) {
      console.log(error);
      setError("Error. Please try again.");
    }
  };

  useEffect(() => {
    purgeLocal();
  }, []);
  return (
    <div className="centered container flex-column border border-success-subtle p-3 rounded-5">
      <h6 className="display-6">Welcome to reactRank</h6>
      <small> Rank games, powered by Rawg.io</small>
      {/* <button
        onClick={() => {
          healthCheck();
        }}
      >
        debug
      </button> */}
      <div className="d-flex flex-column p-3">
        {!showRegister ? (
          <>
            <label>
              Username:
              <input
                type="text"
                className="logininput my-1"
                placeholder="username"
                ref={usernameRef}
              ></input>
            </label>
            <label>
              Password:
              <input
                type="password"
                className="logininput my-1"
                placeholder="password"
                ref={passwordRef}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    handleLogin();
                  }
                }}
              ></input>
            </label>
          </>
        ) : (
          <>
            <label>
              New Username:
              <input
                type="text"
                className="logininput my-1"
                placeholder="username"
                ref={newUserRef}
              ></input>
            </label>
            <label>
              Your Password:<br></br> (needs to be at least 8 characters long)
              <input
                type="password"
                className="logininput my-1"
                placeholder="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              ></input>
            </label>
            <label>
              Retype Your Password:
              <input
                type="password"
                className="logininput my-1"
                placeholder="retype your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
            </label>
            {newPassword.length < 8
              ? "Password must be more than 8 characters ❌"
              : newPassword !== confirmPassword
              ? "❌"
              : "✔"}
          </>
        )}
      </div>
      <div className="d-flex justify-content-around">
        {showRegister ? (
          <>
            <button
              className="btn btn-secondary m-3"
              onClick={() => {
                setShowRegister(false);
              }}
            >
              Cancel Registration
            </button>
            <button
              className="btn btn-warning m-3"
              onClick={() => {
                handleRegister();
              }}
            >
              Register New User
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-primary m-3"
              onClick={() => {
                setShowRegister(true);
              }}
            >
              New user?
            </button>
            <button
              className="btn btn-success m-3"
              onClick={() => {
                handleLogin();
              }}
            >
              Login
            </button>
          </>
        )}
      </div>
      {error}
    </div>
  );
};

export default Login;
