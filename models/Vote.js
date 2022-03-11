const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
  stack: {
    type: String,
    required: true
  },
  points: {
    type: String,
    required: true
  }
});

// Create collection and add schema
module.exports = mongoose.model('Vote', VoteSchema);
