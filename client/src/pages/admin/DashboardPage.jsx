import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardPage() {
  const [data, setData] = useState({
    productsCount: 0,
    categoriesCount: 0,
    subcategoriesCount: 0,
    categoryDistribution: {
      labels: [],
      datasets: [],
    },
    subcategoryDistribution: {
      labels: [],
      datasets: [],
    },
  });

  useEffect(() => {
    // Simulando uma requisição para obter os dados
    setData({
      productsCount: 120,
      categoriesCount: 8,
      subcategoriesCount: 25,
      categoryDistribution: {
        labels: [
          "Eletrônicos",
          "Roupas",
          "Móveis",
          "Alimentos",
          "Beleza",
          "Livros",
          "Brinquedos",
          "Ferramentas",
        ],
        datasets: [
          {
            label: "Quantidade de Produtos por Categoria",
            data: [30, 20, 15, 10, 8, 7, 5, 25],
            backgroundColor: [
              "#FF5733",
              "#33FF57",
              "#3357FF",
              "#FF33A1",
              "#A133FF",
              "#33FFF5",
              "#FF8C33",
              "#5E17EB",
            ],
          },
        ],
      },
      subcategoryDistribution: {
        labels: [
          "Subcat 1",
          "Subcat 2",
          "Subcat 3",
          "Subcat 4",
          "Subcat 5",
          "Subcat 6",
          "Subcat 7",
          "Subcat 8",
          "Subcat 9",
          "Subcat 10",
        ],
        datasets: [
          {
            label: "Produtos por Subcategoria",
            data: [10, 15, 8, 12, 6, 9, 7, 5, 4, 3],
            backgroundColor: [
              "#FF5733",
              "#33FF57",
              "#3357FF",
              "#FF33A1",
              "#A133FF",
              "#33FFF5",
              "#FF8C33",
              "#FFD700",
              "#00CED1",
              "#DC143C",
            ],
          },
        ],
      },
    });
  }, []);

  return (
    <div className="flex flex-grow justify-center items-center md:ml-[350px] bg-gray-100 md:py-5 md:px-3 p-2">
      <div className="max-w-6xl mx-auto">
        {/* Contadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700">Produtos</h2>
            <p className="text-3xl font-bold text-blue-600">
              {data.productsCount}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700">Categorias</h2>
            <p className="text-3xl font-bold text-green-600">
              {data.categoriesCount}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700">
              Subcategorias
            </h2>
            <p className="text-3xl font-bold text-purple-600">
              {data.subcategoriesCount}
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de barras */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Distribuição por Categoria
            </h3>
            {data.categoryDistribution.labels.length > 0 && (
              <Bar
                data={data.categoryDistribution}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            )}
          </div>

          {/* Gráfico de pizza */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Distribuição por Subcategoria
            </h3>
            {data.subcategoryDistribution.labels.length > 0 && (
              <Pie
                data={data.subcategoryDistribution}
                options={{
                  responsive: true,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
