import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Marquee from "react-fast-marquee";

export default function SubCategoryManager() {
  const [subCategories, setSubCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState("");
  const [subCategoryIdToDelete, setSubCategoryIdToDelete] = useState("");
  const [subCategoryNameToRename, setSubCategoryNameToRename] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [adminId, setAdminId] = useState("");

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(
        "https://reino-animal.onrender.com/api/subcategory/list"
      );
      setSubCategories(response.data.list);
    } catch (error) {
      console.error("Erro ao buscar subcategorias:", error);
    }
  };

  const fetchAdminId = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decode = jwtDecode(token);
        setAdminId(decode._id);
      } catch (error) {
        console.error("Erro ao buscar adminId:", error);
      }
    }
  };

  const addSubCategory = async () => {
    try {
      const response = await axios.post(
        "https://reino-animal.onrender.com/api/subcategory/create",
        {
          subCategory: newSubCategory,
          adminId,
        }
      );
      alert(response.data.msg);
      fetchSubCategories();
    } catch (error) {
      console.error("Erro ao adicionar subcategoria:", error);
    }
  };

  const renameSubCategory = async () => {
    try {
      const response = await axios.patch(
        "https://reino-animal.onrender.com/api/subcategory/alter",
        {
          subCategoryId: selectedSubCategoryId,
          newSubCategory: subCategoryNameToRename,
          adminId,
        }
      );
      alert(response.data.msg);
      fetchSubCategories();
    } catch (error) {
      console.error("Erro ao renomear subcategoria:", error);
    }
  };

  const deleteSubCategory = async () => {
    try {
      const response = await axios.delete(
        "https://reino-animal.onrender.com/api/subcategory/delete",
        {
          data: { subCategoryId: subCategoryIdToDelete, adminId },
        }
      );
      alert(response.data.msg);
      fetchSubCategories();
    } catch (error) {
      console.error("Erro ao deletar subcategoria:", error);
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchAdminId();
  }, []);

  return (
    <div className="flex flex-grow justify-center md:items-center items-start md:ml-[350px] md:px-3 md:py-5 p-2">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg border border-zinc-200">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Gerenciador de Subcategorias
        </h1>

        <div className="space-y-8">
          {/*<div>
          <h2 className="text-2xl font-semibold text-gray-700">
            Lista de Subcategorias
          </h2>
          <Marquee
            className="py-2"
            direction="right"
            speed={40}
            autoFill={true}
            pauseOnHover={true}
          >
            {subCategories.map((subCategory) => (
              <span
                className="mx-1 hover:cursor-pointer text-gray-600 py-1 px-2 border border-zinc-200 rounded"
                key={subCategory._id}
              >
                {subCategory.subCategory}
              </span>
            ))}
          </Marquee>
          <ul className="list-disc pl-5 mt-4 space-y-2"></ul>
        </div>*/}

          <div>
            <h2 className="text-2xl font-semibold text-gray-700">
              Adicionar Nova Subcategoria
            </h2>
            <input
              type="text"
              value={newSubCategory}
              onChange={(e) => setNewSubCategory(e.target.value)}
              placeholder="Nome da subcategoria"
              className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={addSubCategory}
              className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Adicionar
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-700">
              Renomear Subcategoria
            </h2>
            <input
              type="text"
              value={subCategoryNameToRename}
              onChange={(e) => setSubCategoryNameToRename(e.target.value)}
              placeholder="Novo nome da subcategoria"
              className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              onChange={(e) => setSelectedSubCategoryId(e.target.value)}
              className="mt-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecione uma subcategoria</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.subCategory}
                </option>
              ))}
            </select>
            <button
              onClick={renameSubCategory}
              className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Renomear
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-700">
              Deletar Subcategoria
            </h2>
            <select
              onChange={(e) => setSubCategoryIdToDelete(e.target.value)}
              className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecione uma subcategoria para deletar</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.subCategory}
                </option>
              ))}
            </select>
            <button
              onClick={deleteSubCategory}
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
