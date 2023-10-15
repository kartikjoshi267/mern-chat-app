import expressAsyncHandler from "express-async-handler"
import Message from '../models/messageModel.js';
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

export const sendMessage = expressAsyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  if (!content || !chatId){
    return res.status(400);
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId
  }

  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name picture");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name picture email'
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message
    });

    res.json(message);
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
});

export const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name picture email").populate('chat');
    res.json(messages);
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
})
