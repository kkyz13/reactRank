import React, { useContext, useState } from "react";
import Button from "./Button";
import Context from "../context/Context";
const Listing = (props) => {
  const Ctx = useContext(Context);

  const pushEntry = () => {
    const sendData = { name: props.name, image: props.image };
    Ctx.setShowRank(true);
    return sendData;
  };

  return (
    <div className="row g-0 gamecontainer">
      <img
        src={props.image}
        onDoubleClick={() => {
          console.log(`${props.name}`);
        }}
      ></img>
      <h1 className="gametitle">{props.name}</h1>
      <Button
        className="addbutton"
        trigger={() => {
          Ctx.addToRank(pushEntry());
        }}
      >
        Add To Current List
      </Button>
    </div>
  );
};

export default Listing;
