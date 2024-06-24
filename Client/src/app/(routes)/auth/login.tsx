"use client";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Login = () => {
  const router = useRouter();
  const [InputData, setInputData] = useState({
    username: "",
    password: "",
  });
  const [loader, setloader] = useState(false);

  const Server = process.env.NEXT_PUBLIC_URL;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInputData({ ...InputData, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setloader(true);
    try {
      const res = await axios.post(`${Server}/api/auth/login`, InputData);
      const { error, message, token, userId } = res.data;
      if (error) {
       return toast.error(message, {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        Cookies.set("token", token, { expires: 1, sameSite: "strict" });
        Cookies.set("user", userId, { expires: 1, sameSite: "strict" });
        toast.success("Login success!", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
      toast.error('Login failed', {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setloader(false);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "10rem",
      }}
    >
      <div>
        <h1 className=" mb-5">Login form</h1>
        <form onSubmit={handleSubmit}>
          <TextField
            onChange={handleChange}
            value={InputData.username}
            name="username"
            id="outlined-basic"
            label="Username"
            variant="outlined"
          />
          <br />
          <br />
          <TextField
            onChange={handleChange}
            value={InputData.password}
            name="password"
            id="outlined-basic"
            label="Password"
            variant="outlined"
          />
          <br />
          <br />
          <Button type="submit" variant="contained">
            {loader ? (
              <h1 className=" p-[10px] h-4 w-4 rounded-full border-t-transparent animate-spin border-2"></h1>
            ) : (
              "Login"
            )}
          </Button>
        </form>
        <br />
        <br />
        No account? <Link className=" text-blue-500 underline" href={"/auth/signup"}>Register</Link>
      </div>
    </div>
  );
};

export default Login;
