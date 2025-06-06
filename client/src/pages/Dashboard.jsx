import React, { useState, useEffect } from "react";
import { IoIosHome } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Dashboard() {
  const [userId, setUserId] = useState("");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //const [currentPage, setCurrentPage] = useState(1);
  //const [totalPages, setTotalPages] = useState(1);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const limit = 5;
  const message = "Estou com um problema no site.";
  const encodedMessage = encodeURIComponent(message);
  const contact = "21993737130";

  useEffect(() => {
    if (userId) {
      // Só executa quando userId está disponível
      getProducts();
      getUsers();
    }
  }, [userId]); // userId como dependência

  const getProducts = async (page) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://reino-production.up.railway.app/api/product/list?limit=${limit}&page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Resposta da API (produtos):", response.data);
      setProducts(response.data.list || []);
      //setTotalPages(response.data.pagination?.totalPages || 1);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error(
        "Erro ao buscar produtos:",
        error.response || error.message
      );
      setProducts([]);
      setError(error.response?.data?.error || "Erro ao carregar produtos.");
      setLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://reino-production.up.railway.app/api/user/list?adminId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Resposta da API (usuários):", response.data);
      setUsers(response.data.list || []);
      setUsersLoading(false);
      setUsersError(null);
    } catch (error) {
      console.error(
        "Erro ao buscar usuários:",
        error.response || error.message
      );
      setUsers([]);
      setUsersError(
        error.response?.data?.error || "Erro ao carregar usuários."
      );
      setUsersLoading(false);
    }
  };

  /*const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };*/

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/acessar";
  };

  return (
    <div className="flex justify-center md:items-center items-start flex-1 md:p-3 p-2 md:ml-[350px]">
      <div className="md:h-[600px] h-auto md:w-4/5 w-full flex justify-center items-center gap-2 md:flex-row flex-col">
        <div className="flex flex-col h-full md:w-1/3 w-full gap-2">
          <div className="md:h-[300px] w-full border border-zinc-800 rounded-2xl bg-escuro p-3 flex justify-center items-center">
            <Link to="/">
              <h1 className="flex items-center gap-2 text-4xl font-bold text-white">
                <IoIosHome />
                Início
              </h1>
            </Link>
          </div>
          <div className="md:h-full w-full sm:flex hidden flex-col justify-between items-center md:p-3 p-2 border border-zinc-200 bg-white rounded-2xl overflow-y-auto">
            <div className="w-full h-full overflow-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="p-2">Produto</th>
                    <th className="p-2">Preço</th>
                    <th className="p-2">Loja</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="p-2 text-center">
                        Carregando produtos...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="3" className="p-2 text-center text-red-400">
                        {error}
                      </td>
                    </tr>
                  ) : products.length > 0 ? (
                    products.map((product, index) => (
                      <tr key={index} className="border-b border-zinc-200">
                        <td className="p-2" title={product.product}>
                          {product.product || "N/A"}
                        </td>
                        <td className="p-2">
                          R$ {product.price ? product.price.toFixed(2) : "N/A"}
                        </td>
                        <td className="p-2">{product.store || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-2 text-center">
                        Nenhum produto disponível
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:h-full md:w-1/3 w-full gap-2">
          <div className="md:h-1/3 w-full flex justify-center items-center md:flex-row flex-col gap-2">
            <div className="md:w-2/4 w-full h-full flex justify-center items-center flex-col gap-2">
              <div className="w-full h-2/4 md:p-3 p-2 bg-white border border-zinc-200 rounded-2xl flex justify-center items-center gap-2 flex-wrap">
                <Link
                  to="/painel/categoria"
                  className="font-bold text-zinc-700 text-2xl"
                >
                  Categoria
                </Link>
              </div>
              <div className="w-full h-2/4 md:p-3 p-2 bg-white border border-zinc-200 rounded-2xl flex justify-center items-center">
                <Link
                  to="/painel/produto/novo"
                  className="text-center text-2xl font-bold"
                >
                  Criar Produto
                </Link>
              </div>
            </div>
            <div className="md:w-2/4 w-full h-full flex justify-center items-center flex-col gap-2">
              <div className=" w-full h-full flex justify-center items-center gap-2 flex-wrap md:p-3 p-2 border border-zinc-200 rounded-2xl bg-white">
                <Link
                  to="/painel/produto/editar"
                  className="font-bold text-zinc-700 text-2xl"
                >
                  Editar Produto
                </Link>
              </div>
              <div className="w-full h-2/4 md:p-3 p-2 bg-white border border-zinc-200 rounded-2xl flex justify-center items-center">
                <Link
                  to="/painel/produto/destacar"
                  className="text-center text-2xl font-bold"
                >
                  Destacar Produtos
                </Link>
              </div>
            </div>
          </div>
          <div className="md:h-2/3 w-full flex flex-col justify-between items-center md:p-3 p-2 border border-zinc-200 rounded-2xl bg-white overflow-y-auto">
            <div className="w-full h-full overflow-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="p-2">Usuário</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Cargo</th>
                  </tr>
                </thead>
                <tbody>
                  {usersLoading ? (
                    <tr>
                      <td colSpan="3" className="p-2 text-center">
                        Carregando usuários...
                      </td>
                    </tr>
                  ) : usersError ? (
                    <tr>
                      <td colSpan="3" className="p-2 text-center text-red-400">
                        {usersError}
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="border-b border-zinc-200">
                        <td className="p-2">{user.username || "N/A"}</td>
                        <td className="p-2">{user.email || "N/A"}</td>
                        <td className="p-2">{user.role || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-2 text-center">
                        Nenhum usuário disponível
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="md:h-1/3 w-full flex justify-center items-center gap-2">
            <div className="md:w-2/4 w-full h-full md:flex-auto flex-1 flex justify-center items-center md:p-3 p-2 border border-zinc-200 rounded-2xl bg-white">
              <Link
                to={`https://wa.me/55${contact}?text=${encodedMessage}`}
                target="_blank"
                className="font-bold text-zinc-700 text-lg flex justify-center items-center flex-col"
              >
                <IoLogoWhatsapp className=" text-4xl" />
                Suporte
              </Link>
            </div>
            <div className="md:w-2/4 w-full h-full flex justify-center items-center flex-col gap-2">
              <div className="w-full h-2/4 md:p-3 p-2 border border-zinc-200 rounded-2xl bg-white flex justify-center items-center">
                <Link
                  to="/painel/subcategoria"
                  className="text-xl font-bold text-center flex justify-center items-center "
                >
                  Subcategorias
                </Link>
              </div>
              <div className="w-full h-2/4 md:p-3 p-2 border border-red-800 rounded-2xl flex justify-center items-center bg-red-500">
                <span
                  className="text-center font-bold text-white hover:cursor-pointer"
                  onClick={() => setOpenModal(true)}
                >
                  Sair
                </span>
              </div>
              {openModal && (
                <div className="fixed inset-0 backdrop-blur-md bg-zinc-100/70 flex justify-center items-center z-40">
                  <div className="rounded-2xl p-3 flex justify-center items-center gap-2 flex-col bg-white border border-zinc-200">
                    <h2 className=" font-bold text-2xl">
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
                        onClick={logout}
                      >
                        Sim
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
