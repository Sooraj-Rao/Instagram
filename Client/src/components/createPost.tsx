"use client";
import React, { useState } from "react";
import axios from "axios";
import { Button, Fab, TextField } from "@mui/material";
import { Image } from "@mui/icons-material";

const AddPostForm = ({ Server, PostDialog, setPostDialog }) => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (image?.size > 5 * 1024 * 1024) return alert("Image should be less than 5Mb");

      if (!image) return alert("Please Add image");
      if (!description) return alert("Please Add Description");
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
      }
      setPostDialog(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setUrl(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={` ${
        PostDialog ? "  h-screen" : "h-0 "
      }   fixed top-0 z-[999] w-screen  bg-white justify-center flex-col items-center gap-y-4 duration-500   overflow-hidden`}
    >
      <div className=" flex justify-center flex-col items-center mt-20 gap-y-10">
        <h1 className=" my-3 text-xl">Create a New Post</h1>
        <div>
          <label
            className={`flex  cursor-pointer  items-center  text-sm  w-fit px-[3.2rem]  rounded-md   border  `}
          >
            <span className=" flex items-center">
              <div className="flex items-center justify-center w-full">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Image className=" text-gray-700" />
                  <p className="mb-2 text-sm text-gray-800 ">
                    <span className="font-semibold"></span>
                    Drag Photos here
                  </p>
                </div>
                <input
                  onChange={handleImageChange}
                  type="file"
                  name="image"
                  accept="image/*"
                  className=" hidden "
                />
              </div>
            </span>
          </label>

          {url && (
            <div className=" flex justify-center">
              <img
                src={url}
                className=" my-4 "
                alt="Preview"
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
            </div>
          )}
        </div>
        <div>
          <TextField
            id="outlined-basic"
            label="Share someting.."
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className=" h-20 w-80"
            variant="outlined"
          />
        </div>
        <Button type="submit" variant="contained">
          Create Post
        </Button>
      </div>
    </form>
  );
};

export default AddPostForm;
