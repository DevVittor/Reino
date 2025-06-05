import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useSnackbar } from "notistack";
import { GiSave } from "react-icons/gi";

const stores = [
  { key: "Shopee", label: "Shopee" },
  { key: "Amazon", label: "Amazon" },
  { key: "Mercado Livre", label: "Mercado Livre" },
];

export default function CreateProduct() {
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState(new Set([]));
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [userId, setUserId] = useState("");
  const [fileList, setFileList] = useState([]);
  const [formData, setFormData] = useState({
    product: "",
    price: "",
    store: "",
    link: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decode = jwtDecode(token);
      setUserId(decode._id);
    }

    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://reino.onrender.com/api/category/list"
        );
        setCategoryOptions(
          res.data.list.map((cat) => ({
            key: cat._id,
            label: cat.category,
          }))
        );
      } catch (error) {
        enqueueSnackbar("Erro ao carregar categorias", {
          variant: "error",
        });
      }
    };

    fetchCategories();
  }, [enqueueSnackbar]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setFileList(files);
  };

  const handleStoreChange = (e) => {
    const storeValue = e.target.value;
    setSelectedStore(storeValue);
    setFormData((prev) => ({ ...prev, store: storeValue }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const newCategories = new Set(categories);
    if (e.target.checked && newCategories.size < 3) {
      newCategories.add(value);
    } else if (!e.target.checked) {
      newCategories.delete(value);
    }
    setCategories(newCategories);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("adminId", userId);
    data.append("product", formData.product);
    data.append("price", Number(formData.price));
    data.append("store", formData.store);
    data.append("link", formData.link);
    Array.from(categories).forEach((category) =>
      data.append("categoryId[]", category)
    );
    fileList.forEach((file) => data.append("photos", file));

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://reino.onrender.com/api/product/create",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      enqueueSnackbar(`${response.data.msg}`, {
        variant: "success",
      });
      setFormData({ product: "", price: "", store: "", link: "" });
      setCategories(new Set([]));
      setSelectedStore("");
      setFileList([]);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.error || "Erro ao criar produto", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 md:py-5 md:px-3 p-2 flex-grow md:ml-[350px]">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Criar Produto</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Upload de Imagens */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagens (Máx: 3)
            </label>
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-48 cursor-pointer hover:bg-gray-50 transition">
              <input
                type="file"
                accept=".png, .webp, .jpg, .jpeg"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
              />
              <label
                htmlFor="fileUpload"
                className="text-center text-gray-500 cursor-pointer"
              >
                <p className="text-lg font-semibold">Clique para enviar</p>
                <p className="text-sm text-gray-400">
                  Arraste ou clique para selecionar
                </p>
              </label>
            </div>
            {fileList.length > 0 && (
              <ul className="mt-2 text-sm text-gray-500 list-disc pl-5">
                {fileList.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Produto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
              required
              placeholder="Camisa da Nike"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Preço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">R$</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Categorias */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categorias (Máx: 3) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
              {categoryOptions.map((cat) => (
                <label
                  key={cat.key}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    value={cat.key}
                    checked={categories.has(cat.key)}
                    onChange={handleCategoryChange}
                    disabled={categories.size >= 3 && !categories.has(cat.key)}
                    className="h-4 w-4 text-blue-500 rounded"
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>

          {/* Loja */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loja <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedStore}
              onChange={handleStoreChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              required
              placeholder="https://shopee.com.br/"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botão de Enviar */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
          >
            <GiSave className="text-lg" />
            {loading ? "Salvando..." : "Salvar Produto"}
          </button>
        </form>
      </div>
    </div>
  );
}
