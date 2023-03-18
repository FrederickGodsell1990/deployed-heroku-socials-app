const express = require("express");
const app = express();
require("dotenv").config();
const querystring = require("querystring");
const axios = require("axios");

const mongoose = require("mongoose");
app.use(express.json()); // to parse incoming json
const SingleTrack = require("./models/singleTrack.js");
const ReleaseRadarModel = require("./models/releaseRadarSchema.js");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = "spotify_auth_state";

app.get("/login", (req, res) => {
  const state = generateRandomString(16);

  res.cookie(stateKey, state);

  const scope =
    "user-read-private user-read-email user-follow-modify user-follow-read user-top-read";

  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get("/callback", (req, res) => {
  const code = req.query.code || null;

  async function tryCatchThis() {
    try {
      const response = await axios({
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        data: querystring.stringify({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: REDIRECT_URI,
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${new Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      });

      if (response.status === 200) {
        const { access_token, token_type, refresh_token, expires_in } =
          response.data;

        const queryParams = querystring.stringify({
          access_token,
          refresh_token,
          expires_in,
        });

        res.redirect(`http://localhost:3000/?${queryParams}`);
      } else {
        res.redirect(`/?${querystring.stringify({ error: "invalid_token" })}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
  tryCatchThis();
});

app.get("/refresh_token", (req, res) => {
  const { refresh_token } = req.query;

  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/get_tracks", (req, res) => {
  console.log("Get tracks req received");
  SingleTrack.find().then((foundSingleTracks) => {
    console.log(
      "single tracks are:",
      typeof foundSingleTracks,
      foundSingleTracks
    );
    res.json({
      message: "All single tracks",
      tracks: foundSingleTracks,
    });
  });
});

app.post("/post_track", async (req, res) => {
  const artist = req.body.artist;
  const track = req.body.track;

  // create a new Post instance
  const singleTrack = new SingleTrack({
    artist: artist,
    track: track,
  });

  // save the instance to the database
  try {
    const postSingleTrack = await singleTrack.save();
    postSingleTrack;
    res.status(201).json({
      message: "Track posted created successfully!",
      postSingleTrack: postSingleTrack,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/post_release_radar_tracks", async (req, res) => {
  const releaseRadarTracksInObjectForm = await req.body.objectFromFrontEnd;
 

  const arrayOfNewTracks = [];

  
  await Promise.all(
    releaseRadarTracksInObjectForm.map(async (x, i) => {
      const toMongo = new ReleaseRadarModel({
        artist: x.artist,
        trackName: x.trackName,
        trackSpotifyID: x.trackSpotifyID,
        dateAdded : x.dateAdded
      });
      

      try {
        const trackIDCall = await ReleaseRadarModel.find().where({
          trackSpotifyID: x.trackSpotifyID,
        });
        if (trackIDCall.length === 0) {
          const postToMongo = await toMongo.save();
          postToMongo;
        
          arrayOfNewTracks.push([postToMongo.artist, postToMongo.trackName]);
        
          return arrayOfNewTracks;
        } 
      } catch (error) {
        console.log(error);
      }
    })
  );
  console.log(arrayOfNewTracks);
  res.status(201).json({
    message: "Below tracks added to database successfully!",
    arrayOfNewTracks: arrayOfNewTracks,
  });
});

const port = 8888;

mongoose
  .connect(
    "mongodb+srv://FrederickG:UXBuVczDI9svDoxj@cluster0.cdybeyt.mongodb.net/?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(8888);
    console.log("Mongo listening");
    console.log(`Express app listening at http://localhost:${port}`);
  })
  .catch((err) => console.log("err", err));
