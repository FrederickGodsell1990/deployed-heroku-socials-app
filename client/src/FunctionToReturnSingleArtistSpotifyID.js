import React, { useEffect, useState } from "react";
import axios from "axios";
import WikiDataAPICallFunction from './WikiDataAPIComponent.js'

let spotify_access_token;

if (process.env.NODE_ENV === "development") {
  spotify_access_token =
    "BQBAI0Y6EBrhXRQWpJ-Lm-Me5CMrpnK98eAcGXSoBFJmlEs9YP0JeJTTAKKPXXv-6ynodNEf34nNbvuKppbxivedkPWYQJQlxpGOxuqAazSk-W4eLjMQ9WZR24P2_XUIv1hpkws-LNRcaHNv2XKErjAdRXfX3aHOGDEN4rhXL0ECQo6iq62_RKB2zYxKu7McspMPpvngzJ6SrBjmE9sIUbPK3Ex3283UTZxHu0c8zKOPDGNsMuxbg89OWSfMWPY_E2_y3zyruhnDoAdMZ_Ud8Om49zZ-qak";
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
