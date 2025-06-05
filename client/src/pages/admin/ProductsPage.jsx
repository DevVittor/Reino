import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 5;
  const page = 1;

  useEffect(() => {
    const getProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://reino.onrender.com/api/product/list?limit=${limit}&page=${page}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(response.data.list || []);
        setError(null);
        setLoading(false);
      } catch (error) {
        setProducts([]);
        setError(error.response?.data?.error || "Erro ao carregar produtos.");
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return (
    <div className="flex justify-center items-center flex-col flex-grow bg-gray-50 px-4 py-8 md:ml-[350px]">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🛒 Lista de Produtos
        </h1>

        {loading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">
            Carregando produtos...
          </div>
        ) : error ? (
          <div className="text-center text-red-600 font-medium py-10">
            {error}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-3 gap-2">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 p-5 border border-gray-100"
              >
                <h2
                  className="text-xl font-semibold text-gray-800 truncate mb-2"
                  title={product.product}
                >
                  {product.product || "Produto sem nome"}
                </h2>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium text-gray-700">Preço:</span> R${" "}
                  {product.price?.toFixed(2) || "N/A"}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Loja:</span>{" "}
                  {product.store || "N/A"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Nenhum produto encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
