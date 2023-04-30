import axios from "axios";

let spotify_access_token; 

if (process.env.NODE_ENV === 'development') {
   spotify_access_token =
  "BQCvir4tGBG-iHSsB53W-J7K8cIi90YFkn5xZgqf-RoGAe-Zayv5ANf8KY5GB0V68Byv5_6uq4oW9WGUBzbYweHSBYilyubn-oBbjYdx_GGqd5yuNGtfXwUE5OHOYpgX2MbVa9lsQpREJrordK_6766qjOCuoPPOgFEWgcn11cfl32TcoVkBwaICWKnR5S2eRa-WnHsfDE-UCQLV0OaL50Nq8VwuiLfRXW77GAexvEgZ4SUzFra7dzYUVeYui7IesdUOiyI9YCBniqy_gOsEFKMhj06Fs0A";
} else {
  spotify_access_token = window.localStorage.spotify_access_token
}


// this function logs the given playlist in the database, storing the 3 values seen in the arguments
async function TextCreatePlaylist(
  playlistSpotifyID,
  monthAndYearCreated,
  playlistName
) {
  try {
    // this creates a new playlist on the back end
    const createPlayListTest = await axios.post(
      "/log_playlist",
      {
        playlistSpotifyID,
        monthAndYearCreated,
        playlistName,
      },
      {
        Key: "Content-Type",
        Value: "application/json",
      }
    );
    console.log(createPlayListTest);
    return createPlayListTest;
  } catch (error) {
    console.log(error);
  }
}

  // this function just gets playlists that are logged in the database and return them as an object
async function returnPlayListsInDatabase() {
  
  try {
    const getPlaylistsResponse = await axios.get("/get_playlists");
    const tracksAsObject = getPlaylistsResponse.data.playlists;
    return tracksAsObject;
  } catch (error) {
    console.log(error);
  }
}

// this function creates in spotify and returns an object of the newly created playlist icluding the details that will be stored in the database
async function returnNewlyCreatedPlaylistID() {
  const today = new Date();
  const options = { month: "long" };
  const monthName = today.toLocaleString("default", options); // returns the name of the month
  const year = today.getFullYear(); // gets the current year
  console.log(`This month is ${monthName} in ${year}, create a new playlist `);

  // if this fucntion is not working, it's likely that the access token has expired
  const getNewTrackPlayLists = async () => {
    try {
      // this create a new playlist in spotify your spotify account. It's hardcoded with my account ID
      const createPlayListTest = await axios.post(
        "https://api.spotify.com/v1/users/b47xswoxdvt7pftssnjks9iff/playlists",
        {
          name: `Release Radar Capture Playlist ${monthName} ${year}`,
          description: `${monthName} ${year}`,
          public: true,
        },
        {
          headers: {
            Authorization: `Bearer ${spotify_access_token}`,
          },
        }
      );
      console.log(createPlayListTest);
      return createPlayListTest;
    } catch (error) {
      console.log(error);
    }
    await returnNewlyCreatedPlaylistID();
  };
  return getNewTrackPlayLists();
}

