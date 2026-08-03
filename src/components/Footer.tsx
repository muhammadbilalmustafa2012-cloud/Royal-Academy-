import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Facebook,
  Youtube,
  Instagram,
  MessageCircle,
  FileText,
  CheckCircle
} from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenProspectus: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenProspectus }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  return (
    <footer className="bg-[#002349] text-white pt-16 pb-12 border-t-4 border-[#B8860B] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Institute Brand & Info */}
          <AnimatedSection animation="fade-up" delay={0}>
            <div className="space-y-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-white leading-none tracking-tight">
                  ROYAL ACADEMY
                </h2>
                <p className="text-[#B8860B] text-[10px] tracking-[0.2em] font-bold uppercase mt-1">
                  Faisalabad's Premier Institute
                </p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Empowering Minds for Sovereign Excellence. Royal Academy is Faisalabad's premier institute for Board exams and Entry Test preparation.
              </p>

              <div className="pt-2 flex items-center space-x-3">
                {[
                  { href: 'https://wa.me/923290247580', Icon: MessageCircle, title: 'WhatsApp Us' },
                  { href: 'https://facebook.com', Icon: Facebook, title: 'Facebook Page' },
                  { href: 'https://youtube.com', Icon: Youtube, title: 'YouTube Lectures' },
                  { href: 'https://instagram.com', Icon: Instagram, title: 'Instagram' },
                ].map(({ href, Icon, title }) => (
                  <a
                    key={title}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon w-9 h-9 rounded bg-[#B8860B]/20 text-[#B8860B] border border-[#B8860B]/40 flex items-center justify-center hover:bg-[#B8860B] hover:text-white transition-all"
                    title={title}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Col 2: Quick Links */}
          <AnimatedSection animation="fade-up" delay={100}>
            <div>
              <h3 className="font-serif text-lg font-bold text-white mb-4 border-l-4 border-[#B8860B] pl-3">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {['Home', 'About Us', 'Courses', 'Admissions', 'Teachers', 'Gallery', 'Notices', 'Results', 'Contact'].map((item) => {
                  const id = item.toLowerCase().replace(/\s+/g, '');
                  return (
                    <li key={item}>
                      <button
                        onClick={() => {
                          setActiveTab(id === 'aboutus' ? 'about' : id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="hover:text-[#B8860B] transition-colors flex items-center gap-1.5"
                      >
                        <span className="text-[#B8860B] font-bold">›</span> {item}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </AnimatedSection>

          {/* Col 3: Campus Contact Information */}
          <AnimatedSection animation="fade-up" delay={200}>
            <div>
              <h3 className="font-serif text-lg font-bold text-white mb-4 border-l-4 border-[#B8860B] pl-3">
                Campus Info
              </h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#B8860B] shrink-0 mt-0.5" />
                  <span>
                    Street 14, Farooqabad, Mansoorabad, Faisalabad, Punjab 38000, Pakistan
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#B8860B] shrink-0" />
                  <a href="tel:03290247580" className="hover:text-[#B8860B] transition-colors font-medium">
                    +92 329 0247580
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#B8860B] shrink-0" />
                  <a href="mailto:info@royalacademy.pk" className="hover:text-[#B8860B] transition-colors">
                    info@royalacademy.pk
                  </a>
                </li>
              </ul>

              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={onOpenProspectus}
                  className="w-full py-2.5 px-3 rounded-sm bg-[#B8860B]/20 text-[#B8860B] border border-[#B8860B]/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#B8860B] hover:text-white transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Download Official Prospectus
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* Col 4: Newsletter & Admission Hotline */}
          <AnimatedSection animation="fade-up" delay={300}>
            <div>
              <h3 className="font-serif text-lg font-bold text-white mb-4 border-l-4 border-[#B8860B] pl-3">
                Newsletter & Alerts
              </h3>
              <p className="text-xs text-slate-300 mb-3">
                Subscribe to get immediate BISE board exam schedules, admission alerts, and results updates.
              </p>

              {newsletterSubscribed ? (
                <div className="p-3 bg-[#B8860B]/20 border border-[#B8860B] rounded-sm text-[#B8860B] text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Thank you! You are subscribed to Royal Academy alerts.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-sm text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 top-1 bottom-1 px-3 bg-[#B8860B] text-white rounded-sm text-xs font-bold hover:bg-[#966D09] transition-colors flex items-center justify-center"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-5 p-3 rounded-sm bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase tracking-wider text-[#B8860B] font-bold mb-1">
                  Admission Helpline
                </div>
                <p className="text-xs text-slate-300">
                  Facing issues with online form? Call our admission coordinator:
                </p>
                <div className="text-sm font-bold text-white mt-1">
                  03290247580
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Bottom Bar */}
        <AnimatedSection animation="fade-in" delay={100}>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© 2026 Royal Academy. Nurturing Excellence, Shaping Futures. All Rights Reserved.</p>
            <div className="flex items-center space-x-6">
              <span>Street 14, Farooqabad, Mansoorabad, Faisalabad, Punjab 38000, Pakistan</span>
              <span>•</span>
              <button onClick={() => setActiveTab('contact')} className="hover:text-[#B8860B]">
                Privacy & Admissions Policy
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
};
