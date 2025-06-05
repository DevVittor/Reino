import { Outlet } from "react-router-dom";
import NavBarAdmin from "./NavBarAdmin";
import { useEffect, useState } from "react";
import LoadingContent from "../LoadingContent";

export default function NavAdmin() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoading(false);
    } else {
      window.location.href = "/acessar";
    }
  }, []);

  return (
    <>
      {loading ? (
        <LoadingContent />
      ) : (
        <div className="flex md:min-h-screen min-h-dvh bg-escuro">
          <main className="flex justify-center items-center flex-1">
            <Outlet />
          </main>
        </div>
      )}
    </>
  );
}
