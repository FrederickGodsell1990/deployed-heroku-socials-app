import { useNavigate } from "react-router-dom";
import { useState } from "react";
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

  const axiosGetRequest = async () => {
    try{
      await axios.get('/get_tracks')
  
    } catch(err){
       console.log('get req error', err)
    }
  }
  

  const handleSingleTrackPostSubmit = (e) => {
    e.preventDefault();

    let artistDetails = e.target[0].value;
     let trackDetails = e.target[1].value;
    
    console.log('Artist is',artistDetails, 'track is',trackDetails)

    const config = {
      Key : 'Content-Type',
      Value : 'application/json'
    }
    
    const body = {
      artist : artistDetails,
      track : trackDetails
    }


    const axiosPostRequest = async () => {
      try{
      //  await axios.post('http://localhost:8888/post_track',body,config)
       await axios.post('/post_track',body,config)
      }
      catch(err){
        console.log(err)
      }
      
    }
   axiosPostRequest();
  };

  return (
    <>
    <br/>
  
      <button onClick={functionToArtistSearch}>Go to Artist Search Page with Heroku - changes added then taken!</button>
      <br />
      <button onClick={functionToFavouriteArtists}>Go to Favourite Artsist's Page</button>
      <button onClick={axiosGetRequest} >Get tracks</button>
      
      
      <form onSubmit={(e) => handleSingleTrackPostSubmit(e)} >
    <label>Enter track info below;</label>
    <br/>
    <input type="text"  name="artist" placeholder="Enter artist name..." required/>
    <input type="text" name="track" placeholder="Enter track name..." required/>
    <input type="submit"></input>
    </form>
    </>
  );
};

export default Profile;
