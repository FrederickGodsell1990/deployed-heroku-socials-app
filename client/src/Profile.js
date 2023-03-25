import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
  GoToProfileButton
} from "./styling/ComponentStyles.js";
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();

  const functionToArtistSearch = () => {
    navigate("/artist_search");
  };

  const functionToFavouriteArtists = () => {
    navigate("/favourite_artists");
  };

  const functionToMongoDBFunction = () => {
    navigate("/release_radar");
  };


  
  return (
    <React.Fragment >
    <button onClick={functionToArtistSearch}>Go to Artist Search Page</button>
    <button onClick={functionToFavouriteArtists}>Go to Favourite Artsist's Page</button>
    <button onClick={functionToMongoDBFunction}>Go to MongoDB Page - staging environment fully functional!</button>
    
  </React.Fragment>
  );
};

export default Profile;
