// all functions goes here
const User = require("../../db/users");
const Comment = require("../../db/comment");
const Photo = require("../../db/photos");
const db = require("../../db")

module.exports = {
//moved
  //Add new user signup
  addUser: (req, res) => {
    const newUser = new User({
      username: req.body.username, //from firebase
      userId: req.body.userId, //from firebase
      profilePic: req.body.bio, //url
      bio:  req.body.bio 
    });
    newUser.save();

    res.send('User Added')
  },

  // Render Feed
  userFeed: (req, res) => {
    //moved
    Photo.find({ username: req.params.username })
      .limit(20)
      .exec((err, data) => {
        if (err) {
          throw err;
        }
        res.send(data);
      });
  },

  followerFeed: (req, res) => {
//moved
//findUser 
//findFollowerPhoto
    User.find({ username: req.params.username }).then(data => {
      const friendPhotos = [];
      for (const friend of data[0].following) {
        Photo.find({ username: friend })
          .limit(10)
          .then(data => {
            friendPhotos = friendPhotos.concat(data);
          });
      }
      // may have to be stringified
      res.send(friendPhotos);
    });
  },

  allFeed: (req, res) => {
    //moved
    Photo.find()
      .limit(40)
      .exec((err, data) => {
        // sort? for newest?
        if (err) {
          throw err;
        }
        res.send(data);
      });
  },
  // Follower
  addFollower: (req, res) => {
    //addPendingFollowers
    //addPendingFollowing


    // req.body.username = person im adding
    // req.params.username = me
    // i am trying to follow "person"
    User.findOneAndUpdate(
      { username: req.body.username },
      { $push: { pendingFollowers: req.params.username } }
    ) // verfiy how you send up data req.body....
      .then(data => {
        // data.pending
        User.findOneAndUpdate(
          { username: req.params.username },
          { $push: { pendingFollowing: req.body.username } }
        ).then(() => {
          res.send("Pending Approval");
        });
      });
  },

  acceptFollower: (req, res) => {
 // addFollowers
 //removePendingFollowers
 //addFollowing
 //removePendingFollowing
    User.findOneAndUpdate(
      { username: req.params.username },
      { $push: { followers: req.body.username } }
    ) // verfiy how you send up data req.body....
      .then(
        data =>
          // data.pending
          User.findOneAndUpdate(
            { username: req.params.username },
            { $pull: { pendingfollowers: { $in: [req.body.username] } } }
          ) // verfiy how you send up data req.body....
      )
      // updating the guy who wants to follow
      .then(
        data =>
          User.findOneAndUpdate(
            { username: req.body.username },
            { $push: { following: req.params.username } }
          ) // verfiy how you send up data req.body....
      )
      .then(data =>
        User.findOneAndUpdate(
          { username: req.body.username },
          { $pull: { pendingfollowing: { $in: [req.params.username] } } }
        )
      )
      .then(data => res.send("you have finally accepted a follower"));
  },

  deleteFollower: (req, res) => {
    //deleteFollower
    //deleteFollowing
    User.findOneAndUpdate(
      { username: req.params.username },
      { $pull: { followers: { $in: [req.body.username] } } }
    ).then(() => {
      User.findOneAndUpdate(
        { username: req.body.username },
        { $pull: { following: { $in: [req.params.username] } } }
      ).exec((err, data) => {
        res.send("we deleted the follower");
      });
    });
  },
// person being followed reject follower
  denyRequest: (req, res) => {
    //removePendingFollowers
    //removePendingFollowing
    User.findOneAndUpdate(
      { username: req.params.username },
      { $pull: { pendingFollowers: { $in: [req.body.username] } } }
    ).then(() => {
      User.findOneAndUpdate(
        { username: req.body.username },
        { $pull: { pendingFollowing: { $in: [req.params.username] } } }
      ).exec((err, data) => {
        res.send("we deleted pending the follower");
      });
    });
  },
  // person being followed reject follower
  deletePending: (req, res) => {
    //removePendingFollowers
    //removePendingFollowing
    User.findOneAndUpdate(
      { username: req.params.username },
      { $pull: { pendingFollowing: { $in: [req.body.username] } } }
    ).then(() => {
      User.findOneAndUpdate(
        { username: req.body.username },
        { $pull: { pendingFollowers: { $in: [req.params.username] } } }
      ).exec((err, data) => {
        res.send("we deleted pending the follower");
      });
    });
  },

  // Comment

  getComments: (req, res) => {
    Comment.find({ photo: req.body.photo }).exec((err, data) => {
      if (err) {
        throw err;
      } else {
        res.send(data);
      }
    });
  },

  postComment: (req, res) => {
    // req.body.text- comment
    // req.params.username - user
    // req.body.photo - photo reference
    const newComment = new Comment({
      user: req.params.username,
      photoId: req.params.photoId,
      text: req.body.text
    });
    newComment.save();
    res.send('Comment Posted');
  },

  deleteComment: (req, res) => {
    Comment.remove({ photoId: req.params.photoId }, err => {
      if (err) {
        throw err;
      } else {
        res.send("deleted the comment");
      }
    });
  },

  editComment: (req, res) => {
    Comment.findOneAndUpdate(
      { photoId: req.params.photoId },
      { $set: { text: req.body.text } },
      err => {
        if (err) {
          throw err;
        } else {
          res.send("updated the comment");
        }
      }
    );
  },

  // Posting new images

  addContent: (req, res) => {
    //addPhoto
    const newPhoto = new Photo({
      username: req.params.username,
      description: req.body.description,
      photoUrl: req.body.photoUrl,
    });
    newPhoto.save();
    res.send("Added Photo")
  },

  deleteContent: (req, res) => {
    //removePhoto
    Photo.remove({ _id: req.body.id }, err => {
      if (err) {
        throw err;
      } else {
        res.send("deleted the photo");
      }
    });
  },
  // Likes
  addLike: (req, res) => {
    //addLike
    Photo.findOneAndUpdate(
      { _id: req.params.photoId },
      { $push: { likes: req.params.username } }
    ).exec((err, data) => {
      res.send("Liked");
      // front end needs to list for update on event to rerender like count
    });
  },

  removeLike: (req, res) => {
    //removeLike
    Photo.findOneAndUpdate(
      { _id: req.params.photoId },
      {
        $pull: { likes: { $in: [req.params.username] } }
        // front end needs to list for update on event to rerender like count
      }
    ).then(() => {
      res.send('Removed Like');
    });
  }
};
