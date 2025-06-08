// Test.jsx
import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Test() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://reino-production.up.railway.app/api/product/list"
        );
        setProducts(response.data.list || []);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col md:flex-row bg-[#3F2305] min-h-screen">
      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex fixed md:w-[350px] w-full min-h-screen">
        <div className="flex flex-col justify-between items-center gap-10 p-5 min-h-screen bg-[#361500] border-r-2 border-[#52280f] w-full">
          <div className="flex justify-center items-center flex-col gap-1 h-1/5 w-full text-center">
            <Link to="/">
              <img src={Logo} alt="Logo" className="w-24 rounded-full" />
            </Link>
            <Link to="/">
              <h1 className="font-bold text-4xl text-[#FFE99A]">
                Reino Animal
              </h1>
            </Link>
          </div>

          <div className="overflow-y-auto flex-grow w-full flex flex-col gap-3 justify-center items-center">
            <div className="w-full">
              <input
                className="px-3 py-2 rounded-xl w-full bg-[#3F2305] text-[#FFE99A] outline-none border-none font-medium"
                type="search"
                placeholder="Buscar produtos..."
              />
            </div>
            <div className="w-full overflow-y-auto">
              <ol className="flex flex-col gap-2 w-full">
                {Array.from({ length: 12 }).map((_, index) => (
                  <li
                    key={index}
                    className="text-[#FFE99A] bg-[#3F2305] w-full px-3 py-1 rounded-full text-center"
                  >
                    Categoria {index + 1}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="py-2 px-5 bg-[#3F2305] max-h-[100px] rounded-xl w-auto flex justify-center items-center gap-2">
            <div>
              <img
                className="w-14 h-14 object-cover rounded-full border-2 border-[#361500]"
                src="https://images.pexels.com/photos/28206842/pexels-photo-28206842/free-photo-of-moda-tendencia-pessoa-mulher.jpeg"
                alt=""
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-medium text-zinc-100">
                Adriane Freitas
              </span>
              <span className="font-light text-xs text-zinc-300">Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-grow md:ml-[350px]">
        <div className="bg-red-500 md:h-[400px] h-[250px] p-2 flex justify-center items-center sticky top-0">
          <div className="w-full h-full bg-red-600"></div>
        </div>

        <div className="md:columns-5 columns-2 md:gap-2 gap-1 md:px-2 md:pt-2 px-1 pt-1">
          {products.map((product) => (
            <div
              key={product._id}
              className="break-inside-avoid flex flex-col justify-center items-center md:mb-2 mb-1"
            >
              <div className="w-full">
                <img
                  className="w-full object-cover"
                  loading="lazy"
                  src={product.photos}
                  alt={product.product}
                  title={product.product}
                />
              </div>
              <div className="w-full bg-[#070707] py-2 px-3 flex flex-col gap-2">
                <h2
                  className="text-[#FFE99A] font-semibold line-clamp-2 md:leading-5 leading-4 md:text-base text-sm"
                  title={product.product}
                >
                  {product.product}
                </h2>
                <Link
                  to={product.link}
                  target="_blank"
                  className="bg-amber-900 px-3 py-1 rounded flex-grow text-[#FFE99A] flex justify-center items-center truncate font-bold"
                  title={product.price}
                >
                  <span className="mx-1">R$</span>
                  {product.price.toFixed(2).replace(".", ",")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navbar para Mobile */}
      <div className="md:hidden fixed bottom-0 w-full bg-[#361500] border-t border-[#52280f] flex justify-around items-center py-2">
        <Link to="/" className="text-[#FFE99A] text-sm font-semibold">
          Início
        </Link>
        <button className="text-[#FFE99A] text-sm font-semibold">
          Categorias
        </button>
        <button className="text-[#FFE99A] text-sm font-semibold">Buscar</button>
        <button className="text-[#FFE99A] text-sm font-semibold">Perfil</button>
      </div>
    </div>
  );
}
