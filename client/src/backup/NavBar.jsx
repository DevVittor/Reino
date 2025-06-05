import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillDashboard } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";

import Logo from "../assets/icons/logo.png";

export default function NavBar() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decode = jwtDecode(token);
      setUserId(decode._id);
      setRole(decode.role);
    }
  }, [userId, role]);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div
        className={`${
          userId && role
            ? " md:justify-between justify-center"
            : "justify-center"
        } flex items-center md:gap-2 gap-1 flex-wrap px-5 py-2 border-b border-zinc-200`}
      >
        <div className="">
          <Link
            className="flex justify-center items-center flex-wrap gap-2"
            to="/"
          >
            <img className="w-10 object-cover" src={Logo} alt="Reino Animal" />
            <h1 className={`text-4xl font-bold title_logo`}>Reino Animal</h1>
          </Link>
        </div>

        {userId && role && (
          <div className="">
            <ol className="flex items-center gap-1.5 text-zinc-800">
              <li>
                <Link
                  className="flex items-center gap-1 border border-zinc-200 px-3 py-1 rounded-sm bg-white hover:bg-zinc-50 transition-colors ease-linear duration-150"
                  to="/painel"
                >
                  <AiFillDashboard />
                  Painel
                </Link>
              </li>
            </ol>
          </div>
        )}
      </div>
    </header>
  );
}
