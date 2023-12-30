const express = require("express");
const router = express.Router();
const {
  createConversation,
  getConversation,
  getExistingConversation,
} = require("../controllers/conversations");

router.route("/").post(createConversation);
router.route("/:userId").get(getConversation);
router.route("/find/:firstUserId/:secondUserId").get(getExistingConversation);

module.exports = router;
