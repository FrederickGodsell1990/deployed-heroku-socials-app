import GoogleNewsFunction from "./GoogleNews.js";
import React, { useEffect, useState } from "react";
import ArtistSpotifyIDFormatFunction from './ArtistSpotifyIDFormatFunction.js'
import {
 AlbumNameAndReleaseDateWrapper,
 SubtitleH2
} from "./styling/ComponentStyles.js";

const PullTrackData = ({ artist, track }) => {
  const [artistState, setArtistState] = useState("");
  const [trackState, setTrackState] = useState("");

  useEffect(() => {
    setArtistState(artist);
    setTrackState(track);
  }, [artist, track]);

  return <>
   <AlbumNameAndReleaseDateWrapper>
   <SubtitleH2>News &nbsp;</SubtitleH2> : &nbsp;
   <GoogleNewsFunction artist={artistState} track={trackState} />
   </AlbumNameAndReleaseDateWrapper>
   <AlbumNameAndReleaseDateWrapper>
   <SubtitleH2> Artist Socials </SubtitleH2> : &nbsp;
       <ArtistSpotifyIDFormatFunction artistName={artistState}/>
       </AlbumNameAndReleaseDateWrapper>
   
       
   </>
};

export default PullTrackData;
