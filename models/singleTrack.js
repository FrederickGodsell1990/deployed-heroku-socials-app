const mongoose = require('mongoose');// import mongoose
// extract the schema from that mongoose object
const Schema = mongoose.Schema;
// create a new post schema
const singleTrackSchema = new Schema({
  artist: {
    type: String,
    required: true
  },
  track: {
    type: String,
    required: true
  }
});
// export the model
module.exports = mongoose.model('SingleTrack', singleTrackSchema);

