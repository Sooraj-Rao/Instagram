import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { router as userRoutes } from "./src/Routes/user.route.js";
import { router as postRoutes } from "./src/Routes/post.route.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { LikePost, PostComment } from "./src/Controllers/socket.controller.js";
import { connectDB } from "./src/DB/connectDB.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = 8000;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

connectDB();

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
    LikePost(postId, token);
  });

  socket.on("addComment", async ({ postId, token, text }) => {
    PostComment(postId, token, text);
  });

  socket.on("disconnect", () => {});
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default io;
