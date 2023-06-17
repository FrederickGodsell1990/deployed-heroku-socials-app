import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import WikiDataAPICallFunction from "./WikiDataAPIComponent";
import { GoToProfileButton, ImageSize, WikiDataTextSize } from "./styling/ComponentStyles.js";

function ArtistSearch() {
  const [spotifyID, setSpotifyID] = useState("");
  const [artistImage, setArtistImage] = useState("");
  const [artistName, setArtistName] = useState("");

  const navigate = useNavigate();
  const functionToProfile = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let searchBarVar = e.target[0].value;
    const { spotify_access_token } = window.localStorage;

    async function spotifyAPICall() {
      try {
        const { data } = await axios.get("https://api.spotify.com/v1/search", {
          headers: {
            Authorization: `Bearer ${spotify_access_token}`,
          },
          params: {
            q: searchBarVar,
            type: "artist",
          },
        });

        // var not const as var has global scope
        var justArtistData = await data.artists.items[0].id;
        var spotifyArtistsImage = data.artists.items?.[0]?.images?.[0].url;
        var spotifyArtistsNameFormal = data.artists.items?.[0].name;
        setArtistName(spotifyArtistsNameFormal);
        setArtistImage(spotifyArtistsImage);
        setSpotifyID(justArtistData);
        console.log(justArtistData);
      } catch (error) {
        console.log(error);
      }
    }

    spotifyAPICall();
  };

  return (
    <>
      <h1>Artist Search</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input />
        &nbsp;&nbsp;&nbsp;
        <button type={"submit"}>Search artist</button>
      </form>

      
      {artistName && artistImage && spotifyID && (
        <>
          <div>
            <h5>{artistName}</h5>
            <ImageSize src={artistImage}/>
            <WikiDataTextSize>
            <WikiDataAPICallFunction SpotID={spotifyID} />
            </WikiDataTextSize>
          </div>
        
        </>
        
      )}
      
      <GoToProfileButton onClick={functionToProfile}>
        Go to Profile
      </GoToProfileButton>
    </>
  );
}

export default ArtistSearch;
