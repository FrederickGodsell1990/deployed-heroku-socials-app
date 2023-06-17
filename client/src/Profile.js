import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { LogOutButtonRight, NavigationBar } from "./styling/ComponentStyles.js";
import axios from "axios";
import RenderPlaylist from "./RenderPlaylist.js";
import { logout } from "./spotify";
const { spotify_access_token } = window.localStorage;

const getPlaylistsFromDatabase = async () => {
  const allPlaylistAPICall = await axios.get("/get_playlists");
  // returns an array with all playlists in database
  return allPlaylistAPICall.data.playlists;
};




const Profile = () => {
  
  const navigate = useNavigate();

const functionProfile = () => {
  navigate("/");
};

  const functionToArtistSearch = () => {
    navigate("/artist_search");
  };

  const functionToFavouriteArtists = () => {
    navigate("/favourite_artists");
  };

  const functionToMongoDBFunction = () => {
    navigate("/release_radar");
  };



  const [playlistsAsState, setPlaylistsAsState] = useState([]);

  // calls 'getPlaylistsFromDatabase' when page first renders. Sets 'playlistData' to state with the data returned
  useEffect(() => {
    (async function getAllPlaylists() {
      const playlistData = await getPlaylistsFromDatabase();

      setPlaylistsAsState(playlistData.reverse());
    })();
  }, []);

  // takes 'playlistsAsState' array and creates a new array with the selected playlist to the first value of the new array
  const reArrangePlaylistArrayOrder = (index, array) => {
    const arrayAsNewVariable = [...array];
    const newlySplicedArray = arrayAsNewVariable.splice(index, 1);
    const newlyOrderedArray = [...newlySplicedArray, ...arrayAsNewVariable];
    setPlaylistsAsState(newlyOrderedArray);
  };

  return (
    <React.Fragment>
      {playlistsAsState &&
        playlistsAsState
          .slice(0, 1)
          .map(({ monthAndYearCreated, playlistSpotifyID }) => {
            return (
              <RenderPlaylist
                key={playlistSpotifyID}
                monthAndYearCreated={monthAndYearCreated}
                playlistSpotifyID={playlistSpotifyID}
              />
            );
          })}
      {playlistsAsState &&
        playlistsAsState.map(
          ({ playlistSpotifyID, monthAndYearCreated }, index, array) => {
            return (
              <React.Fragment key={playlistSpotifyID}>
                <div>{monthAndYearCreated}</div>
                <button
                  onClick={() => reArrangePlaylistArrayOrder(index, array)}
                >
                  Switch
                </button>
              </React.Fragment>
            );
          }
        )}
      <NavigationBar>
        <button onClick={functionToArtistSearch}>Artist Search</button>
        <button onClick={functionToFavouriteArtists}>
          Favourite Artsist's
        </button>
        <button onClick={functionToMongoDBFunction}>Release Radar</button>
        <button onClick={logout}>Log out</button>
      </NavigationBar>
    </React.Fragment>
  );
};

export default Profile;
