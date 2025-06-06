import { FaTachometerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaPowerOff } from "react-icons/fa6";
import { IoLogoWhatsapp, IoIosHome } from "react-icons/io";

export default function NavBarDashboard() {
  const [modalPainel, setModalPainel] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/acessar";
  };

  const PainelConteudo = () => (
    <div className="flex flex-col justify-center items-center gap-5 flex-grow w-full">
      <div className="flex justify-center items-center flex-col w-full">
        <div className="flex justify-end w-full md:hidden">
          {/* Só aparece no mobile */}
          <IoClose
            className="text-red-500 text-2xl"
            title="fechar"
            onClick={() => setModalPainel(false)}
          />
        </div>
        <div className="flex items-center gap-2 text-2xl">
          <Link to="/painel" className="flex items-center gap-1">
            <FaTachometerAlt />
            <h2>Dashboard</h2>
          </Link>
        </div>
        <Link
          to="/"
          className="flex items-center gap-1 text-zinc-300 font-light"
        >
          <IoIosHome />
          voltar ao site
        </Link>
      </div>
      <div className="flex-grow flex items-center">
        <ol className="flex flex-col gap-1.5 text-zinc-100 font-medium">
          <li>
            <Link to="/painel/usuarios/lista">Lista de Usuários</Link>
          </li>
          <li>
            <Link to="/painel/produto/lista">Lista de Produtos</Link>
          </li>
          <li>
            <Link to="/painel/produto/novo">Criar Produto</Link>
          </li>
          <li>
            {/*<Link to="/painel/produto/editar">Editar Produto</Link>*/}
            <span className="text-zinc-500 md:cursor-not-allowed cursor-auto">
              Editar Produto (Em manutenção)
            </span>
          </li>
          <li>
            <Link to="/painel/produto/destacar">Destacar Produto</Link>
          </li>
          <li>
            <Link to="/painel/categoria">Categoria</Link>
          </li>
          <li>
            <Link to="/painel/subcategoria">Subcategoria</Link>
          </li>
        </ol>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border border-zinc-200">
      {/* Mobile Nav */}
      <div className="md:hidden flex items-center gap-2 px-3 py-2">
        <GiHamburgerMenu onClick={() => setModalPainel(true)} />
        <h2 className="text-4xl font-bold">Dashboard</h2>
      </div>

      {/* Mobile Aside */}
      {modalPainel && (
        <aside className="fixed top-0 left-0 bg-black w-[350px] min-h-screen z-50 text-white px-5 py-8 flex justify-between items-center flex-col gap-3 md:hidden">
          <PainelConteudo />
          <div className="flex justify-center items-center gap-2 flex-col">
            <Link
              className="px-3 py-1 rounded font-bold flex items-center gap-1 bg-green-400"
              to="https://api.whatsapp.com/send/?phone=5521993737130&text=Estou+com+um+problema+no+site.&type=phone_number&app_absent=0"
              target="_blank"
            >
              <IoLogoWhatsapp />
              Suporte
            </Link>
            <button
              className="px-3 py-1 rounded bg-red-500 text-zinc-100 font-bold flex items-center gap-1"
              onClick={logout}
            >
              <FaPowerOff />
              Sair
            </button>
          </div>
        </aside>
      )}

      {/* Desktop Aside */}
      <aside className="hidden md:flex fixed top-0 left-0 bg-black w-[350px] min-h-screen text-white px-5 py-8 flex-col justify-between z-40">
        <PainelConteudo />
        <div className="flex justify-center items-center gap-2 flex-col">
          <Link
            className="px-3 py-1 rounded font-bold flex items-center gap-1 bg-green-400"
            to="https://api.whatsapp.com/send/?phone=5521993737130&text=Estou+com+um+problema+no+site.&type=phone_number&app_absent=0"
            target="_blank"
          >
            <IoLogoWhatsapp />
            Suporte
          </Link>
          <button
            className="px-3 py-1 rounded bg-red-500 text-zinc-100 font-bold flex items-center gap-1"
            onClick={logout}
          >
            <FaPowerOff />
            Sair
          </button>
        </div>
      </aside>
    </header>
  );
}
