import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function BackupManageProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    product: "",
    price: "",
    store: "",
    link: "",
    categoryId: [],
    photos: [],
  });
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [adminId, setAdminId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setAdminId(decoded._id);
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://reino-production.up.railway.app/api/product/list"
        );
        setProducts(response.data.list);
      } catch (error) {
        setError("Erro ao carregar os produtos", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://reino-production.up.railway.app/api/category/list"
        );
        setCategories(response.data.list);
      } catch (error) {
        setError("Nenhuma categoria encontrada.", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleProductChange = (event) => {
    const selectedProductId = event.target.value;
    const selected = products.find(
      (product) => product._id === selectedProductId
    );

    if (selected) {
      setSelectedProduct(selected);
      setFormData({
        product: selected.product || "",
        price: selected.price || "",
        store: selected.store || "",
        link: selected.link || "",
        categoryId: selected.categoryId || [],
        photos: selected.photos || [],
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        product: "",
        price: "",
        store: "",
        link: "",
        categoryId: [],
        photos: [],
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = () => {
    if (newCategory && !formData.categoryId.includes(newCategory)) {
      if (formData.categoryId.length < 5) {
        setFormData((prev) => ({
          ...prev,
          categoryId: [...prev.categoryId, newCategory],
        }));
        setNewCategory("");
      } else {
        setError("Você pode adicionar no máximo 5 categorias.");
      }
    }
  };

  const handleRemoveCategory = (categoryIdToRemove) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: prev.categoryId.filter((id) => id !== categoryIdToRemove),
    }));
  };

  const handleDelete = async () => {
    try {
      await axios.post(
        "https://reino-production.up.railway.app/api/product/delete",
        {
          productId: selectedProduct._id,
          adminId: adminId,
        }
      );
      setSuccess("Produto deletado com sucesso!");
      setSelectedProduct(null);
      const response = await axios.get(
        "https://reino-production.up.railway.app/api/product/list"
      );
      setProducts(response.data.list);
    } catch (error) {
      setError("Erro ao deletar o produto.", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.patch(
        "https://reino-production.up.railway.app/api/product/update",
        {
          adminId: adminId,
          productId: selectedProduct._id,
          ...formData,
        }
      );

      setSuccess("Produto atualizado com sucesso!");
      const updatedProducts = products.map((p) =>
        p._id === selectedProduct._id ? response.data.updatedProduct : p
      );
      setProducts(updatedProducts);
      setSelectedProduct(response.data.updatedProduct);
    } catch (error) {
      setError(`Erro ao atualizar o produto. Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Produto</h1>

      <div className="mb-4">
        <label className="block mb-2">Escolha um Produto</label>
        <select
          onChange={handleProductChange}
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedProduct?._id || ""}
        >
          <option value="">Selecione um produto</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.product}
            </option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4 space-y-4">
            <h2 className="font-semibold text-lg">Editar Produto</h2>

            <div>
              <label className="block mb-1">Nome do Produto</label>
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Preço</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                step="0.01"
              />
            </div>

            <div>
              <label className="block mb-1">Loja</label>
              <input
                type="text"
                name="store"
                value={formData.store}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Link</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Categorias</label>
              <div className="flex mb-2">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded mr-2"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.category}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={!newCategory}
                >
                  Adicionar
                </button>
              </div>

              <div className="space-y-2">
                {formData.categoryId.map((categoryId) => {
                  const category = categories.find((c) => c._id === categoryId);
                  return (
                    <div
                      key={categoryId}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded"
                    >
                      <span>
                        {category?.name || "Categoria não encontrada"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(categoryId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remover
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Salvar Alterações
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Deletar Produto
            </button>
          </div>
        </form>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
}
