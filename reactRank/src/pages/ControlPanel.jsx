import React, { useState, useContext, useEffect } from "react";
import Button from "../components/Button";
import RListing from "../components/RListing";
import Modal from "../components/Modal";
import ErrorModal from "../components/ErrorModal";
import { PacmanLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import Context from "../context/Context";
import { jwtDecode } from "jwt-decode";

const ControlPanel = () => {
  const [rankID, setRankID] = useState();
  const [rankName, setRankName] = useState("");
  const [userTell, setUserTell] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectRank, setSelectRank] = useState(false);
  const [showRank, setShowRank] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [rankListFromAirTab, setRankListFromAirTab] = useState([]);
  const [myRanking, setMyRanking] = useState([]);
  const navigate = useNavigate();
  const userCtx = useContext(AppContext);
  const Ctx = useContext(Context);
  const [user, setUser] = useState("");

  const loginCheck = () => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const token = JSON.parse(loggedInUser);
      const decoded = jwtDecode(loggedInUser);
      setUser(decoded.username);
      setAccessToken(token.access);
      // userCtx.setRefreshToken(token.refresh);}
    } else {
      alert("Something went wrong, dropping back to login");
      navigate("/login");
    }
  };
  const resetSelector = () => {
    const selectorTarget = document.querySelector(".selector");
    selectorTarget.value = "default";
  };
  const handleModalNope = () => {
    setConfirmationModal(false);
  };

  if (userTell) {
    const userTellPoint = document.querySelector(".usertell");
    userTellPoint.classList.add("spawn");
    setTimeout(() => {
      userTellPoint.classList.remove("spawn");
      userTellPoint.classList.add("despawn");
      setTimeout(() => {
        setUserTell("");
        userTellPoint.classList.remove("despawn");
      }, 300);
    }, 5000);
  }
  const fetchRankListFromAirTab = async () => {
    try {
      setUserTell("Loading from Mongo Atlas...");
      setIsLoading(true);
      const res = await fetch(import.meta.env.VITE_MYSERV + "/rank/get", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });
      if (res.status === 200) {
        // console.log("successful fetch from Airtable");
        const data = await res.json();
        setRankListFromAirTab(data);
        setSelectRank(true);
        if (data.length !== 0) {
          setUserTell("Successful Fetch");
        } else {
          setUserTell("No Data Found");
        }
      }
    } catch (error) {
      console.log(error);
      setUserTell("Something wrong happened. Please Refresh");
    }
    setIsLoading(false);
  };
  const getRankListToAirTab = async (id) => {
    try {
      setUserTell("Getting from MongoDB");
      setIsLoading(true);
      // console.log(`getting ${target}`);
      const res = await fetch(
        import.meta.env.VITE_MYSERV + "/rank/get/q/?id=" + id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      if (res.status === 200) {
        // console.log("successful GET from Airtable");
        const data = await res.json();
        console.log(data);
        setRankID(data._id);
        setRankName(data.title);
        setMyRanking(data.ranking);
        setShowRank(true);
      }
    } catch (error) {
      console.log(error);
      setUserTell("Something wrong happaned. Please Refresh");
    }
    resetSelector();
    setIsLoading(false);
  };
  const delRankListFromAirTab = async (target) => {
    const delAnimArr = document.querySelectorAll(".rankcontainer");
    let delayer = 1;
    let lastidx = 0;
    // for (let entry of delAnimArr) {
    //   delayer += 1;
    //   entry.classList.add("deleteaway");
    //   entry.style.animationDelay = `${delayer * 25}ms`;
    // }
    try {
      setUserTell("Deleting...");
      setIsLoading(true);
      const res = await fetch(
        import.meta.env.VITE_MYSERV + "/rank/delete/" + target,
        {
          method: "Delete",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      if (res.status === 200) {
        for (let entry of delAnimArr) {
          const LastEntry = delAnimArr.length - 1;
          delayer += 1;
          lastidx += 1;
          entry.classList.add("deleteaway");
          entry.style.animationDelay = `${delayer * 25}ms`;
          if (lastidx === LastEntry) {
            entry.addEventListener("animationend", () => {
              // console.log("successful DEL from Airtable");
              fetchRankListFromAirTab();
              setShowRank(false);
              setRankID("");
              setRankName("");
              setUserTell("Deleted. There's no getting back.");
            });
          }
        }
      }
    } catch (error) {
      // console.log(error);
      setUserTell("Something wrong happened. Please Refresh");
    }
    setIsLoading(false);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    userCtx.setAccessToken("");
    navigate("/login");
  };
  useEffect(() => {
    loginCheck();
  }, []);

  useEffect(() => {
    fetchRankListFromAirTab();
  }, [accessToken]);

  return (
    <>
      <div className="container">
        {confirmationModal && !rankID ? (
          <ErrorModal
            title="Error"
            message="You can't delete nothing"
            dismiss={handleModalNope}
          ></ErrorModal>
        ) : (
          ""
        )}
        {confirmationModal && rankID ? (
          <Modal
            title="Confirm Delete?"
            message={`you are deleting ${rankName}! ARE YOU SURE? (this cannot be undone)`}
            rankID={rankID}
            delete={delRankListFromAirTab}
            dismiss={handleModalNope}
          ></Modal>
        ) : (
          ""
        )}
        <div className="row g-0">
          <div className="col-sm-6 display-6">CONTROL PANEL</div>
          <div className="col-sm-5 usertell" style={{ alignSelf: "flex-end" }}>
            {userTell}
          </div>
          <div className="col-sm-1"></div>
        </div>

        <div className="row">
          <div>
            <select
              className="selector"
              onChange={(e) => {
                getRankListToAirTab(e.target.value);
              }}
            >
              <option value={"default"}>Existing Rankings:</option>
              {selectRank && rankListFromAirTab.length > 0 ? (
                rankListFromAirTab.map((entry, idx) => {
                  return (
                    <option key={idx} value={entry._id}>
                      {entry.title}
                    </option>
                  );
                })
              ) : rankListFromAirTab.length == 0 ? (
                <option>You haven't created anything!</option>
              ) : (
                <option>loading...</option>
              )}
            </select>
            <Button
              className="btn btn-danger"
              trigger={() => setConfirmationModal(true)}
            >
              Delete List
            </Button>
            <button
              className="mx-1 btn btn-dark"
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </button>
          </div>
          <div className="container">
            {isLoading && (
              <PacmanLoader color="#d63636" margin={4} speedMultiplier={3} />
            )}
          </div>
          <div>
            Rank List Preview:
            <h3 className="display-6">{rankName}</h3>
            {showRank &&
              myRanking.length > 0 &&
              myRanking.map((entry, idx) => {
                return (
                  <RListing
                    cPanel={true}
                    rank={idx + 1}
                    idx={idx}
                    key={idx}
                    image={entry.image}
                    name={entry.name}
                  ></RListing>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ControlPanel;
