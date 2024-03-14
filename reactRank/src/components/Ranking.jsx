import React, { useContext, useEffect, useRef, useState } from "react";
import RListing from "./RListing";
import Context from "../context/Context";
import Button from "./Button";

const Ranking = (props) => {
  const rankTitleRef = useRef();
  const [rankID, setRankID] = useState();
  const [rankListFromAirTab, setRankListFromAirTab] = useState({ records: [] });
  const [selectRank, setSelectRank] = useState(false);
  const Ctx = useContext(Context);

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

  const getRankListToAirTab = async (target) => {
    try {
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

  const putRankListToAirTab = async (target) => {
    try {
      console.log(`getting ${target}`);
      const res = await fetch(
        "https://api.airtable.com/v0/appea1L2EfUKfNpwi/RankLists/" + target,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: import.meta.env.VITE_AIRTABLE,
          },
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
    try {
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
        setSelectRank(false);
        fetchRankListFromAirTab();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("Loading from AirTable");
    fetchRankListFromAirTab();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <select
          onChange={(e) => {
            getRankListToAirTab(e.target.value);
          }}
        >
          <option>Existing Rankings:</option>
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
      </div>
      <div className="row">
        <div className="col-sm-8"></div>
        <div className="col-sm-4">
          <Button>New List/Clear</Button>
        </div>
      </div>
      <div>
        <h5 className="display-6">Ranking</h5>
        {/* <div className="ranking"> */}
        <div className="row g-0 ranking" style={{ padding: "5px" }}>
          <>
            <div>
              <label>Title:</label>
              <input ref={rankTitleRef} placeholder="Your Title"></input>
              <Button trigger={postRankListToAirTab}>Save</Button>
              {/* <Button>Update</Button> */}
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
