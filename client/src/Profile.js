import { useNavigate } from "react-router-dom";
import React from "react";



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
      <button onClick={functionToMongoDBFunction}>Go to MongoDB Page</button>
      
    </React.Fragment>
  );

 

};

 

export default Profile;
