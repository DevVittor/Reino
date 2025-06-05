import { Link, useLocation } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";

export default function NotFound() {
  const location = useLocation();
  const resultPath = location.pathname;

  return (
    <div
      className={`${
        resultPath.startsWith("/painel") ? "flex-grow md:ml-[350px]" : "md:ml-0"
      } flex flex-1 justify-center items-center flex-col gap-1 bg-zinc-50 p-2`}
    >
      <h1 className="font-bold text-6xl">Error 404</h1>
      <p className="font-bold text-2xl text-zinc-700 text-pretty text-center">
        Essa página não foi encontrada...
      </p>
      <Link
        className="bg-red-500 text-white font-bold px-3 py-1 rounded-md flex items-center justify-center gap-1 mt-3"
        to={`${resultPath.startsWith("/painel") ? "/painel" : "/"}`}
      >
        <IoChevronBack />
        Voltar ao Início
      </Link>
    </div>
  );
}
