import React, { useEffect, useState } from "react";
import axios from "axios";
import FunctionToReturnSingleArtistSpotifyID from "./FunctionToReturnSingleArtistSpotifyID.js";
import {
  MoreInfoDivForArrayOfNewTracksState
  
} from "./styling/ComponentStyles.js";

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
          <div>
          {item}
          
          <FunctionToReturnSingleArtistSpotifyID artistName={item} />
          </div>
        </React.Fragment>
      );
    })
  );
};

export default ArtistSpotifyIDFormatFunction;
