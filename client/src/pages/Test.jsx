import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiHome, FiSearch, FiGrid } from "react-icons/fi";
import { AiOutlineDashboard } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

export default function Test() {
  const [products, setProducts] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const API = "https://reino-production.up.railway.app";
  const limit = windowWidth >= 768 ? 15 : 10;

  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
  }, [windowWidth]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page, windowWidth]);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchInitialData = async () => {
    try {
      const [{ data: cat }, { data: sub }] = await Promise.all([
        axios.get(`${API}/api/category/list`),
        axios.get(`${API}/api/subcategory/list`),
      ]);
      setCategoryOptions(cat.list);
      setSubcategories(sub.list);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async (pageToFetch) => {
    if (loadingRef.current) return;
    if (!hasMore && pageToFetch !== 1) return;

    loadingRef.current = true;
    try {
      const params = { page: pageToFetch, limit };
      if (selectedCategory) params.categories = selectedCategory;

      const { data } = await axios.get(`${API}/api/product/list`, { params });

      if (pageToFetch === 1) {
        setProducts(data.list);
      } else {
        setProducts((prev) => {
          const newProducts = data.list.filter(
            (newP) => !prev.some((oldP) => oldP._id === newP._id)
          );
          return [...prev, ...newProducts];
        });
      }

      if (data.list.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (e) {
      console.error(e);
    }
    loadingRef.current = false;
  };

  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchProducts(1);
  }, [selectedCategory]);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        hasMore &&
        !loadingRef.current
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore]);

  const getSubFor = (catId) => {
    const cat = categoryOptions.find((c) => c._id === catId);
    if (!cat || !cat.subCategoryId) return [];
    return subcategories.filter((s) => cat.subCategoryId.includes(s._id));
  };

  return (
    <>
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
            className="fixed bottom-14 left-0 right-0  bg-[#3F2305] text-[#FFE99A] border-t border-[#52280f] p-4 z-40 max-h-[50vh] overflow-y-auto"
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
    </>
  );
}
