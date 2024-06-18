import multer from "multer";
import io from "../../index.js";
import User from "../Models/user.model.js";
import upload from "../multer.js";
import Post from "../Models/post.model.js";

export const createPost = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res
          .json({ error: true, message: "Error uploading file" });
      } else if (err) {
        return res.json({ error: true, message: err.message });
      }

      const { description } = req.body;
      const userId = req.user.id;

      const newPost = new Post({
        url: req.file.path,
        description,
        author: userId,
      });

      const newPostDetail = await newPost.save();

      const findUser = await User.findById(userId);

      if (findUser) {
        findUser.posts.push(newPostDetail._id);
        await findUser.save();
      }

      const newPostForClient = {
        ...newPost._doc,
        author: { username: findUser?.username },
      };
      io.emit("newPost", newPostForClient);

      return res.json({
        error: false,
        message: "Post created successfully",
        post: newPost,
      });
    });
  } catch (error) {
    console.log("Error creating post: ", error);
    return res
      .json({ error: true, message: "Internal Server Error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "-password");
    return res.json({ error: false, message: "success", data: posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.json({ error: true, message: "Internal Server Error" });
  }
};
