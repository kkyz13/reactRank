import React, { useContext, useEffect, useRef, useState } from "react";
import RListing from "./RListing";
import Context from "../context/Context";

const Ranking = (props) => {
  const [rankList, setRankList] = useState([]);
  const rankTitleRef = useRef();
  const Ctx = useContext(Context);

  // const mapMyList = () => {
  //   props.myRanking.map((entry, idx) => {
  //     console.log("1");
  //     const printHere = document.getElementById("rankingContainer");
  //     printHere.innerHTML = (
  //       <RListing key={idx} image={entry.image} name={entry.name}></RListing>
  //     );
  //   });
  // };

  const mapMyList = () => {
    Ctx.setShowRank(false);
    setRankList(props.myRanking);
    Ctx.setShowRank(true);
  };

  const wheretheFUCKismyList = () => {
    mapMyList();
  };

  useEffect(() => {
    mapMyList();
    console.log(rankList);
  }, [rankList]);

  //////////////////////////////////////////////////////////////////
  return (
    <div className="container">
      <div className="row">
        <select>
          <option>Existing Rankings:</option>
          <option>This is a placeholder</option>
        </select>
      </div>
      <button
        onClick={(e) => {
          wheretheFUCKismyList();
        }}
      >
        WHY IS MY LIST NOT PRINTING
      </button>
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
              rankList.map((entry, idx) => {
                console.log("1");
                return (
                  <RListing
                    key={idx}
                    image={entry.image}
                    name={entry.name}
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
