import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoToProfileButton } from "./styling/ComponentStyles.js";
import {
  addToOrCreatePlaylistFunction,
  TextCreatePlaylist,
  addTracksToSpotifyPlaylist,
} from "./databaseOperations.js";
import GoogleNewsFunction from "./GoogleNews.js";
import PullTrackData from "./PullDataForTrackFunction.js";

const { spotify_access_token } = window.localStorage;
console.log(spotify_access_token);

// returns spotify release radar playlist data
const releaseRaderAPICallFunction = async () => {
  try {
    const releaseRadarAPICall = await axios.get(
      "https://api.spotify.com/v1/playlists/37i9dQZEVXbpTERBYDw7WM",
      {
        headers: {
          Authorization: `Bearer ${spotify_access_token}`,
        },
      }
    );
    return releaseRadarAPICall;
  } catch (error) {
    console.log(error);
  }
};

// formats data from release radar API request into an object
const formatNewTracksAsObjectFunction = (releaseRadarTracks) => {
  return releaseRadarTracks.map((item, index) => {
    let artist2;
    // if track cites only one artist
    if (item.track.artists.length === 1) {
      artist2 = item.track.artists[0]?.name;
    } else {
      // if track cites more than one artist, return a string with all of them
      const oneString = item.track.artists.map((e) => {
        let moreThanOneArist = [];
        moreThanOneArist.push(e.name);
        const artistsAsOneString = moreThanOneArist.join(",");

        return artistsAsOneString;
      });

      artist2 = oneString.join(",");
    }

    const artist = artist2;
    const trackID = item.track?.id;
    const trackName = item.track?.name;
    const dateAdded = item.added_at;
    const album = item.track?.album?.name;
    const albumReleaseDate = item.track?.album?.release_date;
    const albumImage = item.track?.album?.images[0]?.url;

    const simpleRadarObject = {
      artist: artist,
      trackName: trackName,
      trackSpotifyID: trackID,
      dateAdded: dateAdded,
      album: album,
      albumReleaseDate: albumReleaseDate,
      albumImage: albumImage,
    };

    return simpleRadarObject;
  });
};


// sends new tracks to the back end. The response will returned only those that are not already on the databse
const sendRadarTracksToBackEndFunction = async (
  releaseRadarTracksAsSimpleObject
) => {
  const config = {
    Key: "Content-Type",
    Value: "application/json",
  };

  const body = {
    objectFromFrontEnd: releaseRadarTracksAsSimpleObject,
  };

  try {
    const axiosPost = await axios.post(
      "/post_release_radar_tracks",
      body,
      config
    );
    const newTracks = axiosPost.data.arrayOfNewTracks;

    console.log(axiosPost);
    return newTracks;
  } catch (err) {
    console.log(err);
  }
};

// function to remove call back end to remove single track from database. Seperate for testing
const functionToRemoveSingleTrackfromDatabase = async (trackSpotifyID, dateAdded) => {
  const config = {
    Key: "Content-Type",
    Value: "application/json",
  };

  const body = {
    trackSpotifyID,
    dateAdded,
  };
  try {
    // post requst to server with body containing info on which track to mark as removed
    axios.post("/remove_single_track_from_database", body, config);

    return (trackSpotifyID, dateAdded)
  } catch (error) {
    console.log(error);
  }
}


