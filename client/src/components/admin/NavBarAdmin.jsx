import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { IoCart } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

export default function NavBarAdmin() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  console.log(userId);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decode = jwtDecode(token);
      setUserId(decode._id);
      setRole(decode.role);
    } else {
      window.location.href = "/acessar";
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const toggleSubMenu = (menu) => {
    setOpenSubMenu((prev) => (prev === menu ? null : menu));
  };

  // Condiciona a exibição de itens com base no role
  const canAccessUsers = role === "admin"; // Exemplo: apenas admin pode ver o item "Usuários"

  return (
    <aside className="fixed top-0 left-0 h-screen w-[250px] bg-escuro border-r border-zinc-800 flex justify-between flex-col z-50">
      {/* Header do Aside */}
      <div className="flex items-center flex-col gap-1 p-4 border-b border-zinc-700">
        <Link to="/painel" className="text-white text-xl font-semibold">
          Dashboard
        </Link>
        <Link className="text-zinc-300 font-light text-sm" to="/">
          Voltar ao Início
        </Link>
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Item de Produtos com Submenu */}
        <div>
          <button
            onClick={() => toggleSubMenu("produtos")}
            className="w-full flex items-center gap-2 p-2 text-gray-300 hover:bg-indigo-700 hover:text-white rounded transition duration-200 focus:outline-none"
          >
            <IoCart /> Produtos
            <span className="ml-auto">
              {openSubMenu === "produtos" ? (
                <IoMdArrowDropup />
              ) : (
                <IoMdArrowDropdown />
              )}
            </span>
          </button>
          {openSubMenu === "produtos" && (
            <div className="ml-8 mt-1 space-y-1">
              <Link
                to="/painel/produtos/lista"
                className="block p-2 text-sm text-gray-400 hover:bg-indigo-600 hover:text-white rounded"
              >
                Lista de Produtos
              </Link>
              <Link
                to="/painel/produtos/criar"
                className="block p-2 text-sm text-gray-400 hover:bg-indigo-600 hover:text-white rounded"
              >
                Criar Produto
              </Link>
              <span className="block p-2 text-sm text-gray-400 hover:bg-indigo-600 hover:text-white rounded">
                Editar Produto (Em Manutenção)
              </span>
              <Link
                to="/painel/produtos/apagar"
                className="block p-2 text-sm text-gray-400 hover:bg-indigo-600 hover:text-white rounded"
              >
                Apagar Produto
              </Link>
            </div>
          )}
        </div>

        {/* Item de Usuários - Condicional com base no role */}
        {canAccessUsers && (
          <Link
            to="/painel/usuarios"
            className="flex items-center gap-2 p-2 text-gray-300 hover:bg-indigo-700 hover:text-white rounded transition duration-200"
          >
            <FaUserCircle /> Usuários
          </Link>
        )}
      </nav>

      {/* Footer com Logout */}
      <div className="flex justify-center items-center p-3">
        <button
          className="w-full px-3 py-1 rounded-md text-zinc-100 bg-red-500 font-bold"
          onClick={() => setOpenModal(true)}
        >
          Sair
        </button>
        {openModal && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/70 flex justify-center items-center z-40">
            <div className="rounded-2xl p-3 flex justify-center items-center gap-2 flex-col bg-zinc-900 border border-zinc-800">
              <h2 className="text-zinc-100 font-bold text-2xl">
                Deseja sair da sua conta?
              </h2>
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <button
                  className="px-3 py-1 rounded-sm text-zinc-100 font-bold bg-zinc-800"
                  onClick={() => setOpenModal(false)}
                >
                  Não
                </button>
                <button
                  className="px-3 py-1 rounded-sm text-zinc-100 font-bold bg-red-500"
                  onClick={() => {
                    setOpenModal(false);
                    logout();
                  }}
                >
                  Sim
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
