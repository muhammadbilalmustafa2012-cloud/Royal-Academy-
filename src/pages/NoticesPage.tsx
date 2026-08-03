import React, { useState } from 'react';
import { Bell, Calendar, AlertTriangle, FileText, CheckCircle, Search } from 'lucide-react';
import { Notice } from '../types';
import { AnimatedSection } from '../components/AnimatedSection';

interface NoticesPageProps {
  notices: Notice[];
  onOpenProspectus: () => void;
}

export const NoticesPage: React.FC<NoticesPageProps> = ({ notices, onOpenProspectus }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Academic', 'Exam', 'Holiday', 'Event', 'General'];

  const filteredNotices = notices.filter(
    (n) => selectedCategory === 'All' || n.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-12">
      {/* Header Banner */}
      <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#4ffbe6] uppercase tracking-widest">Notice Board &amp; Announcements</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">Official Updates</h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Stay informed with Royal Academy board exam schedules, test series dates, parent meetings, and holiday schedules.
        </p>
      </AnimatedSection>

      {/* Category Pills */}
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

      {/* Notices List */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {filteredNotices.map((notice, idx) => (
          <AnimatedSection
            key={notice.id}
            animation="fade-up"
            delay={Math.min(idx, 6) * 80}
            className={`p-6 rounded-3xl bg-[#1b2025] border transition-all ${
              notice.urgent
                ? 'border-amber-500/50 shadow-lg shadow-amber-500/10'
                : 'border-white/10 hover:border-[#4ffbe6]/40'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    notice.category === 'Exam'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : notice.category === 'Academic'
                      ? 'bg-[#6200ee]/30 text-[#4ffbe6] border border-[#6200ee]/40'
                      : 'bg-white/10 text-gray-200'
                  }`}
                >
                  {notice.category}
                </span>

                {notice.urgent && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> URGENT
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-400 flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#4ffbe6]" /> {notice.date}
              </div>
            </div>

            <h3 className="font-serif text-lg font-bold text-white mb-2">{notice.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{notice.content}</p>
          </AnimatedSection>
        ))}
      </div>

      {/* Prospectus Trigger Banner */}
      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center max-w-2xl mx-auto space-y-3">
        <h3 className="font-serif font-bold text-white text-lg">Looking for Full Academic Syllabus & Calendar?</h3>
        <p className="text-xs text-gray-300">
          Download our complete official prospectus containing fee breakdown, course codes, and session timetables.
        </p>
        <button
          onClick={onOpenProspectus}
          className="px-6 py-2.5 rounded-full bg-[#6200ee] text-white font-semibold text-xs hover:bg-[#7c3aed] transition-colors"
        >
          View / Download Prospectus
        </button>
      </div>
    </div>
  );
};
