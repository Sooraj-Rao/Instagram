"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Grid, Fab, Button } from "@mui/material";
import { Add, Close, X } from "@mui/icons-material";
import AddPostForm from "@/components/createPost";
import socket from "@/utils/socket";
import PostCard from "@/components/postCard";
const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loader, setloader] = useState(true);
  const [PostDialog, setPostDialog] = useState(false);
  const [Server] = useState(process.env.NEXT_PUBLIC_URL);

  const fetchPosts = async () => {
    try {
      setloader(true);
      const res = await axios.get(`${Server}/api/posts/get`);
      const { error, data, message } = res.data;
      if (error) {
        console.error("Error fetching posts:", message);
        alert('Error fetching posts')
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      alert('Error fetching posts')
    } finally {
      setloader(false);
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

  return (
    <div className=" mx-4 my-2">
      <div className=" fixed bottom-10 right-10 z-[9999]">
        <Button
          onClick={() => setPostDialog(!PostDialog)}
          type="button"
          variant="contained"
          className=" w-fit px-4 py-2"
        >
          {!PostDialog ? (
            <>
              <Add /> Create a Post
            </>
          ) : (
            <Close />
          )}
        </Button>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            className="  text-red-800  font-bold"
          >
            Instagram
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <AddPostForm
            setPostDialog={setPostDialog}
            PostDialog={PostDialog}
            Server={Server}
          />
        </Grid>
        <Grid item xs={12}>
          <h1 className="  text-xl text-center">Recent Posts</h1>
          {loader ? (
            <div className=" flex justify-center">
              <div className=" bg-gray-200 animate-pulse w-[20rem] min-h-[30rem] my-3 "></div>
            </div>
          ) : (
            ""
          )}
          {!loader && posts?.length === 0 ? (
            <Typography variant="h4">Be the first to add posts</Typography>
          ) : (
            <ul
              style={{
                width: "100vw",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                listStyleType: "none",
              }}
            >
              {posts?.map((post) => (
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
