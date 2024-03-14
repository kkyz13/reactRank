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

      {/* <header className="container">
        <div className="row">
          <div className="col-sm-6">
            <h2 className="display-2">Ranker</h2>
          </div>
          <div className="col-sm-3"></div>
          <div
            className="col-sm-3 display-4"
            style={{ textAlign: "right", fontSize: "4vw" }}
          ></div>
        </div>
      </header> */}
      {/* <Display></Display> */}
    </>
  );
}

export default App;
