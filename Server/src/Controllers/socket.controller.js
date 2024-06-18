import jwt from "jsonwebtoken";
import io from "../../index.js";
import Post from "../Models/post.model.js";

export const LikePost = async (postId, token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const post = await Post.findById(postId);
    if (post) {
      const userIdIndex = post.likes.indexOf(decoded.id);

      if (userIdIndex === -1) {
        post.likes.push(decoded.id);
      } else {
        post.likes.splice(userIdIndex, 1);
      }

      await post.save();
      io.emit("postLiked", { postId: post._id, likes: post.likes });
    }
  } catch (error) {
    console.error("Error liking/unliking post:", error);
  }
};


export const PostComment=async( postId, token, text )=>{
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const post = await Post.findById(postId);
    if (post) {
      const comment = {
        user: decoded.id,
        text,
        createdAt: new Date(),
      };
      post.comments.push(comment);
      await post.save();
      io.emit("commentAdded", { postId: post._id, comments: post.comments });
    }
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}