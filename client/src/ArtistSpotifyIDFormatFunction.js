import React, { useEffect, useState } from "react";
import axios from "axios";
import FunctionToReturnSingleArtistSpotifyID from "./FunctionToReturnSingleArtistSpotifyID.js";

const ArtistSpotifyIDFormatFunction = ({ artistName }) => {
  const [aristOrArtists, setAristOrArtists] = useState([]);

  useEffect(() => {
    const removeAmpersand = artistName.split(" & ");
    setAristOrArtists(removeAmpersand);
  }, [artistName]);

  return (
    aristOrArtists &&
    aristOrArtists.map((item) => {
      return (
        <React.Fragment key={item}>
          <div>Individual Arists name {item}</div>
          <FunctionToReturnSingleArtistSpotifyID artistName={item} />
        </React.Fragment>
      );
    })
  );
};

export default ArtistSpotifyIDFormatFunction;
