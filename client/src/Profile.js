import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  GoToProfileButton
} from "./styling/ComponentStyles.js";

const Profile = () => {
  const navigate = useNavigate();

  const functionToArtistSearch = () => {
    navigate("/artist_search");
  };

  const functionToFavouriteArtists = () => {
    navigate("/favourite_artists");
  };

  return (
    <>
    <br/>
  
      <button onClick={functionToArtistSearch}>Go to Artist Search Page with Heroku - changes added again!</button>
      <br />
      <button onClick={functionToFavouriteArtists}>Go to Favourite Artsist's Page</button>

    </>
  );
};

export default Profile;
