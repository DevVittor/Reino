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
  const [categoryOptions, setCategoryOptions] = useState([]); // ← categorias do backend
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
          "https://reino-production.up.railway.app/api/category/list"
        );
        // Aqui estou assumindo que o campo correto é `category` e não `name`
        setCategoryOptions(
          res.data.list.map((cat) => ({
            key: cat._id,
            label: cat.category, // Corrigido para usar `category` ao invés de `name`
          }))
        );
      } catch (error) {
        console.error("Erro ao buscar categorias", error);
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
        "https://reino-production.up.railway.app/api/product/create",
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
    <div className="flex md:justify-center justify-start items-center flex-col gap-3 md:ml-[350px] flex-grow">
      <div className="flex w-full max-w-md flex-col gap-4 p-2">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:gap-4 gap-2 w-full bg-white border border-zinc-200 p-3 rounded-md"
        >
          {/* Upload de Imagens */}
          <div className="flex flex-col items-center">
            <label className="text-center text-sm font-medium mb-1 flex justify-center items-center border-dashed border-2 w-full h-[200px] rounded-2xl hover:cursor-pointer border-zinc-200">
              <div className="flex justify-center items-center flex-col gap-1">
                <h3 className="font-semibold text-lg text-zinc-700">
                  Upload de Imagens
                </h3>
                <span className="text-zinc-700 font-light text-sm">
                  Imagens (Máx: 3)
                </span>
              </div>
              <input
                type="file"
                accept=".png, .webp, .jpg, .jpeg"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {fileList.length > 0 && (
              <ul className="mt-2 text-sm text-gray-300">
                {fileList.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Campo Produto */}
          <div className="flex flex-col">
            <label htmlFor="product" className="block text-sm font-medium mb-1">
              Produto <span className="text-red-500">*</span>
            </label>
            <input
              id="product"
              type="text"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
              required
              placeholder="Camisa da Nike"
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md"
            />
          </div>

          {/* Campo Preço */}
          <div className="flex flex-col">
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Preço <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                R$
              </span>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
                className="w-full pl-8 pr-3 py-2 bg-white border border-zinc-200 rounded-md"
              />
            </div>
          </div>

          {/* Seleção de Categorias */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1">
              Categorias (Máx: 3) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto bg-white p-2 rounded-md border border-zinc-200">
              {categoryOptions.map((categorie) => (
                <label
                  key={categorie.key}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    value={categorie.key}
                    checked={categories.has(categorie.key)}
                    onChange={handleCategoryChange}
                    disabled={
                      categories.size >= 3 && !categories.has(categorie.key)
                    }
                    className="h-4 w-4 text-blue-500 border-gray-600 rounded"
                  />
                  {categorie.label}
                </label>
              ))}
            </div>
          </div>

          {/* Seleção de Loja */}
          <div className="flex flex-col">
            <label htmlFor="store" className="block text-sm font-medium mb-1">
              Loja <span className="text-red-500">*</span>
            </label>
            <select
              id="store"
              name="store"
              value={selectedStore}
              onChange={handleStoreChange}
              required
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md"
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

          {/* Campo Link */}
          <div className="flex flex-col">
            <label htmlFor="link" className="block text-sm font-medium mb-1">
              Link <span className="text-red-500">*</span>
            </label>
            <input
              id="link"
              type="url"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              required
              placeholder="https://shopee.com.br/"
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md"
            />
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center gap-2 bg-blue-500 text-white font-bold w-full px-4 py-2 rounded-md mt-2 disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            <GiSave />
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>
    </div>
  );
}
