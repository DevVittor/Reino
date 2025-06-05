import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";

const stores = [
  { key: "Shopee", label: "Shopee" },
  { key: "Amazon", label: "Amazon" },
  { key: "Mercado Livre", label: "Mercado Livre" },
];

export default function ManageProduct() {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    product: "",
    price: 0,
    store: "",
    link: "",
  });
  const [newPhotos, setNewPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const endpoint = "https://reino-animal.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${endpoint}/product/mylist`);
      setProducts(response.data.list);
    } catch (error) {
      showMessage("Erro ao buscar produtos", "error");
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find((p) => p._id === selectedProductId);
      if (product) {
        setSelectedProduct(product);
        setFormData({
          product: product.product,
          price: product.price,
          store: product.store,
          link: product.link,
        });
      }
    }
  }, [selectedProductId, products]);

  const showMessage = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = (e) => {
    setNewPhotos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const decode = jwtDecode(token);
      const data = new FormData();

      data.append("adminId", decode._id);
      data.append("productId", selectedProductId);
      data.append("product", formData.product);
      data.append("price", formData.price);
      data.append("store", formData.store);
      data.append("link", formData.link);

      newPhotos.forEach((photo) => data.append("photos", photo));

      await axios.patch(`${endpoint}/product/update`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showMessage("Produto atualizado com sucesso!", "success");
      fetchProducts();
      setNewPhotos([]);
    } catch (error) {
      showMessage("Erro ao atualizar produto", "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProductId) return;
    const confirmed = window.confirm(
      `Deseja realmente deletar o produto "${selectedProduct?.product}"?`
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const decode = jwtDecode(token);
      await axios.delete(`${endpoint}/product/delete`, {
        data: {
          adminId: decode._id,
          productId: selectedProductId,
        },
      });
      showMessage("Produto deletado com sucesso!", "success");
      setSelectedProductId("");
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      showMessage("Erro ao deletar produto", "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-grow bg-gray-50 md:py-5 md:px-3 p-2 md:ml-[350px]">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow border">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🛠️ Gerenciar Produto
        </h1>
        <Link
          className="text-blue-500 underline text-sm block mb-6 hover:text-blue-700"
          to="/painel/categoria"
        >
          ➕ Adicionar Categoria e Subcategoria
        </Link>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Selecione um Produto:
          </label>
          <select
            className="w-full p-2 border rounded shadow-sm"
            onChange={(e) => setSelectedProductId(e.target.value)}
            value={selectedProductId}
            disabled={isLoading}
          >
            <option value="" disabled>
              Escolha um produto
            </option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.product} - R${product.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome:
              </label>
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleInputChange}
                className="w-full p-2 border rounded shadow-sm"
                required
                minLength={1}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$):
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded shadow-sm"
                step="0.01"
                min="0"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use ponto para decimais. Ex: 39.90
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loja:
              </label>
              <select
                name="store"
                value={formData.store}
                onChange={handleInputChange}
                className="w-full p-2 border rounded shadow-sm"
                required
                disabled={isLoading}
              >
                <option value="" disabled>
                  Selecione uma loja
                </option>
                {stores.map((store) => (
                  <option key={store.key} value={store.key}>
                    {store.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link:
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full p-2 border rounded shadow-sm"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nova Imagem (opcional):
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
