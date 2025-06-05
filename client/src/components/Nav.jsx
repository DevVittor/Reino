import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import FooterBar from "./FooterBar";
import NavBarDashboard from "./NavBarDashboard";
export default function Nav() {
  const location = useLocation();
  const resultPath = location.pathname;
  return (
    <div
      className={`${
        resultPath === "/" ? "flex-col" : "md:flex-row flex-col "
      } flex justify-between md:min-h-screen min-h-dvh bg-zinc-50`}
    >
      {resultPath === "/" && <NavBar />}
      {resultPath.startsWith("/painel") && <NavBarDashboard />}
      <Outlet />
      {resultPath === "/" && <FooterBar />}
    </div>
  );
}
