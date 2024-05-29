import React, { useContext, useEffect, useState } from "react";
import Search from "../components/Search";
import Context from "../context/Context";
import Ranking from "../components/Ranking";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Display = () => {
  const AppCtx = useContext(AppContext);
  const [accessToken, setAccessToken] = useState("");
  const [myRanking, setMyRanking] = useState([]);
  const [showRank, setShowRank] = useState(false);
  const [fetchData, setFetchData] = useState(false);
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const loginCheck = () => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const token = JSON.parse(loggedInUser);
      const decoded = jwtDecode(loggedInUser);
      setUser(decoded.username);
      setAccessToken(token.access);
      setFetchData(true);
      // userCtx.setRefreshToken(token.refresh);}
    } else {
      alert("Something went wrong, dropping back to login");
      navigate("/login");
    }
  };

  useEffect(() => {
    loginCheck();
  }, []);

  useEffect(() => {
    console.log(user);
  }, [fetchData]);
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
    //give the up animation
    const movingUpAnim = document.querySelector(`.idx${idx}`);
    const movingDownAnim = document.querySelector(`.idx${idx - 1}`);
    movingUpAnim.classList.add("goingup");
    movingDownAnim.classList.add("goingdown");

    //remove the animation style when animation is done
    movingUpAnim.addEventListener("animationend", () => {
      movingUpAnim.classList.remove("goingup");
      movingDownAnim.classList.remove("goingdown");
      //the actual array manupilation
      const tempArr = [...myRanking];
      const mover = myRanking[idx];
      tempArr.splice(idx, 1);
      tempArr.splice(idx - 1, 0, mover);
      setMyRanking(tempArr);
    });
  };
  const downRank = (idx) => {
    //give the down animation
    const movingDownAnim = document.querySelector(`.idx${idx}`);
    const movingUpAnim = document.querySelector(`.idx${idx + 1}`);
    movingUpAnim.classList.add("goingup");
    movingDownAnim.classList.add("goingdown");

    //wait for the animation to end
    movingUpAnim.addEventListener("animationend", () => {
      movingUpAnim.classList.remove("goingup");
      movingDownAnim.classList.remove("goingdown");
      //actual array manupilation
      const tempArr = [...myRanking];
      const mover = myRanking[idx];
      tempArr.splice(idx, 1);
      tempArr.splice(idx + 1, 0, mover);
      setMyRanking(tempArr);
    });
  };

  return (
    <div className="container">
      <div className="row">
        <h3 className="small">Welcome, {user} </h3>
        <Context.Provider
          value={{
            accessToken,
            addToRank,
            showRank,
            setShowRank,
            myRanking,
            setMyRanking,
          }}
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
