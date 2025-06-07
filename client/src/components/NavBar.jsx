// NavBar.js
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { AiFillDashboard } from "react-icons/ai";
import { TbShoppingBagSearch } from "react-icons/tb";
import { IoClose, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import Logo from "../assets/icons/logo.png";

export default function NavBar({ onFilterChange }) {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  const [modalSearch, setModalSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

  const filterRef = useRef(null);
  const filterButtonRef = useRef(null);

  const API_URL = "https://reino-production.up.railway.app";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decode = jwtDecode(token);
      setUserId(decode._id);
      setRole(decode.role);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get(`${API_URL}/api/category/list`);
      setCategoryOptions(res.data.list);
    };

    const fetchSubcategories = async () => {
      const res = await axios.get(`${API_URL}/api/subcategory/list`);
      setSubcategories(res.data.list);
    };

    fetchCategories();
    fetchSubcategories();
  }, []);

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
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

  const applyFilters = () => {
    onFilterChange({
      searchTerm,
      selectedStore,
      selectedCategories,
      selectedSubcategories,
    });
    setModalSearch(false);
  };

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

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="flex items-center justify-center md:justify-between flex-wrap px-5 py-2 border-b border-zinc-200">
        <Link className="flex items-center gap-2" to="/">
          <img className="w-10" src={Logo} alt="Reino Animal" />
          <h1 className="text-4xl font-bold title_logo">Reino Animal</h1>
        </Link>

        <div className="flex gap-2 items-center">
          <button
            ref={filterButtonRef}
            onClick={() => setModalSearch(true)}
            className="md:hidden flex items-center gap-1 border border-zinc-200 px-3 py-1 rounded-full bg-white hover:bg-zinc-50 transition-colors text-sm"
          >
            <TbShoppingBagSearch />
            Filtros
          </button>

          {userId && role && (
            <Link
              className="flex items-center gap-1 border border-zinc-200 px-3 py-1 rounded-sm hover:bg-zinc-50"
              to="/painel"
            >
              <AiFillDashboard />
              Painel
            </Link>
          )}
        </div>
      </div>

      {modalSearch && (
        <div className="fixed inset-0 z-40 bg-white/80 backdrop-blur-md flex items-center justify-center p-3">
          <div
            ref={filterRef}
            className="w-[320px] max-h-[500px] overflow-auto bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-3 border border-zinc-200"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-zinc-800">
                🎯 Filtros
              </h3>
              <button onClick={() => setModalSearch(false)}>
                <IoClose className="text-xl text-zinc-500" />
              </button>
            </div>

            <input
              type="search"
              placeholder="🔍 Buscar Produto..."
              className="px-4 py-2 rounded-lg border bg-zinc-50 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-zinc-50 text-sm"
            >
              <option value="">Todas as Lojas</option>
              <option value="Shopee">Shopee</option>
              <option value="Amazon">Amazon</option>
              <option value="Mercado Livre">Mercado Livre</option>
            </select>

            <div className="overflow-y-auto max-h-64 pr-1">
              {categoryOptions.map((category) => (
                <div key={category._id} className="mb-2">
                  <div
                    className="flex justify-between items-center cursor-pointer text-sm font-medium"
                    onClick={() => toggleCategory(category._id)}
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-blue-600"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      {category.category}
                    </label>
                    {expandedCategories[category._id] ? (
                      <IoChevronUp />
                    ) : (
                      <IoChevronDown />
                    )}
                  </div>

                  {expandedCategories[category._id] && (
                    <div className="ml-5 mt-1">
                      {getSubcategoriesForCategory(category._id).map((sub) => (
                        <label
                          key={sub._id}
                          className="flex items-center gap-2 text-sm mb-1"
                        >
                          <input
                            type="checkbox"
                            className="accent-blue-600"
                            onChange={() => handleSubcategoryToggle(sub._id)}
                          />
                          {sub.subCategory}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
            >
              ✅ Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
