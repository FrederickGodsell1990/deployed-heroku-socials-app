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
  SocialIconStyling,
  SingleSocialIconStyling
} from "./styling/ComponentStyles.js";

function WikiDataAPICallFunction({ SpotID, SpotImage }) {
  const [wikiDataArtistQCode, setWikiDataArtistQCode] = useState("");
  const [SpotifyArtistImage, setSpotifyArtistImage] = useState([]);

  useEffect(() => {
    wikiDataAPICallAsyncFunction(SpotID);
    setSpotifyArtistImage(SpotImage);
    console.log(SpotifyArtistImage);
  }, []);

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
        {wikiDataArtistQCode != "" ? (
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
      {twitterURL == undefined ? (
        <WikiDataNoFileTextFormat>No Twitter profile </WikiDataNoFileTextFormat>
      ) : (
        <TwitterComponent TwitURL={`https://twitter.com/${twitterURL}`} />
      )}

      {instagramURL == undefined ? (
        <WikiDataNoFileTextFormat>
          No Instgram profile{" "}
        </WikiDataNoFileTextFormat>
      ) : (
        <InstagramComponent
          instaURL={`https://www.instagram.com/${instagramURL}`}
        />
      )}

      {youTubeURL == undefined ? (
        <WikiDataNoFileTextFormat>No YouTube profile</WikiDataNoFileTextFormat>
      ) : (
        <YoutubeComponent
          TubeURL={`https://www.youtube.com/channel/${youTubeURL}`}
        />
      )}

      {soundCloudURL == undefined ? (
        <WikiDataNoFileTextFormat>
          No SoundCloud profile
        </WikiDataNoFileTextFormat>
      ) : (
        <SoundcloudComponent
          CloudURL={`https://soundcloud.com/${soundCloudURL}`}
        />
      )}
    </>
  );
}

export function InstagramComponent({ instaURL }) {
  return (
    <>
      {" "}
      {instaURL ? (
        
          <SocialIconStyling>
            <span>
              <SingleSocialIconStyling>
            <RiInstagramLine />
            </SingleSocialIconStyling>
            </span>
            <span>
            <a href={instaURL}>{"Instagram"}</a>
            </span>
          </SocialIconStyling>
       
      ) : (
        <SocialIconStyling>
          <RiInstagramLine />
          No Instagram record
          </SocialIconStyling>
      )}
    </>
  );
}





export function TwitterComponent({ TwitURL }) {
  return (
    <>
      {" "}
      {TwitURL ? (
        
          <SocialIconStyling>
            <span>
              <SingleSocialIconStyling>
              <RiTwitterFill />
            </SingleSocialIconStyling>
            </span>
            <span>
            <a href={TwitURL}>{"Twitter"}</a>
            </span>
          </SocialIconStyling>
       
      ) : (
        <SocialIconStyling>
          <RiTwitterFill />
          No Twitter record
          </SocialIconStyling>
      )}
    </>
  );
}


export function YoutubeComponent({ TubeURL }) {
  return (
    <>
      {" "}
      {TubeURL ? (
        
          <SocialIconStyling>
            <span>
              <SingleSocialIconStyling>
              <RiYoutubeFill />
            </SingleSocialIconStyling>
            </span>
            <span>
            <a href={TubeURL}>{"YouTube"}</a>
            </span>
          </SocialIconStyling>
       
      ) : (
        <SocialIconStyling>
                  <RiYoutubeFill />
          No YouTube record
          </SocialIconStyling>
      )}
    </>
  );
}


export function SoundcloudComponent({ CloudURL }) {
  return (
    <>
      {" "}
      {CloudURL ? (
        
          <SocialIconStyling>
            <span>
              <SingleSocialIconStyling>
              <RiSoundcloudFill />
            </SingleSocialIconStyling>
            </span>
            <span>
            <a href={CloudURL}>{"Soundcloud"}</a>
            </span>
          </SocialIconStyling>
       
      ) : (
        <SocialIconStyling>
                  <RiSoundcloudFill />
          No SoundCloud record
          </SocialIconStyling>
      )}
    </>
  );
}


export default WikiDataAPICallFunction;
