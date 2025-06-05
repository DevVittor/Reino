// Home.js (Frontend)
import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { TbShoppingBagSearch } from "react-icons/tb";
import { IoCart, IoClose, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Link } from "react-router-dom";
import LoadingContent from "../components/LoadingContent";
import Slider from "../components/Slider";
import SliderMobile from "../components/SliderMobile";

import Logo from "../assets/icons/logo.png";

export default function Beta() {
  const [products, setProducts] = useState([]);
  const [listFeatured, setListFeatured] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalSearch, setModalSearch] = useState(false);
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const filterRef = useRef(null);
  const filterButtonRef = useRef(null);

  const API_URL = "https://reino.onrender.com";

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/category/list`);
      setCategoryOptions(response.data.list);
    } catch (error) {
      console.error("Erro ao buscar categorias", error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/subcategory/list`);
      setSubcategories(response.data.list);
    } catch (error) {
      console.error("Erro ao buscar subcategorias", error);
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(selectedStore && { store: selectedStore }),
        ...(selectedCategories.length > 0 && {
          categories: selectedCategories
            .map((category) => category._id)
            .join(","),
        }),
        ...(selectedSubcategories.length > 0 && {
          subcategories: selectedSubcategories.join(","),
        }),
      };
      const response = await axios.get(`${API_URL}/api/product/list`, {
        params,
      });
      setProducts(response.data.list || []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStore, selectedCategories, selectedSubcategories]);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/product/list/featured`);
      setListFeatured(response.data.list || []);
    } catch (error) {
      console.error("Erro ao buscar destaques:", error);
      setListFeatured([]);
    }
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const getSubcategoriesForCategory = (categoryId) => {
    const category = categoryOptions.find((cat) => cat._id === categoryId);
    if (!category || !category.subCategoryId) return [];
    return subcategories.filter((sub) =>
      category.subCategoryId.includes(sub._id)
    );
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    if (modalSearch) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalSearch]);

  useEffect(() => {
    const initData = async () => {
      await Promise.all([fetchFeaturedProducts(), fetchProducts()]);
    };
    initData();
  }, [fetchFeaturedProducts, fetchProducts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setModalSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.some((c) => c._id === category._id)
        ? prev.filter((c) => c._id !== category._id)
        : [...prev, category]
    );
  };

  const handleSubcategoryToggle = (subcategoryId) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const renderProductCarousel = () => {
    if (loading) return <LoadingContent />;
    return products.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    ) : (
      <div className="py-4 text-center">Nenhum produto encontrado</div>
    );
  };

  return (
    <main className="flex-grow flex flex-col bg-[#2A1C0F]">
      {/*New Header*/}
      <header className="sticky top-3 z-50 mt-3">
        <div className="flex justify-center items-center gap-2 min-w-min">
          <h1 className="font-bold text-5xl text-[#D6A758] bg-[#0E1A2B] py-2 px-5 rounded-xl shadow-sm flex items-center justify-center gap-2">
            <img className="w-10" src={Logo} alt="Reino Animal" />
            Reino Animal
          </h1>
        </div>
      </header>
      {/*New Header*/}
      <div className="flex flex-col gap-3 p-1 md:p-3 w-full">
        <div className="w-full flex flex-col gap-2">
          <h2 className="font-bold text-2xl tesouros_da_tribo text-center">
            Tesouros da Tribo
          </h2>
          {listFeatured.length > 0 && (
            <div>
              <div className="sm:block hidden">
                <Slider items={listFeatured} />
              </div>
              <div className="sm:hidden block">
                <SliderMobile items={listFeatured} />
              </div>
            </div>
          )}
        </div>

        {!modalSearch && (
          <div
            ref={filterButtonRef}
            className="fixed bottom-12 flex sm:justify-start justify-center sm:w-auto w-full sm:right-8 z-10 items-center"
          >
            <div
              className="bg-white flex items-center justify-center gap-1 shadow-sm rounded-full sm:p-3 px-3 py-1.5 hover:cursor-pointer hover:bg-zinc-50 duration-150 ease-in transition-colors border border-zinc-200"
              onClick={() => setModalSearch(true)}
            >
              <TbShoppingBagSearch className="sm:text-3xl text-2xl" />
              <span>Filtro</span>
            </div>
          </div>
        )}

        {modalSearch && (
          <>
            {/* Overlay escuro atrás do drawer */}
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setModalSearch(false)}
            ></div>

            {/* Drawer lateral */}
            <aside
              ref={filterRef}
              className="fixed top-0 right-0 w-80 max-w-full h-full bg-white shadow-lg z-50 flex flex-col p-4
              transform transition-transform duration-300 ease-in-out"
              style={{
                transform: modalSearch ? "translateX(0)" : "translateX(100%)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-800">
                  🎯 Filtros
                </h3>
                <button onClick={() => setModalSearch(false)}>
                  <IoClose className="text-zinc-500 hover:text-zinc-800 text-xl" />
                </button>
              </div>

              <input
                type="search"
                placeholder="🔍 Buscar Produto..."
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                <option value="">Todas as Lojas</option>
                <option value="Shopee">Shopee</option>
                <option value="Amazon">Amazon</option>
                <option value="Mercado Livre">Mercado Livre</option>
              </select>

              <div className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 pr-1 max-h-[60vh] mb-4">
                {categoryOptions.map((category) => (
                  <div key={category._id} className="mb-3">
                    <div
                      className="flex items-center justify-between cursor-pointer text-sm font-medium text-zinc-700 hover:text-blue-600"
                      onClick={() => toggleCategory(category._id)}
                    >
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="accent-blue-600 w-4 h-4"
                          checked={selectedCategories.some(
                            (c) => c._id === category._id
                          )}
                          onChange={() => handleCategoryToggle(category)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        {category.category}
                      </label>
                      {expandedCategories[category._id] ? (
                        <IoChevronUp className="text-zinc-500" />
                      ) : (
                        <IoChevronDown className="text-zinc-500" />
                      )}
                    </div>

                    {expandedCategories[category._id] && (
                      <div className="ml-5 mt-2 flex flex-col gap-1">
                        {getSubcategoriesForCategory(category._id).map(
                          (sub) => (
                            <label
                              key={sub._id}
                              className="flex items-center gap-2 text-sm text-zinc-600 hover:text-blue-500"
                            >
                              <input
                                type="checkbox"
                                className="accent-blue-600 w-4 h-4"
                                checked={selectedSubcategories.includes(
                                  sub._id
                                )}
                                onChange={() =>
                                  handleSubcategoryToggle(sub._id)
                                }
                              />
                              {sub.subCategory}
                            </label>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                className="mt-auto w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-all text-sm"
                onClick={() => {
                  fetchProducts();
                  setModalSearch(false);
                }}
              >
                ✅ Aplicar Filtro
              </button>
            </aside>
          </>
        )}

        <div>{renderProductCarousel()}</div>
      </div>
    </main>
  );
}

const ProductCard = ({ product }) => (
  <div className="bg-white border border-zinc-200 rounded overflow-hidden">
    <div className="relative">
      <img
        src={Array.isArray(product.photos) ? product.photos[0] : product.photos}
        alt={product.product}
        className="w-full aspect-square object-cover"
        loading="lazy"
      />
      <span
        className={`absolute top-0 right-0 text-sm font-medium rounded-bl-md px-2 py-1 ${
          product.store === "Mercado Livre"
            ? "bg-[#FFE600]"
            : product.store === "Shopee"
            ? "bg-[#EE4D2D] text-zinc-100"
            : product.store === "Amazon"
            ? "bg-[#00A0DC]"
            : "bg-white"
        }`}
      >
        {product.store}
      </span>
    </div>

    <div className="p-3">
      <h3 className="font-bold text-sm line-clamp-2 min-h-10">
        {product.product}
      </h3>
      <div className="mt-3">
        <Link
          to={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white flex items-center justify-center gap-1 py-1 px-2 font-bold text-sm hover:bg-blue-700 transition-colors"
        >
          <IoCart size={14} /> Comprar
        </Link>
        <div className="flex justify-between items-center mt-2">
          <span className="font-medium">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          <span className="text-zinc-700 text-xs">
            12x R$ {(product.price / 12).toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>
    </div>
  </div>
);
