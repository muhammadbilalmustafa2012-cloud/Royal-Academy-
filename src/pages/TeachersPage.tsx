import React from 'react';
import { Mail, Phone, Award, GraduationCap, CheckCircle } from 'lucide-react';
import { Teacher } from '../types';

interface TeachersPageProps {
  teachers: Teacher[];
  setActiveTab: (tab: string) => void;
}

export const TeachersPage: React.FC<TeachersPageProps> = ({ teachers, setActiveTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#4ffbe6] uppercase tracking-widest">Royal Academy Faculty</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">Our Distinguished Educators</h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Learn from subject matter experts, M.Sc, M.Phil, and Ph.D educators with proven track records of guiding students to board distinctions.
        </p>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teachers.map((t) => (
          <div
            key={t.id}
            className="bg-[#1b2025] rounded-3xl border border-white/10 overflow-hidden flex flex-col hover:border-[#6200ee] transition-all group shadow-xl"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={t.photo}
                alt={t.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b2025] via-transparent to-transparent" />
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 text-amber-300 text-xs font-bold border border-amber-400/30">
                {t.experience} Exp
              </span>
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#6200ee] text-white text-xs font-semibold">
                {t.subject}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-white mb-1 group-hover:text-[#4ffbe6] transition-colors">
                  {t.name}
                </h3>
                <div className="text-xs text-[#4ffbe6] font-semibold mb-3">{t.role}</div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-300 space-y-1 mb-4">
                  <div className="font-medium text-white flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>{t.qualification}</span>
                  </div>
                </div>

                <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-6">
                  {t.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
                <a
                  href={`tel:${t.phone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#4ffbe6]" /> {t.phone}
                </a>
                <a
                  href={`mailto:${t.email}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#4ffbe6]" /> Email
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Join Faculty Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1b2025] via-[#252a30] to-[#1b2025] border border-white/10 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-white">Interested in Joining Royal Academy Faculty?</h2>
        <p className="text-gray-300 text-sm max-w-lg mx-auto">
          We invite passionate subject specialists for Matric, Intermediate, and Entry Test coaching to drop their CV at our campus.
        </p>
        <button
          onClick={() => setActiveTab('contact')}
          className="px-6 py-2.5 rounded-full bg-[#6200ee] text-white font-semibold text-xs hover:bg-[#7c3aed] transition-colors"
        >
          Contact HR / Principal Office
        </button>
      </div>
    </div>
  );
};
