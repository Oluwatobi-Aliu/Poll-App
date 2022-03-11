
const router = require('express').Router();
const Pusher = require('pusher');

const Vote = require('../models/Vote.js');
const keys = require('../config');

var pusher = new Pusher({
  appId: keys.pusherAppId,
  key: keys.pusherKey,
  secret: keys.pusherSecret,
  cluster: keys.pusherCluster,
  encrypted: keys.pusherEncrypted
});

router.get('/', (req, res) => {
  Vote.find().then(votes => res.json({ success: true, votes: votes }))
  .catch(err => {
    res.json(err);
  })
});

router.post('/', (req, res) => {
  const newVote = {
    stack: req.body.stack,
    points: 1
  };
  console.log(newVote);
  new Vote(newVote).save().then(vote => {
    pusher.trigger('os-poll', 'os-vote', {
      points: parseInt(vote.points),
      stack: vote.stack
    })
    .catch(err => {
      res.json(err)
    })

    return res.json({ success: true, message: 'Thank you for voting' });
  });
});

module.exports = router;