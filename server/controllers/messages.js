const { StatusCodes } = require("http-status-codes");
const Message = require("../models/Message");
const { BadRequestError, NotFoundError } = require("../errors");

// create a message
const createMessage = async (req, res) => {
  const { conversation, text } = req.body;
  if (!conversation || !text) {
    throw new BadRequestError(
      "Please provide conversation id and message text"
    );
  }
  const message = await Message.create(req.body);
  res.status(StatusCodes.CREATED).json({ message });
};

// get messages
const getMessages = async (req, res) => {
  const messages = await Message.find({
    conversation: req.params.conversationId,
  });
  if (messages.length === 0) {
    throw new NotFoundError(
      `No message found with conversation id ${req.params.conversationId}`
    );
  }
  res.status(StatusCodes.OK).json({ messages });
};

module.exports = { createMessage, getMessages };
