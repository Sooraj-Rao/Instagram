import React from "react";
import Login from "../login";
import SignUp from "../signup";

const Page = ({ params: { route } }) => {
  const renderComponent = () => {
    switch (route) {
      case "signup":
        return <SignUp />;
      default:
        return <Login />;
    }
  };

  return <div style={{ height: "100vh" }}>{renderComponent()}</div>;
};

export default Page;
