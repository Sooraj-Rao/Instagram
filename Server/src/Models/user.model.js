import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    posts: [{
      type: Schema.Types.ObjectId,
      ref: "Post",
    }],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
