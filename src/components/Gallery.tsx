import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data/initialData';
import { Eye, X, Image as ImageIcon } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [activePhoto, setActivePhoto] = useState<typeof GALLERY_ITEMS[0] | null>(null);

  const filters = [
    { id: 'todos', label: 'Todos os Momentos' },
    { id: 'banho', label: 'Banho & Higiene' },
    { id: 'tosa', label: 'Tosa & Estética' },
    { id: 'creche', label: 'Creche & Brincadeiras' },
    { id: 'hospedagem', label: 'Hospedagem' },
  ];

  const filteredItems = selectedFilter === 'todos'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedFilter);

  return (
    <section id="galeria" className="py-20 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <span>📸</span> Nossa Galeria
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
            Momentos especiais de amor e diversão
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Confira como é o cuidado, a alegria e os momentos de carinho que proporcionamos aos cães e gatos.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedFilter === f.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group relative rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 bg-white cursor-pointer aspect-4/3"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-white">
                <span className="inline-block self-start px-2.5 py-1 rounded-md bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                  {item.category}
                </span>
                <h4 className="font-bold text-base leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-200 line-clamp-2 mt-1">{item.description}</p>
                <div className="flex items-center gap-1 text-xs text-amber-300 mt-2 font-semibold">
                  <Eye className="w-3.5 h-3.5" />
                  Clique para ampliar
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Informative notice as requested */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            * As imagens acima ilustram as experiências, cuidados e atividades desenvolvidas em nosso espaço. Visite nosso Instagram para ver os registros diários!
          </p>
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-16/10 bg-slate-900">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                  {activePhoto.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-display mb-2">
                  {activePhoto.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {activePhoto.description}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
