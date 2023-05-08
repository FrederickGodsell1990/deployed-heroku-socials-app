import React, { useEffect, useState } from "react";
import axios from "axios";
import WikiDataAPICallFunction from './WikiDataAPIComponent.js'

let spotify_access_token;

if (process.env.NODE_ENV === "development") {
  spotify_access_token =
    "BQCLaQp62ht9WHPZ_QtVQAwPdqGbhgBo_ye2A7Ux9UPGoNVX2pUTMFC1AJvzVoZ_NRAXOI0L3kv3qk_IS4o74X3Y1Um4r3MXZH_h7wW4AhMATilHNROmrYtp0lnVFryB__PPu1v6G_4hKM_mgwOeFBryVAEev2LX9JUKIyIvYu72pAwdVdK_vYrV_0BJLxVtsOJOuvDxfA5CYrNKtFEmFZsQmfdWvO19WU5BU3g3AAqbbkLWfGYX1HfOMN70RKo_3KtXmCFTCDAcUZ9O2RKSvzItifsfcNc";
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

      console.log('spotifyArtistID', spotifyArtistID)
      console.log('spotifyArtistsImage', spotifyArtistsImage)
      
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
