import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decode = jwtDecode(token);
      setUserId(decode._id);
    }
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://reino-production.up.railway.app/api/user/list?adminId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data.list || []);
        setUsersLoading(false);
        setUsersError(null);
      } catch (error) {
        setUsers([]);
        setUsersError(
          error.response?.data?.error || "Erro ao carregar usuários."
        );
        setUsersLoading(false);
      }
    };

    if (userId) getUsers();
  }, [userId]);

  return (
    <div className="flex justify-center md:items-center items-start flex-grow md:px-6 px-4 py-6 md:ml-[350px] bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          Lista de Usuários
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 border-b">Usuário</th>
                <th className="px-4 py-3 border-b">Email</th>
                <th className="px-4 py-3 border-b">Cargo</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {usersLoading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-blue-500"
                  >
                    ⏳ Carregando usuários...
                  </td>
                </tr>
              ) : usersError ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-red-500"
                  >
                    ❌ {usersError}
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 border-b">
                      {user.username || "N/A"}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-4 py-2 border-b">{user.role || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
