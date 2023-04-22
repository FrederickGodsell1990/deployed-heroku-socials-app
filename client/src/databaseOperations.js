import axios from "axios";

let spotify_access_token; 

if (process.env.NODE_ENV === 'development') {
   spotify_access_token =
  "BQDxUw34z-uAnZL4dQnjfEYxEjxAxKgWY4n4hWwhV0PBXPsSriYc9paH9ck91na6VHQSGz4jpWUmikFq5ijgLG9aOTOOEYM4xTK0PbHxIMnFouCRwNEw6s6napbmUvW17sKzmxkzRLj-737lf0qt96rS7tjTg3-zAJ3plitCbNzPWqvQhp_9dwYa4E1a2tfwE0pMm9Wu3swS4fCQMaMEix0gO-KZ2361hhM3nMXIJ7Lx_d44XFwyGnnQbcxhCfBX4qBtTixSjEIILNnf6SidvkrEVlTxcgU";
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

  // this function just gets playlists that are logged in the database 
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
      // this works to create a new playlist in spotify
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
    console.log(
      "Added to playlist, here is snapshot ID;",
      addToPlaylistAxiosPostRequest.data.snapshot_id
    );
  } catch (error) {
    console.log(error);
  }
}

async function formatPlayListInputAndBackendLog(unuqueSpoitifyPlaylistData) {
  const playlistSpotifyID = unuqueSpoitifyPlaylistData.data.id;
  const monthAndYearCreated = unuqueSpoitifyPlaylistData.data.description;
  const playlistName = unuqueSpoitifyPlaylistData.data.name;

  TextCreatePlaylist(playlistSpotifyID, monthAndYearCreated, playlistName);

  return [playlistSpotifyID, monthAndYearCreated, playlistName];
}

async function addToOrCreatePlaylistFunction(dataOfTrackAdded) {
  // this track added month is the same as the most recently published new tracks playlist's month

  // this looks at the 'date added' value of the first entry of the 'arrayOfNewTracksState' array sent from 'releaseRadar.js'
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

  const monthAndYearOfNewTrack = `${monthName} ${yearOfNewestAddedTrack + 1}`;

  const today = new Date();
  const theMonthRightNow = today.getMonth();

  const playListsAsNewArray = [...(await returnPlayListsInDatabase())];
  if (playListsAsNewArray.length === 0) {
    const firstPlayList = await returnNewlyCreatedPlaylistID();
    console.log("Array is empty, first playlist created", firstPlayList);
    let spotifyPlaylistIDOnceLogged = formatPlayListInputAndBackendLog(
      firstPlayList
    );

    await spotifyPlaylistIDOnceLogged.then((item) => {
      addTracksToSpotifyPlaylist(item[0], dataOfTrackAdded);
    });

    // return added here to hard stop code from progressing after created 
    return;
  
  }
  // if the  month of the newest un-added track matches today's month
  if (monthOfNewestAddedTrack === theMonthRightNow) {
    console.log(`It's the same month, add to existing playlist`); // "03"
    async function callPlayListsAsync() {
      console.log(await returnPlayListsInDatabase());
      const playListsAsNewArray = [...(await returnPlayListsInDatabase())];

      playListsAsNewArray.map((x, i) => {
        if (x.monthAndYearCreated === monthAndYearOfNewTrack) {
          console.log(
            `Month & year of match playlist us ${x.monthAndYearCreated}, ID of matched playlist is ${x.playlistSpotifyID}`
          );

          addTracksToSpotifyPlaylist(x.playlistSpotifyID, dataOfTrackAdded);
        } else {
          console.log("No matching playlists");
        }
      });
    }
    callPlayListsAsync();
  }
  // this month is one month after as the most recent playlist, publish a new one
  else {
    // this is async + seperate to be able to test the async calls

    // this wll return newly create playlist unique ID
    const unuqueSpoitifyPlaylistData = await returnNewlyCreatedPlaylistID();

    let spotifyPlaylistIDOnceLogged = formatPlayListInputAndBackendLog(
      unuqueSpoitifyPlaylistData
    );

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
