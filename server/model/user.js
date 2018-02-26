const User = require('../../db/users');
const db = require('../../db');

module.exports = {
<<<<<<< HEAD
  addUser: (input) => {
=======
  addUser: (input, callback) => {
>>>>>>> 0bbed90a03617050538ed8ba38c4178fa2e71161
    const newUser = new User({
      username: input.body.username, // from firebase
      userId: input.body.userId, // from firebase
      profilePic: input.body.bio, // url
      bio: input.body.bio,
<<<<<<< HEAD
      pendingFollowers: [],
      followers: [],
      pendingFollowing: [],
      following: [],
    });
    newUser.save();

=======
    });
    newUser.save().exec((err, data) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
>>>>>>> 0bbed90a03617050538ed8ba38c4178fa2e71161
  },

  findUser: (input, callback) => {
    User.find({ username: input.params.username }).exec((err, data) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },

  addPendingFollowers: (input, callback) => {
    User.findOneAndUpdate(
      { username: input.body.username },
      { $push: { pendingFollowers: input.params.username } },
    ).exec((err, data) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },

  addPendingFollowing: (input, callback) => {
    User.findOneAndUpdate(
      { username: input.params.username },
      { $push: { pendingFollowing: input.body.username } },
    ).exec((err, data) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },

  addFollowers: (input, callback) => {
    User.findOneAndUpdate(
      { username: input.params.username },
      { $push: { followers: input.body.username } },
    ).exec((err, data) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },

  addFollowing: (input, callback) => {
    User.findOneAndUpdate(
      { username: input.body.username },
      { $push: { following: input.params.username } },
    ).exec((err, data) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },

  removePendingFollowers: (input, callback) => {
    User.findOneAndUpdate(
      { username: input.params.username },
      { $pull: { pendingFollowers: { $in: [input.body.username] } } },
    ).exec((err, data) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },

  removePendingFollowing: (input, callback) => {
    User.findOneAndUpdate(
      { username: input.body.username },
      { $pull: { pendingFollowing: { $in: [input.params.username] } } },
    ).exec((err, data) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },

  deleteFollower: (input, callback) => {
    User.findOneAndUpdate(
      { username: input.params.username },
      { $pull: { followers: { $in: [input.body.username] } } },
    ).exec((err, data) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },

  deleteFollowing: (input, callback) => {
    User.findOneAndUpdate(
      { username: input.body.username },
      { $pull: { following: { $in: [input.params.username] } } },
    ).exec((err, data) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },
};
