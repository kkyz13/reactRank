import React, { useContext, useEffect, useRef, useState } from "react";
import RListing from "./RListing";
import Context from "../context/Context";

const Ranking = (props) => {
  const rankTitleRef = useRef();
  const Ctx = useContext(Context);

  return (
    <div className="container">
      <div className="row">
        <select>
          <option>Existing Rankings:</option>
          <option>This is a placeholder</option>
        </select>
      </div>

      <div>
        <br />
        <br />
        <br />
        <div className="ranking">
          <div className="row g-0" style={{ padding: "5px" }}>
            {Ctx.showRank && (
              <div>
                <label>Title:</label>
                <input ref={rankTitleRef} placeholder="Your Title"></input>
              </div>
            )}
            {Ctx.showRank &&
              props.myRanking.map((entry, idx) => {
                console.log("1");
                return (
                  <RListing
                    rank={idx + 1}
                    idx={idx}
                    key={idx}
                    image={entry.image}
                    name={entry.name}
                    upRank={props.upRank}
                    delete={props.deleteRank}
                  ></RListing>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
