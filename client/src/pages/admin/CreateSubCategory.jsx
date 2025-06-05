import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

export default function CreateSubCategory() {
  const [adminId, setAdminId] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setAdminId(decoded._id);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://reino-animal.onrender.com/api/subcategory/create",
        {
          adminId,
          subCategory,
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
      <h1 className="text-2xl font-bold mb-4">Criar SubCategoria</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="mb-2">
          SubCategoria:
          <input
            type="text"
            value={subCategory}
            onChange={(event) => setSubCategory(event.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <Link
          className="mb-2 text-blue-500 hover:text-blue-700"
          to="/painel/categoria/criar"
        >
          Criar Categoria
        </Link>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Criar SubCategoria
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
}
