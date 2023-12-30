const { NotFoundError } = require("../errors");
const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

// create post
const createPost = async (req, res) => {
  const newPost = await Post.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ newPost });
};

// update post
const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId !== req.body.userId) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ msg: "You can only update your post" });
  } else {
    await post.updateOne({ $set: req.body });
    res.status(StatusCodes.OK).json({ msg: "Post has been updated" });
  }
};

// delete post
const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId !== req.body.userId) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ msg: "You can only delete your post" });
  } else {
    await post.deleteOne();
    res.status(StatusCodes.OK).json({ msg: "Post has been deleted" });
  }
};

// get post
const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new NotFoundError(`No post found with id ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ post });
};

// like or dislike post
const likeOrDislikePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post.likes.includes(req.body.userId)) {
    await post.updateOne({ $push: { likes: req.body.userId } });
    res.status(StatusCodes.OK).json({ msg: "The post has been liked" });
  } else {
    await post.updateOne({ $pull: { likes: req.body.userId } });
    res.status(StatusCodes.OK).json({ msg: "The post has been disliked" });
  }
};

// get timeline post
const getTimelinePost = async (req, res) => {
  const currentUser = await User.findById(req.params.userId);
  const userPosts = await Post.find({ userId: currentUser._id });
  const friendPosts = await Promise.all(
    currentUser.following.map((friendId) => Post.find({ userId: friendId }))
  );
  res.status(StatusCodes.OK).json(userPosts.concat(...friendPosts));
};

// get all posts of a user
const getUserAllPosts = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  const posts = await Post.find({ userId: user._id });
  res.status(StatusCodes.OK).json(posts);
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likeOrDislikePost,
  getPost,
  getTimelinePost,
  getUserAllPosts,
};
