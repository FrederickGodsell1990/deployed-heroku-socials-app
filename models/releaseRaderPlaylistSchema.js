const mongoose = require('mongoose');// import mongoose
// extract the schema from that mongoose object
const Schema = mongoose.Schema;
// create a new post schema
const releaseRadarPlayListSchema = new Schema({
  monthAndYearCreated: {
    type: String,
    required: true
  },
  playlistSpotifyID: {
    type: String,
    required: true
  },playlistName : {
    type: String,
    required: true
  }

});
// export the model
module.exports = mongoose.model('ReleaseRadarPlayListModel', releaseRadarPlayListSchema);