// this function formats new tracks data then makes API call to spotify app and adds tracks to a pre-existing playlist
async function addTracksToSpotifyPlaylist(
  playlistID,
  arrayOfTrackDataFromDataBase
) {
  let arrayOfTrackIDsFormattedForAdding = [];

  Promise.all(
    arrayOfTrackDataFromDataBase.map((item, index) => {
      const spotifyFormatting = `spotify:track:${item[2]}`;
      arrayOfTrackIDsFormattedForAdding.push(spotifyFormatting);
    })
  );
  console.log(arrayOfTrackIDsFormattedForAdding);

  try {
    const addToPlaylistAxiosPostRequest = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
      {
        uris: arrayOfTrackIDsFormattedForAdding,
      },
      {
        headers: {
          Authorization: `Bearer ${spotify_access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // log here to confirm that tracks have been successfully added to spotify playlist
    console.log(
      "Added to playlist, here is snapshot ID;",
      addToPlaylistAxiosPostRequest.data.snapshot_id
    );
  } catch (error) {
    console.log(error);
  }
}

// this function formats data from the newly created playlist in spotify ready for consumption by database
async function formatPlayListInputAndBackendLog(unuqueSpoitifyPlaylistData) {
  const playlistSpotifyID = unuqueSpoitifyPlaylistData.data.id;
  const monthAndYearCreated = unuqueSpoitifyPlaylistData.data.description;
  const playlistName = unuqueSpoitifyPlaylistData.data.name;

  TextCreatePlaylist(playlistSpotifyID, monthAndYearCreated, playlistName);

  return [playlistSpotifyID, monthAndYearCreated, playlistName];
}

// this function conditionally creates a new playlist if none exist in the database,
// adds new tracks if a playlist existing for the given month, or creates a new playlist if
// one does not exist for the current month
async function addToOrCreatePlaylistFunction(dataOfTrackAdded) {
  
  // variable for the date of the newly added tracks. They will always be the same as
  // new tracks come from 'release radar' playlist which wipes clean + resests each Friday   
  const referenceDateForTranceOfTracks = dataOfTrackAdded[0][3];

  // regex to extract month of newly added track
  const regex = /^(\d{4})-(\d{2})/;
  const match = regex.exec(referenceDateForTranceOfTracks);
  const monthOfNewestAddedTrack = Number(match[2] - 1);
  const yearOfNewestAddedTrack = Number(match[1] - 1);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[monthOfNewestAddedTrack];

  // monthAndYearOfNewTrack formatted in the way so it matches how it is stored in database,
  // this data is later compared conditionally 
  const monthAndYearOfNewTrack = `${monthName} ${yearOfNewestAddedTrack + 1}`;

  const today = new Date();
  const theMonthRightNow = today.getMonth();

  const playListsAsNewArray = [...(await returnPlayListsInDatabase())];
  // condition checking if no playlist are stored in database
  if (playListsAsNewArray.length === 0) {
    const firstPlayList = await returnNewlyCreatedPlaylistID();
    let spotifyPlaylistIDOnceLogged = formatPlayListInputAndBackendLog(
      firstPlayList
    );
// .then is used otherwise playlist ID would not display value
    await spotifyPlaylistIDOnceLogged.then((item) => {
      addTracksToSpotifyPlaylist(item[0], dataOfTrackAdded);
    });

    // return added here to hard stop code from progressing after playlist was created 
    return;
  
  }
  // if the month of the new un-added track matches today's month i.e if a playlist for 
  // the given month already exists
  if (monthOfNewestAddedTrack === theMonthRightNow) {
    async function callPlayListsAsync() {
      const playListsAsNewArray = [...(await returnPlayListsInDatabase())];
// map over playlists to find the one that matches current month
      playListsAsNewArray.map((x, i) => {
        if (x.monthAndYearCreated === monthAndYearOfNewTrack) {

          addTracksToSpotifyPlaylist(x.playlistSpotifyID, dataOfTrackAdded);
        } else {
          console.log("No matching playlists");
        }
      });
    }
    callPlayListsAsync();
  }
  // if months/year is not that of an existing playlist, create a new one
  else {

    // this wll return newly create playlist unique ID
    const unuqueSpoitifyPlaylistData = await returnNewlyCreatedPlaylistID();
// log playlist on back end
    let spotifyPlaylistIDOnceLogged = formatPlayListInputAndBackendLog(
      unuqueSpoitifyPlaylistData
    );
// add new tracks to playlist
    await spotifyPlaylistIDOnceLogged.then((item) => {
      addTracksToSpotifyPlaylist(item[0], dataOfTrackAdded);
    });
  }
}

export {
  addToOrCreatePlaylistFunction,
  TextCreatePlaylist,
  addTracksToSpotifyPlaylist,
};
