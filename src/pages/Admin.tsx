import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit, Trash2, Car, Loader2, Users, Shield, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Vehicle } from '../types';
import { VehicleForm } from '../components/admin/VehicleForm';

type AdminUser = {
  id: string;
  email: string;
  created_at: string;
};

export function Admin() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // ================= ESTADOS DO PORTEIRO DE SEGURANÇA =================
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [verifyingAccess, setVerifyingAccess] = useState(true);

  // Estado de Navegação do Painel
  const [activeView, setActiveView] = useState<'inventory' | 'users'>('inventory');

  // Estados do Inventário
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Estados dos Utilizadores (Admins)
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // ================= 1. VERIFICAÇÃO RIGOROSA DE ACESSO =================
  // ================= 1. VERIFICAÇÃO RIGOROSA DE ACESSO =================
  useEffect(() => {
    const checkAdminAccess = async () => {
      // 1. O porteiro tem de esperar se o Supabase ainda estiver a ler o login da URL
      if (!user && window.location.hash.includes('access_token')) {
        return; // Fica em modo "verifyingAccess = true" à espera que a sessão carregue
      }

      // 2. Se não está a carregar nada e não há utilizador, volta para o login
      if (!user || !user.email) {
        navigate('/login');
        return;
      }

      try {
        // Tenta encontrar o email na tabela de administradores
        const { data, error } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', user.email)
          .maybeSingle();

        if (error || !data) {
          // O EMAIL NÃO ESTÁ NA LISTA: Expulsa o utilizador
          await signOut();
          navigate('/login', { 
            state: { authError: 'Acesso Negado: O seu email não tem permissões de administrador.' } 
          });
        } else {
          // O EMAIL ESTÁ NA LISTA: Permite a entrada no painel
          setIsAuthorized(true);
        }
      } catch (err) {
        console.error('Erro ao verificar acesso:', err);
        await signOut();
        navigate('/login', { 
          state: { authError: 'Ocorreu um erro ao verificar as credenciais.' } 
        });
      } finally {
        setVerifyingAccess(false);
      }
    };

    checkAdminAccess();
  }, [user, navigate, signOut]);
  
  // ================= 2. CARREGAR DADOS SE AUTORIZADO =================
  useEffect(() => {
    if (!isAuthorized) return; // Não carrega dados se ainda não tiver luz verde

    if (activeView === 'inventory') {
      fetchVehicles();
    } else {
      fetchAdmins();
    }
  }, [activeView, isAuthorized]);

  // ================= LÓGICA DO INVENTÁRIO =================
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setVehicles(data);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!window.confirm('Tem a certeza que deseja eliminar este veículo? Esta ação é irreversível.')) return;
    try {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (error) throw error;
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (error) {
      console.error('Erro ao eliminar veículo:', error);
      alert('Ocorreu um erro ao eliminar o veículo.');
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsAdding(true);
  };

  const handleAddNewVehicle = () => {
    setEditingVehicle(null);
    setIsAdding(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
  };

  // ================= LÓGICA DE UTILIZADORES =================
  const fetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const { data, error } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setAdmins(data);
    } catch (error) {
      console.error('Erro ao buscar administradores:', error);
    } finally {
      setLoadingAdmins(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    try {
      const { data, error } = await supabase.from('admin_users').insert([{ email: newAdminEmail.toLowerCase() }]).select().single();
      if (error) {
        if (error.code === '23505') alert('Este email já tem acesso de administrador.');
        else throw error;
      } else if (data) {
        setAdmins([data, ...admins]);
        setNewAdminEmail('');
        setIsAddingAdmin(false);
      }
    } catch (error) {
      console.error('Erro ao adicionar administrador:', error);
      alert('Ocorreu um erro ao adicionar o acesso.');
    }
  };

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (!window.confirm(`Remover acesso de administrador a ${email}?`)) return;
    try {
      const { error } = await supabase.from('admin_users').delete().eq('id', id);
      if (error) throw error;
      setAdmins(admins.filter(a => a.id !== id));
    } catch (error) {
      console.error('Erro ao remover administrador:', error);
      alert('Ocorreu um erro ao remover o acesso.');
    }
  };

  // ================= RENDERIZAÇÃO CONDICIONAL (O PORTEIRO) =================
  
  // 1. Mostrar ecrã de carregamento em ecrã inteiro enquanto verifica a lista VIP
  if (verifyingAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center transition-colors duration-500">
        <Loader2 size={48} className="animate-spin text-ja-blue mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">A verificar credenciais de acesso...</p>
      </div>
    );
  }

  // 2. Se a verificação terminou e não está autorizado, retorna null porque o navigate já está a correr para o expulsar
  if (!isAuthorized) {
    return null;
  }

  // 3. Se passou em tudo, renderiza o painel completo
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col md:flex-row pt-20 transition-colors duration-500">
      
      {/* Sidebar do Admin */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-500">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 transition-colors duration-500">
          <h2 className="text-xl font-bold text-ja-dark dark:text-white transition-colors duration-500">Painel de Gestão</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-500">Área Administrativa</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveView('inventory')}
            className={`w-full flex items-center gap-3 font-semibold px-4 py-3 rounded-xl transition-colors duration-300 ${
              activeView === 'inventory' 
                ? 'bg-ja-blue/10 dark:bg-ja-blue/20 text-ja-blue dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <Car size={20} />
            Inventário
          </button>
          <button 
            onClick={() => setActiveView('users')}
            className={`w-full flex items-center gap-3 font-semibold px-4 py-3 rounded-xl transition-colors duration-300 ${
              activeView === 'users' 
                ? 'bg-ja-blue/10 dark:bg-ja-blue/20 text-ja-blue dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <Users size={20} />
            Utilizadores
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 transition-colors duration-500">
          <button 
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium px-4 py-3 rounded-xl transition-colors duration-300"
          >
            <LogOut size={20} />
            Terminar Sessão
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* VISTA 1: INVENTÁRIO */}
          {activeView === 'inventory' && (
            isAdding ? (
              <VehicleForm 
                initialData={editingVehicle}
                onCancel={() => setIsAdding(false)} 
                onSuccess={() => {
                  setIsAdding(false);
                  fetchVehicles();
                }} 
              />
            ) : (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-ja-dark dark:text-white transition-colors duration-500">Veículos em Stock</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-500">Gira os automóveis disponíveis no stand.</p>
                  </div>
                  <button 
                    onClick={handleAddNewVehicle} 
                    className="flex items-center gap-2 bg-ja-dark dark:bg-gray-800 hover:bg-ja-blue dark:hover:bg-ja-blue text-white px-5 py-2.5 rounded-xl font-semibold transition-colors duration-300 shadow-sm"
                  >
                    <Plus size={20} />
                    Adicionar Veículo
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-500">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 transition-colors duration-500">
                          <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors duration-500">Veículo</th>
                          <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors duration-500">Ano</th>
                          <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors duration-500">Preço</th>
                          <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors duration-500">Estado</th>
                          <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right transition-colors duration-500">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800 transition-colors duration-500">
                        {loading ? (
                          <tr>
                            <td colSpan={5} className="py-12 text-center">
                              <Loader2 size={32} className="mx-auto text-ja-blue animate-spin mb-2" />
                              <span className="text-gray-500 dark:text-gray-400">A carregar inventário...</span>
                            </td>
                          </tr>
                        ) : vehicles.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-gray-500 dark:text-gray-400">
                              Nenhum veículo encontrado no sistema.
                            </td>
                          </tr>
                        ) : (
                          vehicles.map((vehicle) => (
                            <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-300">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-4">
                                  <img 
                                    src={vehicle.fotos[0] || 'https://via.placeholder.com/150'} 
                                    alt={vehicle.modelo} 
                                    className="w-16 h-12 rounded-lg object-cover bg-gray-200 dark:bg-gray-700 transition-colors duration-500"
                                  />
                                  <div>
                                    <p className="font-bold text-ja-dark dark:text-white transition-colors duration-500">{vehicle.marca} {vehicle.modelo}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-500">{vehicle.versao}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-gray-600 dark:text-gray-300 transition-colors duration-500">{vehicle.ano}</td>
                              <td className="py-4 px-6 font-semibold text-ja-dark dark:text-white transition-colors duration-500">{formatPrice(vehicle.preco)}</td>
                              <td className="py-4 px-6">
                                {vehicle.em_stock ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 transition-colors duration-500">
                                    Disponível
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 transition-colors duration-500">
                                    Vendido
                                  </span>
                                )}
                                {vehicle.em_destaque && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 ml-2 transition-colors duration-500">
                                    Destaque
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  <button 
                                    onClick={() => handleEditVehicle(vehicle)} 
                                    className="text-gray-400 dark:text-gray-500 hover:text-ja-blue dark:hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteVehicle(vehicle.id)}
                                    className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
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
                  <h1 className="text-2xl font-bold text-ja-dark dark:text-white transition-colors duration-500">Acessos de Administrador</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-500">Controle quem tem acesso a este painel.</p>
                </div>
                {!isAddingAdmin && (
                  <button 
                    onClick={() => setIsAddingAdmin(true)} 
                    className="flex items-center gap-2 bg-ja-dark dark:bg-gray-800 hover:bg-ja-blue dark:hover:bg-ja-blue text-white px-5 py-2.5 rounded-xl font-semibold transition-colors duration-300 shadow-sm"
                  >
                    <UserPlus size={20} />
                    Conceder Acesso
                  </button>
                )}
              </div>

              {isAddingAdmin && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 transition-colors duration-500">
                  <h3 className="text-lg font-bold text-ja-dark dark:text-white mb-4 transition-colors duration-500">Novo Administrador</h3>
                  <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="email" 
                      required 
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="Email do novo utilizador" 
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 outline-none bg-gray-50 dark:bg-gray-800 text-ja-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-500"
                    />
                    <div className="flex gap-3">
                      <button 
                        type="button" 
                        onClick={() => setIsAddingAdmin(false)}
                        className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="bg-ja-blue hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-300"
                      >
                        Adicionar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-500">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 transition-colors duration-500">
                        <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors duration-500">Utilizador</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors duration-500">Permissão</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors duration-500">Data de Adição</th>
                        <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right transition-colors duration-500">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 transition-colors duration-500">
                      {loadingAdmins ? (
                        <tr>
                          <td colSpan={4} className="py-12 text-center">
                            <Loader2 size={32} className="mx-auto text-ja-blue animate-spin mb-2" />
                            <span className="text-gray-500 dark:text-gray-400">A carregar utilizadores...</span>
                          </td>
                        </tr>
                      ) : admins.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-gray-500 dark:text-gray-400">
                            Nenhum administrador encontrado.
                          </td>
                        </tr>
                      ) : (
                        admins.map((admin) => (
                          <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-300">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-ja-blue/10 dark:bg-ja-blue/20 flex items-center justify-center text-ja-blue dark:text-blue-400 font-bold">
                                  {admin.email.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-ja-dark dark:text-white transition-colors duration-500">
                                  {admin.email}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 transition-colors duration-500">
                                <Shield size={12} />
                                Admin
                              </span>
                            </td>
                            <td className="py-4 px-6 text-gray-500 dark:text-gray-400 text-sm transition-colors duration-500">
                              {new Date(admin.created_at).toLocaleDateString('pt-PT')}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button 
                                onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                                className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                                title="Remover Acesso"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}