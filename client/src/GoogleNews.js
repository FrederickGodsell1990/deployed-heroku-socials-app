import axios from "axios";
import React, { useEffect, useState } from "react";
import ArtistSpotifyIDFormatFunction from './ArtistSpotifyIDFormatFunction.js'

function GoogleNewsFunction(dataFromParent) {
  const [newsState, setNewsState] = useState("");
  const [artistToPassToChild, setArtistToPassToChild] = useState('')
  

  useEffect(() => {
const {artist} = dataFromParent;

console.log(artist)
    setArtistToPassToChild(artist)

// handles formatting to make it accepted for query params
    function regexToReplaceSpaceWithPlusSign(text) {
      return text.replace(/[\s&]+/g, "+");
    }
  
    const artistsWithPlusSign = regexToReplaceSpaceWithPlusSign(
      dataFromParent.artist
    );
    const trackWithPlusSign = regexToReplaceSpaceWithPlusSign(
      dataFromParent.track
    );
  
    (async function makeCall() {
      const API_KEY = "ddb5310c41da4750bf006802810a6757";
  
      const today = new Date();
      // have to set params to within 27 days free plan with NewsAPI only goes back one month
      const oneMonthAgo = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 27
      );
  
      const fromParam = oneMonthAgo.toISOString().split("T")[0];
      const toParam = today.toISOString().split("T")[0];
  // URL to search news API. Params put on as otherwise was returning error saying search was
  //  too broad or my free plan would not accept the request
      const URL2 = `https://newsapi.org/v2/everything?q=${artistsWithPlusSign}+${trackWithPlusSign}&qInTitle=music&sortBy=popularity&apiKey=${API_KEY}&from=${fromParam}&to=${toParam}`;
  
      try {
        const response = await axios.get(URL2);
        const returnedNewsURL = response.data.articles[0]?.url;
        setNewsState(returnedNewsURL);
      } catch (error) {
        console.log(error);
      }
    })();
  
  });

  
  return newsState ? (
    <div>
    <div>Arist's top news artile: {newsState} </div>
    <ArtistSpotifyIDFormatFunction artistName={artistToPassToChild}/>
    </div>

  ) : (
    <div>No news articles</div>
  );
}

export default GoogleNewsFunction;
