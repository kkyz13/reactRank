import React from "react";
import { useRef } from "react";

const Login = () => {
  const textRef = useRef();
  const passwordRef = useRef();
  return (
    <div className="centered container flex-column border border-success-subtle p-3 rounded-5">
      <h6 className="display-6">Welcome to reactRank</h6>
      <small> Rank games, powered by Rawg.io</small>
      <div className="d-flex flex-column p-3">
        <label>
          Username:
          <input
            type="text"
            className="logininput my-1"
            placeholder="username"
            ref={textRef}
          ></input>
        </label>
        <label>
          Password:
          <input
            type="password"
            className="logininput my-1"
            placeholder="password"
            ref={passwordRef}
          ></input>
        </label>
      </div>
      <div className="d-flex justify-content-around">
        {}
        <button className="btn btn-primary m-3">Register</button>
        <button className="btn btn-success m-3">Login</button>
      </div>
    </div>
  );
};

export default Login;
