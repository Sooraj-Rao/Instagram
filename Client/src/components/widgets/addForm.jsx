"use client";
import React, { useState } from "react";
import axios from "axios";
import { Button, Fab, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";

const AddPostForm = ({ Server, onPostAdded, PostDialog }) => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("description", description);

      const response = await axios.post(`${Server}/api/posts/add`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.error) {
        alert(response.data.message);
      } else {
        setImage(null);
        setUrl("");
        setDescription("");
        if (typeof onPostAdded === "function") {
          onPostAdded(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setUrl(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <form onSubmit={handleSubmit} className={` ${PostDialog ? '  h-screen' : 'h-0 '}  my-40s flex justify-center flex-col items-center gap-y-4 duration-500   overflow-hidden`}>
      <h1 className=" my-3">Create a post</h1>
      <div>
        <label
          className={`flex h-12 cursor-pointer  items-center  text-sm  w-fit px-[3.2rem] bg-slate-200 rounded-md   border  `}
        >
          <span className=" flex items-center"><Add /> Upload Image</span>
          <input
            onChange={handleImageChange}
            type="file"
            accept="image/*"
            required
            className=" hidden "
            style={{ visibility: 'hidden' }}
          />
        </label>

        {url && (
          <img
            src={url}
            alt="Preview"
            style={{ maxWidth: "100px", maxHeight: "100px" }}
          />
        )}
      </div>
      <div>
        <TextField
          id="outlined-basic"
          label="Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className=" h-16 w-80"
          variant="outlined"
        />
      </div>
      <Button type="submit" variant="contained">
        Create Post
      </Button>

    </form>
  );
};

export default AddPostForm;
