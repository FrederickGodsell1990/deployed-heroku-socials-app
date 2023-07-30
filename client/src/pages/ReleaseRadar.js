import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  GoToProfileButton,
  OuterDivForArrayOfNewTracksState,
  AlbumNameAndReleaseDateFlexBox,
  MoreInfoFlexBox,
  SubtitleH2,
  AlbumNameAndReleaseDateWrapper,
  BoldParagraph,
  ReleaseRaderParaFlexBox,
  StyledParagraph
} from "../styling/ComponentStyles.js";
import { addToOrCreatePlaylistFunction } from "../releaseRadarComponents/DatabaseOperations.js";
import PullTrackData from "../releaseRadarComponents/PullDataForTrackFunction.js";

const { spotify_access_token } = window.localStorage;
console.log(spotify_access_token);

// returns spotify release radar playlist data
export const releaseRaderAPICallFunction = async () => {
  try {
    const releaseRadarAPICall = await axios.get(
      "https://api.spotify.com/v1/playlists/37i9dQZEVXbpTERBYDw7WM", // hardcoded release rader playlist - can make dynamic
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
  return releaseRadarTracks.map((item) => {
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

    console.log("those not on database", axiosPost);
    return newTracks;
  } catch (err) {
    console.log(err);
  }
};

// function to call back end to remove single track from database.
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
  const [releaseRaderObject, setReleaseRaderObject] = useState("");
  const [arrayOfNewTracksState, setArrayOfNewTracksState] = useState("");
  const [moreInfo, setMoreInfo] = useState([]);
  const [getTracksButtonBeenClicked, setGetTracksButtonBeenClicked] =
    useState(false);

  // function to call release radar API to return playlist to pass to the back end
  // and sett ReleaseRadarFunction's state with new, unadded tracks
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
    // lets state know that the search release rader button has been clicked once
    setGetTracksButtonBeenClicked(true);
  };

  // call the global function (that calls the back end) and updates the components state so 'arrayOfNewTracksState'
  // removes those selected to be removed
  const removeSingleTrackfromDatabase = async (trackSpotifyID, dateAdded) => {
    // sends call to back end to mark track as removed
    functionToRemoveSingleTrackfromDatabase(trackSpotifyID, dateAdded);
    // maps over each new track, if the track is removable 'arrayOfNewTracksState' is re-set with a spliced array with
    // the given track removed 
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

  const scriptElement = document.getElementById("background-color");

  const navigate = useNavigate();

  const functionToProfile = () => {
    navigate("/");
  };

  return (
    <React.Fragment>
      {/* // conditional rendering to indicate there are no new tracks once the search button has been clicked once or 
      // all new tracks have been removed by user */}
      {getTracksButtonBeenClicked === false && !arrayOfNewTracksState ? (
        <>

        <br/>
        <br/>
        <br/>
        <ReleaseRaderParaFlexBox>
<BoldParagraph>This app was built to prevent losing new track releases from my favourite artists into the Spotify ether. </BoldParagraph>
<StyledParagraph>Its functionality hinges on Spotify’s ‘Release Radar’ playlist; an auto-generated, 30 track playlist that is curated based on a user's listening habits, followed artists, and music preferences. Each Friday the playlist is revised, nudging older tracks off to make way for new releases. The number of new releases varies, but seldom exceeds the full 30, therefore most playlists contain some tracks that have appeared on it before. </StyledParagraph>
<StyledParagraph>The app’s ‘find new tracks’ feature first retrieves the most recent iteration of the ‘Release Radar’ playlist. Presented with the contents of this playlist within the app, the user is then given options to remove any individual track, to view further information about each track and to bulk add them to a custom playlist within their Spotify account. The instructions to add or remove tracks are captured in a database to allow the app to recognise which tracks are new to the user and prevent the track from appearing on the custom playlist, or from the user having to give the remove instruction, more than once. </StyledParagraph>


<StyledParagraph>The custom playlist is itself generated by the app, with its title formatted as ‘Release Radar Capture Playlist MONTH YEAR’. If a playlist exists for the given month, the app will add the new tracks to that playlist. If it does not, it will create a new one, which over time will build a library of personalised playlists of new releases indexed by month and year, accessible both within the user’s Spotify account and within the app. </StyledParagraph>
</ReleaseRaderParaFlexBox>
<br/>
        <button onClick={getReleaseRadarPlaylist}>Find new tracks</button>
        
        </>
      ) : arrayOfNewTracksState.length === 0 && getTracksButtonBeenClicked ? (
        <h3>No new tracks!</h3>
      ) : (
        ""
      )}

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
           

            return (
              <React.Fragment key={i}>
                <OuterDivForArrayOfNewTracksState>
                  {/* iframe to to display spotify player */}
                  <iframe
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "rgb(119, 119, 119)",
                    }}
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
                

                  <div>
                    <button
                      onClick={() =>
                        removeSingleTrackfromDatabase(trackSpotifyID, dateAdded)
                      }
                    >
                      Remove
                    </button>
                    <br />
                    {/* conditional render of 'more info' button to only disply if the track ID is not within the 
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
                            <div class="div1">Album name &nbsp;</div>{" "}
                            <SubtitleH2 class="div2">
                              {" "}
                              :&nbsp; {album}{" "}
                            </SubtitleH2>
                          </AlbumNameAndReleaseDateWrapper>
                          <AlbumNameAndReleaseDateWrapper>
                            <div>Album release date &nbsp;</div>{" "}
                            <SubtitleH2>
                              {" "}
                              :&nbsp; {albumReleaseDate}{" "}
                            </SubtitleH2>
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

      <GoToProfileButton onClick={functionToProfile}>
        Go to Profile
      </GoToProfileButton>
    </React.Fragment>
  );
};

export default ReleaseRadarFunction;
