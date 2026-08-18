import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/layout/WhatsAppButton';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { CookieConsent } from './components/ui/CookieConsent'; // Importação do banner global

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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stand" element={<Stand />} />
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

          </Routes>
        </main>

        <WhatsAppButton />
        <Footer />
        <CookieConsent /> {/* Banner inserido globalmente */}
      </div>
    </Router>
  );
}

// O App principal agora envolve tudo com o AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}