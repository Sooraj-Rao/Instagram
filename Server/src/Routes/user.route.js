import express from "express";
import { Login, SignUp } from "../Controllers/auth";


export const router  = new express.Router();
router.post("/auth/signup", SignUp);
router.post("/auth/login", Login);
