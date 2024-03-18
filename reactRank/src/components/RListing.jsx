import React, { useState } from "react";
import Button from "./Button";

const RListing = (props) => {
  const [controlDisplay, setControlDisplay] = useState(false);

  return (
    <div
      className={`row g-0 rankcontainer idx${props.idx}`}
      onMouseEnter={() => {
        setControlDisplay(true);
      }}
      onMouseLeave={() => {
        setControlDisplay(false);
      }}
    >
      <img
        src={props.image}
        onDoubleClick={() => {
          console.log(`${props.name}`);
        }}
      ></img>
      <h1 className="gametitle">{props.name}</h1>
      <h3 className="rankNum">
        <span>{props.rank}</span>
      </h3>

      {!props.cPanel && controlDisplay && props.idx !== 0 ? (
        <Button
          className="arrow up"
          trigger={() => {
            props.upRank(props.idx);
          }}
        >
          &#9650;
        </Button>
      ) : (
        ""
      )}
      {!props.cPanel && controlDisplay && (
        <Button
          className="deletebutton"
          trigger={() => {
            props.delete(props.idx);
          }}
        >
          delete
        </Button>
      )}
      {!props.cPanel && controlDisplay && (
        <Button
          className="arrow down"
          trigger={() => {
            props.downRank(props.idx);
          }}
        >
          &#9660;
        </Button>
      )}
    </div>
  );
};

export default RListing;
