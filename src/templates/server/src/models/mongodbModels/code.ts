import mongoose from "mongoose";

const codeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    codeType: {
      type: String,
      enum: ["emailVerification", "forgotPassword"]
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 5 * 1000,
      required: true,
    },
  },

);

export const Code = mongoose.model("codes", codeSchema);

