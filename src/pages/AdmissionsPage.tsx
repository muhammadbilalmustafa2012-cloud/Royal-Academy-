import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Search,
  AlertCircle,
  Send,
  Loader2,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  Calendar,
  User,
  MapPin,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Course, AdmissionApplication } from '../types';

interface AdmissionsPageProps {
  courses: Course[];
  preSelectedCourse?: Course | null;
  onSubmissionSuccess: () => void;
}

export const AdmissionsPage: React.FC<AdmissionsPageProps> = ({
  courses,
  preSelectedCourse,
  onSubmissionSuccess
}) => {
  // 11 Required Fields State
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    email: '',
    phone: '',
    courseId: preSelectedCourse ? preSelectedCourse.id : courses[0]?.id || '',
    courseName: preSelectedCourse ? preSelectedCourse.title : courses[0]?.title || '',
    gender: 'Male',
    dateOfBirth: '',
    address: '',
    previousSchool: '',
    additionalNotes: '',
    cnicBForm: '',
    guardianPhone: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Application Status Checker State
  const [statusQuery, setStatusQuery] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState<AdmissionApplication | null>(null);
  const [statusError, setStatusError] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'courseId') {
      const selected = courses.find((c) => c.id === value);
      setFormData((prev) => ({
        ...prev,
        courseId: value,
        courseName: selected ? selected.title : prev.courseName
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const generateWhatsAppUrl = (app: AdmissionApplication) => {
    const message = `Assalam-o-Alaikum.\n\nI have successfully submitted my admission form on Royal Academy.\n\nName: ${app.studentName}\nClass: ${app.courseName}\nPhone: ${app.phone}\n\nPlease confirm my admission.`;
    return `https://wa.me/923290247580?text=${encodeURIComponent(message)}`;
  };

  const openWhatsAppRedirect = (app: AdmissionApplication) => {
    const url = generateWhatsAppUrl(app);
    window.open(url, '_blank');
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.studentName || !formData.fatherName || !formData.phone || !formData.courseName || !formData.address) {
      setSubmitError('Please fill in all required fields (Student Name, Father Name, Phone, Course, and Address).');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        submissionTime: new Date().toISOString()
      };

      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit admission application.');
      }

      const newApp = await res.json();
      setSubmittedApp(newApp);
      setShowWhatsAppModal(true);
      onSubmissionSuccess();

      // Automatically trigger WhatsApp redirect after 1.5s
      setTimeout(() => {
        openWhatsAppRedirect(newApp);
      }, 1500);

    } catch (err: any) {
      setSubmitError(err.message || 'Error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = statusQuery.trim();
    if (!query) return;

    setCheckingStatus(true);
    setStatusError('');
    setStatusResult(null);

    try {
      const res = await fetch(`/api/admissions/status/${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error('No application found with this Application ID or Phone number.');
      }
      const data = await res.json();
      setStatusResult(data);
    } catch (err: any) {
      setStatusError(err.message || 'Application not found.');
    } finally {
      setCheckingStatus(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#B8860B]" /> Royal Academy Admissions 2026-2027
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#002349]">
          Online Admission Registration
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Apply online for Matric, F.Sc, ICS, MDCAT/ECAT, Spoken English & IT Courses. Direct submission to database with automatic WhatsApp & Google Sheets confirmation.
        </p>
      </div>

      {/* 3-STEP ADMISSION PROCESS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="text-3xl font-extrabold font-serif text-[#002349] mb-2">01</div>
          <h3 className="font-serif font-bold text-[#002349] text-base mb-2">Complete Application</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Fill in student details, previous school/qualification, parent contact info, and select target class.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="text-3xl font-extrabold font-serif text-[#B8860B] mb-2">02</div>
          <h3 className="font-serif font-bold text-[#002349] text-base mb-2">Instant Confirmation</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Get instant Application ID, WhatsApp confirmation, and automatic database record creation.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="text-3xl font-extrabold font-serif text-[#002349] mb-2">03</div>
          <h3 className="font-serif font-bold text-[#002349] text-base mb-2">Document Submission</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Visit campus at Street 14, Mansoorabad, Faisalabad to collect your ID card and timetable schedule.
          </p>
        </div>
      </div>

      {/* ONLINE APPLICATION FORM & STATUS CHECKER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* FORM CONTAINER (2 COLS) */}
        <div className="lg:col-span-2 p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#002349] flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#B8860B]" /> Admission Registration Form
              </h2>
              <p className="text-xs text-slate-500">Please provide accurate information for board/academy registration.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#002349] text-white text-[11px] font-bold uppercase tracking-wider">
              Session 2026-27
            </span>
          </div>

          {submittedApp && showWhatsAppModal ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                  Submission Confirmed
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#002349] mt-1">
                  Admission Form Submitted Successfully!
                </h3>
                <p className="text-slate-700 text-sm mt-2">
                  Thank you, <span className="text-[#002349] font-bold">{submittedApp.studentName}</span>. Your application record is saved in our database.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-200 inline-block text-center space-y-1">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Application Tracking ID</div>
                <div className="font-mono font-extrabold text-2xl text-[#002349]">{submittedApp.id}</div>
              </div>

              {/* WHATSAPP AUTOMATION NOTICE */}
              <div className="p-5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-left space-y-3 max-w-lg mx-auto">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <MessageSquare className="w-5 h-5 text-emerald-700" /> WhatsApp Admission Confirmation
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  We are automatically opening WhatsApp to send your pre-filled admission summary to official helpline <span className="font-bold text-[#002349]">03290247580</span>.
                </p>
                <div className="pt-1 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => openWhatsAppRedirect(submittedApp)}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <MessageSquare className="w-4 h-4" /> Open WhatsApp Now <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href="tel:03290247580"
                    className="py-3 px-4 rounded-xl bg-[#002349] hover:bg-[#001A38] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                  >
                    <PhoneCall className="w-4 h-4" /> Call 03290247580
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmittedApp(null);
                    setShowWhatsAppModal(false);
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-[#002349] underline"
                >
                  Fill Another Admission Form
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              {submitError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* SECTION 1: PERSONAL DETAILS */}
              <div className="font-bold text-[#002349] border-b border-slate-100 pb-1 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#B8860B]" /> 1. Personal & Guardian Info
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#002349] mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="e.g. Muhammad Ali"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#002349] mb-1">Father Name *</label>
                  <input
                    type="text"
                    required
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder="e.g. Tariq Mahmood"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#002349] mb-1">Student Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="03290247580"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#002349] mb-1">Guardian Phone Number</label>
                  <input
                    type="text"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleInputChange}
                    placeholder="0300-1234567"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#002349] mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#002349] mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#002349] mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349]"
                  />
                </div>
              </div>

              {/* SECTION 2: ACADEMIC DETAILS */}
              <div className="font-bold text-[#002349] border-b border-slate-100 pb-1 text-xs uppercase tracking-wider pt-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#B8860B]" /> 2. Class & Academic Selection
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#002349] mb-1">Target Course / Class *</label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349] focus:outline-none focus:border-[#B8860B]"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} (PKR {c.fee})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#002349] mb-1">CNIC / B-Form Number</label>
                  <input
                    type="text"
                    name="cnicBForm"
                    value={formData.cnicBForm}
                    onChange={handleInputChange}
                    placeholder="33100-1234567-1"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#002349] mb-1">Previous School / Qualification</label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleInputChange}
                  placeholder="e.g. Govt High School Faisalabad / Matric 1020 marks"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                />
              </div>

              {/* SECTION 3: ADDRESS & NOTES */}
              <div className="font-bold text-[#002349] border-b border-slate-100 pb-1 text-xs uppercase tracking-wider pt-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#B8860B]" /> 3. Address & Additional Notes
              </div>

              <div>
                <label className="block font-bold text-[#002349] mb-1">Residential Address *</label>
                <textarea
                  rows={2}
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street 14, Farooqabad, Mansoorabad, Faisalabad, Punjab, Pakistan"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#002349] mb-1">Additional Notes / Special Requests</label>
                <textarea
                  rows={2}
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Any fee scholarship request, transport needs, or session timings preference..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-[#B8860B] hover:bg-[#966D09] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting to Database...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Admission Form & Confirm on WhatsApp
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* SIDEBAR: STATUS CHECKER & HELP DESK */}
        <div className="space-y-6">
          {/* Status Checker Widget */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#002349] flex items-center gap-2">
              <Search className="w-5 h-5 text-[#B8860B]" /> Check Application Status
            </h3>
            <p className="text-xs text-slate-500">
              Enter your Application ID (e.g. APP-2026-101) or Phone Number to view your live admission status.
            </p>

            <form onSubmit={handleCheckStatus} className="space-y-2">
              <input
                type="text"
                value={statusQuery}
                onChange={(e) => setStatusQuery(e.target.value)}
                placeholder="APP-2026-101 or 03290247580"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
              />
              <button
                type="submit"
                disabled={checkingStatus}
                className="w-full py-2.5 rounded-xl bg-[#002349] hover:bg-[#001A38] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {checkingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Track Status"}
              </button>
            </form>

            {statusError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {statusError}
              </div>
            )}

            {statusResult && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#002349]">{statusResult.studentName}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      statusResult.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : statusResult.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {statusResult.status}
                  </span>
                </div>
                <div className="text-slate-600">Course: {statusResult.courseName}</div>
                <div className="text-slate-400 text-[11px]">
                  Submitted: {new Date(statusResult.createdAt || (statusResult as any).submissionTime).toLocaleDateString()}
                </div>
                {statusResult.adminNotes && (
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-800 text-[11px] border border-amber-200">
                    Note: {statusResult.adminNotes}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Contact Helpline Widget */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <h4 className="font-serif font-bold text-[#002349] text-sm flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#B8860B]" /> Admission Helpline
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Have questions regarding admission eligibility or scholarship fees? Contact our admissions desk directly:
            </p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-[#002349] flex items-center justify-between">
              <span>03290247580</span>
              <a href="tel:03290247580" className="text-[#B8860B] hover:underline">Call Now</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
