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
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import Cookies from "js-cookie";
import socket from "@/utils/socket";
import { formatRelativeTime } from "@/utils/date.format";

export default function PostCard({ post, Server }) {
  const [likes, setLikes] = useState(post?.likes || []);
  const [comments, setComments] = useState(post?.comments || []);
  const [commentText, setCommentText] = useState("");
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
  }, [post._id]);

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
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {post?.author?.username[0]}
          </Avatar>
        }
        title={post?.author?.username}
        subheader={formatRelativeTime(post?.createdAt)}
      />
      <CardMedia
        component="img"
        height="194"
        image={`${Server}/${post?.url}`}
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post?.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLike} aria-label="add to favorites">
          {hasLiked ? <Favorite /> : <FavoriteBorder />}
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {likes.length}
          </Typography>
        </IconButton>
      </CardActions>
      <CardContent>
        <List>
          {comments?.map((comment, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={comment.text}
                secondary={formatRelativeTime(comment?.createdAt)}
              />
            </ListItem>
          ))}
        </List>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          onClick={handleAddComment}
          variant="contained"
          color="primary"
          sx={{ mt: 1 }}
        >
          Comment
        </Button>
      </CardContent>
    </Card>
  );
}
