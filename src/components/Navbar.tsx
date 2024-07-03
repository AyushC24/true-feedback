
"use client";
import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import profileIcon from "../../public/profileIcon.jpg";
import { Router } from "next/router";
import logoIcon from "../../public/logo.jpg";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
      await signOut({
      redirect: false, // Prevent automatic redirect
      callbackUrl: "/",
    });

    // Push to the homepage after signing out
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/sign-in");
    // signIn();
  };

  const name = session?.user?.username;
  const username = name ? name.split(" ")[0] : "" || "Guest";

  return (
    <nav className="flex justify-between items-center bg-gray-800 shadow-lg px-6 py-3">
      <div className="flex items-center flex-col">
        <Image
          src={logoIcon}
          alt="Logo"
          width={40}
          height={40}
          className="w-10 h-10 mr-4"
        />
        <span className="text-lg font-bold italic text-white mx-5">
          Feedonymous
        </span>
      </div>
      <div className="flex items-center">
        <div className="relative mr-4 cursor-pointer" onClick={toggleDropdown}>
          <div className="flex items-center hover:text-lg">
            <Image
              src={session?.user?.image || profileIcon.src}
              alt="Logo"
              width={40}
              height={40}
              className="mr-4 rounded-full"
            />
            <span className="mr-2 text-white">{username ?? "Guest"}</span>
            <svg
              className={`fill-current text-gray-600 h-4 w-4 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 0l8 9H4l8-9zM6 11h12v2H6z" />
            </svg>
          </div>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
              <ul className="py-1">
                {session ? (
                  <li
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Signout
                  </li>
                ) : (
                  <li
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                    onClick={handleLogin}
                  >
                    Signin
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
