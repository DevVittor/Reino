import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Nav from "./components/Nav";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateProduct from "./pages/admin/CreateProduct";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Beta from "./pages/Beta";
import Featured from "./pages/admin/Featured";
import Slider from "./components/Slider";
import CreateCategory from "./pages/admin/CreateCategory";
import CreateSubCategory from "./pages/admin/CreateSubCategory";
import CategoryManager from "./pages/admin/CategoryManager";
import SubCategoryManager from "./pages/admin/SubCategoryManager";
import ProductCategory from "./pages/admin/ProductCategory";
import ManageProduct from "./pages/admin/ManageProduct";
import ProductsPage from "./pages/admin/ProductsPage";
import UsersPage from "./pages/admin/UsersPage";
import DashboardPage from "./pages/admin/DashboardPage";
import Test from "./pages/Test";

// Componente de Rota Protegida
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Verifica o token no localStorage

  // Se não houver token, redireciona para /acessar
  if (!token) {
    return <Navigate to="/acessar" replace />;
  }

  // Se houver token, renderiza o componente filho (a rota protegida)
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Nav />}>
          <Route index element={<Home />} />
          <Route path="by-test" element={<Beta />} />
          <Route path="nada" element={<Slider />} />
          <Route path="cadastrar" element={<Register />} />
          <Route path="esqueceu-a-senha" element={<ForgotPassword />} />
          <Route path="acessar" element={<Login />} />
          <Route
            path="painel"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="painel/usuarios/lista"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="painel/produto/lista"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="painel/produto/novo"
            element={
              <ProtectedRoute>
                <CreateProduct />
              </ProtectedRoute>
            }
          />
          {/*<Route
            path="painel/produto/editar"
            element={
              <ProtectedRoute>
                <ManageProduct />
              </ProtectedRoute>
            }
          />*/}
          <Route
            path="painel/produto/destacar"
            element={
              <ProtectedRoute>
                <Featured />
              </ProtectedRoute>
            }
          />
          <Route
            path="painel/produto/adicionar"
            element={
              <ProtectedRoute>
                <ProductCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="painel/categoria"
            element={
              <ProtectedRoute>
                <CategoryManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="painel/subcategoria"
            element={
              <ProtectedRoute>
                <SubCategoryManager />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/beta">
          <Route index element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
