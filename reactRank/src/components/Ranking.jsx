import React, { useContext, useEffect, useRef, useState } from "react";
import RListing from "./RListing";
import Context from "../context/Context";
import Button from "./Button";
import { PacmanLoader } from "react-spinners";

const Ranking = (props) => {
  const [userTell, setUserTell] = useState("");

  const rankTitleRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [emptyWarning, setEmptyWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rankID, setRankID] = useState();
  const [rankListFromAirTab, setRankListFromAirTab] = useState({ records: [] });
  const [selectRank, setSelectRank] = useState(false);
  const Ctx = useContext(Context);

  const clearList = () => {
    //Reset page san Search
    Ctx.setMyRanking([]);
    rankTitleRef.current.value = "";
    setRankID("");
    resetSelector();
    setEmptyWarning(false);
    setUserTell("Cleared, a fresh list is ready!");
  };
  if (userTell) {
    //Message Clearer
    const userTellPoint = document.querySelector(".usertell");
    userTellPoint.classList.add("spawn");
    // console.log(userTellPoint);
    setTimeout(() => {
      // console.log("despawn");
      userTellPoint.classList.remove("spawn");
      userTellPoint.classList.add("despawn");
      setTimeout(() => {
        setUserTell("");
        userTellPoint.classList.remove("despawn");
      }, 300);
    }, 5000);
  }
  const resetSelector = () => {
    //resets selector box to the first entry
    const selectorTarget = document.querySelector(".selector");
    selectorTarget.value = "default";
  };

  const dropZone = document.querySelector(".drop-zone");
  //targets the right container to put in stuff
  const fetchRankListFromAirTab = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        "https://api.airtable.com/v0/appea1L2EfUKfNpwi/RankLists",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: import.meta.env.VITE_AIRTABLE,
          },
        }
      );
      if (res.status === 200) {
        // console.log("successful fetch from Airtable");
        const data = await res.json();
        setRankListFromAirTab(data);
        setSelectRank(true);
      }
    } catch (error) {
      // console.log(error);
      setUserTell("Something wrong happened. Please Refresh");
    }
    setIsLoading(false);
  };

  const getRankListFromAirTab = async (target) => {
    try {
      setIsLoading(true);
      // console.log(`getting ${target}`);
      const res = await fetch(
        "https://api.airtable.com/v0/appea1L2EfUKfNpwi/RankLists/" + target,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: import.meta.env.VITE_AIRTABLE,
          },
        }
      );
      if (res.status === 200) {
        // console.log("successful GET from Airtable");
        const data = await res.json();
        Ctx.setMyRanking(JSON.parse(data.fields.Ranking)); //Airtable returns nested items as stringified JSON
        setRankID(data.id);
        Ctx.setShowRank(true);
        rankTitleRef.current.value = data.fields.Name;
      }
    } catch (error) {
      // console.log(error);
      setUserTell("Something wrong happened. Please Refresh");
    }
    resetSelector();
    setIsLoading(false);
  };

  const putRankListToAirTab = async (target) => {
    try {
      // console.log(`putting ${target}`);
      setUserTell("Saving...");
      const res = await fetch(
        "https://api.airtable.com/v0/appea1L2EfUKfNpwi/RankLists/" + target,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: import.meta.env.VITE_AIRTABLE,
          },
          body: JSON.stringify({
            fields: {
              Name: rankTitleRef.current.value,
              Ranking: JSON.stringify(props.myRanking),
            },
          }),
        }
      );
      if (res.status === 200) {
        // console.log("successful PUT from Airtable");
        const data = await res.json();
        // console.log(typeof data);
        Ctx.setMyRanking(JSON.parse(data.fields.Ranking)); //Airtable returns nested items as stringified JSON
        setRankID(data.id);
        Ctx.setShowRank(true);
        rankTitleRef.current.value = data.fields.Name;
        fetchRankListFromAirTab();
        setUserTell("Saved! Give it a moment for updates to be reflected");
      }
    } catch (error) {
      // console.log(error);
      setUserTell("Something wrong happened. Please Refresh");
    }
  };

  const postRankListToAirTab = async () => {
    if (rankTitleRef.current.value !== "") {
      if (Ctx.myRanking.length !== 0) {
        try {
          // console.log("Trying to POST to Airtable");
          setUserTell("Saving...");

          const res = await fetch(
            "https://api.airtable.com/v0/appea1L2EfUKfNpwi/RankLists",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: import.meta.env.VITE_AIRTABLE,
              },
              body: JSON.stringify({
                records: [
                  {
                    fields: {
                      Name: rankTitleRef.current.value,
                      Ranking: JSON.stringify(props.myRanking),
                    },
                  },
                ],
              }),
            }
          );
          if (res.status === 200) {
            // console.log("successful POST from Airtable");
            const data = await res.json();
            setRankID(data.records[0].id);
            // console.log(data);
            setSelectRank(false);
            fetchRankListFromAirTab();
            setUserTell("Saved! Give it a moment for updates to be reflected");
          }
        } catch (error) {
          // console.log(error);
          setUserTell("Something wrong happened. Please Refresh");
        }
      } else {
        setUserTell("You cannot save an empty list");
      }
    } else {
      setUserTell("You cannot save with no title");
      setEmptyWarning(true);
    }
  };

  useEffect(() => {
    // console.log("Loading from AirTable");
    fetchRankListFromAirTab();
  }, []);
  ///////////////////////CODE/RENDERBLOCK////////////////////////////////////////
  return (
    <div
      className="container drop-zone"
      onDragOver={(e) => {
        e.preventDefault();
        dropZone.style.minHeight = "100%";
        dropZone.style.background = "#111";
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        dropZone.style.removeProperty("minHeight");
        dropZone.style.removeProperty("background");
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        dropZone.style.removeProperty("minHeight");
        dropZone.style.removeProperty("background");
        const data = e.dataTransfer.getData("mypayload");
        if (data) {
          const parsedData = JSON.parse(data);
          // console.log(parsedData);
          Ctx.addToRank(parsedData);
          Ctx.setShowRank(true);
        } else {
          setUserTell("Drag Error, or something horrible happened");
        }
      }}
    >
      <div className="row">
        {" "}
        <div className="col-sm-6">
          {isDragging ? (
            <h5 className="display-6">Release to add to list</h5>
          ) : !isLoading ? (
            <h5 className="display-6">Ranking</h5>
          ) : (
            <h5 className="display-6">Loading...</h5>
          )}
        </div>
        <div className="col-sm-6">
          {isLoading && (
            <PacmanLoader color="#d6cd36" margin={5} speedMultiplier={3} />
          )}
        </div>
      </div>
      <div className="row g-2">
        <div>
          <select
            className="form-select-sm selector"
            onChange={(e) => {
              getRankListFromAirTab(e.target.value);
            }}
          >
            <option value={"default"}>Open existing rankings:</option>
            {selectRank ? (
              rankListFromAirTab.records.map((entry, idx) => {
                return (
                  <option key={idx} value={entry.id}>
                    {entry.fields.Name}
                  </option>
                );
              })
            ) : (
              <option>loading...</option>
            )}
          </select>

          <Button
            className="btn btn-warning btn-sm"
            trigger={() => {
              clearList();
            }}
          >
            New List/Clear
          </Button>
        </div>
      </div>

      <div>
        {/* <div className="ranking"> */}
        <div className="row g-0 ranking">
          <div className="container">
            <div className="usertell">{userTell}</div>
            <div className="titleForm">
              <input
                ref={rankTitleRef}
                className="yourtitle"
                placeholder={
                  emptyWarning ? "Title cannot be empty" : "Your Title"
                }
              ></input>
              {rankID && (
                <Button
                  className="btn btn-info btn-sm"
                  trigger={() => {
                    putRankListToAirTab(rankID);
                  }}
                >
                  Update
                </Button>
              )}
              <Button
                className="btn btn-success btn-sm"
                trigger={() => {
                  postRankListToAirTab();
                }}
              >
                {rankID ? "Duplicate" : "Save"}
              </Button>
            </div>
          </div>

          {Ctx.showRank &&
            props.myRanking.map((entry, idx) => {
              return (
                <RListing
                  cPanel={false}
                  rank={idx + 1}
                  idx={idx}
                  key={idx}
                  image={entry.image}
                  name={entry.name}
                  upRank={props.upRank}
                  downRank={props.downRank}
                  delete={props.deleteRank}
                ></RListing>
              );
            })}
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Ranking;
