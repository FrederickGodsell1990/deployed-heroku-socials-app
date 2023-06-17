import React, { useEffect, useState } from "react";
import axios from "axios";
import WikiDataAPICallFunction from "./WikiDataAPIComponent.js";
import {
  SocialsFlexBox,
} from "./styling/ComponentStyles.js";

let spotify_access_token;

if (process.env.NODE_ENV === "development") {
  spotify_access_token =
    "BQAQlffakQDLjblLfJC-w5U4xZiVHD80jkcO18Xwyuj53eIz_xAGRc3aiq9suGiY83bwAuRjiODX8GMkEBHQp-ignNjptzOEdD8JALtBxIfC1Fay-ftJ46CS6hVa-dxQBNh7wt91XMdwEunZLFFg_DnFFMupDhAs1JilmH3JAsb5Oel4UZ5vNBfT4sURgbW-vaVLmPc72jCYoFv96b8z4H7dx2leAqR5kBCXAgjr1wl3KFyD56K09MpweqWpyVD8N9NGqGswKBtpscP4weEIzvg1c81EEw";
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
