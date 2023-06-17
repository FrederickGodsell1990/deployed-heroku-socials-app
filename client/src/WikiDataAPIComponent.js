import axios from "axios";
import { useState, useEffect } from "react";
import {
  RiInstagramLine,
  RiTwitterFill,
  RiYoutubeFill,
  RiSoundcloudFill,
} from "react-icons/ri";
import {
  WikiDataNoFileTextFormat,
  SocialsFlexBox,
} from "./styling/ComponentStyles.js";

function WikiDataAPICallFunction({ SpotID, SpotImage }) {
  const [wikiDataArtistQCode, setWikiDataArtistQCode] = useState("");
  const [SpotifyArtistImage, setSpotifyArtistImage] = useState([]);

  useEffect(() => {
    wikiDataAPICallAsyncFunction(SpotID);
    setSpotifyArtistImage(SpotImage);
    console.log(SpotifyArtistImage);
  }, [SpotID, SpotImage]);

  async function wikiDataAPICallAsyncFunction(SpotID) {
    try {
      // retrieves Q code (page identifier) from wikidata API via only the spotify artist ID

      var wikiDataArtistQueryData = await axios.get(
        `https://www.wikidata.org/w/api.php?action=query&format=json&list=search&srsearch=haswbstatement:P1902=${SpotID}`
      );

      var extractedQCodeFinal =
        wikiDataArtistQueryData.data.query.search[0].title;
      // sets the local state (of MakeSpotifyAPICall) with the wiki data page ID
      setWikiDataArtistQCode(extractedQCodeFinal);
      // if statemet to only call the wikiData API is the artist's Q code can be determined by spotify ID
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div>
        {wikiDataArtistQCode ? (
          <SetSocialStatesComponent QCode={wikiDataArtistQCode} />
        ) : (
          <WikiDataNoFileTextFormat>No WikiData file</WikiDataNoFileTextFormat>
        )}
      </div>
    </>
  );
}

/////

function SetSocialStatesComponent({ QCode }) {
  const [twitterURL, setTwitterURL] = useState("");
  const [instagramURL, setinstagramURL] = useState("");
  const [soundCloudURL, setsoundCloudURL] = useState("");
  const [youTubeURL, setYouTubeURL] = useState("");

  useEffect(() => {}, [QCode]);

  SetSocialStatesAsyncFunction(QCode);

  async function SetSocialStatesAsyncFunction(QCode) {
    // returns a wiki data json object from the wiki data API
    const wikiDataAPICall = await axios.get(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${QCode}&format=json`
    );

    const wikiDataTwitterInfoIntoObject = wikiDataAPICall.data;

    const { entities } = await wikiDataTwitterInfoIntoObject;

    const twitterUserName =
      entities[QCode].claims.P2002?.[0].mainsnak.datavalue.value;

    const youtubeChannelID =
      entities[QCode].claims.P2397?.[0].mainsnak.datavalue.value;

    const InstagramUsername =
      entities[QCode].claims.P2003?.[0].mainsnak.datavalue.value;

    const soundCloudID =
      entities[QCode].claims.P3040?.[0].mainsnak.datavalue.value;

    if (entities) {
      setTwitterURL(twitterUserName);
      setYouTubeURL(youtubeChannelID);
      setinstagramURL(InstagramUsername);
      setsoundCloudURL(soundCloudID);
    }
  }

  return (
    <>
      <SocialsFlexBox>
        {twitterURL && (
          <a href={`https://twitter.com/${twitterURL}`}>
            <RiTwitterFill />
          </a>
        )}

        {instagramURL && (
          <a href={`https://www.instagram.com/${instagramURL}`}>
            <RiInstagramLine />
          </a>
        )}

        {youTubeURL && (
          <a href={`https://www.youtube.com/channel/${youTubeURL}`}>
            <RiYoutubeFill />
          </a>
        )}

        {soundCloudURL && (
          <a href={`https://soundcloud.com/${soundCloudURL}`}>
            <RiSoundcloudFill />
          </a>
        )}
      </SocialsFlexBox>
    </>
  );
}

export default WikiDataAPICallFunction;
