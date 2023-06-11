import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  GoToProfileButton,
  ReleaseRadarCoverArtImage,
  OuterDivForArrayOfNewTracksState,
  AlbumNameAndReleaseDateFlexBox,
  MoreInfoFlexBox,
  SubtitleH2,
  AlbumNameAndReleaseDateWrapper,
} from "./styling/ComponentStyles.js";
import {
  addToOrCreatePlaylistFunction,
  TextCreatePlaylist,
  addTracksToSpotifyPlaylist,
} from "./databaseOperations.js";
import GoogleNewsFunction from "./GoogleNews.js";
import PullTrackData from "./PullDataForTrackFunction.js";
import ArtistSpotifyIDFormatFunction from "./ArtistSpotifyIDFormatFunction.js";



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
const functionToRemoveSingleTrackfromDatabase = async (
  trackSpotifyID,
  dateAdded
) => {
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

    return trackSpotifyID, dateAdded;
  } catch (error) {
    console.log(error);
  }
};

const ReleaseRadarFunction = () => {
  const [tracksObject, setTracksObject] = useState("");
  const [releaseRaderObject, setReleaseRaderObject] = useState("");
  const [arrayOfNewTracksState, setArrayOfNewTracksState] = useState("");
  const [moreInfo, setMoreInfo] = useState([]);
  const [artistSpotifyID, setArtistSpotifyID] = useState([]);

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
    functionToRemoveSingleTrackfromDatabase(trackSpotifyID, dateAdded);
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
  };

  // after playlist is added, this resets 'arrayOfNewTracksState' to nothing
  const setNewTracksArrayToBlankArray = () => {
    setArrayOfNewTracksState([]);
  };

  const addIDsToMoreInfo = (SpotID) => {
    setMoreInfo([...moreInfo, SpotID]);
  };

  const scriptElement = document.getElementById('background-color');
  
 
  

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

           

            return (
              <React.Fragment key={i}>
                <OuterDivForArrayOfNewTracksState>
                  
                    <iframe
                      style={{ borderRadius: "12px", backgroundColor: 'rgb(119, 119, 119)'  }}
                      title={trackSpotifyID}
                      src={`https://open.spotify.com/embed/track/${trackSpotifyID}?utm_source=generator`}
                      width="80%"
                      height="250"
                      frameBorder="0"
                      allowFullScreen=""
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    ></iframe>
                  
                  <br />
            {console.log('scriptElement',scriptElement)}
                 
                  <div>
                    <button
                      onClick={() =>
                        removeSingleTrackfromDatabase(trackSpotifyID, dateAdded)
                      }
                    >
                      Remove
                    </button>
                    <br />
                    {/* conditional render of more info button to only disply if the track ID is not within the 
  'moreInfo array   */}

                    {(moreInfo.length === 0 ||
                      !moreInfo.includes(trackSpotifyID)) && (
                      <button
                        onClick={() => {
                          addIDsToMoreInfo(trackSpotifyID);
                      
                        }}
                      >
                        More info?
                      </button>
                    )}
                    
                  </div>
                </OuterDivForArrayOfNewTracksState>
                <MoreInfoFlexBox>
                  {moreInfo.map((item, index) => {
                    return item === trackSpotifyID ? (
                      <React.Fragment key={index}>
                        <br />

                        <AlbumNameAndReleaseDateFlexBox>
                          <AlbumNameAndReleaseDateWrapper>
                            <SubtitleH2 class="div1">
                              Album name &nbsp;
                            </SubtitleH2>{" "}
                            <div class="div2"> :&nbsp; {album} </div>
                          </AlbumNameAndReleaseDateWrapper>
                          <AlbumNameAndReleaseDateWrapper>
                            <SubtitleH2>Album release date &nbsp;</SubtitleH2>{" "}
                            <div> :&nbsp; {albumReleaseDate} </div>
                          </AlbumNameAndReleaseDateWrapper>

                          <PullTrackData artist={artist} track={track} />
                        </AlbumNameAndReleaseDateFlexBox>
                      </React.Fragment>
                    ) : (
                      <React.Fragment key={index}></React.Fragment>
                    );
                  })}
                </MoreInfoFlexBox>
                <br />
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
