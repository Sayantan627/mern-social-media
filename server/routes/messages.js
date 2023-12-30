const express = require("express");
const router = express.Router();
const { createMessage, getMessages } = require("../controllers/messages");

router.route("/").post(createMessage);
router.route("/:conversationId").get(getMessages);

module.exports = router;
