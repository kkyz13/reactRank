import React from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";
import Button from "./Button";

const OverLay = (props) => {
  return (
    <div className={styles.backdrop} onClick={props.dismiss}>
      <div className={`${styles.board} ${styles.modal}`}>
        <header className={styles.header}>
          <h3>{props.title}</h3>
        </header>
        <div className={styles.content}>
          <p>{props.message}</p>
        </div>
        <div className={styles.actions}>
          <Button trigger={props.dismiss}>Ok</Button>
        </div>
      </div>
    </div>
  );
};

const Modal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <OverLay
          title={props.title}
          message={props.message}
          delete={props.delete}
          dismiss={props.dismiss}
          rankID={props.rankID}
        />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};
export default Modal;
