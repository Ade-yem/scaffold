import mongoose from "mongoose";
import * as bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    email: {
      type: String,
      unique: true
    },

    image: {
      type: String,
    },

    password: {
      type: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const genSalt = 10;
  const hashedPass = await bcrypt.hash(this.password || "", genSalt);
  this.password = hashedPass;
  next();
});

export const User = mongoose.model("users", userSchema);
module.exports = User;
