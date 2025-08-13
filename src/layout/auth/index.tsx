import React from "react";
import logo from "@/assets/images/logo.png";
import render from "@/assets/images/render.jpg";
import { Link, Navigate, Outlet, useLocation } from "react-location";

export default function AuthLayout() {
  return (
    <main className="w-full h-screen flex justify-between items-center">
      <div className="flex-1 h-full overflow-hidden">
        <img
          src={render}
          alt="auth picture"
          className="object-cover h-full w-full"
        />
      </div>
      <div className="flex-1 h-full p-5 overflow-auto ">
        <div className="w-full h-full max-w-[22rem] mx-auto flex flex-col justify-center items-center py-10">
          <img src={logo} alt="logo" className="w-48 h-auto object-contain" />
          <Outlet />
        </div>
      </div>
    </main>
  );
}
