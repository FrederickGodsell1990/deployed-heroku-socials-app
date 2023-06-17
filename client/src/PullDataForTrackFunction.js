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
   <div>News &nbsp;</div> : &nbsp;
   <SubtitleH2>
   <GoogleNewsFunction artist={artistState} track={trackState} />
   </SubtitleH2>
   </AlbumNameAndReleaseDateWrapper>
   <AlbumNameAndReleaseDateWrapper>
   <div> Artist Socials </div> : &nbsp;
   <SubtitleH2>
       <ArtistSpotifyIDFormatFunction artistName={artistState}/>
       </SubtitleH2>
       </AlbumNameAndReleaseDateWrapper>
   
       
   </>
};

export default PullTrackData;
