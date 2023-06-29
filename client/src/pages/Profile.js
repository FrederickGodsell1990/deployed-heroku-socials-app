import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  NavigationBar,
  DormantPlaylistFlexbox,
  DormantPlaylistInline,
  SubtitleH2,
  ProfilePageFlexbox,
} from "../styling/ComponentStyles.js";
import axios from "axios";
import RenderPlaylist from "../RenderPlaylist.js";
import { logout } from "../Spotify.js";

const getPlaylistsFromDatabase = async () => {
  const allPlaylistAPICall = await axios.get("/get_playlists");
  // returns an array with all playlists in database
  return allPlaylistAPICall.data.playlists;
};

const Profile = () => {
  const navigate = useNavigate();

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

  // takes 'playlistsAsState' array and creates a new array with the selected playlist as the first value of the new array
  const reArrangePlaylistArrayOrder = (index, array) => {
    const arrayAsNewVariable = [...array];
    const newlySplicedArray = arrayAsNewVariable.splice(index, 1);
    const newlyOrderedArray = [...newlySplicedArray, ...arrayAsNewVariable];
    setPlaylistsAsState(newlyOrderedArray);
  };

  return (
    <React.Fragment>
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
&nbsp;
        <ProfilePageFlexbox>
          <React.Fragment>
            <br />
            <div>
              <h3>Playlists</h3>
              <DormantPlaylistFlexbox>
                {playlistsAsState &&
                  playlistsAsState.map(
                    (
                      { playlistSpotifyID, monthAndYearCreated },
                      index,
                      array
                    ) => {
                      const monthAndYearCreatedSplit =
                        monthAndYearCreated.split(" ");
                      const month = monthAndYearCreatedSplit[0];
                      const year = monthAndYearCreatedSplit[1];

                      return (
                        <React.Fragment key={playlistSpotifyID}>
                          <DormantPlaylistInline>
                            <SubtitleH2>{month} &nbsp; </SubtitleH2>
                            <div>{year} &nbsp; </div>
                            <button
                              onClick={() => {
                                reArrangePlaylistArrayOrder(index, array);
                               
                              }}
                            >
                              Switch?
                            </button>
                          </DormantPlaylistInline>
                        </React.Fragment>
                      );
                    }
                  )}
              </DormantPlaylistFlexbox>
            </div>
          </React.Fragment>
          &nbsp; &nbsp; &nbsp; &nbsp;
          <div>
            <h3>Pages & Actions</h3>
            <NavigationBar>
              <button onClick={functionToArtistSearch}>Artist Search</button>
              <button onClick={functionToFavouriteArtists}>
                Favourite Artists
              </button>
              <button onClick={functionToMongoDBFunction}>Release Radar</button>
              <button onClick={logout}>Log out</button>
            </NavigationBar>
          </div>
        </ProfilePageFlexbox>
      </React.Fragment>
    </React.Fragment>
  );
};

export default Profile;
