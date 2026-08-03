import React, { useState } from 'react';
import { Award, Search, CheckCircle, XCircle, Trophy, GraduationCap, Loader2 } from 'lucide-react';
import { StudentResult } from '../types';

interface ResultsPageProps {
  initialResults: StudentResult[];
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ initialResults }) => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [resultsList, setResultsList] = useState<StudentResult[]>(initialResults);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    try {
      const res = await fetch(`/api/results?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResultsList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#4ffbe6] uppercase tracking-widest">Academic Distinction</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">Student Results & Hall of Fame</h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Search student BISE board result cards and internal grand mock test scores by Roll Number or Name.
        </p>
      </div>

      {/* SEARCH BOX */}
      <div className="max-w-xl mx-auto p-6 rounded-3xl bg-[#1b2025] border border-white/10 shadow-xl space-y-4">
        <h3 className="font-serif font-bold text-white text-base flex items-center gap-2">
          <Search className="w-5 h-5 text-[#4ffbe6]" /> Verify Student Result
        </h3>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Roll No (e.g. RA-2025-1001) or Student Name"
            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#6200ee]"
          />
          <button
            type="submit"
            disabled={searching}
            className="px-5 py-2.5 rounded-xl bg-[#6200ee] hover:bg-[#7c3aed] text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search Result"}
          </button>
        </form>
      </div>

      {/* RESULTS DISPLAY GRID */}
      <div>
        <h3 className="font-serif font-bold text-white text-xl mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> Top Achievers & Result Verification
        </h3>

        {resultsList.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No result records found matching "{query}". Try searching by roll number.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resultsList.map((res) => (
              <div
                key={res.id}
                className="p-6 rounded-3xl bg-[#1b2025] border border-white/10 hover:border-[#6200ee] transition-all space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h4 className="font-serif font-bold text-white text-lg">{res.studentName}</h4>
                    <p className="text-xs text-gray-400">Father: {res.fatherName}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#6200ee]/30 text-[#4ffbe6] font-mono text-xs font-bold border border-[#6200ee]/50">
                    {res.rollNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-gray-400">Class</div>
                    <div className="font-bold text-white mt-0.5">{res.className}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-gray-400">Marks</div>
                    <div className="font-bold text-amber-300 mt-0.5">
                      {res.marksObtained} / {res.totalMarks}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-gray-400">Percentage</div>
                    <div className="font-bold text-[#4ffbe6] mt-0.5">{res.percentage}%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-gray-400">Grade</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{res.grade}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                  <span>Exam: {res.examName}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> VERIFIED
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
