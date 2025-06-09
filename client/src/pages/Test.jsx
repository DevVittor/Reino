import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiHome, FiSearch, FiGrid } from "react-icons/fi";
import { AiOutlineDashboard } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FreeMode, Pagination, Navigation } from "swiper/modules";

export default function Test() {
  const [products, setProducts] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const API = "https://reino-production.up.railway.app";
  const limit = windowWidth >= 768 ? 15 : 10;

  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
  }, [windowWidth]);

  useEffect(() => {
    fetchInitialData();
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page, windowWidth, selectedCategory]);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= fullHeight - 200 && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

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
  };

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/api/product/list/featured`);
      setFeaturedProducts(data.list || []);
    } catch (e) {
      console.error("Erro ao buscar destaques:", e);
      setFeaturedProducts([]);
    }
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
        </div>
      </div>

      <div className="flex-grow md:ml-[350px]">
        <div className="sticky top-0 flex justify-center items-center flex-col z-50 bg-[#3F2305]">
          <div className="flex justify-center items-center gap-1 w-full md:hidden px-3 py-1 bg-[#361500] border-b border-[#52280f]">
            <img src={Logo} alt="Logo" className="h-14" />
            <h2 className="text-4xl font-bold text-[#FFE99A]">Reino Animal</h2>
          </div>

          <div className="relative w-full max-w-6xl bg-[#361500] md:mt-2 md:p-2 p-1">
            <Swiper
              slidesPerView={"auto"}
              spaceBetween={5}
              freeMode={true}
              loop={true}
              modules={[FreeMode, Pagination, Navigation]}
              className=""
            >
              {featuredProducts.map((p) => (
                <SwiperSlide key={p._id} style={{ width: "auto" }}>
                  <div className="bg-[#070707] flex flex-col items-center rounded overflow-hidden h-full shadow-lg w-full">
                    <div className="flex justify-center items-center h-[200px] md:h-[300px] relative">
                      <img
                        src={Array.isArray(p.photos) ? p.photos[0] : p.photos}
                        alt={p.product}
                        className="h-full w-auto object-contain"
                      />
                      <div className="text-[#FFE99A] px-2 py-2 absolute bottom-0 bg-black/70 w-full">
                        <h2 className="font-semibold line-clamp-2 md:text-base text-sm md:leading-5 leading-4">
                          {p.product}
                        </h2>
                        <Link
                          to={p.link}
                          target="_blank"
                          className="mt-2 inline-block bg-amber-900 text-white py-1 px-3 rounded text-sm"
                        >
                          R$ {p.price.toFixed(2).replace(".", ",")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="columns-2 md:columns-5 md:gap-2 gap-1 md:px-2 md:pt-2 p-1">
          {products.map((p) => (
            <div
              key={p._id}
              className="break-inside-avoid md:mb-2 mb-1 bg-[#070707] overflow-hidden rounded"
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
    </div>
  );
}
