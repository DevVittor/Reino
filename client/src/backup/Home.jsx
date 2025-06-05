import axios from "axios";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { IoCart } from "react-icons/io5";
import { Link } from "react-router-dom";
import LoadingContent from "../components/LoadingContent";
import { IoFilter } from "react-icons/io5";
//import Whatsapp from "../components/Whatsapp";

const categoriasPetshop = [
  "Gato",
  "Cachorro",
  "Pássaros",
  "Tapete Gelado",
  "Grades de Proteção",
  "Pó Higiênico",
  "Ração Seca",
  "Ração Úmida",
  "Petiscos",
  "Brinquedos",
  "Camas",
  "Casinhas",
  "Coleiras",
  "Guias",
  "Peitorais",
  "Roupas",
  "Acessórios de Passeio",
  "Higiene e Limpeza",
  "Shampoos",
  "Condicionadores",
  "Escovas e Pentes",
  "Cortes de Unha",
  "Tapetes Higiênicos",
  "Fraldas",
  "Caixas de Transporte",
  "Gaiolas",
  "Aquários",
  "Filtros para Aquário",
  "Comedouros",
  "Bebedouros",
  "Suplementos",
  "Medicamentos",
  "Antipulgas",
  "Vermífugos",
  "Banho e Tosa",
  "Serviços de Adestramento",
];

export default function Teste() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [openFilter, setOpenFilter] = useState(false);
  const [fetchedPages, setFetchedPages] = useState(new Set());
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const filterRef = useRef(null);
  const filterButtonRef = useRef(null);

  const urlBack = "https://reino-animal.onrender.com";

  const getDataProducts = useCallback(
    async (pageNum) => {
      if (fetchedPages.has(pageNum) || !hasMore || loading) return;

      try {
        setLoading(true);
        console.log(`Buscando página ${pageNum} com filtros:`, {
          searchTerm,
          selectedStore,
          selectedCategories,
        });

        const response = await axios.get(`${urlBack}/api/product/list`, {
          params: {
            page: pageNum,
            limit: 21,
            search: searchTerm || undefined,
            store: selectedStore || undefined,
            categories: selectedCategories.join(",") || undefined,
          },
          timeout: 10000,
        });

        console.log("Resposta do backend:", response.data);

        const newProducts = response.data.list || [];
        if (!newProducts.length || newProducts.length < 21) {
          setHasMore(false);
          console.log("Não há mais produtos para carregar.");
        }

        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const filteredNewProducts = newProducts.filter(
            (p) => !existingIds.has(p._id)
          );
          console.log("Novos produtos adicionados:", filteredNewProducts);
          return [...prev, ...filteredNewProducts];
        });

        setFetchedPages((prev) => new Set(prev).add(pageNum));
      } catch (error) {
        console.error(
          "Erro ao buscar produtos:",
          error.response?.data || error.message
        );
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [fetchedPages, hasMore, searchTerm, selectedStore, selectedCategories]
  );

  useEffect(() => {
    console.log("Carregamento inicial...");
    getDataProducts(1);
  }, [getDataProducts]);

  useEffect(() => {
    console.log("Filtros mudaram, resetando...");
    setPage(1);
    setProducts([]);
    setFetchedPages(new Set());
    setHasMore(true);
    getDataProducts(1);
  }, [searchTerm, selectedStore, selectedCategories]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      !loading &&
      hasMore
    ) {
      setPage((prev) => {
        const nextPage = prev + 1;
        console.log("Incrementando página para:", nextPage);
        return nextPage;
      });
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (page > 1 && !loading) {
      getDataProducts(page);
    }
  }, [page, getDataProducts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setOpenFilter(false);
      }
    };
    if (openFilter) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openFilter]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleFilterClick = (e) => {
    e.stopPropagation(); // Impede que o clique no filtro propague para o botão
  };

  return (
    <div className="flex justify-start items-center flex-col md:gap-3 gap-2 flex-1 md:p-3 p-2">
      <div className="w-full flex">
        <div className="flex md:justify-start justify-center items-center flex-wrap w-auto md:h-[30px] h-auto border border-zinc-800">
          <button
            ref={filterButtonRef}
            className="h-full px-3 relative md:order-1 order-2 bg-escuro"
            onClick={() => setOpenFilter(!openFilter)}
          >
            <IoFilter className="text-zinc-100" />
            {openFilter && (
              <div
                ref={filterRef}
                className="absolute z-10 top-full md:left-0 right-0 mt-3 p-2 bg-escuro text-zinc-100 font-medium overflow-y-auto h-[400px] w-[300px] rounded-md border border-zinc-800"
                onClick={handleFilterClick} // Impede propagação do clique
              >
                <h3 className="font-semibold text-zinc-100 text-lg text-left mb-2">
                  Filtro:
                </h3>
                {categoriasPetshop.map((item, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(item)}
                      onChange={() => handleCategoryChange(item)}
                    />
                    <span className="font-medium text-zinc-100">{item}</span>
                  </label>
                ))}
              </div>
            )}
          </button>
          <input
            className="px-3 md:py-0 py-1 h-full outline-none font-medium text-zinc-100 bg-escuro border-x border-zinc-800 md:order-2 order-1 md:w-auto flex-grow md:flex-grow-0"
            type="search"
            placeholder="Buscar Produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-3 h-full md:block hidden bg-escuro font-medium text-zinc-100 text-center hover:cursor-pointer outline-none order-3"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            <option value="">Todas as Lojas</option>
            <option value="Shopee">Shopee</option>
            <option value="Amazon">Amazon</option>
            <option value="Mercado Livre">Mercado Livre</option>
          </select>
        </div>
      </div>
      <div className="grid 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 flex-wrap gap-2">
        {products.length > 0
          ? products.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-2 bg-zinc-900 border border-zinc-800"
              >
                <div className="relative">
                  <img
                    className="aspect-square object-cover"
                    src={
                      Array.isArray(item.photos) ? item.photos[0] : item.photos
                    }
                    alt={item.product}
                  />
                  <span className="absolute top-0 right-0 px-3 py-1 rounded-bl-md text-sm bg-red-500 text-white font-medium">
                    R$ {item.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="px-3 line-clamp-2">
                  <h3
                    className="font-bold text-white text-sm"
                    title={item.product}
                  >
                    {item.product}
                  </h3>
                </div>
                <hr className="border-zinc-700 w-full" />
                <div className="px-3 pb-2 flex justify-between items-center">
                  <Link
                    to={item.link}
                    target="_blank"
                    className="flex justify-center items-center gap-1 px-3 py-1 bg-white font-bold rounded-sm"
                  >
                    <IoCart />
                    Comprar
                  </Link>
                  <span className="text-zinc-100 font-medium">
                    {item.store}
                  </span>
                </div>
              </div>
            ))
          : !loading && (
              <div className="w-full text-center py-4 text-zinc-100">
                Nenhum produto encontrado.
              </div>
            )}
      </div>

      {loading && (
        <div className="flex-1 flex justify-center items-center w-full py-4">
          <LoadingContent />
        </div>
      )}
      {!hasMore && products.length > 0 && (
        <div className="w-full text-center py-4 text-zinc-100">
          Não há mais produtos para carregar.
        </div>
      )}
      {/*<Whatsapp
        title={"Fale Conosco"}
        contact={"21988343583"}
        message={"Estou com um problema"}
      />*/}
    </div>
  );
}
