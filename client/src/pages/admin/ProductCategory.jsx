import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useSnackbar } from "notistack";

export default function ProductCategory() {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const API_URL = "https://reino-production.up.railway.app";

  // Buscar todos os dados (produtos, categorias, subcategorias)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes, subcategoriesRes] = await Promise.all([
        axios.get(`${API_URL}/product/mylist`),
        axios.get(`${API_URL}/category/list`),
        axios.get(`${API_URL}/subcategory/list`),
      ]);

      setProducts(productsRes.data.list);
      setCategories(categoriesRes.data.list);
      setSubcategories(subcategoriesRes.data.list);
    } catch (error) {
      showMessage("Erro ao carregar dados", "error");
      console.error("Erro no fetchData:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Atualizar produto selecionado
  useEffect(() => {
    if (selectedProductId) {
      const product = products.find((p) => p._id === selectedProductId);
      setSelectedProduct(product);
    }
  }, [selectedProductId, products]);

  const showMessage = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  // ========== MANIPULAÇÃO DE CATEGORIAS ========== //
  const handleAddCategory = async () => {
    if (!selectedProductId || !selectedCategory) {
      showMessage("Selecione um produto e uma categoria", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const adminId = jwtDecode(token)._id;

      await axios.post(`${API_URL}/category/add`, {
        adminId,
        productId: selectedProductId,
        categoryId: selectedCategory,
      });

      showMessage("Categoria adicionada com sucesso!", "success");
      fetchData(); // Recarrega os dados
      setSelectedCategory("");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Erro ao adicionar categoria";
      showMessage(errorMsg, "error");
      console.error("Erro ao adicionar categoria:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCategory = async (categoryId) => {
    if (!selectedProductId || !categoryId) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const adminId = jwtDecode(token)._id;

      await axios.patch(`${API_URL}/category/remove`, {
        adminId,
        productId: selectedProductId,
        categoryId,
      });

      showMessage("Categoria removida com sucesso!", "success");
      fetchData();
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Erro ao remover categoria";
      showMessage(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ========== MANIPULAÇÃO DE SUBCATEGORIAS ========== //
  const handleAddSubcategory = async () => {
    if (!selectedProductId || !selectedSubcategory) {
      showMessage("Selecione um produto e uma subcategoria", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const adminId = jwtDecode(token)._id;

      // **ENDPOINT CORRETO: `/subcategory/add`**
      const response = await axios.post(`${API_URL}/subcategory/add`, {
        adminId,
        productId: selectedProductId,
        subCategoryId: selectedSubcategory,
      });

      showMessage(
        response.data.message || "Subcategoria adicionada com sucesso!",
        "success"
      );

      // Atualização otimizada (sem recarregar tudo)
      setSelectedProduct((prev) => ({
        ...prev,
        subCategoryId: [...prev.subCategoryId, selectedSubcategory],
      }));
      setSelectedSubcategory("");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Erro ao adicionar subcategoria";
      showMessage(errorMsg, "error");
      console.error("Erro no handleAddSubcategory:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSubcategory = async (subcategoryId) => {
    if (!selectedProductId || !subcategoryId) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const adminId = jwtDecode(token)._id;

      await axios.patch(`${API_URL}/subcategory/remove`, {
        adminId,
        productId: selectedProductId,
        subCategoryId: subcategoryId,
      });

      showMessage("Subcategoria removida com sucesso!", "success");
      fetchData();
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Erro ao remover subcategoria";
      showMessage(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ========== RENDERIZAÇÃO ========== //
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">
        Gerenciar Categorias do Produto
      </h1>

      {/* Seletor de Produto */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Selecione um produto:</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          disabled={isLoading}
        >
          <option value="">Selecione um produto</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.product} (R$ {product.price.toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Seção de Categorias */}
          <div className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Categorias</h2>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Categorias vinculadas:</h3>
              {selectedProduct.categoryId?.length > 0 ? (
                <div className="space-y-2">
                  {selectedProduct.categoryId.map((catId) => {
                    const category = categories.find((c) => c._id === catId);
                    return (
                      <div
                        key={catId}
                        className="flex justify-between items-center bg-gray-50 p-2 rounded"
                      >
                        <span>
                          {category?.category || "Categoria não encontrada"}
                        </span>
                        <button
                          onClick={() => handleRemoveCategory(catId)}
                          className="text-red-500 hover:text-red-700 p-1"
                          disabled={isLoading}
                          title="Remover categoria"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Nenhuma categoria vinculada
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="block mb-2 font-medium">
                Adicionar categoria:
              </label>
              <div className="flex gap-2">
                <select
                  className="flex-1 p-2 border rounded"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={isLoading || !categories.length}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories
                    .filter(
                      (cat) => !selectedProduct.categoryId?.includes(cat._id)
                    )
                    .map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.category}
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleAddCategory}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
                  disabled={!selectedCategory || isLoading}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* Seção de Subcategorias */}
          <div className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Subcategorias</h2>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Subcategorias vinculadas:</h3>
              {selectedProduct.subCategoryId?.length > 0 ? (
                <div className="space-y-2">
                  {selectedProduct.subCategoryId.map((subId) => {
                    const subcategory = subcategories.find(
                      (s) => s._id === subId
                    );
                    return (
                      <div
                        key={subId}
                        className="flex justify-between items-center bg-gray-50 p-2 rounded"
                      >
                        <span>
                          {subcategory?.subCategory ||
                            "Subcategoria não encontrada"}
                        </span>
                        <button
                          onClick={() => handleRemoveSubcategory(subId)}
                          className="text-red-500 hover:text-red-700 p-1"
                          disabled={isLoading}
                          title="Remover subcategoria"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Nenhuma subcategoria vinculada
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="block mb-2 font-medium">
                Adicionar subcategoria:
              </label>
              <div className="flex gap-2">
                <select
                  className="flex-1 p-2 border rounded"
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  disabled={isLoading || !subcategories.length}
                >
                  <option value="">Selecione uma subcategoria</option>
                  {subcategories
                    .filter(
                      (sub) => !selectedProduct.subCategoryId?.includes(sub._id)
                    )
                    .map((subcategory) => (
                      <option key={subcategory._id} value={subcategory._id}>
                        {subcategory.subCategory}
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleAddSubcategory}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:bg-green-300"
                  disabled={!selectedSubcategory || isLoading}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
