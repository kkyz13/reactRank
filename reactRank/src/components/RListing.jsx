import React from "react";
import Button from "./Button";

const RListing = (props) => {
  return (
    <div className="row g-0 gamecontainer">
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
      {props.idx !== 0 ? (
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
      <Button
        className="deletebutton"
        trigger={() => {
          props.delete(props.idx);
        }}
      >
        delete
      </Button>
      <Button className="arrow down" trigger={() => {}}>
        &#9660;
      </Button>
    </div>
  );
};

export default RListing;
