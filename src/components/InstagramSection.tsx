import React from 'react';
import { Instagram, Heart, ExternalLink } from 'lucide-react';
import { BusinessSettings } from '../types';

interface InstagramProps {
  settings: BusinessSettings;
}

export const InstagramSection: React.FC<InstagramProps> = ({ settings }) => {
  const instagramPosts = [
    {
      id: 'ig-1',
      img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80',
      likes: '142',
      caption: 'Dia de muita correria e alegria na creche! 🎾',
    },
    {
      id: 'ig-2',
      img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=400&q=80',
      likes: '98',
      caption: 'Cheiroso e sequinho pronto pro fim de semana! 🛁',
    },
    {
      id: 'ig-3',
      img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80',
      likes: '215',
      caption: 'Transformação linda na tosa estilizada ✂️✨',
    },
    {
      id: 'ig-4',
      img: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=400&q=80',
      likes: '183',
      caption: 'Soneca dos hóspedes depois do recreio da tarde 💤',
    },
  ];

  return (
    <section className="py-16 bg-[#FAF8F5] border-t border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Instagram className="w-3.5 h-3.5 text-pink-600" />
            <span>Redes Sociais</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Siga nossas aventuras no Instagram 🐾
          </h2>

          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Acompanhe o dia a dia dos doguinhos e gatinhos mais felizes de Ipatinga em tempo real.
          </p>

          <div className="mt-4">
            <a
              id="btn-seguir-instagram"
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>SEGUIR NO INSTAGRAM</span>
              <span className="text-xs font-normal opacity-90">({settings.instagramHandle})</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 aspect-square block bg-white"
            >
              <img
                src={post.img}
                alt={post.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                <div className="flex justify-end">
                  <Instagram className="w-4 h-4 text-pink-300" />
                </div>
                <div>
                  <p className="text-xs text-white line-clamp-2 leading-snug">{post.caption}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-rose-300">
                    <Heart className="w-3.5 h-3.5 fill-rose-300" />
                    <span>{post.likes} curtidas</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
