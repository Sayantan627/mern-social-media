const express = require("express");
const router = express.Router();
const {
  updateUser,
  deleteUser,
  getUser,
  getFriends,
  followUser,
  unfollowUser,
} = require("../controllers/users");

router.get("/", getUser);
router.route("/:id").put(updateUser).delete(deleteUser);
router.route("/friends/:userId").get(getFriends);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);

module.exports = router;
