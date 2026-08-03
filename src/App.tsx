import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ScrollToTop } from './components/ScrollToTop';
import { SearchModal } from './components/SearchModal';
import { ProspectusModal } from './components/ProspectusModal';
import { AiChatWidget } from './components/AiChatWidget';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { TeachersPage } from './pages/TeachersPage';
import { GalleryPage } from './pages/GalleryPage';
import { NoticesPage } from './pages/NoticesPage';
import { ResultsPage } from './pages/ResultsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';

import { Course, Teacher, Notice, GalleryItem, StudentResult } from './types';
import {
  INITIAL_COURSES,
  INITIAL_TEACHERS,
  INITIAL_NOTICES,
  INITIAL_GALLERY,
  INITIAL_RESULTS
} from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // App Data states fetched from REST API
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [results, setResults] = useState<StudentResult[]>(INITIAL_RESULTS);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProspectusOpen, setIsProspectusOpen] = useState(false);
  const [selectedCourseModal, setSelectedCourseModal] = useState<Course | null>(null);
  const [preSelectedCourseForAdmission, setPreSelectedCourseForAdmission] = useState<Course | null>(null);

  // Fetch initial data from backend API
  const fetchData = async () => {
    try {
      const [cRes, tRes, nRes, gRes, rRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/teachers'),
        fetch('/api/notices'),
        fetch('/api/gallery'),
        fetch('/api/results')
      ]);

      if (cRes.ok) setCourses(await cRes.json());
      if (tRes.ok) setTeachers(await tRes.json());
      if (nRes.ok) setNotices(await nRes.json());
      if (gRes.ok) setGallery(await gRes.json());
      if (rRes.ok) setResults(await rRes.json());
    } catch (err) {
      console.warn("Using fallback client data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyForCourse = (course: Course) => {
    setPreSelectedCourseForAdmission(course);
    setActiveTab('admissions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1A1A1A] selection:bg-[#B8860B] selection:text-white flex flex-col font-sans">
      {/* Top Fixed Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProspectus={() => setIsProspectusOpen(true)}
      />

      {/* Main Page View Container */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            courses={courses}
            teachers={teachers}
            notices={notices}
            gallery={gallery}
            results={results}
            setActiveTab={setActiveTab}
            onSelectCourse={(course) => setSelectedCourseModal(course)}
            onOpenProspectus={() => setIsProspectusOpen(true)}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage
            teachers={teachers}
            setActiveTab={setActiveTab}
            onOpenProspectus={() => setIsProspectusOpen(true)}
          />
        )}

        {activeTab === 'courses' && (
          <CoursesPage
            courses={courses}
            selectedCourseModal={selectedCourseModal}
            setSelectedCourseModal={setSelectedCourseModal}
            setActiveTab={setActiveTab}
            onApplyForCourse={handleApplyForCourse}
          />
        )}

        {activeTab === 'admissions' && (
          <AdmissionsPage
            courses={courses}
            preSelectedCourse={preSelectedCourseForAdmission}
            onSubmissionSuccess={fetchData}
          />
        )}

        {activeTab === 'teachers' && (
          <TeachersPage
            teachers={teachers}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryPage
            gallery={gallery}
          />
        )}

        {activeTab === 'notices' && (
          <NoticesPage
            notices={notices}
            onOpenProspectus={() => setIsProspectusOpen(true)}
          />
        )}

        {activeTab === 'results' && (
          <ResultsPage
            initialResults={results}
          />
        )}

        {activeTab === 'contact' && (
          <ContactPage />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            onDataChange={fetchData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenProspectus={() => setIsProspectusOpen(true)}
      />

      {/* Floating Action Utilities */}
      <WhatsAppButton />
      <ScrollToTop />
      <AiChatWidget />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        courses={courses}
        teachers={teachers}
        notices={notices}
        gallery={gallery}
        setActiveTab={setActiveTab}
        onSelectCourse={(course) => setSelectedCourseModal(course)}
      />

      {/* Prospectus Modal */}
      <ProspectusModal
        isOpen={isProspectusOpen}
        onClose={() => setIsProspectusOpen(false)}
        onApplyNow={() => {
          setIsProspectusOpen(false);
          setActiveTab('admissions');
        }}
      />
    </div>
  );
}
