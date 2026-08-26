import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VehiclesPage from './pages/VehiclesPage';
import MyReservationsPage from './pages/MyReservationsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminVehiclesPage from './pages/AdminVehiclesPage';
import AdminReservationsPage from './pages/AdminReservationsPage';

function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

function RequireRole({ rol, children }) {
  const { kullanici } = useAuth();
  if (!kullanici) return <Navigate to="/giris" replace />;
  if (kullanici.rol !== rol) return <Navigate to={kullanici.rol === 'ADMIN' ? '/admin' : '/araclar'} replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="giris" element={<LoginPage />} />
        <Route path="kayit" element={<RegisterPage />} />

        <Route path="araclar" element={<RequireRole rol="KULLANICI"><VehiclesPage /></RequireRole>} />
        <Route path="rezervasyonlarim" element={<RequireRole rol="KULLANICI"><MyReservationsPage /></RequireRole>} />

        <Route path="admin" element={<RequireRole rol="ADMIN"><AdminDashboardPage /></RequireRole>} />
        <Route path="admin/araclar" element={<RequireRole rol="ADMIN"><AdminVehiclesPage /></RequireRole>} />
        <Route path="admin/rezervasyonlar" element={<RequireRole rol="ADMIN"><AdminReservationsPage /></RequireRole>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
