import React, { useState } from 'react';
import { Search, X, BookOpen, User, Bell, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Course, Teacher, Notice, GalleryItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  teachers: Teacher[];
  notices: Notice[];
  gallery: GalleryItem[];
  setActiveTab: (tab: string) => void;
  onSelectCourse?: (course: Course) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  courses,
  teachers,
  notices,
  gallery,
  setActiveTab,
  onSelectCourse
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  const matchingCourses = cleanQuery
    ? courses.filter(
        c =>
          c.title.toLowerCase().includes(cleanQuery) ||
          c.category.toLowerCase().includes(cleanQuery) ||
          c.shortDescription.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchingTeachers = cleanQuery
    ? teachers.filter(
        t =>
          t.name.toLowerCase().includes(cleanQuery) ||
          t.subject.toLowerCase().includes(cleanQuery) ||
          t.qualification.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchingNotices = cleanQuery
    ? notices.filter(
        n =>
          n.title.toLowerCase().includes(cleanQuery) ||
          n.content.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchingGallery = cleanQuery
    ? gallery.filter(
        g =>
          g.title.toLowerCase().includes(cleanQuery) ||
          g.category.toLowerCase().includes(cleanQuery)
      )
    : [];

  const totalResults =
    matchingCourses.length +
    matchingTeachers.length +
    matchingNotices.length +
    matchingGallery.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#1b2025] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#4ffbe6]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, teachers, notices, or gallery..."
            className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-base font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 text-xs font-semibold"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-6">
          {!cleanQuery ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <Search className="w-10 h-10 text-gray-600 mx-auto mb-2 opacity-50" />
              <p>Type keywords to search across Royal Academy resources.</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {['F.Sc Pre-Medical', 'MDCAT', 'ICS', 'Matric Science', 'Spoken English', 'Prof. Akram'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 rounded-full bg-white/5 text-xs text-gray-300 hover:bg-white/10 border border-white/5"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              No results found matching "{query}". Try searching for courses or teachers.
            </div>
          ) : (
            <>
              {/* Courses Section */}
              {matchingCourses.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#4ffbe6] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Courses ({matchingCourses.length})
                  </h4>
                  <div className="space-y-2">
                    {matchingCourses.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          if (onSelectCourse) onSelectCourse(c);
                          setActiveTab('courses');
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div>
                          <div className="font-semibold text-white text-sm group-hover:text-[#4ffbe6]">
                            {c.title}
                          </div>
                          <div className="text-xs text-gray-400">
                            {c.category} • {c.duration} • PKR {c.fee.toLocaleString()} {c.feePeriod}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teachers Section */}
              {matchingTeachers.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Faculty ({matchingTeachers.length})
                  </h4>
                  <div className="space-y-2">
                    {matchingTeachers.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setActiveTab('teachers');
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer flex items-center gap-3 group transition-all"
                      >
                        <img
                          src={t.photo}
                          alt={t.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-white text-sm group-hover:text-amber-300">
                            {t.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {t.role} • {t.subject} • {t.qualification}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notices Section */}
              {matchingNotices.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5" /> Notices ({matchingNotices.length})
                  </h4>
                  <div className="space-y-2">
                    {matchingNotices.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setActiveTab('notices');
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div>
                          <div className="font-semibold text-white text-sm group-hover:text-indigo-300">
                            {n.title}
                          </div>
                          <div className="text-xs text-gray-400 line-clamp-1">{n.content}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
