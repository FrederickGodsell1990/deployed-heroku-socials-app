import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState, Fragment } from "react";
import WikiDataAPICallFunction from "./WikiDataAPIComponent";
import {
  ImageSize,
  ImagesLeftToRight,
  WikiDataTextSize,
  GoToProfileButton,
} from "./styling/ComponentStyles.js";

const FavouriteArtistsFunction = () => {
  const [favouriteArtistsID, setFavouriteArtistsID] = useState("");
  const { spotify_access_token } = window.localStorage;
  const navigate = useNavigate();
  const functionToProfile = () => {
    navigate("/");
  };

  useEffect(() => {
    const spotifyFavouriteArtistsFunction = async () => {
      const favouriteArtistParams = {
        time_range: "medium_term",
        limit: 10,
      };

      try {
        const { data } = await axios.get(
          "https://api.spotify.com/v1/me/top/artists",
          {
            headers: {
              Authorization: `Bearer ${spotify_access_token}`,
            },
            params: favouriteArtistParams,
          }
        );

        const { items } = data;

        setFavouriteArtistsID(items);
      } catch (error) {}
    };
    spotifyFavouriteArtistsFunction();
  }, []);

  return (
    <>
      <h3>Top 10 Favourite Artists</h3>
      <GoToProfileButton onClick={functionToProfile}>
        Go to Profile
      </GoToProfileButton>
      <ImagesLeftToRight>
        {favouriteArtistsID &&
          favouriteArtistsID.map((items) => {
            console.log(items);
            return (
              <React.Fragment key={items.id}>
                {items.images && (
                  <div>
                    <h5>{items.name}</h5>
                    <ImageSize src={items.images[0].url} />
                    <WikiDataTextSize>
                      <WikiDataAPICallFunction
                        SpotID={items.id}
                        SpotImage={items}
                      />
                    </WikiDataTextSize>
                  </div>
                )}
              </React.Fragment>
            );
          })}
      </ImagesLeftToRight>
    </>
  );
};

export default FavouriteArtistsFunction;
