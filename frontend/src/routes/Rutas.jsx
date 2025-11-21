import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { Inicio } from "../components/pages/Inicio.jsx";
import { Articulo } from "../components/pages/Articulo";
import { Articulos } from "../components/pages/Articulos.jsx";
import { Header } from "../components/layout/Header";
import { Nav } from "../components/layout/Nav";
import { Footer } from "../components/layout/Footer";
import { Crear } from "../components/pages/Crear.jsx";
import { Contacto } from "../components/pages/Contacto.jsx";
import { Login } from "../components/pages/Login";
import { Servicios } from "../components/pages/Servicios";
import { Ubicacion } from "../components/pages/Ubicacion.jsx";
import { useAuth } from "../context/AuthProvider.jsx";
import VerUsuarios from '../components/pages/Usuarios/VerUsuarios.jsx';
import { Layout } from "../components/pages/Layout/Layout.jsx";
import { Proveedores } from "../components/pages/Proveedores/Proveedores.jsx";
import { Presupuestos } from "../components/pages/Presupuestos/Presupuestos.jsx";
import { Trabajos } from "../components/pages/Trabajo/Trabajos.jsx";
import { Home } from "../components/pages/Home.jsx";
import VerProductos from '../components/pages/Productos/VerProductos.jsx';
import RegistrarVenta from "../components/pages/Ventas/RegistrarVenta.jsx";
import { Quiensoy } from "../components/pages/Quiensoy.jsx";
import VerServicios from "../components/pages/Servicios/VerServicios.jsx";
import VerClientes from "../components/pages/Clientes/VerClientes.jsx";
import ChartsDashboard from "../components/pages/Charts/ChartsDashboard";
export const Rutas = () => {
  const { isLoggedIn, isAuthChecked } = useAuth();

  if (!isAuthChecked) {
    return <div className="cargando">Verificando sesión...</div>;
  }

  return (
    <BrowserRouter>
      {!isLoggedIn && (
        <>
          <Header />
          <Nav />

        </>
      )}

      <section id="content" className="content">
        <Routes>
          <Route path="/" element={<Navigate to={isLoggedIn ? "/welcome" : "/inicio"} />} />

          {/* Rutas públicas */}
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/articulos" element={<Articulos />} />
          <Route path="/quiensoy" element={<Quiensoy />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/ubicacion" element={<Ubicacion />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/welcome" /> : <Login />} />

          {/* Rutas protegidas */}
          {isLoggedIn && (
            <Route element={<Layout />}>
              <Route path="welcome" element={<Home />} />
              <Route path="crear-articulos" element={<Crear />} />
              <Route path="articulo/:id" element={<Articulo />} />
              <Route path="usuarios" element={<VerUsuarios />} />
              <Route path="ventas" element={<RegistrarVenta />} />
              <Route path="productos" element={<VerProductos />} />
              <Route path="presupuestos" element={<Presupuestos />} />
              <Route path="proveedores" element={<Proveedores />} />
              <Route path="mis_servicios" element={<VerServicios/>} />
              <Route path="clientes" element={<VerClientes />} />
              <Route path="trabajos" element={<Trabajos />} />
              <Route path="charts" element={<ChartsDashboard />} />
            </Route>
          )}

          <Route path="*" element={<Navigate to={isLoggedIn ? "/welcome" : "/inicio"} />} />
        </Routes>
      </section>
      {!isLoggedIn && (
        <>
         <Footer></Footer>
        </>
      )}

    </BrowserRouter>
  );
};
