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
        marginTop: "10rem",
      }}
    >
      <div>
        <h1>Welcome to Instagram</h1>
        <br />
        <Link href={"/auth/login"}>
          <Button variant="outlined">Get started</Button>
        </Link>
      </div>
    </div>
  );
};

export default Main;
