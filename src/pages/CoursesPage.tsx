import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  DollarSign,
  User,
  Calendar,
  X,
  ArrowRight,
  Filter,
  Sparkles
} from 'lucide-react';
import { Course, CourseCategory } from '../types';
import { AnimatedSection } from '../components/AnimatedSection';

interface CoursesPageProps {
  courses: Course[];
  selectedCourseModal: Course | null;
  setSelectedCourseModal: (course: Course | null) => void;
  setActiveTab: (tab: string) => void;
  onApplyForCourse: (course: Course) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  courses,
  selectedCourseModal,
  setSelectedCourseModal,
  setActiveTab,
  onApplyForCourse
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Matric',
    'Intermediate',
    'Entry Test Preparation',
    'Spoken English',
    'Computer Courses',
    'Tuition Classes'
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-12">
      {/* Header Banner */}
      <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest">Royal Academy Curriculum</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#002349]">Our Offered Courses</h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Comprehensive academic programs designed for BISE Board examinations, competitive university entrance tests, language fluency, and career IT skills.
        </p>
      </AnimatedSection>

      {/* Search & Category Filter Pills */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by name or subject..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-md text-sm text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B] shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#002349]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 justify-center pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-[#002349] text-white font-bold shadow-sm border border-[#002349]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm bg-white rounded-lg border border-slate-200">
          No courses found matching your search criteria. Try adjusting filters or search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => (
            <AnimatedSection
              key={course.id}
              animation="fade-up"
              delay={Math.min(idx, 5) * 100}
              className="course-card bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col hover:border-[#B8860B] transition-all group shadow-sm"
            >
              <div className="relative h-48 overflow-hidden img-zoom-container">
                <img
                  src={course.image}
                  alt={course.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-sm bg-[#002349] text-white font-semibold text-xs uppercase tracking-wider">
                  {course.category}
                </span>
                <span className="absolute bottom-3 right-3 px-3 py-1 rounded-sm bg-white/95 text-[#B8860B] font-bold text-xs border border-[#B8860B]/30 shadow-sm">
                  PKR {course.fee.toLocaleString()} {course.feePeriod}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#002349] mb-2 group-hover:text-[#B8860B] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {course.shortDescription}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>Duration: {course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>Timing: {course.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <User className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span className="line-clamp-1">{course.instructor}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedCourseModal(course)}
                    className="flex-1 py-2.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-[#002349] text-xs font-bold transition-colors text-center uppercase tracking-wider"
                  >
                    View Syllabus
                  </button>
                  <button
                    onClick={() => onApplyForCourse(course)}
                    className="flex-1 py-2.5 rounded-sm bg-[#B8860B] hover:bg-[#966D09] text-white text-xs font-bold shadow-sm transition-colors text-center flex items-center justify-center gap-1 uppercase tracking-wider"
                  >
                    Apply Now <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      )}

      {/* COURSE DETAILS MODAL */}
      {selectedCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001A38]/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-lg border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative h-48 sm:h-56">
              <img
                src={selectedCourseModal.image}
                alt={selectedCourseModal.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002349] via-[#002349]/40 to-transparent" />
              <button
                onClick={() => setSelectedCourseModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-3 py-1 rounded-sm bg-[#B8860B] text-white font-bold text-xs uppercase tracking-wider mb-2 inline-block">
                  {selectedCourseModal.category}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {selectedCourseModal.title}
                </h3>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              <div>
                <h4 className="font-serif font-bold text-[#002349] text-base mb-2">Course Overview</h4>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                  {selectedCourseModal.fullDescription || selectedCourseModal.shortDescription}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500">Duration</div>
                  <div className="font-bold text-[#002349] text-xs mt-0.5">{selectedCourseModal.duration}</div>
                </div>
                <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500">Tuition Fee</div>
                  <div className="font-bold text-[#B8860B] text-xs mt-0.5">PKR {selectedCourseModal.fee.toLocaleString()} {selectedCourseModal.feePeriod}</div>
                </div>
                <div className="p-3 rounded-md bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                  <div className="text-xs text-slate-500">Schedule</div>
                  <div className="font-bold text-[#002349] text-xs mt-0.5">{selectedCourseModal.schedule}</div>
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-[#002349] text-base mb-3">Key Learning Features</h4>
                <div className="space-y-2">
                  {selectedCourseModal.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-md bg-[#002349] text-white text-xs flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-[#B8860B] mb-0.5 uppercase tracking-wider">Course Lead</div>
                  <div>{selectedCourseModal.instructor}</div>
                </div>
                <div className="text-slate-300 font-semibold text-right">
                  Mansoorabad Campus
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedCourseModal(null)}
                className="px-5 py-2.5 rounded-sm bg-slate-200 hover:bg-slate-300 text-[#002349] text-xs font-bold uppercase tracking-wider"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const courseToApply = selectedCourseModal;
                  setSelectedCourseModal(null);
                  onApplyForCourse(courseToApply);
                }}
                className="px-6 py-2.5 rounded-sm bg-[#B8860B] hover:bg-[#966D09] text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2 uppercase tracking-wider"
              >
                Proceed to Online Admission <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
