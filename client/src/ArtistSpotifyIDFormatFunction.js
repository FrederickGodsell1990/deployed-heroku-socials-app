import React, { useEffect, useState } from "react";
import axios from "axios";

const { spotify_access_token } = window.localStorage;

const ArtistSpotifyIDFormatFunction = ({artistName}) => {

  
  const [aristOrArtists, setAristOrArtists] = useState([]);

  
useEffect(() =>{
  setAristOrArtists(artistName)

}, [artistName])



return (<div>This better work {artistName}</div>)
   

  //  useEffect(() => {
  //   const removeAmpersand = artistName.split(' & ' )
  //   setAristOrArtists(removeAmpersand)
  //   console.log(aristOrArtists)
  //  },[artistName])
  
 
  

  

  //  const [spotifyArtistIDAsState, setSpotifyArtistIDAsState] = useState([]);

  // const singleArtistSpotifyAPICall = async () => {
  //   try {
  //     const { data } = await axios.get("https://api.spotify.com/v1/search", {
  //       headers: {
  //         Authorization: `Bearer ${spotify_access_token}`,
  //       },
  //       params: {
  //         q: artistName,
  //         type: "artist",
  //       },
  //     });
  //     var spotifyArtistID = data.artists.items[0].id;
  //     var spotifyArtistsImage = data.artists.items?.[0]?.images?.[0].url;
  //     var spotifyArtistsNameFormal = data.artists.items?.[0].name;
  //     setSpotifyArtistIDAsState(spotifyArtistID);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // singleArtistSpotifyAPICall();

  // return (
  //   <div>Spotify artist ID is {spotifyArtistIDAsState}</div>
  // )




};



export default ArtistSpotifyIDFormatFunction;
