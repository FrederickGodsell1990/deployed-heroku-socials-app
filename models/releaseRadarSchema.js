const mongoose = require('mongoose');// import mongoose
// extract the schema from that mongoose object
const Schema = mongoose.Schema;
// create a new post schema
const releaseRadarSchema = new Schema({
  artist: {
    type: String,
    required: true
  },
  trackName: {
    type: String,
    required: true
  },
  trackSpotifyID : {
    type: String,
    required: true
  },
  dateAdded : {
    type: String,
    required: true
  }

});
// export the model
module.exports = mongoose.model('ReleaseRadarModel', releaseRadarSchema);

