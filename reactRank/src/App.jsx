import React from "react";
import Display from "./pages/Display";
import ControlPanel from "./pages/ControlPanel";
import { Navigate, Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <NavBar></NavBar>
      <br></br>
      <Routes>
        <Route path="/" element={<Navigate replace to="/ranker" />} />
        <Route path="ranker" element={<Display />}></Route>
        <Route path="CPanel" element={<ControlPanel />}></Route>
      </Routes>
      <footer>
        <small>
          Videogame API from <a href="https://rawg.io">RAWG.io</a>
        </small>
      </footer>
    </>
  );
}

export default App;
