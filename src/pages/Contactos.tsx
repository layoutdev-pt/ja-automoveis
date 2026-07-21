import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, ChevronDown } from 'lucide-react';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { ScrollReveal } from '../components/ui/ScrollReveal'; // Importação do motor de animação

// ================= COMPONENTE CUSTOMIZADO PARA O DROPDOWN =================
function CustomSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 text-ja-dark dark:text-white outline-none transition-colors duration-500 focus:ring-2 focus:ring-ja-blue/20 shadow-sm"
      >
        <span className="truncate pr-2">{value}</span>
        <ChevronDown size={16} className={`flex-shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto p-1 flex flex-col transition-colors duration-500">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                value === opt 
                  ? 'bg-ja-blue/10 text-ja-blue font-semibold' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// =========================================================================

export function Contactos() {
  const location = useLocation();
  const formRef = useRef<HTMLDivElement>(null);

  // Guardar o assunto recebido
  const assuntoRecebido = location.state?.assunto;
  
  // Lista de assuntos padrão
  const assuntosPadrao = [
    'Informação Geral',
    'Agendar Test-Drive',
    'Processo de Importação',
    'Quero Vender a Minha Viatura'
  ];

  // Verificar se o assunto recebido é um assunto personalizado
  const isAssuntoPersonalizado = assuntoRecebido && !assuntosPadrao.includes(assuntoRecebido);
  
  // Montar as opções finais a apresentar
  const assuntosOptions = isAssuntoPersonalizado 
    ? [assuntoRecebido, ...assuntosPadrao] 
    : assuntosPadrao;

  const [formData, setFormData] = useState({
    nome: '',
    apelido: '',
    email: '',
    telefone: '',
    assunto: assuntoRecebido || 'Informação Geral',
    mensagem: '',
    consentimento: false
  });

  // Efeito que deteta a chegada de outra página com a flag scrollToForm
  useEffect(() => {
    if (location.state?.scrollToForm && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! Entraremos em contacto brevemente.');
    setFormData({ ...formData, mensagem: '', consentimento: false });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isChecked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? isChecked : value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-40 pb-20 transition-colors duration-500">
      
      {/* Cabeçalho */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
          <h1 className="text-4xl font-bold text-ja-dark dark:text-white tracking-tight mb-4 uppercase transition-colors duration-500">
            Fale Connosco
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-500">
            Estamos aqui para ajudar. Entre em contacto ou visite-nos no nosso stand para conhecer as nossas viaturas ao vivo.
          </p>
        </section>
      </ScrollReveal>

      {/* Grelha de Contactos e Formulário */}
      <ScrollReveal>
        <section ref={formRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-24">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col lg:flex-row transition-colors duration-500">
            
            {/* Coluna Esquerda: Informações */}
            <div className="lg:w-1/3 bg-gray-50 dark:bg-gray-900/50 p-10 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800 transition-colors duration-500">
              <h3 className="text-xl font-bold text-ja-dark dark:text-white mb-8 transition-colors duration-500">
                Informação de Contacto
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl text-ja-blue shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ja-dark dark:text-white transition-colors duration-500">Morada</h4>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm leading-relaxed transition-colors duration-500">
                      Av. Cidade do Rio de Janeiro<br />
                      Covilhã, Portugal, 6200-563
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl text-ja-blue shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-500">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ja-dark dark:text-white transition-colors duration-500">Telefone</h4>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm transition-colors duration-500">+351 961 650 396</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 transition-colors duration-500">
                      (Chamada para a rede móvel nacional)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl text-ja-blue shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-500">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ja-dark dark:text-white transition-colors duration-500">Email</h4>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm transition-colors duration-500">jaautomoveis553@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl text-ja-blue shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-500">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ja-dark dark:text-white transition-colors duration-500">Horário</h4>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm transition-colors duration-500">Seg - Sáb: 09:30 - 19:30</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-500">Domingo: 14:30 - 19:30</p>
                </div>
                </div>
              </div>

              <div className="mt-12">
                <a 
                  href="https://api.whatsapp.com/send/?phone=351961650396&text=Olá%21+Gostaria+de+obter+mais+informações+sobre+os+veículos.&type=phone_number&app_absent=0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebd57] text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-sm"
                >
                  <WhatsAppIcon className="w-6 h-6" />
                  Contactar por WhatsApp
                </a>
              </div>
            </div>

            {/* Coluna Direita: Formulário */}
            <div className="lg:w-2/3 p-10 lg:p-12">
              <h3 className="text-2xl font-bold text-ja-dark dark:text-white mb-8 transition-colors duration-500">
                Envie-nos uma Mensagem
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Nome *</label>
                    <input 
                      type="text" name="nome" value={formData.nome} onChange={handleChange} required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 text-ja-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors duration-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Apelido *</label>
                    <input 
                      type="text" name="apelido" value={formData.apelido} onChange={handleChange} required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 text-ja-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors duration-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Email *</label>
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleChange} required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 text-ja-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors duration-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Telefone</label>
                    <input 
                      type="tel" name="telefone" value={formData.telefone} onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 text-ja-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors duration-500" 
                    />
                  </div>
                </div>

                {/* DROPDOWN CUSTOMIZADO AQUI */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Assunto *</label>
                  <CustomSelect
                    value={formData.assunto}
                    options={assuntosOptions}
                    onChange={(val) => setFormData({ ...formData, assunto: val })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Mensagem *</label>
                  <textarea 
                    name="mensagem" value={formData.mensagem} onChange={handleChange} required rows={5} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-ja-blue/20 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 text-ja-dark dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors duration-500 resize-none" 
                    placeholder="Como podemos ajudar?"
                  ></textarea>
                </div>

                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" name="consentimento" checked={formData.consentimento} onChange={handleChange} required id="consentimento" 
                    className="mt-1 w-5 h-5 text-ja-blue border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded focus:ring-ja-blue cursor-pointer transition-colors duration-500" 
                  />
                  <label htmlFor="consentimento" className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer transition-colors duration-500">
                    Li e aceito a <a href="#" className="text-ja-blue hover:underline">Política de Privacidade</a> e autorizo o tratamento dos meus dados para efeitos de contacto comercial.
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="w-full sm:w-auto px-8 py-4 bg-ja-dark dark:bg-gray-800 hover:bg-ja-blue dark:hover:bg-ja-blue text-white font-bold rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send size={18} />
                  Enviar Mensagem
                </button>
              </form>
            </div>
            
          </div>
        </section>
      </ScrollReveal>

      {/* Mapa do Google */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full h-[500px] bg-gray-200 dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-500">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.095351288633!2d-7.492406688490895!3d40.283470671342315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd3d2366e4f7eb7b%3A0xd6dc5dab865a83e9!2sJA%20Autom%C3%B3veis!5e1!3m2!1spt-PT!2spt!4v1784209768863!5m2!1spt-PT!2spt"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização JA Automóveis"
              className="dark:opacity-80 transition-opacity duration-500"
            ></iframe>
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
}