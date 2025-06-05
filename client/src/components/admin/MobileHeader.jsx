import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IoCartOutline, FaUserCircle, IoLogOutOutline } from "react-icons/io5";
import { FaUserCircle as FaUserCircleSolid } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

export default function MobileHeader() {
  const location = useLocation();
  const isAdmin = localStorage.getItem("token")
    ? jwtDecode(localStorage.getItem("token")).role === "admin"
    : false;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50 rounded-t-2xl">
      <Link
        to="/painel/produtos/lista"
        className={`flex flex-col items-center ${
          location.pathname.startsWith("/painel/produtos")
            ? "text-blue-500 bg-blue-100 rounded-lg p-2"
            : "text-gray-600"
        }`}
      >
        <IoCartOutline className="text-2xl" />
        <span className="text-xs">Produtos</span>
      </Link>
      {isAdmin && (
        <Link
          to="/painel/usuarios"
          className={`flex flex-col items-center ${
            location.pathname === "/painel/usuarios"
              ? "text-blue-500"
              : "text-gray-600"
          }`}
        >
          <FaUserCircleSolid className="text-2xl" />
          <span className="text-xs">Usuários</span>
        </Link>
      )}
      <Link
        to="/"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        className={`flex flex-col items-center ${
          location.pathname === "/" ? "text-blue-500" : "text-gray-600"
        }`}
      >
        <IoLogOutOutline className="text-2xl" />
        <span className="text-xs">Sair</span>
      </Link>
    </nav>
  );
}
