import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit, Trash2, Car, Loader2, Users, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Vehicle } from '../types';
import { VehicleForm } from '../components/admin/VehicleForm';

type AdminUser = {
  id: string;
  email: string;
  created_at: string;
};

export function Admin() {
  const navigate = useNavigate();
  
  // ================= ESTADOS DE SEGURANÇA E NAVEGAÇÃO =================
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [verifyingAccess, setVerifyingAccess] = useState(true);
  const [activeView, setActiveView] = useState<'inventory' | 'users'>('inventory');
  
  // Guardamos o email de quem está logado para dar os super poderes ao Dono
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  // ================= ESTADOS DO INVENTÁRIO =================
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // ================= ESTADOS DOS UTILIZADORES =================
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Verifica se quem está logado é o dono principal
  const isOwner = currentUserEmail === 'ja.automoveis001@gmail.com';

  // ================= 1. VERIFICAÇÃO DIRETA NA FONTE =================
  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session || !session.user) {
          if (window.location.hash.includes('access_token')) {
            return;
          }
          if (isMounted) navigate('/login', { replace: true });
          return;
        }

        const userEmail = session.user.email?.toLowerCase() || '';

        const { data, error } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', userEmail)
          .maybeSingle();

        if (error || !data) {
          await supabase.auth.signOut();
          if (isMounted) {
            navigate('/login', { 
              state: { authError: 'Acesso Negado: O seu email não tem permissões.' } 
            });
          }
        } else {
          if (isMounted) {
            setIsAuthorized(true);
            setCurrentUserEmail(userEmail);
            setVerifyingAccess(false);
          }
        }
      } catch (err) {
        console.error('Erro:', err);
        await supabase.auth.signOut();
        if (isMounted) navigate('/login');
      }
    };

    checkAccess();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        checkAccess();
      } else if (event === 'SIGNED_OUT' && isMounted) {
        navigate('/login', { replace: true });
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // ================= 2. CARREGAR DADOS =================
  useEffect(() => {
    if (!isAuthorized) return; 

    if (activeView === 'inventory') {
      fetchVehicles();
    } else {
      fetchAdmins();
    }
  }, [activeView, isAuthorized]);

  const fetchVehicles = async () => {
    setLoading(true);
    const { data } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
    if (data) setVehicles(data);
    setLoading(false);
  };

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    const { data } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false });
    if (data) setAdmins(data);
    setLoadingAdmins(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // ================= AÇÕES DO INVENTÁRIO =================
  const handleDeleteVehicle = async (id: string) => {
    if (!window.confirm('Tem a certeza? Esta ação é irreversível.')) return;
    await supabase.from('vehicles').delete().eq('id', id);
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
  };

  // ================= AÇÕES DE ADMINS =================
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    // Bloqueio extra no código
    if (!isOwner) {
      alert('Ação bloqueada: Apenas o Dono pode adicionar novos administradores.');
      return;
    }

    const { data, error } = await supabase.from('admin_users').insert([{ email: newAdminEmail.toLowerCase() }]).select().single();
    if (error && error.code === '23505') alert('Este email já é administrador.');
    else if (data) {
      setAdmins([data, ...admins]);
      setNewAdminEmail('');
      setIsAddingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (id: string, email: string) => {
    // Bloqueio extra no código
    if (!isOwner) {
      alert('Ação bloqueada: Apenas o Dono pode remover administradores.');
      return;
    }

    if (email.toLowerCase() === 'ja.automoveis001@gmail.com') {
      alert('Ação bloqueada: A conta principal do dono não pode ser removida.');
      return;
    }

    if (!window.confirm(`Remover acesso a ${email}?`)) return;
    
    await supabase.from('admin_users').delete().eq('id', id);
    setAdmins(admins.filter(a => a.id !== id));
  };

  // ================= ECRÃS DE BLOQUEIO =================
  if (verifyingAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center transition-colors duration-500">
        <Loader2 size={48} className="animate-spin text-ja-blue mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">A verificar credenciais de acesso...</p>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col md:flex-row pt-20 transition-colors duration-500">
      
      <aside className="w-full md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-500">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 transition-colors duration-500">
          <h2 className="text-xl font-bold text-ja-dark dark:text-white transition-colors duration-500">Painel de Gestão</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-500">Área Administrativa</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveView('inventory')} className={`w-full flex items-center gap-3 font-semibold px-4 py-3 rounded-xl transition-colors duration-300 ${activeView === 'inventory' ? 'bg-ja-blue/10 dark:bg-ja-blue/20 text-ja-blue dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
            <Car size={20} /> Inventário
          </button>
          <button onClick={() => setActiveView('users')} className={`w-full flex items-center gap-3 font-semibold px-4 py-3 rounded-xl transition-colors duration-300 ${activeView === 'users' ? 'bg-ja-blue/10 dark:bg-ja-blue/20 text-ja-blue dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
            <Users size={20} /> Utilizadores
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 transition-colors duration-500">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium px-4 py-3 rounded-xl transition-colors duration-300">
            <LogOut size={20} /> Terminar Sessão
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {activeView === 'inventory' && (
            isAdding ? (
              <VehicleForm initialData={editingVehicle} onCancel={() => setIsAdding(false)} onSuccess={() => { setIsAdding(false); fetchVehicles(); }} />
            ) : (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-ja-dark dark:text-white transition-colors duration-500">Veículos em Stock</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-500">Gira os automóveis disponíveis no stand.</p>
                  </div>
                  <button onClick={() => { setEditingVehicle(null); setIsAdding(true); }} className="flex items-center gap-2 bg-ja-dark dark:bg-gray-800 hover:bg-ja-blue text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors">
                    <Plus size={20} /> Adicionar Veículo
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-500">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 transition-colors">
                          <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Veículo</th>
                          <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Ano</th>
                          <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Preço</th>
                          <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Estado</th>
                          <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {loading ? (
                          <tr><td colSpan={5} className="py-12 text-center"><Loader2 size={32} className="mx-auto animate-spin text-ja-blue mb-2" /></td></tr>
                        ) : vehicles.map((vehicle) => (
                          <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-4">
                                <img src={vehicle.fotos[0]} alt={vehicle.modelo} className="w-16 h-12 rounded-lg object-cover bg-gray-200 dark:bg-gray-700" />
                                <div>
                                  <p className="font-bold text-ja-dark dark:text-white">{vehicle.marca} {vehicle.modelo}</p>
                                  <p className="text-xs text-gray-500">{vehicle.versao}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-gray-600 dark:text-gray-300">{vehicle.ano}</td>
                            <td className="py-4 px-6 font-semibold text-ja-dark dark:text-white">{formatPrice(vehicle.preco)}</td>
                            <td className="py-4 px-6">
                              {vehicle.em_stock ? (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Disponível</span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Vendido</span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button onClick={() => { setEditingVehicle(vehicle); setIsAdding(true); }} className="text-gray-400 hover:text-ja-blue p-2">
                                <Edit size={18} />
                              </button>
                              <button onClick={() => handleDeleteVehicle(vehicle.id)} className="text-gray-400 hover:text-red-600 p-2">
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )
          )}

          {/* VISTA 2: UTILIZADORES */}
          {activeView === 'users' && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-ja-dark dark:text-white">Acessos de Administrador</h1>
                  <p className="text-gray-500 text-sm mt-1">Controle quem tem acesso a este painel.</p>
                </div>
                {/* O botão de adicionar só aparece para o Dono */}
                {!isAddingAdmin && isOwner && (
                  <button onClick={() => setIsAddingAdmin(true)} className="flex items-center gap-2 bg-ja-dark hover:bg-ja-blue text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm">
                    <UserPlus size={20} /> Conceder Acesso
                  </button>
                )}
              </div>

              {isAddingAdmin && isOwner && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 transition-colors duration-500">
                  <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-4">
                    <input type="email" required value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="Email do novo utilizador" className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-ja-dark dark:text-white transition-colors duration-500" />
                    <button type="button" onClick={() => setIsAddingAdmin(false)} className="px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300">Cancelar</button>
                    <button type="submit" className="bg-ja-blue hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-300">Adicionar</button>
                  </form>
                </div>
              )}

              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-500">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 transition-colors duration-500">
                      <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors">Utilizador</th>
                      <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right transition-colors">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 transition-colors duration-500">
                    {loadingAdmins ? (
                      <tr><td colSpan={2} className="py-8 text-center"><Loader2 size={32} className="mx-auto animate-spin text-ja-blue mb-2" /></td></tr>
                    ) : admins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-300">
                        <td className="py-4 px-6 font-semibold text-ja-dark dark:text-white transition-colors">
                          {admin.email}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {admin.email.toLowerCase() === 'ja.automoveis001@gmail.com' ? (
                            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors">
                              Dono
                            </span>
                          ) : isOwner ? (
                            // O botão de apagar só aparece se for um utilizador comum E quem estiver logado for o dono
                            <button 
                              onClick={() => handleDeleteAdmin(admin.id, admin.email)} 
                              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                              title="Remover Acesso"
                            >
                              <Trash2 size={18} />
                            </button>
                          ) : (
                            // Se for um funcionário a ver a lista, não lhe mostramos nenhum botão
                            <span className="text-gray-400 dark:text-gray-600 text-sm">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}