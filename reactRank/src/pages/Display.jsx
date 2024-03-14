import React, { useContext, useState } from "react";
import Search from "../components/Search";
import Context from "../context/Context";
import Ranking from "../components/Ranking";

const Display = () => {
  const [myRanking, setMyRanking] = useState([]);
  const [showRank, setShowRank] = useState(false);

  const addToRank = (entry) => {
    setMyRanking((prevArr) => {
      return [...prevArr, entry];
    });
  };

  const deleteRankEntry = (idx) => {
    const tempArr = [...myRanking];
    tempArr.splice(idx, 1);
    setMyRanking(tempArr);
  };

  const upRank = (idx) => {
    console.log("going up");
    const tempArr = [...myRanking];
    const mover = myRanking[idx];
    tempArr.splice(idx, 1);
    tempArr.splice(idx - 1, 0, mover);
    setMyRanking(tempArr);
  };
  const downRank = (idx) => {
    console.log("going down");
    const tempArr = [...myRanking];
    const mover = myRanking[idx];
    tempArr.splice(idx, 1);
    tempArr.splice(idx + 1, 0, mover);
    setMyRanking(tempArr);
  };

  return (
    <div className="container">
      <div className="row">
        <h3 className="display-3">Ranker</h3>
        <Context.Provider
          value={{ addToRank, showRank, setShowRank, myRanking, setMyRanking }}
        >
          <div className="col-sm-6">
            <Search></Search>
          </div>
          <div className="col-sm-6">
            <Ranking
              myRanking={myRanking}
              deleteRank={deleteRankEntry}
              upRank={upRank}
              downRank={downRank}
            ></Ranking>
          </div>
        </Context.Provider>
      </div>
    </div>
  );
};

export default Display;
