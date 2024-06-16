'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "../../../utils/socket.js";
import PostCard from "@/components/widgets/Card";
import { Typography, Grid, Fab, Button } from "@mui/material";
import AddPostForm from '@/components/widgets/addForm'
import { Add, Close, X } from "@mui/icons-material";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [PostDialog, setPostDialog] = useState(false)
  const [Server] = useState(process.env.NEXT_PUBLIC_URL);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${Server}/api/posts/get`);
      const { error, data, message } = res.data;
      if (error) {
        console.error("Error fetching posts:", message);
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    const handleNewPost = (newPost) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    socket.on("newPost", handleNewPost);

    return () => {
      socket.off("newPost", handleNewPost);
    };
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostAdded = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div className=" mx-4 my-2">
      <div className=" fixed bottom-10 right-10">
        <Button onClick={() => setPostDialog(!PostDialog)} type="button" variant="contained" className=" w-fit px-4 py-2">

          {
            !PostDialog ?
              <>
                <Add /> Create a Post
              </> :
              <Close />
          }
        </Button>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" className="  text-red-800 font-bold">Instagram</Typography>
        </Grid>
        <Grid item xs={12}>
          <AddPostForm PostDialog={PostDialog} Server={Server} onPostAdded={handlePostAdded} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Recent Posts</Typography>
          {posts.length === 0 ? (
            <Typography variant="h4">Be the first to add posts</Typography>
          ) : (
            <ul style={{ width: "100vw", display: "flex", alignItems: "center", flexDirection: "column", listStyleType: "none" }}>
              {posts.map((post) => (
                <li key={post?._id}>
                  <PostCard Server={Server} post={post} />
                </li>
              ))}
            </ul>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
