import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, X, BookOpen, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getStudents } from '../lib/api';

const PublicResults = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const modalContentRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!modalContentRef.current) return;
    const canvas = await html2canvas(modalContentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${selectedStudent.name.replace(/\s+/g, '_')}_Result.pdf`);
  };

  useEffect(() => {
    const fetchResults = async () => {
      const data = await getStudents();
      setStudents(data);
      setLoading(false);
    };
    fetchResults();
  }, []);

  const classes = [...new Set(students.map(s => s.className))].filter(Boolean);

  const filteredStudents = selectedClass ? students.filter(student => {
    if (student.className !== selectedClass) return false;
    if (searchTerm) {
      return student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  }) : [];



  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
          Madrasa Examination Results 2026
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
          Select a class to view the student mark list.
        </p>
      </div>

      <div className="panel" style={{ padding: '24px', marginBottom: '32px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 250px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Select Class</label>
          <div style={{ position: 'relative' }}>
            <select 
              className="input-field" 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ width: '100%', appearance: 'none', paddingRight: '40px', cursor: 'pointer' }}
            >
              <option value="" disabled>Select a Class</option>
              {classes.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
          </div>
        </div>

        <div style={{ flex: '1 1 300px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Search Student</label>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by name or roll no..." 
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '40px' }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading results...</p>
        </div>
      ) : (
        <div className="panel" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td style={{ fontWeight: 500 }}>{student.rollNo}</td>
                    <td>{student.name}</td>
                    <td>{student.className}</td>
                    <td>{Object.values(student.subjects).reduce((a, b) => a + Number(b), 0)}</td>
                    <td>{student.percentage}%</td>
                    <td>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: student.grade === 'F' ? '#fee2e2' : '#f0fdf4',
                        color: student.grade === 'F' ? '#ef4444' : '#16a34a'
                      }}>
                        {student.grade}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => setSelectedStudent(student)}
                      >
                        <BookOpen size={14} /> View Marks
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                    {selectedClass ? `No students found in ${selectedClass}.` : 'Please select a class to view the results.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="panel"
              style={{ position: 'relative', width: '100%', maxWidth: '500px', padding: '0', overflow: 'hidden' }}
            >
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-light)' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{selectedStudent.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    {selectedStudent.className} | Roll No: {selectedStudent.rollNo}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={handleDownloadPDF}
                    style={{ background: 'var(--color-primary)', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                  >
                    <Download size={16} /> Download PDF
                  </button>
                  <button 
                    onClick={() => setSelectedStudent(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div ref={modalContentRef} style={{ padding: '24px', background: 'var(--color-bg-panel)' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h2 style={{ margin: 0, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>SALAFI MADRASA KARIMBIL</h2>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Examination Result 2026</p>
                </div>
                
                <table className="data-table" style={{ border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                      <th style={{ textAlign: 'right' }}>Marks (out of 100)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedStudent.subjects).map(([subject, score]) => (
                      <tr key={subject}>
                        <td style={{ textTransform: 'capitalize', fontWeight: 500 }}>{subject}</td>
                        <td style={{ textAlign: 'center', fontWeight: 600, color: Number(score) >= 35 ? '#16a34a' : '#ef4444' }}>
                          {Number(score) >= 35 ? 'Pass' : 'Fail'}
                        </td>
                        <td style={{ textAlign: 'right' }}>{score}</td>
                      </tr>
                    ))}
                    <tr style={{ background: 'var(--color-bg-light)' }}>
                      <td colSpan="2" style={{ fontWeight: 600 }}>Total</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {Object.values(selectedStudent.subjects).reduce((a, b) => a + Number(b), 0)} / {Object.keys(selectedStudent.subjects).length * 100}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--color-accent-light)', borderRadius: '8px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Percentage</p>
                    <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-primary)' }}>{selectedStudent.percentage}%</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Grade</p>
                    <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: studentGradeColor(selectedStudent.grade) }}>{selectedStudent.grade}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper for grade color in modal
function studentGradeColor(grade) {
  if (grade === 'F') return '#ef4444';
  if (grade === 'A+' || grade === 'A') return '#2563eb';
  return '#16a34a';
}

export default PublicResults;
