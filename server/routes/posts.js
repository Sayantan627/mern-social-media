const express = require("express");
const router = express.Router();
const {
  createPost,
  updatePost,
  deletePost,
  likeOrDislikePost,
  getPost,
  getTimelinePost,
  getUserAllPosts,
} = require("../controllers/posts");

router.post("/", createPost);
router.route("/:id").put(updatePost).delete(deletePost).get(getPost);
router.put("/:id/like", likeOrDislikePost);
router.get("/timeline/:userId", getTimelinePost);
router.get("/profile/:username", getUserAllPosts);

module.exports = router;
