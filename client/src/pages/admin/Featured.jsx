import axios from "axios";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Featured() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decode = jwtDecode(token);
      if (decode._id && decode.role === "admin") {
        setUserId(decode._id);
      }
    }
  }, []);

  useEffect(() => {
    getInfoProduct();
  }, []);

  const featuredProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `https://reino-animal.onrender.com/api/product/featured?productId=${selectedProductId}&adminId=${userId}`
      );
      console.log(response.data);
      setTimeout(() => {
        getInfoProduct();
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Erro ao destacar produto:", error.message);
    }
  };

  const getInfoProduct = async () => {
    try {
      const response = await axios.get(
        "https://reino-animal.onrender.com/api/product/list/unlocks"
      );
      setProducts(response.data.list);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error.message);
    }
  };

  const handleProductId = (event) => {
    setSelectedProductId(event.target.value);
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-zinc-900 md:ml-[350px] md:px-3 md:py-5 p-2">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-md p-6 space-y-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">
            ✨ Destacar Produto
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Escolha um produto para marcar como destaque.
          </p>
        </div>

        <form onSubmit={featuredProduct} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Produto:
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg shadow-sm bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleProductId}
              value={selectedProductId}
              required
            >
              <option value="" disabled>
                Selecione um produto
              </option>
              {products.map((product) => (
                <option
                  key={product._id}
                  value={product._id}
                  className={
                    product.featured ? "text-blue-600" : "text-red-600"
                  }
                >
                  {product.product || "Sem nome"}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded-lg"
          >
            Marcar como Destaque
          </button>
        </form>
      </div>
    </div>
  );
}
