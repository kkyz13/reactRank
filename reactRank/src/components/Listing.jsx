import React, { useContext, useState } from "react";
import Button from "./Button";
import Context from "../context/Context";

//props list [name = Name of the Entry, would be shown as a title; image = Image URL; idx = index of entry from the list]
const Listing = (props) => {
  const Ctx = useContext(Context);

  const pushEntry = () => {
    const sendData = { name: props.name, image: props.image };
    Ctx.setShowRank(true);
    return sendData;
  };

  return (
    <div
      className="row g-0 gamecontainer"
      draggable={true}
      onDrag={(e) => {
        e.preventDefault();
        // console.log("DRAG!");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData(
          "mypayload",
          JSON.stringify({
            name: props.name,
            image: props.image,
          })
        );
      }}
    >
      <img
        src={props.image}
        onDoubleClick={() => {
          Ctx.addToRank(pushEntry());
        }}
        draggable={true}
        onDragStart={(e) => {
          // e.preventDefault();

          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData(
            "mypayload",
            JSON.stringify({
              name: props.name,
              image: props.image,
            })
          );
        }}
      ></img>
      <h1
        className="gametitle"
        draggable={true}
        onDragStart={(e) => {
          // e.preventDefault();

          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData(
            "mypayload",
            JSON.stringify({
              name: props.name,
              image: props.image,
            })
          );
        }}
      >
        {props.name}
      </h1>
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
