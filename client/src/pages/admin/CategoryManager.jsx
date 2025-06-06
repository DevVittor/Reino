import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useSnackbar } from "notistack";

export default function CategoryManager() {
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState([]);
  const [adminId, setAdminId] = useState("");
  const [categoryNameToRename, setCategoryNameToRename] = useState("");
  const [categoryIdToDelete, setCategoryIdToDelete] = useState("");
  const [assignedSubcategoryIds, setAssignedSubcategoryIds] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://reino-production.up.railway.app/api/category/list"
      );
      setCategories(response.data.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Não encontramos nenhuma categoria.", {
        variant: "error",
      });
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(
        "https://reino-production.up.railway.app/api/subcategory/list"
      );
      setSubcategories(response.data.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Erro ao buscar subcategorias", { variant: "error" });
    }
  };

  const fetchAdminId = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decode = jwtDecode(token);
        setAdminId(decode._id);
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Erro ao decodificar o token", { variant: "error" });
      }
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      enqueueSnackbar("Digite o nome da categoria", { variant: "warning" });
      return;
    }

    try {
      const response = await axios.post(
        "https://reino-production.up.railway.app/api/category/create",
        {
          category: newCategory,
          adminId,
          subCategoryIds: [],
        }
      );
      enqueueSnackbar(response.data.msg || "Categoria adicionada", {
        variant: "success",
      });
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Erro ao adicionar categoria", { variant: "error" });
    }
  };

  const addSubCategories = async () => {
    try {
      for (const subCategoryId of selectedSubCategoryIds) {
        await axios.patch(
          "https://reino-production.up.railway.app/api/category/add-subcategory",
          {
            adminId,
            categoryId: selectedCategoryId,
            subCategoryId,
          }
        );
      }
      enqueueSnackbar("Subcategorias adicionadas com sucesso", {
        variant: "success",
      });
      setSelectedSubCategoryIds([]);
      fetchCategories();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Erro ao adicionar subcategorias", { variant: "error" });
    }
  };

  const renameCategory = async () => {
    if (!categoryNameToRename.trim()) {
      enqueueSnackbar("Digite o novo nome da categoria", {
        variant: "warning",
      });
      return;
    }

    try {
      const response = await axios.patch(
        "https://reino-production.up.railway.app/api/category/alter",
        {
          categoryId: selectedCategoryId,
          newName: categoryNameToRename,
          adminId,
        }
      );
      enqueueSnackbar(response.data.msg || "Categoria renomeada", {
        variant: "success",
      });
      setCategoryNameToRename("");
      fetchCategories();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Erro ao renomear categoria", { variant: "error" });
    }
  };

  const deleteCategory = async () => {
    try {
      const response = await axios.delete(
        "https://reino-production.up.railway.app/api/category/delete",
        {
          data: { categoryId: categoryIdToDelete, adminId },
        }
      );
      enqueueSnackbar(response.data.msg || "Categoria deletada", {
        variant: "success",
      });
      setCategoryIdToDelete("");
      fetchCategories();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Erro ao deletar categoria", { variant: "error" });
    }
  };

  const handleSubCategorySelection = (id) => {
    setSelectedSubCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((subId) => subId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchAdminId();
  }, []);

  useEffect(() => {
    const selectedCategory = categories.find(
      (cat) => cat._id === selectedCategoryId
    );
    if (selectedCategory && Array.isArray(selectedCategory.subCategoryId)) {
      setAssignedSubcategoryIds(selectedCategory.subCategoryId);
    } else {
      setAssignedSubcategoryIds([]);
    }
    setSelectedSubCategoryIds([]);
  }, [selectedCategoryId, categories]);

  return (
    <div className="flex flex-grow justify-center items-center md:ml-[350px] md:py-5 md:px-3 p-2">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg border border-zinc-200">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Gerenciador de Categorias
        </h1>

        <div className="space-y-8">
          {/*<div>
            <h2 className="text-2xl font-semibold text-gray-700">
              Lista de Categorias
            </h2>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              {categories.map((category) => (
                <li key={category._id} className="text-gray-600">
                  {category.category} -{" "}
                  {Array.isArray(category.subCategoryId)
                    ? category.subCategoryId.length + " subcategorias"
                    : "Sem subcategorias"}
                </li>
              ))}
            </ul>
          </div>*/}

          <div>
            <h2 className="text-2xl font-semibold text-gray-700">
              Adicionar Nova Categoria
            </h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nome da categoria"
              className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={addCategory}
              className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Adicionar
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-700">
              Adicionar SubCategorias à Categoria
            </h2>
            <select
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              value={selectedCategoryId}
              className="mt-2 w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category}
                </option>
              ))}
            </select>

            {selectedCategoryId && (
              <div className="mt-4 grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {subcategories.map((sub) => {
                  const isAssigned = assignedSubcategoryIds.includes(sub._id);
                  return (
                    <div
                      key={sub._id}
                      className={`flex items-center space-x-2 ${
                        isAssigned ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={sub._id}
                        checked={
                          isAssigned || selectedSubCategoryIds.includes(sub._id)
                        }
                        onChange={() =>
                          !isAssigned && handleSubCategorySelection(sub._id)
                        }
                        className="form-checkbox"
                        disabled={isAssigned}
                      />
                      <span>{sub.subCategory}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={addSubCategories}
              disabled={
                !selectedCategoryId || selectedSubCategoryIds.length === 0
              }
              className="mt-4 w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Adicionar SubCategorias
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-700">
              Renomear Categoria
            </h2>
            <input
              type="text"
              value={categoryNameToRename}
              onChange={(e) => setCategoryNameToRename(e.target.value)}
              placeholder="Novo nome da categoria"
              className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              value={selectedCategoryId}
              className="mt-4 w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category}
                </option>
              ))}
            </select>
            <button
              onClick={renameCategory}
              className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Renomear
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-700">
              Deletar Categoria
            </h2>
            <select
              onChange={(e) => setCategoryIdToDelete(e.target.value)}
              value={categoryIdToDelete}
              className="mt-2 w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="">Selecione uma categoria para deletar</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category}
                </option>
              ))}
            </select>
            <button
              onClick={deleteCategory}
              className="mt-4 w-full py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
