import React, { useEffect, useState } from "react";
import axios from "axios";
import WikiDataAPICallFunction from './WikiDataAPIComponent.js'

let spotify_access_token;

if (process.env.NODE_ENV === "development") {
  spotify_access_token =
    "BQDIj9QVks5JKlnSxNEG0l02wvxl7--7JX7YH_XuajbZiWax7baL2RV0O1VeSAEZtyl3kSgEbmsQl-4-lGKIILI6CszqrYkWmVWfER5yr02X3gGMomSFVErul_0qgoMWezBIdBY_7jmZQwjXyAu33r2cb_yBb_Y4E55MrqOgL02yxKYY5L4YtRsYAw6XUPqyg8uNW_nFLEjYmZTdxEfwrjloEk3bflK2aWBjm-wOhUHD01cprRj6H5Opu-3rX7iwXm4JGB_UPEkrgz-s3p8AUuMYVqdS6A";
} else {
  spotify_access_token = window.localStorage.spotify_access_token;
}

// function uses artists name to find its spotify ID / other individual artist data
function FunctionToReturnSingleArtistSpotifyID({ artistName }) {
  
  const [spotifyArtistIDAsState, setSpotifyArtistIDAsState] = useState('');
  const [spotifyArtistsImageAsState, setSpotifyArtistsImageAsState] = useState('');

  useEffect(() => {
    singleArtistSpotifyAPICall(artistName);
  }, [artistName]);

  const singleArtistSpotifyAPICall = async (IndividualArtistName) => {
    // if statement prevents API call if value if empty
    if (!IndividualArtistName) {
      return; 
    }
    try {

      // makes the API request here
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${spotify_access_token}`,
        },
        params: {
          q: IndividualArtistName,
          type: "artist",
        },
      });
      console.log(data)

      // extracts ID
        var spotifyArtistID = data.artists.items[0].id;
        // extracts imags
        var spotifyArtistsImage = data.artists.items?.[0]?.images?.[0].url;
      //   var spotifyArtistsNameFormal = data.

    // sets the API responses to state
      setSpotifyArtistIDAsState(spotifyArtistID)
      setSpotifyArtistsImageAsState(spotifyArtistsImage)

    } catch (error) {
      console.log(error);
    }
  };

  return (


  <WikiDataAPICallFunction SpotImage={spotifyArtistsImageAsState} SpotID={spotifyArtistIDAsState}/>
  
  )
}

export default FunctionToReturnSingleArtistSpotifyID;
