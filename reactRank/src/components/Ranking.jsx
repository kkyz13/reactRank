import React, { useContext, useEffect, useRef, useState } from "react";
import RListing from "./RListing";
import Context from "../context/Context";
import Button from "./Button";
import { PacmanLoader } from "react-spinners";

const Ranking = (props) => {
  const rankTitleRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [rankID, setRankID] = useState();
  const [rankListFromAirTab, setRankListFromAirTab] = useState({ records: [] });
  const [selectRank, setSelectRank] = useState(false);
  const Ctx = useContext(Context);

  const clearList = () => {
    Ctx.setMyRanking([]);
    rankTitleRef.current.value = "";
    setRankID("");
    resetSelector();
  };
  const fetchRankListFromAirTab = async () => {
    try {
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
        console.log("successful fetch from Airtable");
        const data = await res.json();
        setRankListFromAirTab(data);
        setSelectRank(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetSelector = () => {
    const selectorTarget = document.getElementsByClassName("select");
    selectorTarget.value = "default";
  };
  const getRankListToAirTab = async (target) => {
    try {
      setIsLoading(true);
      console.log(`getting ${target}`);
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
        console.log("successful GET from Airtable");
        const data = await res.json();
        Ctx.setMyRanking(JSON.parse(data.fields.Ranking)); //Airtable returns nested items as stringified JSON
        setRankID(data.id);
        Ctx.setShowRank(true);
        rankTitleRef.current.value = data.fields.Name;
      }
    } catch (error) {
      console.log(error);
    }
    resetSelector();
    setIsLoading(false);
  };

  const putRankListToAirTab = async (target) => {
    try {
      console.log(`putting ${target}`);
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
        console.log("successful GET from Airtable");
        const data = await res.json();
        // console.log(typeof data);
        Ctx.setMyRanking(JSON.parse(data.fields.Ranking)); //Airtable returns nested items as stringified JSON
        setRankID(data.id);
        Ctx.setShowRank(true);
        rankTitleRef.current.value = data.fields.Name;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const postRankListToAirTab = async () => {
    if (rankTitleRef.current.value !== "") {
      if (Ctx.myRanking.length !== 0) {
        try {
          console.log("Trying to POST to Airtable");
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
            console.log("successful POST from Airtable");
            const data = await res.json();
            setRankID(data.records[0].id);
            console.log(data);
            setSelectRank(false);
            fetchRankListFromAirTab();
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("you cannot save an empty list");
      }
    } else {
      console.log("you need a title to save");
    }
  };

  useEffect(() => {
    console.log("Loading from AirTable");
    fetchRankListFromAirTab();
  }, []);

  return (
    <div className="container">
      <h5 className="display-6">Ranking</h5>
      <div className="row g-2">
        <select
          className="selector"
          onChange={(e) => {
            getRankListToAirTab(e.target.value);
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

      {isLoading && <PacmanLoader color="#d6cd36" />}
      <div>
        {/* <div className="ranking"> */}
        <div className="row g-0 ranking">
          <>
            <div>
              <label>Title:</label>
              <input
                ref={rankTitleRef}
                className="yourtitle"
                placeholder="Your Title"
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
          </>

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
