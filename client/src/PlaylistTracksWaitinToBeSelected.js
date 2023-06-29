import React from "react";
import { SubtitleH2 } from "./styling/ComponentStyles.js";

const PlaylistTracksWaitinToBeSelected = ({ trackName, artistName }) => {
  const splicedTrackTitle = trackName.substring(0, 17);
  const splicedArtistName = artistName.substring(0, 17);

  // below is conditional rendering to make sure track + artist names don't appear too disproporionately large
  // in the flex box
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
