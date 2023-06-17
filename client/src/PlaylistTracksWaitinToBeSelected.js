import React, { useEffect, useState } from "react";
import { TextToFade, SubtitleH2 } from "./styling/ComponentStyles.js";

const PlaylistTracksWaitinToBeSelected = ({ trackName, artistName }) => {
  const isTextOverflowing = trackName.length > 20;
  const splicedTrackTitle = trackName.substring(0, 17);
  const splicedArtistName = artistName.substring(0, 17);
  console.log(splicedTrackTitle);
  return (
    <>
      {trackName && trackName.length > 20 && artistName.length > 20 ? (
        // below twenty
        <>
        <SubtitleH2>
          {splicedTrackTitle}... 
          </SubtitleH2>
          &nbsp;by&nbsp;
          <SubtitleH2>{splicedArtistName}...</SubtitleH2>
        </>
      ) : trackName && trackName.length < 20 && artistName.length > 20 ? (
        // above twenty
        <>
        <SubtitleH2>
          {trackName}
          </SubtitleH2>
          &nbsp;by&nbsp;
          <SubtitleH2>{splicedArtistName}...</SubtitleH2>
        </>
      ) : trackName && trackName.length > 20 && artistName.length < 20 ? (
        // above twenty
        <>
        <SubtitleH2>
          {splicedTrackTitle}... 
          </SubtitleH2>
          &nbsp;by&nbsp;
          <SubtitleH2>{artistName}</SubtitleH2>
        </>
      ) : (
        <>
          <SubtitleH2>{trackName}</SubtitleH2>
          &nbsp;by&nbsp;
          <SubtitleH2>{artistName}</SubtitleH2>
        </>
      )}
    </>
  );
};

export default PlaylistTracksWaitinToBeSelected;
