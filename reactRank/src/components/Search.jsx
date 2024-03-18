import React, { useRef, useState, useEffect, useContext } from "react";
import { PacmanLoader } from "react-spinners";
import Listing from "./Listing";
import myJson from "./psudoSearch.json";
import Context from "../context/Context";

const Search = () => {
  const textInRef = useRef();

  const [showEmptyWarning, setShowEmptyWarning] = useState(false);
  const [results, setResults] = useState({ results: [] });
  const [searchTrigger, setSearchTrigger] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getPsudoGameData = async () => {
    console.log("DEBUGGER SEARCH");

    const data = myJson;

    setResults(data);
    setSearchTrigger(true);
  };

  const tipsMessages = [
    "Tip: Remember to save your list or it be lost forever",
    "Tip: You can click and drag from this search to the list on the right!",
    "Tip: Search exact names for better results!",
    "Did You Know: Pacman originally was called Puck-Man, but was changed for obvious reasons",
  ];
  const [tipHint, setTipHint] = useState(tipsMessages[0]);
  const emptyWarning = "Search cannot be empty";

  //Search//
  const getGameData = async () => {
    if (textInRef.current.value !== "") {
      setIsLoading(true);
      try {
        const res = await fetch(
          import.meta.env.VITE_SERVER +
            "&page=1&page_size=10&search_precise=true&exclude_additions=true&search=" +
            textInRef.current.value
        );
        if (res.status === 200) {
          console.log("successful fetch");
          const data = await res.json();
          setResults(data);
          setSearchTrigger(true);
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      setShowEmptyWarning(true);
    }
    setIsLoading(false);
  };
  // useEffect(() => {
  //   const controller = new AbortController();

  //   return () => {
  //     controller.abort();
  //   };
  // }, []);
  /////////////////////////////////////////////////RENDERER////////////

  return (
    <div className="row">
      <div>
        <label>Search: &nbsp;</label>
        <input
          type="type"
          className="search"
          ref={textInRef}
          placeholder={
            showEmptyWarning ? emptyWarning : "Search for Vidyagames"
          }
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              getGameData();
            }
          }}
        ></input>
        <button className={"btn btn-success btn-sm"} onClick={getGameData}>
          Search
        </button>
        <button
          className={"btn btn-outline-success btn-sm"}
          onClick={getPsudoGameData}
        >
          Debug
        </button>
        <br />
      </div>
      <br />
      <div className="row">
        {isLoading ? <PacmanLoader color="#d6ab36" speedMultiplier={3} /> : ""}
        {searchTrigger ? (
          <div className="row">{`Results: ${results.count} found, returning the first 10 (Try to give exact titles for better results!)`}</div>
        ) : (
          <small
            onClick={() => {
              setTipHint(
                tipsMessages[Math.ceil(Math.random() * tipsMessages.length) - 1]
              );
            }}
          >
            {tipHint}
          </small>
        )}
      </div>

      <hr></hr>
      <div className="container">
        {results.results.length === 0 ? (
          "Start searching and adding to your list!"
        ) : (
          <div className="row">
            {results.results.map((entry, idx) => {
              return (
                <Listing
                  key={idx}
                  image={entry.background_image}
                  name={entry.name}
                ></Listing>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
