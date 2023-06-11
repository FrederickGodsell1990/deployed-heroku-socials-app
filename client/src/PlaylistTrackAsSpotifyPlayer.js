import React, { useEffect, useState } from "react";

const PlaylistTrackAsSpotifyPlayer = ({ id }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseOver = () => {
    setIsHovered(true);
  };


  const handleMouseOut = () => {
    setIsHovered(false);
  };
  return (
    <>
     

         <div>PlaylistTrackAsSpotifyPlayer {id}</div>
    
    </>
  );
};

export default PlaylistTrackAsSpotifyPlayer;
