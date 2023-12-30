const { StatusCodes } = require("http-status-codes");
const Conversation = require("../models/Conversation");
const { BadRequestError } = require("../errors");

// new conversation
const createConversation = async (req, res) => {
  const { sender, receiver } = req.body;
  if (!sender || !receiver) {
    throw new BadRequestError("Please provide both sender and receiver");
  }
  const conversation = await Conversation.create({
    members: [sender, receiver],
  });
  res.status(StatusCodes.CREATED).json({ conversation });
};

// get conversations of a user
const getConversation = async (req, res) => {
  const { userId } = req.params;
  const conversation = await Conversation.find({
    members: { $in: [userId] },
  }).sort("-createdAt");
  res.status(StatusCodes.OK).json({ conversation });
};

// get existing conversation
const getExistingConversation = async (req, res) => {
  const { firstUserId, secondUserId } = req.params;
  const conversation = await Conversation.findOne({
    members: { $all: [firstUserId, secondUserId] },
  });
  res.status(StatusCodes.OK).json({ conversation });
};

module.exports = {
  createConversation,
  getConversation,
  getExistingConversation,
};
