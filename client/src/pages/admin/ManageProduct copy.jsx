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

  const endpoint = "https://reino-production.up.railway.app";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${endpoint}/product/mylist`);
      setProducts(response.data.list);
    } catch (error) {
      showMessage("Erro ao buscar produtos", "error");
      console.error("Erro ao buscar produtos:", error);
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

      if (newPhotos.length > 0) {
        newPhotos.forEach((photo) => {
          data.append("photos", photo);
        });
      }

      const response = await axios.patch(`${endpoint}/product/update`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);

      showMessage("Produto atualizado com sucesso!", "success");
      fetchProducts();
      setNewPhotos([]);
    } catch (error) {
      showMessage("Erro ao atualizar produto", "error");
      console.error("Erro ao atualizar produto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProductId) return;

    const userConfirmed = window.confirm(
      `Tem certeza que deseja deletar o produto "${selectedProduct?.product}"?`
    );

    if (!userConfirmed) return;

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
      console.error("Erro ao deletar produto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex justify-center md:items-center items-start md:ml-[350px] p-2">
      <div className="md:max-w-md w-full mx-auto p-4 border border-zinc-200 rounded bg-white">
        <h1 className="text-2xl font-bold">Gerenciar Produto</h1>
        <Link
          className="text-zinc-500 font-light text-sm mb-6"
          to="/painel/produto/adicionar"
        >
          Adicionar Categorie e Subcategoria
        </Link>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Selecione o Produto:</label>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => setSelectedProductId(e.target.value)}
            value={selectedProductId}
            disabled={isLoading}
          >
            <option value="" disabled>
              Selecione um produto
            </option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.product} - R${product.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Nome do Produto:</label>
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                minLength={1}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Preço (R$):</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                step="0.01"
                min="0"
                required
                disabled={isLoading}
              />
              <span className="text-zinc-500 font-medium text-sm">
                Ex: 39,90(Não é possível usar ponto apenas virgula)
              </span>
            </div>

            <div>
              <label className="block mb-2 font-medium">Loja:</label>
              <select
                name="store"
                value={formData.store}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
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
              <label className="block mb-2 font-medium">Link:</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Nova Imagem (opcional):
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:bg-red-300"
                disabled={isLoading}
              >
                {isLoading ? "Processando..." : "Deletar Produto"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
