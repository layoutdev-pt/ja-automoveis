import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit, Trash2, Car, Loader2, Users, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Vehicle } from '../types';
import { VehicleForm } from '../components/admin/VehicleForm';

type AdminUser = { id: string; email: string; created_at: string; };

export function Admin() {
  const navigate = useNavigate();
  
  // ================= ESTADOS DE SEGURANÇA E NAVEGAÇÃO =================
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [verifyingAccess, setVerifyingAccess] = useState(true);
  const [activeView, setActiveView] = useState<'inventory' | 'users'>('inventory');
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  // ================= ESTADOS DO INVENTÁRIO =================
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // ================= ESTADOS DOS UTILIZADORES =================
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const isOwner = currentUserEmail === 'ja.automoveis001@gmail.com';

  // ================= 1. VERIFICAÇÃO DE ACESSO =================
  useEffect(() => {
    let isMounted = true;
    const checkAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
          if (window.location.hash.includes('access_token')) return;
          if (isMounted) navigate('/login', { replace: true });
          return;
        }

        const userEmail = session.user.email?.toLowerCase() || '';
        const { data, error } = await supabase.from('admin_users').select('email').eq('email', userEmail).maybeSingle();

        if (error || !data) {
          await supabase.auth.signOut();
          if (isMounted) navigate('/login', { state: { authError: 'Acesso Negado: O seu email não tem permissões.' } });
        } else {
          if (isMounted) {
            setIsAuthorized(true);
            setCurrentUserEmail(userEmail);
            setVerifyingAccess(false);
          }
        }
      } catch (err) {
        await supabase.auth.signOut();
        if (isMounted) navigate('/login');
      }
    };

    checkAccess();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) checkAccess();
      else if (event === 'SIGNED_OUT' && isMounted) navigate('/login', { replace: true });
    });

    return () => { isMounted = false; authListener.subscription.unsubscribe(); };
  }, [navigate]);

  // ================= 2. CARREGAR DADOS =================
  useEffect(() => {
    if (!isAuthorized) return; 
    if (activeView === 'inventory') fetchVehicles();
    else if (activeView === 'users') fetchAdmins();
  }, [activeView, isAuthorized]);

  const fetchVehicles = async () => {
    setLoading(true);
    const { data } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
    if (data) setVehicles(data);
    setLoading(false);
  };

  const fetchAdmins = async () => {
    setLoading(true);
    const { data } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false });
    if (data) setAdmins(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // ================= AÇÕES DO INVENTÁRIO =================
  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    if (!window.confirm('Tem a certeza? Esta ação apagará a viatura e todas as fotos associadas de forma irreversível.')) return;

    try {
      // 1. Extrair ficheiros a apagar do Storage (Evita duplicados através do Set)
      const filesToDelete = new Set<string>();

      // Imagens Visíveis (Crops ou Imagens diretas)
      if (vehicle.fotos && Array.isArray(vehicle.fotos)) {
        vehicle.fotos.forEach(url => {
          if (url && typeof url === 'string') {
            const fileName = url.split('/').pop();
            if (fileName) filesToDelete.add(fileName);
          }
        });
      }

      // Imagens Mestras/Originais (guardadas nos metadados)
      const fotosMeta = (vehicle as any).fotos_meta;
      if (fotosMeta && Array.isArray(fotosMeta)) {
        fotosMeta.forEach((meta: any) => {
          if (meta && meta.masterUrl && typeof meta.masterUrl === 'string') {
            const fileName = meta.masterUrl.split('/').pop();
            if (fileName) filesToDelete.add(fileName);
          }
        });
      }

      // 2. Executar a eliminação dos ficheiros no Storage
      if (filesToDelete.size > 0) {
        const { error: storageError } = await supabase.storage
          .from('vehicle_images')
          .remove(Array.from(filesToDelete));
          
        if (storageError) {
          console.error('Erro ao apagar imagens do Storage:', storageError);
        }
      }

      // 3. Eliminar registo na Base de Dados
      const { error: dbError } = await supabase.from('vehicles').delete().eq('id', vehicle.id);
      if (dbError) throw dbError;

      setVehicles(vehicles.filter(v => v.id !== vehicle.id));
    } catch (error) {
      console.error('Erro ao apagar veículo:', error);
      alert('Ocorreu um erro ao apagar a viatura.');
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);

  // ================= AÇÕES DE ADMINS =================
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !isOwner) return;
    const { data, error } = await supabase.from('admin_users').insert([{ email: newAdminEmail.toLowerCase() }]).select().single();
    if (error && error.code === '23505') alert('Este email já é administrador.');
    else if (data) { setAdmins([data, ...admins]); setNewAdminEmail(''); setIsAddingAdmin(false); }
  };

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (!isOwner || email.toLowerCase() === 'ja.automoveis001@gmail.com') return;
    if (!window.confirm(`Remover acesso a ${email}?`)) return;
    await supabase.from('admin_users').delete().eq('id', id);
    setAdmins(admins.filter(a => a.id !== id));
  };

  // ================= ECRÃS DE BLOQUEIO E INTERFACE =================
  if (verifyingAccess) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-ja-blue" size={48}/></div>;
  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col md:flex-row pt-20 transition-colors duration-500">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col pt-20 transition-colors duration-500">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-ja-dark dark:text-white">Painel de Gestão</h2>
          <p className="text-sm text-gray-500">Área Administrativa</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveView('inventory')} className={`w-full flex items-center gap-3 font-semibold px-4 py-3 rounded-xl transition-colors ${activeView === 'inventory' ? 'bg-ja-blue/10 text-ja-blue' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
            <Car size={20} /> Inventário
          </button>
          <button onClick={() => setActiveView('users')} className={`w-full flex items-center gap-3 font-semibold px-4 py-3 rounded-xl transition-colors ${activeView === 'users' ? 'bg-ja-blue/10 text-ja-blue' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
            <Users size={20} /> Utilizadores
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium px-4 py-3 rounded-xl transition-colors">
            <LogOut size={20} /> Terminar Sessão
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-4 md:p-20 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* ================= VISTA: INVENTÁRIO ================= */}
          {activeView === 'inventory' && (
            isAdding ? (
              <VehicleForm initialData={editingVehicle} onCancel={() => setIsAdding(false)} onSuccess={() => { setIsAdding(false); fetchVehicles(); }} />
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-2xl font-bold text-ja-dark dark:text-white">Veículos em Stock</h1>
                    <p className="text-gray-500 text-sm mt-1">Gira os automóveis disponíveis no stand.</p>
                  </div>
                  <button onClick={() => { setEditingVehicle(null); setIsAdding(true); }} className="flex items-center gap-2 bg-ja-dark hover:bg-ja-blue text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors">
                    <Plus size={20} /> Adicionar Veículo
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                  {loading ? <div className="py-12"><Loader2 size={32} className="mx-auto animate-spin text-ja-blue" /></div> : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                          <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Veículo</th>
                          <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Preço</th>
                          <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Estado</th>
                          <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {vehicles.map(vehicle => (
                          <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="py-4 px-6 flex items-center gap-4">
                              <img src={vehicle.fotos[0]} alt="carro" className="w-16 h-12 rounded-lg object-cover" />
                              <div><p className="font-bold text-ja-dark dark:text-white">{vehicle.marca} {vehicle.modelo}</p><p className="text-xs text-gray-500">{vehicle.ano}</p></div>
                            </td>
                            <td className="py-4 px-6 font-semibold text-ja-dark dark:text-white">{formatPrice(vehicle.preco)}</td>
                            <td className="py-4 px-6"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${vehicle.em_stock ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{vehicle.em_stock ? 'Stock' : 'Vendido'}</span></td>
                            <td className="py-4 px-6 text-right">
                              <button onClick={() => { setEditingVehicle(vehicle); setIsAdding(true); }} className="text-gray-400 hover:text-ja-blue p-2"><Edit size={18} /></button>
                              <button onClick={() => handleDeleteVehicle(vehicle)} className="text-gray-400 hover:text-red-600 p-2"><Trash2 size={18} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )
          )}

          {/* ================= VISTA: UTILIZADORES ================= */}
          {activeView === 'users' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-ja-dark dark:text-white">Acessos de Administrador</h1>
                </div>
                {!isAddingAdmin && isOwner && (
                  <button onClick={() => setIsAddingAdmin(true)} className="flex items-center gap-2 bg-ja-dark hover:bg-ja-blue text-white px-5 py-2.5 rounded-xl font-semibold"><UserPlus size={20} /> Conceder Acesso</button>
                )}
              </div>
              {isAddingAdmin && isOwner && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 mb-8">
                  <form onSubmit={handleAddAdmin} className="flex gap-4">
                    <input type="email" required value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} placeholder="Email do utilizador" className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-ja-dark dark:text-white" />
                    <button type="submit" className="bg-ja-blue text-white px-6 py-3 rounded-xl font-semibold">Adicionar</button>
                  </form>
                </div>
              )}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                  <thead><tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800"><th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Utilizador</th><th className="py-4 px-6 text-right">Ações</th></tr></thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {admins.map(admin => (
                      <tr key={admin.id}>
                        <td className="py-4 px-6 font-semibold text-ja-dark dark:text-white">{admin.email}</td>
                        <td className="py-4 px-6 text-right">
                          {admin.email === 'ja.automoveis001@gmail.com' ? <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-bold rounded-lg uppercase">Dono</span> : isOwner && <button onClick={() => handleDeleteAdmin(admin.id, admin.email)} className="text-gray-400 hover:text-red-600 p-2"><Trash2 size={18} /></button>}
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