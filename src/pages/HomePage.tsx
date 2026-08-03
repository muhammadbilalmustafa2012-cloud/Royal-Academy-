import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  MapPin,
  Phone,
  Sparkles,
  Users,
  ShieldCheck,
  Star,
  ArrowRight,
  ChevronDown,
  Building2,
  Microscope,
  Cpu,
  Calendar,
  FileText
} from 'lucide-react';
import { ShaderBackground } from '../components/ShaderBackground';
import { AnimatedSection } from '../components/AnimatedSection';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Course, Teacher, Notice, GalleryItem, StudentResult } from '../types';

interface HomePageProps {
  courses: Course[];
  teachers: Teacher[];
  notices: Notice[];
  gallery: GalleryItem[];
  results: StudentResult[];
  setActiveTab: (tab: string) => void;
  onSelectCourse: (course: Course) => void;
  onOpenProspectus: () => void;
}

/* ── CountUp Component ── */
interface CountUpProps { target: string; suffix?: string; duration?: number; }
const CountUp: React.FC<CountUpProps> = ({ target, suffix = '', duration = 2000 }) => {
  const [ref, isVisible] = useScrollAnimation<HTMLSpanElement>({ threshold: 0.5 });
  const [count, setCount] = useState('0');
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isVisible || hasRun.current) return;
    hasRun.current = true;

    // Parse the numeric part (e.g., "12k" → 12, "98" → 98)
    const numMatch = target.match(/[\d.]+/);
    if (!numMatch) { setCount(target); return; }
    const end = parseFloat(numMatch[0]);
    const start = 0;
    const step = (end - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      // Reconstruct with original format
      const formatted = target.replace(/[\d.]+/, String(Math.floor(current)));
      setCount(formatted);
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export const HomePage: React.FC<HomePageProps> = ({
  courses,
  teachers,
  notices,
  gallery,
  results,
  setActiveTab,
  onSelectCourse,
  onOpenProspectus
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Where is Royal Academy located in Faisalabad?",
      a: "Royal Academy is located at Mansoorabad, Farooqabad, Street 14, Faisalabad, Pakistan. Phone: 0329-0247580."
    },
    {
      q: "Which courses are offered at Royal Academy?",
      a: "We offer Matric (Science & Arts), F.Sc Pre-Medical, F.Sc Pre-Engineering, ICS, MDCAT & ECAT Entry Test preparation, Spoken English, Computer courses, and evening tuition for junior classes."
    },
    {
      q: "How can I apply for online admission?",
      a: "Simply click the 'Enroll Now' or 'Admissions' tab on our website, fill out the online admission form with student and guardian details, and submit. You can also track your application status online."
    },
    {
      q: "What are the academy timing hours?",
      a: "We operate in morning and evening shifts. Morning entry test & computer batches run from 9:00 AM to 1:00 PM, while board classes (Matric/F.Sc/ICS) run in the evening from 2:00 PM to 6:30 PM."
    },
    {
      q: "Is there any fee discount or scholarship for top students?",
      a: "Yes! Royal Academy offers merit scholarships up to 100% fee waiver for BISE board position holders and high marks achievers in Matric."
    }
  ];

  const stats = [
    { value: '12k', suffix: '+', label: 'Students Graduated' },
    { value: '50', suffix: '+', label: 'Expert Teachers' },
    { value: '98', suffix: '%', label: 'Board Success Rate' },
    { value: '150', suffix: '+', label: 'BISE Top Positions' },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* ── HERO SECTION ── */}
      <section className="relative w-full min-h-[640px] bg-[#001A38] overflow-hidden pt-20 flex flex-col justify-center border-b-4 border-[#B8860B]">
        <ShaderBackground />

        {/* Floating abstract shapes */}
        <div className="absolute top-[-10%] right-[-8%] w-[380px] h-[380px] border-[20px] border-[#B8860B]/25 rounded-full pointer-events-none z-10 animate-float-bob" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[260px] h-[260px] border-[10px] border-white/10 rounded-full pointer-events-none z-10 animate-float-bob-slow" />
        <div className="absolute top-[30%] left-[5%] w-[100px] h-[100px] border-[5px] border-[#B8860B]/15 rounded-full pointer-events-none z-10 animate-float-bob" style={{ animationDelay: '-2s' }} />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#001A38]/70 via-[#001A38]/50 to-[#001A38] z-10 pointer-events-none" />

        {/* Hero Content — staggered entrance */}
        <div className="relative z-20 px-4 sm:px-6 text-center max-w-4xl mx-auto py-16">
          <span className="hero-item-1 text-[#B8860B] font-bold tracking-widest text-xs uppercase mb-3 block inline-block">
            ESTABLISHED 2012 • FAISALABAD
          </span>

          <h1 className="hero-item-2 font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.15]">
            Nurturing <span className="italic text-[#B8860B]">Excellence</span>,<br />
            Shaping Futures.
          </h1>

          <p className="hero-item-3 text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed font-sans">
            A legacy of academic brilliance in Faisalabad. We combine traditional values with modern learning methodologies to prepare students for global success and BISE board distinction.
          </p>

          <div className="hero-item-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('admissions')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#B8860B] hover:bg-[#966D09] text-white font-bold text-sm rounded-sm transition-all shadow-lg uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-105 active:scale-95 btn-ripple"
            >
              APPLY ONLINE <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 border border-white/20 text-white font-bold text-sm rounded-sm backdrop-blur-md hover:bg-white/20 transition-all uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              EXPLORE COURSES
            </button>
          </div>

          <div className="hero-item-5 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-sm border border-white/20 text-white text-xs font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-soft-pulse" />
            <span>Admissions Open Session 2026-2027</span>
          </div>
        </div>
      </section>

      {/* ── NOTICE TICKER BANNER ── */}
      <AnimatedSection animation="zoom-in" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30">
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-md flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#B8860B] bg-[#B8860B]/10 px-3 py-1.5 rounded-sm shrink-0 border border-[#B8860B]/30 uppercase">
            <Calendar className="w-4 h-4" /> LATEST NOTICE
          </div>
          <div className="flex-1 text-xs sm:text-sm text-[#002349] font-medium line-clamp-1">
            {notices[0]?.title || "Admissions Open for Session 2026-2027 in Matric, F.Sc, ICS & Entry Test."}
          </div>
          <button
            onClick={() => setActiveTab('notices')}
            className="text-xs font-bold text-[#B8860B] hover:underline shrink-0 flex items-center gap-1 uppercase tracking-wider"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </AnimatedSection>

      {/* ── MISSION & WHY CHOOSE US ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 sm:p-10 rounded-lg border border-slate-200 shadow-sm">
          <AnimatedSection animation="fade-left">
            <h3 className="text-[#002349] font-serif text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2 border-l-4 border-[#B8860B] pl-3">
              Our Mission
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              To empower students with critical thinking skills, academic mastery, and ethical values, ensuring they excel in professional higher education and board examinations in Faisalabad.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-right">
            <h3 className="text-[#002349] font-serif text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2 border-l-4 border-[#B8860B] pl-3">
              Why Choose Us?
            </h3>
            <ul className="text-slate-600 text-sm sm:text-base space-y-2.5">
              {['Expert Faculty & Board Mentorship', 'Modern Science & Computer Laboratories', '98% Board Examination Pass & Position Rate'].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B8860B] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </section>

      {/* ── FEATURED PROGRAMS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest">Academic Offerings</span>
              <h2 className="font-serif text-3xl font-bold text-[#002349] mt-1">Featured Programs</h2>
            </div>
            <button
              onClick={() => setActiveTab('courses')}
              className="text-sm font-bold text-[#B8860B] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              View All Courses ({courses.length}) <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </AnimatedSection>

        {/* Staggered course cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 6).map((course, idx) => (
            <AnimatedSection key={course.id} animation="fade-up" delay={idx * 100} className="course-card bg-white p-6 rounded-lg border border-slate-200 hover:border-[#B8860B] cursor-pointer shadow-sm flex flex-col justify-between group">
              <div>
                <div className="relative h-44 rounded-md overflow-hidden mb-4 border border-slate-100 img-zoom-container">
                  <img
                    src={course.image}
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-[#002349] text-white px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider">
                    {course.category}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-white/95 text-[#B8860B] px-2.5 py-1 rounded-sm text-xs font-bold border border-[#B8860B]/30 shadow-sm">
                    PKR {course.fee.toLocaleString()} {course.feePeriod}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif font-bold text-lg text-[#002349] group-hover:text-[#B8860B] transition-colors">
                    {course.title}
                  </h4>
                  <span className="text-[#B8860B] font-bold text-lg group-hover:translate-x-1 transition-transform">→</span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {course.shortDescription}
                </p>

                <div className="space-y-1.5 mb-6">
                  {course.features.slice(0, 2).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => { onSelectCourse(course); setActiveTab('courses'); }}
                  className="flex-1 py-2 rounded-sm bg-slate-100 hover:bg-slate-200 text-[#002349] font-bold text-xs transition-colors text-center uppercase tracking-wider active:scale-95"
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('admissions')}
                  className="flex-1 py-2 rounded-sm bg-[#B8860B] hover:bg-[#966D09] text-white font-bold text-xs shadow-sm transition-colors text-center uppercase tracking-wider active:scale-95 btn-ripple"
                >
                  Apply
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── INSTITUTE STATISTICS (CountUp) ── */}
      <AnimatedSection animation="zoom-in" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-[#002349] text-white rounded-lg border-b-4 border-[#B8860B] shadow-xl">
          <h3 className="text-[#B8860B] uppercase tracking-widest text-xs font-bold mb-8">
            INSTITUTE STATISTICS & ACHIEVEMENTS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i}>
                <p className="text-3xl sm:text-5xl font-serif font-bold text-[#B8860B] mb-1">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs uppercase tracking-wider text-slate-300 font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── PRINCIPAL MESSAGE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-lg bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-8">
          <AnimatedSection animation="fade-right" className="w-36 h-36 sm:w-44 sm:h-44 rounded-md overflow-hidden shrink-0 border-2 border-[#B8860B] shadow-md img-zoom-container">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
              alt="Miss Ayesha Wadood, Principal"
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </AnimatedSection>

          <AnimatedSection animation="fade-left" className="flex-1 text-center lg:text-left space-y-4">
            <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest">Message from Principal</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#002349]">
              Miss Ayesha Wadood
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed italic">
              "Education at Royal Academy is structured to transform student potential into board positions and medical/engineering entry test success. We instill intellectual curiosity, hard work, and moral integrity."
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => setActiveTab('about')}
                className="px-6 py-2.5 rounded-sm bg-[#002349] text-white text-xs font-bold hover:bg-[#001A38] transition-all active:scale-95 uppercase tracking-wider"
              >
                Read Full Vision
              </button>
              <button
                onClick={onOpenProspectus}
                className="px-6 py-2.5 rounded-sm bg-[#B8860B] text-white text-xs font-bold hover:bg-[#966D09] transition-all active:scale-95 uppercase tracking-wider btn-ripple"
              >
                Download Prospectus
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── FAQ ACCORDION (smooth max-height) ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-8">
          <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest">Help & Information</span>
          <h2 className="font-serif text-3xl font-bold text-[#002349] mt-1">Frequently Asked Questions</h2>
        </AnimatedSection>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <AnimatedSection key={idx} animation="fade-up" delay={idx * 80}>
                <div className="rounded-lg bg-white border border-slate-200 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-serif font-bold text-[#002349] text-base flex items-center justify-between gap-4 hover:text-[#B8860B] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#B8860B] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {/* Smooth CSS accordion */}
                  <div className={`faq-body ${isOpen ? 'open' : ''}`}>
                    <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* ── CAMPUS LOCATION MAP ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white border border-slate-200 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 shadow-sm">
          <AnimatedSection animation="fade-left" className="space-y-4">
            <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest">Visit Our Campus</span>
            <h3 className="font-serif text-2xl font-bold text-[#002349]">Campus Location</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Conveniently situated in Mansoorabad, Faisalabad. Visit us during office hours for campus tours and expert academic counseling.
            </p>

            <div className="space-y-3 text-xs text-slate-700 pt-2 font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#B8860B] shrink-0 mt-0.5" />
                <span>Mansoorabad, Farooqabad, Street 14, Faisalabad, Pakistan</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#B8860B] shrink-0" />
                <a href="tel:03290247580" className="hover:text-[#B8860B] transition-colors">0329-0247580</a>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setActiveTab('contact')}
                className="w-full py-3 rounded-sm bg-[#002349] hover:bg-[#001A38] text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95 text-center btn-ripple"
              >
                Contact Form & Location Map
              </button>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-right" className="lg:col-span-2 h-64 lg:h-auto rounded-md overflow-hidden border border-slate-200 relative">
            <iframe
              title="Royal Academy Faisalabad Location Map"
              src="https://maps.google.com/maps?q=Street%2014,%20Farooqabad,%20Mansoorabad,%20Faisalabad,%20Punjab%2038000,%20Pakistan&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};
