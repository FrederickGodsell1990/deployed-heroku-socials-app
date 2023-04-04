import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoToProfileButton } from "./styling/ComponentStyles.js";

const ReleaseRadarFunction = () => {
  const [tracksObject, setTracksObject] = useState("");
  const [releaseRaderObject, setReleaseRaderObject] = useState("");
  const [arrayOfNewTracksState, setArrayOfNewTracksState] = useState("");


  const handleSingleTrackPostSubmit = (e) => {
    e.preventDefault();

    let artistDetails = e.target[0].value;
    let trackDetails = e.target[1].value;

    console.log("Artist is", artistDetails, "track is", trackDetails);

    const config = {
      Key: "Content-Type",
      Value: "application/json",
    };

    const body = {
      artist: artistDetails,
      track: trackDetails,
    };

    const axiosPostRequest = async () => {
      try {
        await axios.post("/post_track", body, config);
      } catch (err) {
        console.log(err);
      }
    };
    axiosPostRequest();
  };

  const axiosGetRequest = async () => {
    try {
      const getTracksResponse = await axios.get("/get_tracks");
      const tracksAsObject = getTracksResponse.data.tracks;
      setTracksObject(tracksAsObject);

      tracksObject.map((x) => console.log(x));
    } catch (err) {
      console.log("get req error", err);
    }
  };

  const { spotify_access_token } = window.localStorage;

  const getReleaseRadarPlaylist = async () => {
    try {
      const releaseRadarAPICall = await axios.get(
        "https://api.spotify.com/v1/playlists/37i9dQZEVXbpTERBYDw7WM",
        {
          headers: {
            Authorization: `Bearer ${spotify_access_token}`,
          },
        }
      );

      const releaseRadarTracks = releaseRadarAPICall.data.tracks.items;

      const releaseRadarTracksAsSimpleObject = releaseRadarTracks.map(
        (item, index) => {
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

          const simpleRadarObject = {
            artist: artist,
            trackName: trackName,
            trackSpotifyID: trackID,
            dateAdded: dateAdded,
          };

          return simpleRadarObject;
        }
      );

      const config = {
        Key: "Content-Type",
        Value: "application/json",
      };

      const body = {
        objectFromFrontEnd: releaseRadarTracksAsSimpleObject,
      };

      const sendRadarTracksToBackEnd = async () => {
        try {
          const axiosPost = await axios.post(
            "/post_release_radar_tracks",
            body,
            config
          );
          const newTracks = axiosPost.data.arrayOfNewTracks;

          setArrayOfNewTracksState(newTracks);
          console.log(arrayOfNewTracksState);
          console.log(axiosPost);
        } catch (err) {
          console.log(err);
        }
      };
      sendRadarTracksToBackEnd();
    } catch (err) {}
  };

  const removeSingleTrackfromDatabase = async (trackSpotifyID, dateAdded) => {
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
    } catch (error) {
      console.log(error);
    }
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

  return (
    <React.Fragment>
      <a className="mongoGetTracks" href="http://localhost:8888/get_tracks">
        Get tracksAsObject
      </a>

      <form onSubmit={(e) => handleSingleTrackPostSubmit(e)}>
        <label>Enter track info below;</label>
        <br />
        <input
          type="text"
          name="artist"
          placeholder="Enter artist name..."
          required
        />
        <input
          type="text"
          name="track"
          placeholder="Enter track name..."
          required
        />
        <input type="submit"></input>
      </form>
      <button onClick={axiosGetRequest}>Get tracks</button>
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

      {arrayOfNewTracksState &&
        arrayOfNewTracksState.map((x, i) => {
          const [artist] = x[0]
            .split("|")
            .map((name) => name.replace(/,/g, " & "));
          const [track] = x[1].split("|");
          const [trackSpotifyID] = x[2].split("|");
          const [dateAdded] = x[3].split("|");

          return (
            <React.Fragment key={i}>
              {track} by {artist} added + trackSpotifyID is {trackSpotifyID}
              <button
                onClick={() =>
                  removeSingleTrackfromDatabase(trackSpotifyID, dateAdded)
                }
              >
                Remove
              </button>
              <br />
            </React.Fragment>
          );
        })}
    </React.Fragment>
  );
};

export default ReleaseRadarFunction;
