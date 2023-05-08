import React, { useEffect, useState } from "react";
import axios from "axios";
import WikiDataAPICallFunction from './WikiDataAPIComponent.js'

let spotify_access_token;

if (process.env.NODE_ENV === "development") {
  spotify_access_token =
    "BQDkL6iK2Zi4oaqoeJL6WNqop9NpVcJFcGAuxUWoc6vxG9jpHs_3OFmAnbNbiTX1TbSRMU59OgtMUMzPF1KzrDJ47lRDkvqZ7Dhrn24AGs7c7USNea8T5vvxCCytX-N8aImsg-MYexExMJLYwkqYmpVJBm0d87rl1xqFKCpMRnRR2c5ZYC9kU0_3uULdg5rNxqHJTFX_sHOGMM2LTgJhp1639pHXPELj-piFThdiCzhF-uyR2pxCI6r2btFfliZH5MEMwgclK5MqIUzcqSmEwVPvzM4Ii4o";
} else {
  spotify_access_token = window.localStorage.spotify_access_token;
}

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
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${spotify_access_token}`,
        },
        params: {
          q: IndividualArtistName,
          type: "artist",
        },
      });
        var spotifyArtistID = data.artists.items[0].id;
        var spotifyArtistsImage = data.artists.items?.[0]?.images?.[0].url;
      //   var spotifyArtistsNameFormal = data.

      
      setSpotifyArtistIDAsState(spotifyArtistID)
      setSpotifyArtistsImageAsState(spotifyArtistsImage)

      console.log(data);
      console.log(IndividualArtistName);
    } catch (error) {
      console.log(error);
    }
  };

  return (<WikiDataAPICallFunction SpotImage={spotifyArtistsImageAsState} SpotID={spotifyArtistIDAsState}/>)
}

export default FunctionToReturnSingleArtistSpotifyID;
