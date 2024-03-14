import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import RListing from "../components/RListing";

const ControlPanel = () => {
  const [rankID, setRankID] = useState();
  const [selectRank, setSelectRank] = useState(false);
  const [showRank, setShowRank] = useState(false);
  const [rankListFromAirTab, setRankListFromAirTab] = useState({ records: [] });
  const [myRanking, setMyRanking] = useState([]);

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
        setRankID(data.id);
        setMyRanking(JSON.parse(data.fields.Ranking)); //Airtable returns nested items as stringified JSON
        setShowRank(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const delRankListFromAirTab = async (target) => {
    try {
      console.log(`Deleting ${target}`);
      const res = await fetch(
        "https://api.airtable.com/v0/appea1L2EfUKfNpwi/RankLists?records%5B%5D=" +
          target,
        {
          method: "Delete",
          headers: {
            "Content-Type": "application/json",
            Authorization: import.meta.env.VITE_AIRTABLE,
          },
        }
      );
      if (res.status === 200) {
        console.log("successful DEL from Airtable");
        const data = await res.json();
        fetchRankListFromAirTab();
        setShowRank(false);
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
    <>
      <div className="container">
        <div className="display-6">CONTROL PANEL</div>
        <div className="row">
          <div className="col-sm-8">
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
            <Button trigger={() => delRankListFromAirTab(rankID)}>
              Delete List
            </Button>
          </div>
          <div>
            Rank List Preview:
            {showRank &&
              myRanking.map((entry, idx) => {
                console.log("1");
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
