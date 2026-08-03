import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.name || !formData.message) {
      setErrorMsg('Please fill in your name and message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        throw new Error('Failed to send contact message.');
      }
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-12">
      {/* Header Banner */}
      <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest">Connect With Us</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#002349]">Contact Royal Academy</h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          We welcome parents and prospective students to visit our campus or send us an inquiry. Our admissions office is ready to help!
        </p>
      </AnimatedSection>

      {/* CONTACT INFORMATION & FORM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* COL 1: DETAILS & WHATSAPP */}
        <AnimatedSection animation="fade-left" className="space-y-6">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-[#002349] border-l-4 border-[#B8860B] pl-3">
              Campus Location & Contact
            </h3>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#002349]/10 text-[#002349] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-[#002349] text-sm">Campus Address</div>
                  <p className="text-slate-600 mt-0.5">
                    Street 14, Farooqabad, Mansoorabad, Faisalabad, Punjab 38000, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-[#002349] text-sm">Official Helpline</div>
                  <a href="tel:03290247580" className="text-emerald-700 font-bold hover:underline">
                    +92 329 0247580
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#002349]/10 text-[#002349] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-[#002349] text-sm">Email Address</div>
                  <a href="mailto:info@royalacademy.pk" className="text-slate-600 hover:underline">
                    info@royalacademy.pk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-[#002349] text-sm">Office Hours</div>
                  <p className="text-slate-600 mt-0.5">Monday - Saturday: 8:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/923290247580"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4" /> Instant Chat on WhatsApp (03290247580)
              </a>
            </div>
          </div>
        </AnimatedSection>

        {/* COL 2 & 3: CONTACT FORM */}
        <div className="lg:col-span-2 p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#002349] flex items-center gap-2">
              <Send className="w-6 h-6 text-[#B8860B]" /> Send Us a Direct Message
            </h2>
            <p className="text-xs text-slate-500">Our administrative team responds within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#002349]">Thank You for Reaching Out!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your message has been stored in our backend database. We will contact you at your phone number shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-[#002349] text-white font-bold text-xs uppercase tracking-wider"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#002349] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Muhammad Ali"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#002349] mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="03290247580"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#002349] mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#002349] mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Matric Class Fee Inquiry"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#002349] mb-1">Your Inquiry / Message *</label>
                <textarea
                  rows={4}
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe your question regarding courses, timing, or admissions..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002349] placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-[#002349] hover:bg-[#001A38] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Direct Message
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* FULL WIDTH MAP EMBED */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-80 relative">
        <iframe
          title="Royal Academy Location Map"
          src="https://maps.google.com/maps?q=Street%2014,%20Farooqabad,%20Mansoorabad,%20Faisalabad,%20Punjab%2038000,%20Pakistan&t=&z=16&ie=UTF8&iwloc=&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
};
