import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

export default function CreateCategory() {
  const [adminId, setAdminId] = useState("");
  const [category, setCategory] = useState("");
  const [subCategoryIds, setSubCategoryIds] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setAdminId(decoded._id);
    }

    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(
          "https://reino-production.up.railway.app/api/subcategory/list"
        );
        setSubCategories(response.data.list);
      } catch (error) {
        setError(error.response.data.error);
      }
    };

    fetchSubCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://reino-production.up.railway.app/api/category/create",
        {
          adminId,
          category,
          subCategoryIds,
        }
      );
      setSuccess(response.data.msg);
      setError(null);
    } catch (error) {
      setError(error.response.data.error);
      setSuccess(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {subCategories.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="flex flex-col justify-center items-center flex-wrap gap-1">
            <h1 className="text-2xl font-bold">Criar SubCategoria</h1>
            <span className="font-medium text-red-500 text-center leading-5">
              É necessário ter pelo menos uma subcategoria cadastrada
            </span>
          </div>
          <Link
            to="/painel/subcategoria/criar"
            className="bg-blue-500 hover:bg-blue-700 transition-colors ease-linear duration-150 rounded px-3 py-1 text-white border border-blue-600 hover:border-blue-900 inline-block"
          >
            Criar subcategoria
          </Link>
        </div>
      ) : (
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-4">Criar Categoria</h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="mb-2">
              Categoria:
              <input
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={`${
                  subCategories.length === 0 ? "cursor-not-allowed" : ""
                } w-full p-2 border border-zinc-200 rounded`}
              />
            </label>
            <label className="mb-2">
              <span className="block font-medium mb-1">Subcategorias:</span>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto border border-zinc-200 p-2 rounded">
                {subCategories.map((subCategory) => (
                  <label
                    key={subCategory._id}
                    className="inline-flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={subCategory._id}
                      checked={subCategoryIds.includes(subCategory._id)}
                      onChange={(event) => {
                        const { checked, value } = event.target;
                        setSubCategoryIds((prev) =>
                          checked
                            ? [...prev, value]
                            : prev.filter((id) => id !== value)
                        );
                      }}
                      className="form-checkbox"
                    />
                    <span>{subCategory.subCategory}</span>
                  </label>
                ))}
              </div>
              <Link
                to="/painel/subcategoria/criar"
                className="text-blue-500 hover:text-blue-700 mt-2 rounded px-3 py-1 border border-zinc-200 inline-block"
              >
                Criar subcategoria
              </Link>
            </label>
            <button
              type="submit"
              className={`${
                subCategories.length === 0
                  ? "bg-white text-zinc-500"
                  : "bg-blue-500 hover:bg-blue-700 text-white"
              }  font-bold py-2 px-4 rounded`}
            >
              Criar Categoria
            </button>
          </form>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
}
