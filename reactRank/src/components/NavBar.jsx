import React, { useState, useContext, useEffect } from "react";
import styles from "./NavBar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AppContext from "../context/AppContext";

const NavBar = () => {
  const [user, setUser] = useState('');
  const userCtx = useContext(AppContext)
  const navigate = useNavigate()
  const loginCheck = () => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const token = JSON.parse(loggedInUser);
      const decoded = jwtDecode(loggedInUser);
      console.log(decoded);  
      setUser(decoded.user)
      userCtx.setAccessToken(token.access);
      // userCtx.setRefreshToken(token.refresh);}
    } else {
      alert("Something went wrong, dropping back to login");
      navigate("/login");
    }
  }

  useEffect(() => {
    loginCheck();
  }, []);

  return (
    <header className={styles.navbar}>
      <nav>
        <ul>

          <li>
            <NavLink
              className={(navData) => (navData.isActive ? styles.active : "")}
              to="/ranker"
            >
              reactRank
            </NavLink>
          </li>
          <li>
            <NavLink
              className={(navData) => (navData.isActive ? styles.active : "")}
              to="/CPanel"
              style={{ textAlign: "right" }}
            >
              Control Panel
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
