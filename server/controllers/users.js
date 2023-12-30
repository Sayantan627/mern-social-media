const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { NotFoundError } = require("../errors");

// update user
const updateUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });

    res.status(StatusCodes.OK).json({ msg: "Account has been updated" });
  } else {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ msg: "You can only update your account" });
  }
};

// delete user
const deleteUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(StatusCodes.OK).json({ msg: "Account has been deleted" });
  } else {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ msg: "You can only update your account" });
  }
};

// get user
const getUser = async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  const user = userId
    ? await User.findById(userId)
    : await User.findOne({ username });
  if (!user) {
    throw new NotFoundError(`No user found with id ${req.params.id}`);
  }
  const { password, updatedAt, ...other } = user._doc;
  res.status(StatusCodes.OK).json(other);
};

// get friends
const getFriends = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId });
  const friends = await Promise.all(
    user.following.map((friendId) => {
      return User.findOne({ _id: friendId });
    })
  );
  let friendsList = [];
  friends.map((friend) => {
    const { _id, username, profilePicture } = friend;
    friendsList.push({ _id, username, profilePicture });
  });
  res.status(StatusCodes.OK).json({ friendsList });
};

// follow user
const followUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (!user.followers.includes(req.body.userId)) {
      await user.updateOne({ $push: { followers: req.body.userId } });
      await currentUser.updateOne({ $push: { following: req.params.id } });
      res.status(StatusCodes.OK).json({ msg: "user has been followed" });
    } else {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "You already followed this user" });
    }
  } else {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ msg: "You cannot follow yourself" });
  }
};

// unfollow user
const unfollowUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (user.followers.includes(req.body.userId)) {
      await user.updateOne({ $pull: { followers: req.body.userId } });
      await currentUser.updateOne({ $pull: { following: req.params.id } });
      res.status(StatusCodes.OK).json({ msg: "user has been unfollowed" });
    } else {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "You don't follow this user" });
    }
  } else {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ msg: "You cannot unfollow yourself" });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getUser,
  getFriends,
  followUser,
  unfollowUser,
};
