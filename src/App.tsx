import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/layout/WhatsAppButton';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { CookieConsent } from './components/ui/CookieConsent'; // Importação do banner global
import { GarageDoorSplash } from './components/ui/GarageDoorSplash'; // Animação de entrada Porta de Garagem

import { Home } from './pages/Home';
import { Stand } from './pages/Stand';
import { VehicleDetails } from './pages/VehicleDetails';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { Importacao } from './pages/Importacao';
import { Contactos } from './pages/Contactos';
import { Sobre } from './pages/Sobre';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { CookiesPolicy } from './pages/CookiesPolicy'; // Importação da nova página
import { NotFound } from './pages/NotFound';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // A espera pela sessão fica confinada à área protegida.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-ja-dark">
        A carregar...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

/**
 * Estrutura da aplicação SEM Router.
 * O Router é fornecido por fora: BrowserRouter no cliente (main.tsx)
 * e StaticRouter na pré-renderização (entry-server.tsx).
 */
function AppShell() {
  return (
    <>
      <GarageDoorSplash />
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stand" element={<Stand />} />
            <Route path="/stand/marca/:marca" element={<Stand />} />
            <Route path="/stand/:id" element={<VehicleDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/importacao" element={<Importacao />} />
            <Route path="/contactos" element={<Contactos />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
            <Route path="/termos-condicoes" element={<TermsConditions />} />
            <Route path="/cookies" element={<CookiesPolicy />} /> {/* Nova Rota */}

            {/* A Rota Protegida */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* 404 real: qualquer rota inexistente */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <WhatsAppButton />
        <Footer />
        <CookieConsent /> {/* Banner inserido globalmente */}
      </div>
    </>
  );
}

// O App principal agora envolve tudo com o AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
