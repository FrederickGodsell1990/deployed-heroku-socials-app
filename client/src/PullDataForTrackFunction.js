import GoogleNewsFunction from "./GoogleNews.js";
import React, { useEffect, useState } from "react";
import ArtistSpotifyIDFormatFunction from './ArtistSpotifyIDFormatFunction.js'
import {
  ArtistSocialsFlexBox
} from "./styling/ComponentStyles.js";

const PullTrackData = ({ artist, track }) => {
  const [artistState, setArtistState] = useState("");
  const [trackState, setTrackState] = useState("");

  useEffect(() => {
    setArtistState(artist);
    setTrackState(track);
  }, [artist, track]);

  return <>
   <GoogleNewsFunction artist={artistState} track={trackState} />;
   <div> Artist Socials </div>
   <ArtistSocialsFlexBox>
       <ArtistSpotifyIDFormatFunction artistName={artistState}/>
       </ArtistSocialsFlexBox>
   </>
};

export default PullTrackData;
