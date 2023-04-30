import GoogleNewsFunction from "./GoogleNews.js";
import React, { useEffect, useState } from "react";

const PullTrackData = ({ artist, track }) => {
  const [artistState, setArtistState] = useState("");
  const [trackState, setTrackState] = useState("");

  useEffect(() => {
    setArtistState(artist);
    setTrackState(track);
  }, [artist, track]);

  return <GoogleNewsFunction artist={artistState} track={trackState} />;
};

export default PullTrackData;
