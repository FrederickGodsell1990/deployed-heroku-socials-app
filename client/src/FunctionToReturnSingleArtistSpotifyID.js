import React, { useEffect, useState } from "react";
import axios from "axios";
import WikiDataAPICallFunction from "./WikiDataAPIComponent.js";
import {
  SocialsFlexBox,
} from "./styling/ComponentStyles.js";

let spotify_access_token;

if (process.env.NODE_ENV === "development") {
  spotify_access_token =
    "BQC4fMZ8h8HbeoL8V4UZzLO9x6mev4xSRep72dkZ3YxutV-QzR4IpGD8qCVnAft5FYo4yOnG_ECKStTs24QvzgUjfWIA9KAb0nxJ_Kv8zDi3qJFNhaQ1wwc3PCTieug1VaQDcmftnSRsbbM-p0imzn7Pc_LwiEAzfTz00I9vQwMrVoPYD6csAQa_-ptRePANXwI4LAXmFJTHsp7CJPzLkdpz8X5Mog_LRejDkeRno2RKP33-YCxy6P9_E5R034kXZwHMO_Rz4NJYxAsGAKXfkDN9T1VZJg";
} else {
  spotify_access_token = window.localStorage.spotify_access_token;
}

// function uses artists name to find its spotify ID / other individual artist data
function FunctionToReturnSingleArtistSpotifyID({ artistName }) {
  const [spotifyArtistIDAsState, setSpotifyArtistIDAsState] = useState("");
  const [spotifyArtistsImageAsState, setSpotifyArtistsImageAsState] =
    useState("");
const [artistNameAsState, setArtistNameAsState ] = useState('');
  useEffect(() => {
    singleArtistSpotifyAPICall(artistName);
    // just added so remove if needed
    setArtistNameAsState(artistName)
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
      console.log(data);

      // extracts ID
      var spotifyArtistID = data.artists.items[0].id;
      // extracts imags
      var spotifyArtistsImage = data.artists.items?.[0]?.images?.[0].url;
      //   var spotifyArtistsNameFormal = data.

      // sets the API responses to state
      setSpotifyArtistIDAsState(spotifyArtistID);
      setSpotifyArtistsImageAsState(spotifyArtistsImage);
    } catch (error) {
      console.log(error);
    }
  };

  // return (

  // <WikiDataAPICallFunction SpotImage={spotifyArtistsImageAsState} SpotID={spotifyArtistIDAsState}/>

  // )

  
   return  (spotifyArtistsImageAsState && spotifyArtistIDAsState) ? (
      <> 
      <SocialsFlexBox>
      <div>{artistNameAsState}&nbsp; &nbsp;</div>
      {"   "}
      <WikiDataAPICallFunction
        SpotImage={spotifyArtistsImageAsState}
        SpotID={spotifyArtistIDAsState}
      />
      </SocialsFlexBox>
      </> 
      
    ) : ""
  
}

export default FunctionToReturnSingleArtistSpotifyID;
