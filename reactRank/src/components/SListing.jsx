import React, { useState } from "react";
import Button from "./Button";

const SListing = (props) => {
  return (
    <div
      className="row g-0 rankcontainer"
      style={{ width: "75%", height: "85px" }}
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
    </div>
  );
};

export default SListing;
