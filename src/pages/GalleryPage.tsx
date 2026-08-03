import React, { useState } from 'react';
import { Image as ImageIcon, X, Calendar, Sparkles } from 'lucide-react';
import { GalleryItem, GalleryCategory } from '../types';

interface GalleryPageProps {
  gallery: GalleryItem[];
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Classroom', 'Events', 'Activities', 'Achievements'];

  const filteredGallery = gallery.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#4ffbe6] uppercase tracking-widest">Campus Life</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">Royal Academy Gallery</h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Moments of student achievement, science practicals, high-tech computer labs, prize distributions, and extracurricular activities.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-[#6200ee] text-white shadow-lg shadow-[#6200ee]/30 font-bold'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveLightboxItem(item)}
            className="group relative h-64 rounded-3xl overflow-hidden border border-white/10 bg-[#1b2025] cursor-pointer shadow-xl hover:border-[#4ffbe6] transition-all"
          >
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#6200ee]/90 text-white font-semibold text-[11px] backdrop-blur-md">
              {item.category}
            </div>

            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              <h3 className="font-serif text-base font-bold text-white group-hover:text-[#4ffbe6] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-gray-300 line-clamp-2">{item.description}</p>
              <div className="text-[10px] text-amber-300 font-medium pt-1">{item.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-[#1b2025] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <button
              onClick={() => setActiveLightboxItem(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/70 text-white hover:bg-black/90"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activeLightboxItem.image}
                alt={activeLightboxItem.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#6200ee] text-white text-xs font-semibold">
                  {activeLightboxItem.category}
                </span>
                <span className="text-xs text-amber-300 font-medium">{activeLightboxItem.date}</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-white">{activeLightboxItem.title}</h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {activeLightboxItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
