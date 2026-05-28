import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(location.state?.authError || '');

  useEffect(() => {
    // 1. Limpa erros de navegação anteriores se atualizares a página (F5)
    if (location.state?.authError) {
      window.history.replaceState({}, document.title);
    }

    // 2. O DETETIVE: Apanha erros escondidos que o Supabase/Google mandem no URL
    const hash = window.location.hash;
    if (hash && hash.includes('error=')) {
      // O Supabase devolve erros na barra de endereço (ex: #error=unauthorized_client&error_description=...)
      const params = new URLSearchParams(hash.substring(1)); // remove o '#'
      const errDesc = params.get('error_description');
      
      if (errDesc) {
        // Traduz o erro técnico para formato legível na nossa caixa vermelha
        setError(decodeURIComponent(errDesc.replace(/\+/g, ' ')));
      } else {
        setError('A autenticação foi cancelada ou falhou.');
      }
      
      // Limpa a barra de endereços para não ficar suja
      window.location.hash = ''; 
    }

    // 3. Força a verificação de sessão DIRETAMENTE na fonte
    const checkImmediateSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin', { replace: true });
      }
    };
    checkImmediateSession();

    // 4. Fica à escuta ativamente! Mal o login aconteça, muda de página
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || session) {
        navigate('/admin', { replace: true });
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [location, navigate]);

  // Se o contexto global do utilizador atualizar, também redireciona
  useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
        const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Voltar a apontar diretamente para o painel!
          redirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) throw error;
      
    } catch (err: any) {
      console.error('Erro ao iniciar sessão:', err);
      setError('Não foi possível comunicar com o servidor. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center px-4 transition-colors duration-500">
      
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 transition-colors duration-500">
        
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-ja-blue/10 dark:bg-ja-blue/20 rounded-full flex items-center justify-center mb-4 transition-colors duration-500">
            <ShieldCheck size={32} className="text-ja-blue dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-ja-dark dark:text-white tracking-tight transition-colors duration-500">
            Acesso Restrito
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-500">
            Inicie sessão com a sua conta autorizada para gerir a plataforma.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-800/50 transition-colors duration-500 text-center animate-in fade-in zoom-in-95">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-white font-semibold py-4 px-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300 flex items-center justify-center gap-3 disabled:opacity-70 shadow-sm"
          >
            {loading ? (
              <Loader2 size={24} className="animate-spin text-gray-500 dark:text-gray-400" />
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuar com o Google
              </>
            )}
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-500">
            Apenas os endereços de correio eletrónico registados no painel de administração terão permissão de acesso.
          </p>
        </div>

      </div>
    </div>
  );
}