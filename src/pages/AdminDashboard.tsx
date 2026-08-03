import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  Users,
  BookOpen,
  Bell,
  Award,
  MessageSquare,
  Trash2,
  Edit,
  Save,
  Search,
  Loader2,
  ShieldAlert,
  Download,
  Filter,
  RefreshCw,
  KeyRound,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';
import { Course, AdmissionApplication, ContactMessage, Notice, StudentResult } from '../types';

interface AdminDashboardProps {
  onDataChange: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onDataChange }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('royal_admin_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(localStorage.getItem('royal_admin_token')));
  const [emailInput, setEmailInput] = useState('ayeshawadood02@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'admissions' | 'courses' | 'notices' | 'results' | 'messages' | 'security'>('admissions');

  // Admissions Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Data states
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);

  // New Notice form
  const [newNotice, setNewNotice] = useState({ title: '', content: '', category: 'Academic', urgent: false });
  // New Result form
  const [newResult, setNewResult] = useState({
    rollNumber: '',
    studentName: '',
    fatherName: '',
    className: '10th Science',
    totalMarks: 1100,
    marksObtained: 1020,
    grade: 'A+',
    examName: 'BISE Board Annual Exam 2025'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });

      if (res.ok) {
        const data = await res.json();
        const userToken = data.user.token;
        setToken(userToken);
        localStorage.setItem('royal_admin_token', userToken);
        setIsAuthenticated(true);
        fetchAdminData();
      } else {
        const data = await res.json().catch(() => ({}));
        setLoginError(data.error || 'Invalid Administrator Credentials.');
      }
    } catch (err) {
      setLoginError('Server connection error.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('royal_admin_token');
    setToken(null);
    setIsAuthenticated(false);
  };

  const fetchAdminData = async () => {
    setLoadingData(true);
    try {
      const [admRes, crsRes, ntcRes, resRes, msgRes] = await Promise.all([
        fetch('/api/admissions'),
        fetch('/api/courses'),
        fetch('/api/notices'),
        fetch('/api/results'),
        fetch('/api/messages')
      ]);

      if (admRes.ok) setAdmissions(await admRes.json());
      if (crsRes.ok) setCourses(await crsRes.json());
      if (ntcRes.ok) setNotices(await ntcRes.json());
      if (resRes.ok) setResults(await resRes.json());
      if (msgRes.ok) setMessages(await msgRes.json());
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Auto-refresh interval (every 10 seconds)
  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
      const interval = setInterval(() => {
        fetchAdminData();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleUpdateAdmissionStatus = async (id: string, status: string, notes?: string) => {
    try {
      const res = await fetch(`/api/admissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes || '' })
      });
      if (res.ok) {
        fetchAdminData();
        onDataChange();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAdmission = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this admission application record permanently?')) return;
    try {
      const res = await fetch(`/api/admissions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdminData();
        onDataChange();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    window.open('/api/admissions/export/csv', '_blank');
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ text: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, oldPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordMessage({ text: 'Password updated successfully!', type: 'success' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage({ text: data.error || 'Failed to change password.', type: 'error' });
      }
    } catch (err) {
      setPasswordMessage({ text: 'Network error updating password.', type: 'error' });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotice)
      });
      if (res.ok) {
        setNewNotice({ title: '', content: '', category: 'Academic', urgent: false });
        fetchAdminData();
        onDataChange();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResult.rollNumber || !newResult.studentName) return;
    const percentage = Number(((newResult.marksObtained / newResult.totalMarks) * 100).toFixed(1));
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newResult, percentage })
      });
      if (res.ok) {
        setNewResult({
          rollNumber: '',
          studentName: '',
          fatherName: '',
          className: '10th Science',
          totalMarks: 1100,
          marksObtained: 1020,
          grade: 'A+',
          examName: 'BISE Board Annual Exam 2025'
        });
        fetchAdminData();
        onDataChange();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter admissions locally for fast table rendering
  const filteredAdmissions = admissions.filter((adm) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      adm.studentName.toLowerCase().includes(q) ||
      (adm.fatherName && adm.fatherName.toLowerCase().includes(q)) ||
      adm.phone.includes(q) ||
      (adm.cnicBForm && adm.cnicBForm.includes(q)) ||
      adm.id.toLowerCase().includes(q);

    const matchesClass = classFilter === 'all' || adm.courseName.toLowerCase().includes(classFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || adm.status === statusFilter;

    let matchesDate = true;
    const itemDate = new Date(adm.createdAt || (adm as any).submissionTime).getTime();
    if (startDateFilter) {
      matchesDate = matchesDate && itemDate >= new Date(startDateFilter).getTime();
    }
    if (endDateFilter) {
      matchesDate = matchesDate && itemDate <= new Date(endDateFilter).getTime() + 86400000;
    }

    return matchesSearch && matchesClass && matchesStatus && matchesDate;
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-28 px-4">
        <div className="p-8 rounded-3xl bg-[#1b2025] border border-white/10 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#6200ee]/20 text-[#4ffbe6] border border-[#6200ee]/40 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-white">Administrator Portal</h2>
            <p className="text-xs text-gray-400 mt-1">Royal Academy Management System</p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs text-left">
            <div>
              <label className="block text-gray-300 font-medium mb-1">Admin Email / Username</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="ayeshawadood02@gmail.com"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#6200ee]"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-1">Admin Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#6200ee] font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-[#6200ee] hover:bg-[#7c3aed] text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Access Administrator Dashboard"}
            </button>
          </form>

          <div className="pt-2 flex justify-between items-center text-[11px] text-gray-400 border-t border-white/10">
            <button
              onClick={() => setShowForgotModal(true)}
              className="text-[#4ffbe6] hover:underline font-semibold"
            >
              Forgot Password?
            </button>
            <span>Authorized Personnel Only</span>
          </div>
        </div>

        {/* FORGOT PASSWORD MODAL */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1b2025] border border-white/10 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 text-xs">
              <KeyRound className="w-10 h-10 text-[#4ffbe6] mx-auto" />
              <h3 className="text-lg font-bold text-white font-serif">Admin Password Reset</h3>
              <p className="text-gray-300 leading-relaxed">
                For security reasons, admin passwords can be reset by sending a verification request to official helpline <span className="font-bold text-white">03290247580</span> or principal email <span className="font-bold text-white">ayeshawadood02@gmail.com</span>.
              </p>
              <div className="p-3 bg-white/5 rounded-xl text-gray-300 font-mono text-[11px]">
                Helpline: 03290247580
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
      {/* Admin Control Header */}
      <div className="p-6 rounded-3xl bg-[#1b2025] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#6200ee] text-white font-bold font-serif text-lg">
            RA
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              Royal Academy Admin Portal <Sparkles className="w-4 h-4 text-[#4ffbe6]" />
            </h1>
            <p className="text-xs text-[#4ffbe6] flex items-center gap-2">
              <span>Mansoorabad, Faisalabad Campus</span> •
              <span className="text-gray-400">Auto-Refreshed: {lastRefreshed.toLocaleTimeString()}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdminData}
            disabled={loadingData}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5"
            title="Refresh Database Records"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout Admin
          </button>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('admissions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'admissions'
              ? 'bg-[#6200ee] text-white shadow-lg'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Users className="w-4 h-4" /> Admissions ({admissions.length})
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'courses'
              ? 'bg-[#6200ee] text-white shadow-lg'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Courses ({courses.length})
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'notices'
              ? 'bg-[#6200ee] text-white shadow-lg'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Bell className="w-4 h-4" /> Notice Board ({notices.length})
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'results'
              ? 'bg-[#6200ee] text-white shadow-lg'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Award className="w-4 h-4" /> Board Results ({results.length})
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'messages'
              ? 'bg-[#6200ee] text-white shadow-lg'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Inquiries ({messages.length})
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-[#6200ee] text-white shadow-lg'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          <KeyRound className="w-4 h-4" /> Password & Security
        </button>
      </div>

      {/* STATS OVERVIEW GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Admissions', value: admissions.length, icon: '🎓', color: 'from-[#6200ee]/20 to-[#6200ee]/5', border: 'border-[#6200ee]/30' },
          { label: 'Pending Review', value: admissions.filter(a => a.status === 'Pending').length, icon: '⏳', color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/30' },
          { label: 'Approved Students', value: admissions.filter(a => a.status === 'Approved').length, icon: '✅', color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/30' },
          { label: 'Unread Messages', value: messages.filter(m => m.status === 'Unread').length, icon: '📩', color: 'from-[#4ffbe6]/20 to-[#4ffbe6]/5', border: 'border-[#4ffbe6]/30' },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.border} shadow-sm`}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white">{stat.value}</div>
            <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* TAB CONTENT: ADMISSIONS */}
      {activeTab === 'admissions' && (
        <div className="space-y-6">
          {/* SEARCH & FILTER CONTROLS */}
          <div className="p-6 rounded-3xl bg-[#1b2025] border border-white/10 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#4ffbe6]" /> Student Admission Applications
              </h2>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" /> Export to CSV / Excel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student, father name, phone, B-Form..."
                  className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#6200ee]"
                />
              </div>

              {/* Class Filter */}
              <div>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0f1419] border border-white/10 rounded-xl text-white focus:outline-none"
                >
                  <option value="all">All Classes / Courses</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0f1419] border border-white/10 rounded-xl text-white focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none"
                  title="Filter Start Date"
                />
              </div>
            </div>
          </div>

          {/* ADMISSIONS LIST */}
          {filteredAdmissions.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#1b2025] border border-white/10 text-center text-gray-400 text-xs space-y-2">
              <Users className="w-8 h-8 text-gray-500 mx-auto" />
              <div>No admission applications found matching your search filter.</div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAdmissions.map((adm) => (
                <div key={adm.id} className="p-6 rounded-3xl bg-[#1b2025] border border-white/10 space-y-4 shadow-lg hover:border-[#6200ee]/40 transition-all">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <div className="font-serif font-bold text-white text-lg flex items-center gap-2">
                        {adm.studentName}
                        <span className="font-mono text-xs text-[#4ffbe6] font-normal">({adm.id})</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Father: <span className="text-gray-200">{adm.fatherName || 'N/A'}</span> • Phone: <span className="text-[#4ffbe6]">{adm.phone}</span> • Guardian: <span className="text-gray-200">{adm.guardianPhone || adm.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        adm.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        adm.status === 'Rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {adm.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-300">
                    <div><span className="text-gray-500 block text-[10px] uppercase font-semibold">Course / Class</span>{adm.courseName}</div>
                    <div><span className="text-gray-500 block text-[10px] uppercase font-semibold">Gender & DOB</span>{adm.gender || 'Male'} • {adm.dateOfBirth || 'N/A'}</div>
                    <div><span className="text-gray-500 block text-[10px] uppercase font-semibold">CNIC / B-Form</span>{adm.cnicBForm || 'N/A'}</div>
                    <div><span className="text-gray-500 block text-[10px] uppercase font-semibold">Submission Time</span>{new Date(adm.createdAt || (adm as any).submissionTime).toLocaleString()}</div>
                  </div>

                  {(adm.address || adm.previousSchool || adm.additionalNotes) && (
                    <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 text-xs text-gray-300 space-y-1">
                      {adm.address && <div><span className="text-gray-400 font-semibold">Address:</span> {adm.address}</div>}
                      {adm.previousSchool && <div><span className="text-gray-400 font-semibold">Previous School:</span> {adm.previousSchool}</div>}
                      {adm.additionalNotes && <div><span className="text-gray-400 font-semibold">Notes:</span> {adm.additionalNotes}</div>}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateAdmissionStatus(adm.id, 'Approved', 'Seats confirmed. Please report to office with fees.')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                      >
                        Approve Admission
                      </button>
                      <button
                        onClick={() => handleUpdateAdmissionStatus(adm.id, 'Rejected', 'Application not meeting eligibility criteria.')}
                        className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
                      >
                        Reject Application
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteAdmission(adm.id)}
                      className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Record
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SECURITY & PASSWORD CHANGE */}
      {activeTab === 'security' && (
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-[#1b2025] border border-white/10 space-y-6 shadow-2xl">
          <div className="text-center space-y-1">
            <KeyRound className="w-10 h-10 text-[#4ffbe6] mx-auto mb-2" />
            <h2 className="font-serif text-xl font-bold text-white">Change Admin Password</h2>
            <p className="text-xs text-gray-400">Update security password for Miss Ayesha Wadood / Admin.</p>
          </div>

          {passwordMessage.text && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 font-semibold ${
              passwordMessage.type === 'success'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/20 border border-red-500/40 text-red-300'
            }`}>
              {passwordMessage.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-medium mb-1">Current Password *</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#6200ee]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">New Password *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#6200ee]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#6200ee]"
              />
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="w-full py-3 rounded-xl bg-[#6200ee] hover:bg-[#7c3aed] text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
            >
              {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Admin Password"}
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: NOTICES MANAGEMENT */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-[#1b2025] border border-white/10 space-y-4">
            <h3 className="font-serif font-bold text-white text-base">Post New Notice</h3>
            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g. BISE Faisalabad Roll No Slip Announcement"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Category</label>
                <select
                  value={newNotice.category}
                  onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0f1419] border border-white/10 rounded-xl text-white"
                >
                  <option value="Academic">Academic</option>
                  <option value="Exam">Exam</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Event">Event</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Content / Message</label>
                <textarea
                  rows={4}
                  required
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Detailed announcement details..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgentNotice"
                  checked={newNotice.urgent}
                  onChange={(e) => setNewNotice({ ...newNotice, urgent: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="urgentNotice" className="text-amber-300 font-bold">
                  Mark as High-Priority URGENT Notice
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#6200ee] hover:bg-[#7c3aed] text-white font-bold"
              >
                Publish Notice Announcement
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif font-bold text-white text-base">Published Notices</h3>
            {notices.map((n) => (
              <div key={n.id} className="p-4 rounded-2xl bg-[#1b2025] border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{n.title}</span>
                  <span className="text-gray-400">{n.date}</span>
                </div>
                <p className="text-gray-300 line-clamp-2">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: RESULTS MANAGEMENT */}
      {activeTab === 'results' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-[#1b2025] border border-white/10 space-y-4">
            <h3 className="font-serif font-bold text-white text-base">Add Student Result Card</h3>
            <form onSubmit={handleCreateResult} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Roll Number</label>
                <input
                  type="text"
                  required
                  value={newResult.rollNumber}
                  onChange={(e) => setNewResult({ ...newResult, rollNumber: e.target.value })}
                  placeholder="RA-2026-1010"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={newResult.studentName}
                  onChange={(e) => setNewResult({ ...newResult, studentName: e.target.value })}
                  placeholder="Ayesha Khan"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Father Name</label>
                <input
                  type="text"
                  required
                  value={newResult.fatherName}
                  onChange={(e) => setNewResult({ ...newResult, fatherName: e.target.value })}
                  placeholder="Tariq Khan"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    required
                    value={newResult.marksObtained}
                    onChange={(e) => setNewResult({ ...newResult, marksObtained: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Total Marks</label>
                  <input
                    type="number"
                    required
                    value={newResult.totalMarks}
                    onChange={(e) => setNewResult({ ...newResult, totalMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#6200ee] hover:bg-[#7c3aed] text-white font-bold"
              >
                Save Result Record
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-serif font-bold text-white text-base">Recorded Board Results</h3>
            {results.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-[#1b2025] border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{r.studentName} ({r.rollNumber})</div>
                  <div className="text-gray-400">{r.className} • {r.examName}</div>
                </div>
                <div className="text-right font-bold text-[#4ffbe6]">
                  {r.marksObtained} / {r.totalMarks} ({r.percentage}%) - {r.grade}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CONTACT MESSAGES */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-white">Inquiries Received</h2>
          {messages.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#1b2025] text-center text-gray-400 text-xs">
              No message inquiries received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className="p-5 rounded-2xl bg-[#1b2025] border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{m.name} ({m.phone})</span>
                    <span className="text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-[#4ffbe6] font-semibold">{m.subject || "General Inquiry"}</div>
                  <p className="text-gray-300 leading-relaxed bg-black/30 p-3 rounded-xl">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
