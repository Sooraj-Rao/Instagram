import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { router as userRoutes } from "./src/Routes/userRoute.js";
import { router as postRoutes } from "./src/Routes/postRoute.js";
import { Connect } from "./src/DB/Connect.js";
import Post from "./src/Models/User/postModel.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

Connect();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.resolve(__dirname, "public");

app.use("/public", express.static(publicPath));

app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoutes);
app.use("/api/posts", postRoutes);

io.on("connection", (socket) => {
  socket.on("likePost", async ({ postId, token }) => {
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
  });

  socket.on("addComment", async ({ postId, token, text }) => {
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
  });

  socket.on("disconnect", () => {});
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});

export default io;
