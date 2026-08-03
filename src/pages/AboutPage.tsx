import React from 'react';
import {
  GraduationCap,
  Award,
  ShieldCheck,
  Target,
  Eye,
  Heart,
  Users,
  Building2,
  CheckCircle,
  Microscope,
  Phone,
  MapPin
} from 'lucide-react';
import { Teacher } from '../types';
import { AnimatedSection } from '../components/AnimatedSection';

interface AboutPageProps {
  teachers: Teacher[];
  setActiveTab: (tab: string) => void;
  onOpenProspectus: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ teachers, setActiveTab, onOpenProspectus }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-16">
      {/* Header Banner */}
      <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-[#4ffbe6] uppercase tracking-widest">About Royal Academy</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2 mb-4">
          Nurturing Minds, Building Future Leaders
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Royal Academy is Faisalabad's landmark educational institute, providing uncompromising academic rigor, character building, and top board preparation.
        </p>
      </AnimatedSection>

      {/* Academy History & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <AnimatedSection animation="fade-left" className="space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Our Legacy</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Over 18 Years of Academic Mastery in Faisalabad
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Founded with the sole vision of raising educational standards in Mansoorabad and Farooqabad, Royal Academy has evolved from a dedicated tuition center into a premier coaching institute.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Every year, hundreds of our students secure A+ grades in BISE Faisalabad board examinations and gain admission into top national universities including KEMU, UET, NUST, FAST, and GCUF.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-[#4ffbe6]">100%</div>
              <div className="text-xs text-gray-400">Board Syllabus Coverage</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-amber-400">850+</div>
              <div className="text-xs text-gray-400">Annual Student Enrolment</div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-right" className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl img-zoom-container">
          <img
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800"
            alt="Royal Academy Campus Life"
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1419] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#1b2025]/90 border border-white/10 backdrop-blur-md">
            <div className="font-serif font-bold text-white text-sm">Mansoorabad Campus, Faisalabad</div>
            <div className="text-xs text-[#4ffbe6]">Street 14, Farooqabad • Contact: 0329-0247580</div>
          </div>
        </AnimatedSection>
      </div>

      {/* Vision, Mission, and Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedSection animation="fade-up" delay={0} className="p-8 rounded-3xl bg-[#1b2025] border border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-[#6200ee]/20 text-[#4ffbe6] flex items-center justify-center mb-6">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white mb-3">Our Vision</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            To be recognized as the premier educational institution in Punjab, producing visionary leaders, doctors, engineers, and software professionals.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={150} className="p-8 rounded-3xl bg-[#1b2025] border border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-[#4ffbe6]/20 text-[#4ffbe6] flex items-center justify-center mb-6">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white mb-3">Our Mission</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            To provide affordable, top-quality education combining conceptual clarity, intensive testing, modern computer technology, and student discipline.
          </p>
        </AnimatedSection>

        <div className="p-8 rounded-3xl bg-[#1b2025] border border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-6">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white mb-3">Core Values</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Meritocracy, integrity, continuous testing, student-teacher empathy, and dedication to personal growth and board distinctions.
          </p>
        </div>
      </div>

      {/* Principal's Detailed Message */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1b2025] via-[#252a30] to-[#1b2025] border border-white/10 flex flex-col md:flex-row items-center gap-8">
        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
          alt="Miss Ayesha Wadood"
          referrerPolicy="no-referrer"
          className="w-40 h-40 rounded-2xl object-cover shrink-0 border-2 border-[#4ffbe6]"
        />
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#4ffbe6] uppercase tracking-widest">Principal's Address</span>
          <h3 className="font-serif text-2xl font-bold text-white">Miss Ayesha Wadood (Bio Informatics)</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            "Dear Students and Parents, at Royal Academy, we believe that academic excellence is not an accident—it is the result of focused effort, right guidance, and constant evaluation. Our faculty members bring decades of experience in BISE board examination preparation. We welcome you to join our academic family and chart a successful path to university entrance."
          </p>
          <div className="pt-2 text-xs text-amber-300 font-semibold">
            Phone: 03290247580 • Principal Office, Royal Academy Faisalabad
          </div>
        </div>
      </div>

      {/* Featured Faculty Teaser */}
      <div>
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-[#4ffbe6] uppercase tracking-widest">Faculty Leadership</span>
            <h2 className="font-serif text-3xl font-bold text-white mt-1">Our Esteemed Educators</h2>
          </div>
          <button
            onClick={() => setActiveTab('teachers')}
            className="text-sm font-semibold text-[#4ffbe6] hover:underline"
          >
            View All Teachers →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.slice(0, 3).map((t) => (
            <div key={t.id} className="p-6 rounded-3xl bg-[#1b2025] border border-white/10 flex items-center gap-4">
              <img
                src={t.photo}
                alt={t.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover border border-white/10 shrink-0"
              />
              <div>
                <h4 className="font-serif font-bold text-white text-base">{t.name}</h4>
                <div className="text-xs text-[#4ffbe6] font-medium">{t.role}</div>
                <div className="text-xs text-gray-400 mt-1">{t.qualification}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#6200ee] to-[#2c3ea3] text-center space-y-4 shadow-2xl">
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">Ready to Join Royal Academy?</h2>
        <p className="text-gray-200 text-sm max-w-xl mx-auto">
          Admissions are open for the upcoming session in Matric, F.Sc Pre-Medical, Pre-Engineering, ICS, and Entry Test classes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveTab('admissions')}
            className="px-8 py-3.5 rounded-full bg-white text-[#6200ee] font-bold text-sm shadow-xl hover:bg-gray-100 transition-colors"
          >
            Fill Online Admission Form
          </button>
          <button
            onClick={onOpenProspectus}
            className="px-8 py-3.5 rounded-full bg-black/30 text-[#4ffbe6] border border-[#4ffbe6]/40 font-bold text-sm hover:bg-black/50 transition-colors"
          >
            View Official Prospectus
          </button>
        </div>
      </div>
    </div>
  );
};
