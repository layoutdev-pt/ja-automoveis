import { MapPin, Phone, Mail } from 'lucide-react';

export function HomeContact() {
  return (
    // Fundo muda de branco para escuro
    <section className="py-24 bg-white dark:bg-[#0a0a0a] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Informação Textual */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-ja-dark dark:text-white mb-6 transition-colors duration-500">
              Venha visitar-nos!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed transition-colors duration-500">
              Venha ver e experimentar o seu próximo carro pessoalmente. A nossa equipa está pronta para o receber no nosso espaço e esclarecer todas as suas dúvidas.
            </p>

            <div className="space-y-8">
              {/* Bloco: Morada */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-ja-blue border border-gray-100 dark:border-gray-800 transition-colors duration-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-ja-dark dark:text-white transition-colors duration-500">Morada</h4>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-500">
                    Av. Cidade do Rio de Janeiro<br/>Covilhã, Portugal, 6200-563
                  </p>
                </div>
              </div>

              {/* Bloco: Telefone */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-ja-blue border border-gray-100 dark:border-gray-800 transition-colors duration-500">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-ja-dark dark:text-white transition-colors duration-500">Telefone</h4>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-500">
                    +351 961 650 396
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 transition-colors duration-500">
                    (Chamada para a rede móvel nacional)
                  </p>
                </div>
              </div>

              {/* Bloco: Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-ja-blue border border-gray-100 dark:border-gray-800 transition-colors duration-500">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-ja-dark dark:text-white transition-colors duration-500">Email</h4>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-500">
                    jaautomoveis553@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mapa Integrado (Google Maps) */}
          <div className="h-[450px] w-full bg-gray-200 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 transition-colors duration-500">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.095351288633!2d-7.492406688490895!3d40.283470671342315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd3d2366e4f7eb7b%3A0xd6dc5dab865a83e9!2sJA%20Autom%C3%B3veis!5e1!3m2!1spt-PT!2spt!4v1784209768863!5m2!1spt-PT!2spt"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa JA Automóveis"
              // Adicionada opacidade suave no modo escuro para não encandear
              className="dark:opacity-80 transition-opacity duration-500"
            ></iframe>
          </div>
          
        </div>
      </div>
    </section>
  );
}