import React, { useContext } from "react";
import Display from "./pages/Display";
import ControlPanel from "./pages/ControlPanel";
import { Navigate, Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar";
import Login from "./pages/Login";

function App() {
  
  return (
    <>
      {location.pathname !== "/login" && <NavBar></NavBar>}
      <br></br>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="login" element={<Login />}></Route>
        <Route path="ranker" element={<Display />}></Route>
        <Route path="CPanel" element={<ControlPanel />}></Route>
      </Routes>
      <footer>
        <small>
          Videogame Database API from <a href="https://rawg.io">RAWG.io</a>
        </small>
      </footer>
    </>
  );
}

export default App;
