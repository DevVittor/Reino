import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { FiHome, FiSearch, FiUser, FiGrid } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash.debounce";
import { IoClose, IoChevronDown, IoChevronUp } from "react-icons/io5";

export default function Test() {
  const [products, setProducts] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Estados de filtro e UI
  const [showCategories, setShowCategories] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedStore, setSelectedStore] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(false);

  const API = "https://reino-production.up.railway.app";

  const filterRef = useRef(null);

  // Função para buscar produtos com filtros aplicados
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(selectedStore && { store: selectedStore }),
        ...(selectedCategories.length > 0 && {
          categories: selectedCategories.map((c) => c._id),
        }),
        ...(selectedSubcategories.length > 0 && {
          subcategories: selectedSubcategories,
        }),
      };
      const response = await axios.get(`${API}/api/product/list`, {
        params,
        paramsSerializer: (params) => {
          const query = new URLSearchParams();
          for (const key in params) {
            const value = params[key];
            if (Array.isArray(value)) {
              value.forEach((v) => query.append(key, v));
            } else {
              query.append(key, value);
            }
          }
          return query.toString();
        },
      });
      setProducts(response.data.list || []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStore, selectedCategories, selectedSubcategories]);

  // Debounce para busca, para não chamar a API a cada tecla digitada
  const debouncedFetchProducts = useCallback(debounce(fetchProducts, 500), [
    fetchProducts,
  ]);

  useEffect(() => {
    // Buscar categorias e subcategorias ao montar
    const fetchCategories = async () => {
      try {
        const catRes = await axios.get(`${API}/api/category/list`);
        setCategoryOptions(catRes.data.list);
      } catch {
        setCategoryOptions([]);
      }
    };
    const fetchSubcategories = async () => {
      try {
        const subRes = await axios.get(`${API}/api/subcategory/list`);
        setSubcategories(subRes.data.list);
      } catch {
        setSubcategories([]);
      }
    };
    fetchCategories();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    debouncedFetchProducts();
    return () => debouncedFetchProducts.cancel();
  }, [searchTerm, selectedStore, selectedCategories, selectedSubcategories]);

  // Toggle para expandir categorias no filtro
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Pega subcategorias relacionadas à categoria
  const getSubFor = (catId) => {
    const cat = categoryOptions.find((c) => c._id === catId);
    if (!cat || !cat.subCategoryId) return [];
    return subcategories.filter((s) => cat.subCategoryId.includes(s._id));
  };

  // Toggle seleção categoria no filtro
  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.some((c) => c._id === category._id)
        ? prev.filter((c) => c._id !== category._id)
        : [...prev, category]
    );
  };

  // Toggle seleção subcategoria no filtro
  const handleSubcategoryToggle = (subId) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subId)
        ? prev.filter((id) => id !== subId)
        : [...prev, subId]
    );
  };

  // Fechar filtro ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowSearch(false);
        setShowCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col md:flex-row bg-[#3F2305] min-h-screen pb-14 md:pb-0">
      {/* Sidebar categorias desktop */}
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
                  selectedCategories.some((cat) => cat._id === c._id)
                    ? "bg-gray-700"
                    : "bg-[#3F2305]"
                }`}
                onClick={() => handleCategoryToggle(c)}
              >
                <div className="flex justify-between items-center">
                  <span>{c.category}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(c._id);
                    }}
                  >
                    {expandedCategories[c._id] ? (
                      <IoChevronUp />
                    ) : (
                      <IoChevronDown />
                    )}
                  </button>
                </div>
                {expandedCategories[c._id] && (
                  <ul className="mt-1 ml-4 space-y-1 text-sm text-[#FFE99A]">
                    {getSubFor(c._id).map((s) => (
                      <li
                        key={s._id}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubcategoryToggle(s._id);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(s._id)}
                          readOnly
                          className="mr-1"
                        />
                        {s.subCategory}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-grow md:ml-[350px] p-4">
        <div className="sticky top-0 bg-red-500 h-[250px] md:h-[400px] mb-4"></div>

        {/* Produtos */}
        <div className="columns-2 md:columns-5 gap-2">
          {loading ? (
            <p className="text-yellow-300 text-center w-full">Carregando...</p>
          ) : products.length > 0 ? (
            products.map((p) => (
              <div
                key={p._id}
                className="break-inside-avoid mb-2 bg-[#070707] rounded-lg overflow-hidden"
              >
                <img
                  src={Array.isArray(p.photos) ? p.photos[0] : p.photos}
                  alt={p.product}
                  className="w-full object-cover"
                />
                <div className="p-2 text-[#FFE99A]">
                  <h2 className="font-semibold line-clamp-2">{p.product}</h2>
                  <Link
                    to={p.link}
                    target="_blank"
                    className="mt-2 block bg-amber-900 text-center py-1 rounded"
                  >
                    R$ {p.price.toFixed(2).replace(".", ",")}
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-yellow-300 text-center w-full">
              Nenhum produto encontrado
            </p>
          )}
        </div>
      </div>

      {/* Footer mobile com botões */}
      <div className="fixed bottom-0 w-full bg-[#361500] border-t border-[#52280f] flex justify-around items-center py-2 z-50 md:hidden">
        <Link
          to="/home"
          className="flex flex-col items-center text-white hover:text-yellow-300"
        >
          <FiHome size={24} />
          <span className="text-xs">Início</span>
        </Link>

        <button
          className="flex flex-col items-center text-white hover:text-yellow-300 relative"
          onClick={() => setShowSearch(!showSearch)}
        >
          <FiSearch size={24} />
          <span className="text-xs">Buscar</span>
          <AnimatePresence>
            {showSearch && (
              <motion.div
                ref={filterRef}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-[90vw] max-w-[350px] p-4 bg-[#361500] rounded-lg border border-[#52280f] z-50 shadow-lg"
              >
                <input
                  type="text"
                  placeholder="Buscar produtos"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 rounded text-black"
                />
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full mt-3 p-2 rounded text-black"
                >
                  <option value="">Todas as lojas</option>
                  <option value="Submarino">Submarino</option>
                  <option value="Americanas">Americanas</option>
                  <option value="Amazon">Amazon</option>
                </select>

                <button
                  className="mt-3 w-full bg-red-600 hover:bg-red-700 rounded p-2 text-white"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStore("");
                    setSelectedCategories([]);
                    setSelectedSubcategories([]);
                  }}
                >
                  Limpar filtros
                </button>

                <hr className="my-3 border-yellow-300" />

                <div>
                  <h3 className="text-yellow-300 font-semibold mb-1">
                    Categorias
                  </h3>
                  <ol className="flex flex-col gap-1 max-h-48 overflow-auto">
                    {categoryOptions.map((cat) => (
                      <li key={cat._id}>
                        <div className="flex items-center justify-between">
                          <label className="cursor-pointer flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedCategories.some(
                                (c) => c._id === cat._id
                              )}
                              onChange={() => handleCategoryToggle(cat)}
                            />
                            {cat.category}
                          </label>
                          <button
                            onClick={() => toggleCategory(cat._id)}
                            className="text-yellow-300"
                          >
                            {expandedCategories[cat._id] ? (
                              <IoChevronUp />
                            ) : (
                              <IoChevronDown />
                            )}
                          </button>
                        </div>
                        {expandedCategories[cat._id] && (
                          <ul className="pl-6 text-sm text-[#FFE99A]">
                            {getSubFor(cat._id).map((sub) => (
                              <li key={sub._id}>
                                <label className="cursor-pointer flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedSubcategories.includes(
                                      sub._id
                                    )}
                                    onChange={() =>
                                      handleSubcategoryToggle(sub._id)
                                    }
                                  />
                                  {sub.subCategory}
                                </label>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <Link
          to="/grid"
          className="flex flex-col items-center text-white hover:text-yellow-300"
        >
          <FiGrid size={24} />
          <span className="text-xs">Categorias</span>
        </Link>

        <Link
          to="/perfil"
          className="flex flex-col items-center text-white hover:text-yellow-300"
        >
          <FiUser size={24} />
          <span className="text-xs">Perfil</span>
        </Link>
      </div>
    </div>
  );
}
