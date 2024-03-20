import { React, createRef } from "react";
import ReactDOM from "react-dom";
import styles from "./ShareModal.module.css";
import Button from "./Button";
import SListing from "./SListing";
import { useScreenshot, createFileName } from "use-react-screenshot";

const OverLay = (props) => {
  const [image, takeScreenshot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0,
  });

  const ref = createRef(null);
  const download = (image, { name = "img", extension = "jpg" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const downloadScreenshot = () => takeScreenshot(ref.current).then(download);

  return (
    <div className={styles.backdrop}>
      <div className={`${styles.board} ${styles.modal}`}>
        <header className={styles.header}>
          <h3 className="display-6">{props.title}</h3>
        </header>
        <div
          ref={ref}
          className={styles.content}
          style={{ height: "80vh", overflowY: "scroll" }}
        >
          {props.myRanking.map((entry, idx) => {
            return (
              <SListing
                cPanel={true}
                rank={idx + 1}
                idx={idx}
                key={idx}
                image={entry.image}
                name={entry.name}
              ></SListing>
            );
          })}
        </div>
        <div className={styles.actions}>
          <Button
            trigger={() => {
              downloadScreenshot(ref.current).then(download);
            }}
          >
            Save Screenshot
          </Button>
          <Button trigger={props.dismiss}>I'm done</Button>
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
          share={props.share}
          dismiss={props.dismiss}
          myRanking={props.myRanking}
          rankID={props.rankID}
        />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};
export default Modal;
