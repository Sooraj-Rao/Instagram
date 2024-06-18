import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Models/user.model.js";

dotenv.config();

export const SignUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    const isUser = await User.findOne({ username });
    if (isUser) {
      return res.json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    const newRes = await newUser.save();
    console.log(newRes);
    return res.json({ error: false, message: "Registration Success" });
  } catch (error) {
    console.log("Registration Failed ", error);
    return res.json({ error: true, message: "Internal Server Error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const isUser = await User.findOne({ username });
    if (!isUser) {
      return res.json({ error: true, message: "User Doesn't Exist" });
    }

    const isMatch = await bcrypt.compare(password, isUser.password);
    if (!isMatch) {
      return res.json({ error: true, message: "Password is Invalid" });
    }

    const payload = {
      id: isUser._id,
      username: isUser.username,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.json({
      error: false,
      message: "Login Success",
      token,
      userId: isUser._id,
    });
  } catch (error) {
    console.log("Login Error ", error);
    return res.json({ error: true, message: "Internal Server Error" });
  }
};
