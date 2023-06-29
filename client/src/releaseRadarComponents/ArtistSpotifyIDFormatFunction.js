import React, { useEffect, useState } from "react";
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
        <FunctionToReturnSingleArtistSpotifyID key={item} artistName={item} />
      );
    })
  );
};

export default ArtistSpotifyIDFormatFunction;
