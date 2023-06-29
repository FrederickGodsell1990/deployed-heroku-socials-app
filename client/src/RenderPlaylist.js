import axios from "axios";
import React, { useEffect, useState } from "react";
import PlaylistTracksWaitinToBeSelected from "./PlaylistTracksWaitinToBeSelected.js";
import {
  ActivePlaylistFlexbox,
  PlaylistSingleLineFlexbox,
  ActivePlaylistTitle,
  FullTrackListButton,
} from "./styling/ComponentStyles.js";

const { spotify_access_token } = window.localStorage;

function RenderPlaylist({ playlistSpotifyID }) {
  const [nameAsState, setNameAsState] = useState("");
  const [tracksAsState, setTracksAsState] = useState([]);
  const [trackSelectedToPlay, setTrackSelectedToPlay] = useState("");
  const [fullTrackList, setFullTrackList] = useState(false);

  //when page first renders, 'getExistingPlaylist' call spotify API returning name of playlist and stores their
  //contained tracks as state
  useEffect(() => {
    const getExistingPlaylist = async () => {
      try {
        const getExistingPlaylistAPICall = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistSpotifyID}`,
          {
            headers: {
              Authorization: `Bearer ${spotify_access_token}`,
            },
          }
        );

        const { name } = getExistingPlaylistAPICall.data;
        setNameAsState(name);
        const { items } = getExistingPlaylistAPICall.data.tracks;
        setTracksAsState(items);

        return getExistingPlaylistAPICall;
      } catch (error) {
        console.log(error);
      }
    };

    getExistingPlaylist();
    // }, [nameAsState]);
  }, [playlistSpotifyID]);

  // function to set 'trackSelectedToPlay' as state.
  const playSelectedTrack = (trackID) => {
    setTrackSelectedToPlay(trackID);
  };

  // function to return spotify player to save writing the same code twice
  const functionToReturnSpotifyPlayer = (trackID) => {
    return (
      <iframe
        style={{
          borderRadius: "12px",
          backgroundColor: "rgb(119, 119, 119)",
        }}
        title={trackID}
        src={`https://open.spotify.com/embed/track/${trackID}?utm_source=generator`}
        width="80%"
        height="250"
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    );
  };

  return (
    <>
      <br />
      {/* If no track is clicked to play, the default will be the first track in the playlist */}
      {!trackSelectedToPlay && tracksAsState ? (
        tracksAsState.map(({ track: { id } }, index) => {
          if (index <= 0) {
            return (
              <React.Fragment key={id}>
                {functionToReturnSpotifyPlayer(id)}
              </React.Fragment>
            );
          }
          return null; // Add a return statement for the "else" case
        })
      ) : (
        <React.Fragment>
          {/* else, the selcted track will play */}
          {functionToReturnSpotifyPlayer(trackSelectedToPlay)}
        </React.Fragment>
      )}
      <br />
      <ActivePlaylistTitle>
        <div>{nameAsState}</div>
      </ActivePlaylistTitle>
      {/* Full playlist rendered below the spotify player */}
      <ActivePlaylistFlexbox>
        {tracksAsState &&
          tracksAsState.map(
            (
              {
                track: {
                  id,
                  name: trackName,
                  artists: [{ name: artistName }],
                },
              },
              index
            ) => {
              if (fullTrackList === false) {
                if (index <= 5) {
                  return (
                    // `${id}${index}` used instead of just ID to prevent 'two children with the same ID error
                    <React.Fragment key={`${id}${index}`}>
                      <PlaylistSingleLineFlexbox>
                        <PlaylistTracksWaitinToBeSelected
                          key={`${id}${index}`}
                          trackName={trackName}
                          artistName={artistName}
                        />
                        <button onClick={() => playSelectedTrack(id)}>
                          Play track?
                        </button>
                      </PlaylistSingleLineFlexbox>
                    </React.Fragment>
                  );
                }
              }
              if (fullTrackList === true) {
                return (
                  <React.Fragment key={`${id}${index}`}>
                    <PlaylistSingleLineFlexbox>
                      <PlaylistTracksWaitinToBeSelected
                        key={`${id}${index}`}
                        trackName={trackName}
                        artistName={artistName}
                      />
                      <button onClick={() => playSelectedTrack(id)}>
                        Play track?
                      </button>
                    </PlaylistSingleLineFlexbox>
                  </React.Fragment>
                );
              }
            }
          )}

        {/* // Toggle what displays on button if the paylist is collapsed or open */}

        {fullTrackList ? (
          <FullTrackListButton onClick={() => setFullTrackList(!fullTrackList)}>
            Collapse track list
          </FullTrackListButton>
        ) : (
          <FullTrackListButton onClick={() => setFullTrackList(!fullTrackList)}>
            Full track list
          </FullTrackListButton>
        )}
      </ActivePlaylistFlexbox>
    </>
  );
}

export default RenderPlaylist;
