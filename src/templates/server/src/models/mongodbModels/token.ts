import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: true,
    },

    token: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 43200,
      required: true,
    },
  },

);

export const Token = mongoose.model("tokens", tokenSchema);

