"use client";

import { AuthContext } from "@/components/context/authContext";
import { useContext } from "react";

export default function Profile() {
  const context = useContext(AuthContext);
  if (!context) {
    return <div>Loading...</div>;
  }
  const { user } = context;
  return (
    <div className="">
      <h1 className="font-bold text-xl">Welcome {user.firstName} </h1>
    </div>
  );
}
