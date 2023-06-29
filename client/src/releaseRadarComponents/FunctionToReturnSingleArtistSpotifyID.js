import React, { useEffect, useState } from "react";
import axios from "axios";
import WikiDataAPICallFunction from "../WikiDataAPIComponent.js";
import { SocialsFlexBox } from "../styling/ComponentStyles.js";

let spotify_access_token;

if (process.env.NODE_ENV === "development") {
  spotify_access_token =
    "BQBfDoYsyV_gQvsjfJv-lZB15RIttQtmxHmQistFSbMpLJWTlJONYqscQRv9d_tG4R1C2F5ST8i60WhT8rDpREDeE6oSjMgXZFuuiWWR6b0otuHCPzv7nCiPhjoSA6m9JeECWAOMF81TLXZoSlUorcohArxNmTDvYfSTZyPHHRPlkYPogudqA4tbuGkV0Jq43iIgTOn7A5MkqRQOFzKFSzY6DXhC3XcuSBqQjabCcs9hzmwqBXdyrs_IQEgD1dsheqbydKvuzdRa2i4V1WXojDhCUH106w";
} else {
  spotify_access_token = window.localStorage.spotify_access_token;
}

// function uses artists name to find its spotify ID / other individual artist data
function FunctionToReturnSingleArtistSpotifyID({ artistName }) {
  const [spotifyArtistIDAsState, setSpotifyArtistIDAsState] = useState("");
  const [spotifyArtistsImageAsState, setSpotifyArtistsImageAsState] =
    useState("");
  const [artistNameAsState, setArtistNameAsState] = useState("");
  useEffect(() => {
    singleArtistSpotifyAPICall(artistName);
    setArtistNameAsState(artistName);
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
      // extracts images
      var spotifyArtistsImage = data.artists.items?.[0]?.images?.[0].url;

      // sets the API responses to state
      setSpotifyArtistIDAsState(spotifyArtistID);
      setSpotifyArtistsImageAsState(spotifyArtistsImage);
    } catch (error) {
      console.log(error);
    }
  };

  return spotifyArtistsImageAsState && spotifyArtistIDAsState ? (
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
  ) : (
    ""
  );
}

export default FunctionToReturnSingleArtistSpotifyID;
