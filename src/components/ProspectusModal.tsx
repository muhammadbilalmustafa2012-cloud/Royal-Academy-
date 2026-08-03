import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle, GraduationCap, MapPin, Phone, ShieldCheck, Printer } from 'lucide-react';

interface ProspectusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyNow: () => void;
}

export const ProspectusModal: React.FC<ProspectusModalProps> = ({ isOpen, onClose, onApplyNow }) => {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Simulate file download trigger
      const element = document.createElement("a");
      const file = new Blob([
        `ROYAL ACADEMY FAISALABAD - OFFICIAL PROSPECTUS 2026-2027\n\n` +
        `Address: Mansoorabad, Farooqabad, Street 14, Faisalabad, Pakistan\n` +
        `Phone: 03290247580\nEmail: info@royalacademy.edu.pk\n\n` +
        `OFFERED COURSES:\n` +
        `1. Matriculation (Science & Arts)\n` +
        `2. F.Sc Pre-Medical & Pre-Engineering\n` +
        `3. ICS (Computer Science & Physics)\n` +
        `4. MDCAT & ECAT Entry Test Preparation\n` +
        `5. Spoken English & Public Speaking\n` +
        `6. Computer Short Courses & IT\n\n` +
        `FACULTY LEADERSHIP:\n` +
        `- Miss Ayesha Wadood (Bioinformatics / Principal)\n` +
        `- Sir Izhar (Physics & Mathematics)\n` +
        `- Mam Shiza (Chemistry)\n` +
        `- Mam Mahnoor (Biology)\n` +
        `- Sir Abdul Hanan (Computer Science)\n\n` +
        `ADMISSION REQUIREMENTS:\n` +
        `- 2 Passport Size Photographs\n` +
        `- Copy of Student B-Form / CNIC\n` +
        `- Copy of Father / Guardian CNIC\n` +
        `- Previous Academic Result Sheet / Character Certificate\n\n` +
        `© 2026 Royal Academy. Empowering Minds for Sovereign Excellence.`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = "Royal_Academy_Official_Prospectus_2026.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#1b2025] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#6200ee]/30 via-black/40 to-black/60 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#6200ee] text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">
                Royal Academy Official Prospectus
              </h3>
              <p className="text-xs text-[#4ffbe6]">Academic Session 2026 - 2027</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Content Simulation */}
        <div className="p-6 overflow-y-auto space-y-6 text-gray-300 text-sm">
          {/* Welcome Intro Banner */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=400"
              alt="Royal Academy Campus"
              referrerPolicy="no-referrer"
              className="w-full sm:w-32 h-24 rounded-xl object-cover"
            />
            <div>
              <h4 className="font-serif text-base font-bold text-white mb-1">
                Principal's Opening Address
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                "Welcome to Royal Academy. We combine academic discipline, conceptual teaching, and individualized mentoring to help every student achieve distinction in BISE Board exams and top university entry tests."
              </p>
              <div className="mt-2 text-xs text-[#4ffbe6] font-semibold">
                — Miss Ayesha Wadood (Principal)
              </div>
            </div>
          </div>

          {/* Academic Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h5 className="font-serif font-bold text-white text-sm mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4ffbe6]" /> Board & Entry Test Coaching
              </h5>
              <ul className="text-xs text-gray-400 space-y-1.5 list-disc pl-4">
                <li>100% syllabus coverage according to BISE Faisalabad pattern</li>
                <li>MDCAT & ECAT short trick techniques & 10,000+ MCQ bank</li>
                <li>Bi-weekly testing and parent performance reports</li>
                <li>Air-conditioned, modern computer and science labs</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h5 className="font-serif font-bold text-white text-sm mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400" /> Required Documents for Admission
              </h5>
              <ul className="text-xs text-gray-400 space-y-1.5 list-disc pl-4">
                <li>2 recent passport-size photographs (blue background)</li>
                <li>Attested copy of Student B-Form or CNIC</li>
                <li>Attested copy of Father / Guardian CNIC</li>
                <li>Copy of Matric / Middle result sheet or character certificate</li>
              </ul>
            </div>
          </div>

          {/* Location & Contact Summary */}
          <div className="p-4 rounded-xl bg-[#6200ee]/10 border border-[#6200ee]/30 text-xs flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <div className="font-bold text-white flex items-center gap-1.5 mb-0.5">
                <MapPin className="w-4 h-4 text-[#4ffbe6]" /> Royal Academy Campus
              </div>
              <p className="text-gray-300">Mansoorabad, Farooqabad, Street 14, Faisalabad, Pakistan</p>
            </div>
            <div className="font-bold text-[#4ffbe6] flex items-center gap-1 text-sm">
              <Phone className="w-4 h-4" /> 0329-0247580
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-white/10 bg-[#0f1419] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#6200ee] hover:bg-[#7c3aed] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Preparing Prospectus PDF..." : "Download Full Prospectus"}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print Summary
            </button>
            <button
              onClick={() => {
                onClose();
                onApplyNow();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4ffbe6] to-emerald-400 text-[#0f1419] font-bold text-xs shadow-lg hover:brightness-105 transition-all"
            >
              Apply Online Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
