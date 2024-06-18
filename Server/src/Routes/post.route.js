import express from "express";
import {  createPost, getPost } from "../Controllers/post.controller.js";
import authMiddleware from "../middleware.js";

export const router  = new express.Router();

router.post("/add", authMiddleware, createPost);
router.get("/get",  getPost);