const ReleaseRadarFunction = () => {
  const [tracksObject, setTracksObject] = useState("");
  const [releaseRaderObject, setReleaseRaderObject] = useState("");
  const [arrayOfNewTracksState, setArrayOfNewTracksState] = useState("");
  const [moreInfo, setMoreInfo] = useState([]);

  
  // function to call global scope function from requesting release radar playlist to passing to the back end
  // and setting  ReleaseRadarFunction's state with new, unadded tracks
  const getReleaseRadarPlaylist = async () => {
    // call functions 'releaseRaderAPICallFunction' so it can be global in scope in the file for testing
    const awaitReleaseRaderAPICallFunction =
      await releaseRaderAPICallFunction();
    const releaseRadarTracks =
      awaitReleaseRaderAPICallFunction.data.tracks.items;

      // calls 'formatNewTracksAsObjectFunction' with new tracks
    const releaseRadarTracksAsSimpleObject =
      formatNewTracksAsObjectFunction(releaseRadarTracks);

      // calls 'sendRadarTracksToBackEndFunction' with correctly formatted track data and returns relevent tracks 
      // as an array
    const newTracksReturned = await sendRadarTracksToBackEndFunction(
      releaseRadarTracksAsSimpleObject
    );

    // Sets 'ReleaseRadarFunction''s 'arrayOfNewTracksState' with only unadded tracks
    setArrayOfNewTracksState(newTracksReturned);
  };

  // call the global function (that call the back end) and updates the components state so 'arrayOfNewTracksState'
  // removes those selected to be removed
  const removeSingleTrackfromDatabase = async (trackSpotifyID, dateAdded) => {

    // sends call to back end to mark track as removed
    functionToRemoveSingleTrackfromDatabase(trackSpotifyID, dateAdded)
  // maps over each new track, if removable tack re-set 'arrayOfNewTracksState' with a spliced array with the given track reomved
  arrayOfNewTracksState.forEach((item, index) => {
    const nestedArray = [...item];
    if (nestedArray[2] === trackSpotifyID) {
      // new array created so that react will recognise the new values and re-render
      const updatedArray = [...arrayOfNewTracksState];
      updatedArray.splice(index, 1);

      setArrayOfNewTracksState(updatedArray);
    }
  });

  }
  
  // after playlist is added, this resets 'arrayOfNewTracksState' to nothing
  const setNewTracksArrayToBlankArray = () => {
    setArrayOfNewTracksState([]);
  };
  const addIDsToMoreInfo = (SpotID) => {
    setMoreInfo([...moreInfo, SpotID]);
  };

  return (
    <React.Fragment>
      {tracksObject && tracksObject.map((x) => x.artist)}
      <button onClick={getReleaseRadarPlaylist}>Get Release Radar data</button>

      {releaseRaderObject &&
        releaseRaderObject.map((x) => {
          return (
            <>
              <div key={x.track.id}>{x.track.id}</div>
              <button>Remove</button>
            </>
          );
        })}

      <br />

      {arrayOfNewTracksState && arrayOfNewTracksState.length !== 0 && (
        <>
          {arrayOfNewTracksState.map((x, i) => {
            const [artist] = x[0]
              .split("|")
              .map((name) => name.replace(/,/g, " & "));
            const [track] = x[1].split("|");
            const [trackSpotifyID] = x[2].split("|");
            const [dateAdded] = x[3].split("|");
            const album = x[4];
            const albumReleaseDate = x[5];
            const albumImage = x[6];
            const artistOrArtistsAsArray = x[0]?.split(',')

            return (
              <React.Fragment key={i}>
                <br />
                {track} by {artist} added + trackSpotifyID is {trackSpotifyID}
                <button
                  onClick={() =>
                    removeSingleTrackfromDatabase(trackSpotifyID, dateAdded)
                  }
                >
                  Remove
                </button>
                <br />
                {/* More info? button logs trackID to local components state, which is an array
                , the code then maps over that array to only render the <PullTrackData /> 
                function for IDs in that array   */}
                <button onClick={() => addIDsToMoreInfo(trackSpotifyID)}>
                  More info about release?
                </button>
                <br />
                {moreInfo.map((item, index) => {
                  return item === trackSpotifyID ? (
                    <React.Fragment key={index}>
                      <br />
                      <PullTrackData artist={artist} track={track} />
                      Album name : {album}
                      <br />
                      Album release date : {albumReleaseDate}
                      <br />
                      Album cover image : {albumImage}
                    </React.Fragment>
                  ) : (
                    <React.Fragment key={index}></React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
          <button
            onClick={() => {
              addToOrCreatePlaylistFunction(arrayOfNewTracksState);
              setNewTracksArrayToBlankArray();
            }}
          >
            Add to playlist
          </button>
        </>
      )}
    </React.Fragment>
  );
};

export default ReleaseRadarFunction;
