import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import {
  CardActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  ArrowRight,
  ArrowRightAltSharp,
  Chat,
  Comment,
  CommentBankRounded,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import Cookies from "js-cookie";
import socket from "@/utils/socket";
import { formatRelativeTime } from "@/utils/date.format";
import Image from "next/image";
import { MessageCircle, X } from "lucide-react";

export default function PostCard({ post, Server }) {
  const [likes, setLikes] = useState(post?.likes || []);
  const [comments, setComments] = useState(post?.comments || []);
  const [commentText, setCommentText] = useState("");
  const [showComment, setshowComment] = useState("");
  const userId = Cookies.get("user");

  useEffect(() => {
    socket.on("postLiked", ({ postId, likes }) => {
      if (postId === post._id) {
        setLikes(likes);
      }
    });

    socket.on("commentAdded", ({ postId, comments }) => {
      if (postId === post._id) {
        setComments(comments);
      }
    });
    return () => {
      socket.off("postLiked");
      socket.off("commentAdded");
    };
  }, [post?._id]);

  const handleLike = () => {
    socket.emit("likePost", { postId: post._id, token: Cookies.get("token") });
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      socket.emit("addComment", {
        postId: post._id,
        token: Cookies.get("token"),
        text: commentText,
      });

      setCommentText("");
    }
  };

  const hasLiked = likes.includes(userId);

  return (
    <Card className=" bg-gray-100 -ml-8 w-[20rem] min-h-[30rem] my-3 rounded-lg ">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe"></Avatar>
        }
        title={post?.author?.username}
        subheader={formatRelativeTime(post?.createdAt, "")}
      />
      <div className=" min-h-[20rem] flex items-center border-2 ">
        <img
          className=" w-full h-full "
          src={`${Server}/${post?.url}`}
          alt="image"
        />
      </div>

      <IconButton onClick={handleLike}>
        {hasLiked ? <Favorite /> : <FavoriteBorder />}
        <Typography variant="body2" color="text.secondary" className=" ml-2">
          {likes.length}
        </Typography>
      </IconButton>
      <IconButton onClick={() => setshowComment(post._id)}>
        <MessageCircle className=" h-5 w-5 " />
      </IconButton>
      <h1 className=" mx-3">
        <span className=" font-semibold mr-2 text-black">
          {post?.author?.username}
        </span>

        {post?.description}
      </h1>
      <CardContent>
        <List className="relative border-t  ">
          {comments?.length != 0 && showComment == post._id && (
            <h1
              onClick={() => setshowComment("")}
              className=" absolute right-1 top-1 cursor-pointer p-2 z-[99] "
            >
              <X className=" h-4 w-4 text-slate-600 cursor-pointer " />
            </h1>
          )}
          {comments.length == 0 ? (
            <span className=" text-sm">No comments yet!</span>
          ) : (
            <span
              className=" text-sm cursor-pointer "
              onClick={() => setshowComment(post._id)}
            >
              {comments?.length} comment{comments?.length != 1 && "s"}
            </span>
          )}
          {comments?.map((comment, index) => (
            <ListItem
              key={index}
              className={`${showComment == post._id ? "block" : "hidden"}`}
            >
              <ListItemText
                primary={comment.text}
                secondary={formatRelativeTime(comment?.createdAt, "comments")}
              />
            </ListItem>
          ))}
        </List>
        <div className=" flex items-center justify-between gap-x-2">
          <input
            className=" border-slate-400 border-b w-full rounded outline-none p-1"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            onClick={handleAddComment}
            className=" bg-blue-700 p-1 rounded"
            color="primary"
          >
            <ArrowRightAltSharp className=" text-white" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
