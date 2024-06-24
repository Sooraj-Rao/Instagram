import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";

const Main = () => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
      }}
      className=" relative"
    >
      <h1 className=" absolute left-6 top-4 text-4xl text-red-500 font-semibold">
        Instagram
      </h1>
      <div className=" flex  items-center flex-col mt-40">
        <h1 className=" text-5xl">Welcome to Instagram</h1>
        <br />
        <Link href={"/auth/login"}>
          <Button variant="outlined">Get started</Button>
        </Link>
      </div>
    </div>
  );
};

export default Main;
