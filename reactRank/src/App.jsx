import React from "react";
import Display from "./components/Display";

function App() {
  return (
    <>
      <header className="container">
        <div className="row">
          <div className="col-sm-6">
            <h2 className="display-2">Ranker</h2>
          </div>
          <div className="col-sm-3"></div>
          <div className="col-sm-3 display-4" style={{ textAlign: "right" }}>
            Control Panel
          </div>
        </div>
      </header>
      <Display></Display>
    </>
  );
}

export default App;
