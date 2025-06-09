import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiHome, FiSearch, FiGrid } from "react-icons/fi";
import { AiOutlineDashboard } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

export default function Test() {
  const [products, setProducts] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const API = "https://reino-production.up.railway.app";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [{ data: prod }, { data: cat }, { data: sub }] =
          await Promise.all([
            axios.get(`${API}/api/product/list`),
            axios.get(`${API}/api/category/list`),
            axios.get(`${API}/api/subcategory/list`),
          ]);
        setProducts(prod.list || []);
        setCategoryOptions(cat.list);
        setSubcategories(sub.list);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAll();
  }, []);

  const getSubFor = (catId) => {
    const cat = categoryOptions.find((c) => c._id === catId);
    if (!cat || !cat.subCategoryId) return [];
    return subcategories.filter((s) => cat.subCategoryId.includes(s._id));
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#3F2305] min-h-screen pb-14 md:pb-0">
      <div className="hidden md:flex fixed left-0 top-0 w-[350px] h-full bg-[#361500] border-r-2 border-[#52280f] p-5 flex-col justify-between">
        <div className="w-full flex justify-center mb-6">
          <img src={Logo} alt="Logo" className="h-16" />
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
          <ol className="flex flex-col gap-2">
            {categoryOptions.map((c) => (
              <li
                key={c._id}
                className={`px-3 py-1 rounded-full text-center cursor-pointer ${
                  selectedCategory === c._id ? "bg-gray-700" : "bg-[#3F2305]"
                }`}
                onClick={() =>
                  setSelectedCategory(selectedCategory === c._id ? null : c._id)
                }
              >
                {c.category}
              </li>
            ))}
          </ol>
          {selectedCategory && (
            <div className="mt-3 px-2">
              <h4 className="text-[#FFE99A] mb-1">Subcategorias:</h4>
              <ul className="flex flex-col gap-1">
                {getSubFor(selectedCategory).map((s) => (
                  <li
                    key={s._id}
                    className="px-2 py-1 bg-[#52280f] rounded-full text-xs text-center"
                  >
                    {s.subCategory}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow md:ml-[350px]">
        <div className="sticky top-0 flex justify-center items-center flex-col z-50">
          <div className="flex justify-center items-center gap-1 w-full md:hidden px-3 py-1 bg-[#361500] border-b border-[#52280f]">
            <img src={Logo} alt="Logo" className="h-14" />
            <h2 className="text-4xl font-bold text-[#FFE99A]">Reino Animal</h2>
          </div>
          <div className="bg-red-500 h-[200px] md:h-[400px] w-full px-3 py-1 "></div>
        </div>

        <div className="columns-2 md:columns-5 md:gap-2 gap-1 md:px-2 md:pt-2 p-1">
          {products.map((p) => (
            <div
              key={p._id}
              className="break-inside-avoid md:mb-2 mb-1 bg-[#070707] overflow-hidden"
            >
              <img
                src={p.photos}
                alt={p.product}
                className="w-full object-cover"
              />
              <div className="p-2 text-[#FFE99A]">
                <h2 className="font-semibold line-clamp-2 md:leading-5 leading-4 md:text-base text-sm">
                  {p.product}
                </h2>
                <Link
                  to={p.link}
                  target="_blank"
                  className="mt-2 block bg-amber-900 text-center py-1 px-3"
                >
                  R$ {p.price.toFixed(2).replace(".", ",")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 w-full bg-[#361500] border-t border-[#52280f] flex justify-around items-center py-2 z-50 md:hidden">
        <Link
          to="/"
          className="flex flex-col items-center text-xs text-[#FFE99A]"
        >
          <FiHome size={20} />
          Início
        </Link>
        <button
          onClick={() => {
            setShowSearch(false);
            setShowCategories((prev) => !prev);
          }}
          className="flex flex-col items-center text-xs text-[#FFE99A]"
        >
          <FiGrid size={20} />
          Categorias
        </button>
        <button
          onClick={() => {
            setShowCategories(false);
            setShowSearch((prev) => !prev);
          }}
          className="flex flex-col items-center text-xs text-[#FFE99A]"
        >
          <FiSearch size={20} />
          Buscar
        </button>
        <Link
          to="/painel"
          className="flex flex-col items-center text-xs text-[#FFE99A]"
        >
          <AiOutlineDashboard size={20} />
          Painel
        </Link>
      </div>

      <AnimatePresence>
        {showCategories && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed bottom-14 left-0 right-0 bg-[#3F2305] text-[#FFE99A] border-t border-[#52280f] p-4 z-40 max-h-[50vh] overflow-y-auto"
          >
            {!selectedCategory ? (
              <div className="flex flex-col gap-3">
                <ul className="flex flex-col gap-2">
                  {categoryOptions.map((c) => (
                    <li
                      key={c._id}
                      className="p-2 bg-[#52280f] rounded text-center"
                      onClick={() => setSelectedCategory(c._id)}
                    >
                      {c.category}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <button
                  className="mb-3 underline"
                  onClick={() => setSelectedCategory(null)}
                >
                  Voltar às categorias
                </button>
                <ul className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                  {getSubFor(selectedCategory).map((s) => (
                    <li
                      key={s._id}
                      className="p-2 bg-[#52280f] rounded text-center"
                    >
                      {s.subCategory}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed bottom-14 left-0 right-0 bg-[#3F2305] text-[#FFE99A] border-t border-[#52280f] px-4 py-6 z-40"
          >
            <input
              type="text"
              placeholder="O que você está buscando?"
              className="w-full px-4 py-3 rounded-full bg-[#52280f] text-white placeholder-[#ffe99a88] outline-none"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
