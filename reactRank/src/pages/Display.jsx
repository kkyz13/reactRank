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
    //give the up animation
    const movingUpAnim = document.querySelector(`.idx${idx}`);
    const movingDownAnim = document.querySelector(`.idx${idx - 1}`);
    movingUpAnim.classList.add("goingup");
    movingDownAnim.classList.add("goingdown");
    //the actual array manupliation
    const tempArr = [...myRanking];
    const mover = myRanking[idx];
    tempArr.splice(idx, 1);
    tempArr.splice(idx - 1, 0, mover);
    setMyRanking(tempArr);
    //remove the animation style when animation is done
    movingUpAnim.addEventListener("animationend", () => {
      movingUpAnim.classList.remove("goingup");
      movingDownAnim.classList.remove("goingdown");
    });
  };
  const downRank = (idx) => {
    console.log("going down");
    //give the down animation
    const movingDownAnim = document.querySelector(`.idx${idx}`);
    const movingUpAnim = document.querySelector(`.idx${idx + 1}`);
    movingUpAnim.classList.add("goingup");
    movingDownAnim.classList.add("goingdown");
    const tempArr = [...myRanking];
    const mover = myRanking[idx];
    tempArr.splice(idx, 1);
    tempArr.splice(idx + 1, 0, mover);
    setMyRanking(tempArr);
    //wait for the animation to end
    movingUpAnim.addEventListener("animationend", () => {
      movingUpAnim.classList.remove("goingup");
      movingDownAnim.classList.remove("goingdown");
    });
  };

  return (
    <div className="container">
      <div className="row">
        {/* <h3 className="display-3">Ranker</h3> */}
        <Context.Provider
          value={{ addToRank, showRank, setShowRank, myRanking, setMyRanking }}
        >
          <div className="col-sm-5">
            <Search></Search>
          </div>
          <div className="col-sm-7">
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
