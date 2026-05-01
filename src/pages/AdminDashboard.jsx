import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, GraduationCap, Award, Trash2, Plus, AlertCircle, X } from 'lucide-react';
import StatCard from '../components/StatCard';
import { getStudents, addStudent, deleteStudent, calculateGradeAndPercentage } from '../lib/api';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    className: '',
    subjects: [
      { name: 'Quran', marks: '' },
      { name: 'Hadith', marks: '' },
      { name: 'Fiqh', marks: '' },
      { name: 'Arabic', marks: '' },
      { name: 'Aqeedah', marks: '' },
      { name: 'Seerah', marks: '' },
    ]
  });

  const fetchResults = async () => {
    const data = await getStudents();
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubjectNameChange = (index, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index].name = value;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleSubjectMarksChange = (index, value) => {
    const numValue = Math.min(100, Math.max(0, Number(value)));
    const newSubjects = [...formData.subjects];
    newSubjects[index].marks = numValue;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const addSubjectField = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: '', marks: '' }]
    });
  };

  const removeSubjectField = (index) => {
    const newSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNo || !formData.className) {
      showToast('Name, Roll No, and Class are required', 'error');
      return;
    }
    
    // Convert array back to object for the API
    const subjectsObj = {};
    formData.subjects.forEach(sub => {
      if (sub.name.trim() && sub.marks !== '') {
        subjectsObj[sub.name.trim().toLowerCase()] = sub.marks;
      }
    });

    if (Object.keys(subjectsObj).length === 0) {
      showToast('At least one subject with marks is required', 'error');
      return;
    }

    const { percentage, grade } = calculateGradeAndPercentage(subjectsObj);
    
    const newStudent = {
      name: formData.name,
      rollNo: formData.rollNo,
      className: formData.className,
      subjects: subjectsObj,
      percentage,
      grade
    };

    setLoading(true);
    await addStudent(newStudent);
    await fetchResults();
    
    showToast('Student result added successfully!');
    setFormData({
      name: '',
      rollNo: '',
      className: '',
      subjects: [
        { name: 'Quran', marks: '' },
        { name: 'Hadith', marks: '' },
        { name: 'Fiqh', marks: '' },
        { name: 'Arabic', marks: '' },
        { name: 'Aqeedah', marks: '' },
        { name: 'Seerah', marks: '' },
      ]
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      setLoading(true);
      await deleteStudent(id);
      await fetchResults();
      showToast('Student deleted successfully!');
    }
  };

  const passedStudents = students.filter(s => s.grade !== 'F').length;
  const passRate = students.length > 0 ? Math.round((passedStudents / students.length) * 100) : 0;
  const topGradeStudents = students.filter(s => s.grade === 'A+' || s.grade === 'A').length;

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Manage student results and system statistics.</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <StatCard title="Total Students" value={students.length} icon={Users} delay={0.1} />
        <StatCard title="Pass Rate" value={`${passRate}%`} icon={GraduationCap} color="teal" delay={0.2} />
        <StatCard title="Top Grades (A/A+)" value={topGradeStudents} icon={Award} delay={0.3} />
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        {/* Add Student Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="panel" 
          style={{ flex: '1 1 350px', padding: '32px', height: 'fit-content' }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Plus size={20} color="var(--color-accent)" /> Add New Result
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Student Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleFormChange} className="input-field" style={{ width: '100%' }} placeholder="Enter full name" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Roll Number</label>
                  <input required type="text" name="rollNo" value={formData.rollNo} onChange={handleFormChange} className="input-field" style={{ width: '100%' }} placeholder="e.g. R-1003" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Class</label>
                  <input required type="text" name="className" value={formData.className} onChange={handleFormChange} className="input-field" style={{ width: '100%' }} placeholder="e.g. Class 1" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>Subject Marks (out of 100)</h3>
              <button 
                type="button" 
                onClick={addSubjectField}
                style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} /> Add Subject
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {formData.subjects.map((subject, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    required 
                    type="text" 
                    value={subject.name} 
                    onChange={(e) => handleSubjectNameChange(index, e.target.value)} 
                    className="input-field" 
                    style={{ flex: 2 }} 
                    placeholder="Subject Name"
                  />
                  <input 
                    required 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={subject.marks} 
                    onChange={(e) => handleSubjectMarksChange(index, e.target.value)} 
                    className="input-field" 
                    style={{ flex: 1 }} 
                    placeholder="Marks"
                  />
                  {formData.subjects.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeSubjectField(index)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Processing...' : 'Save Result'}
            </button>
          </form>
        </motion.div>

        {/* Students Table */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="panel" 
          style={{ flex: '2 1 500px', padding: '32px', overflowX: 'auto', height: 'fit-content' }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Manage Students</h2>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Class</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id}>
                    <td style={{ fontWeight: 500 }}>{student.rollNo}</td>
                    <td>{student.name}</td>
                    <td>{student.className}</td>
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
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px', borderRadius: '4px' }}
                        title="Delete Student"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No students found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            style={{
              position: 'fixed',
              bottom: '40px',
              left: '50%',
              background: toast.type === 'error' ? '#ef4444' : 'var(--color-primary)',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 9999,
              fontWeight: 500
            }}
          >
            <AlertCircle size={20} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
