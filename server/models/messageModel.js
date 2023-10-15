import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    content: {
      type: String,
      trim: true
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat"
    }
  },
  { timestamps: true }
);

export default new mongoose.model("Message", messageSchema);
