import React from "react";

const Button = (props) => {
  const fireOff = (e) => {
    e.preventDefault();
    console.log("Button Clicked");
    return props.trigger(true);
  };
  return (
    <button className={props.className} onClick={fireOff}>
      {props.children}
    </button>
  );
};

export default Button;
