// Mock API using localStorage for persistence
const STORAGE_KEY = 'alnoor_madrasa_results_v2';

// Initial mock data
const initialData = [
  {
    id: '1',
    name: 'Ahmad Abdullah',
    rollNo: 'R-1001',
    className: 'Class 1',
    subjects: {
      quran: 95,
      hadith: 88,
      fiqh: 92,
      arabic: 85,
      aqeedah: 90,
      seerah: 94
    },
    percentage: 90.67,
    grade: 'A+'
  },
  {
    id: '2',
    name: 'Fatima Zahra',
    rollNo: 'R-1002',
    className: 'Class 1',
    subjects: {
      quran: 82,
      hadith: 75,
      fiqh: 78,
      arabic: 65,
      aqeedah: 80,
      seerah: 85
    },
    percentage: 77.5,
    grade: 'B'
  },
  {
    id: '3',
    name: 'Umar Farooq',
    rollNo: 'R-2001',
    className: 'Class 2',
    subjects: {
      quran: 88,
      hadith: 90,
      fiqh: 85,
      arabic: 80,
      aqeedah: 88,
      seerah: 82
    },
    percentage: 85.5,
    grade: 'A'
  }
];

export const calculateGradeAndPercentage = (subjects) => {
  const maxPerSubject = 100;
  const numSubjects = Object.keys(subjects).length;
  const totalMax = maxPerSubject * numSubjects;
  
  const totalScore = Object.values(subjects).reduce((sum, score) => sum + Number(score), 0);
  const percentage = (totalScore / totalMax) * 100;
  
  let grade = 'F';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 50) grade = 'D';

  return { percentage: parseFloat(percentage.toFixed(2)), grade, totalScore };
};

export const getStudents = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

export const addStudent = async (studentData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const students = await getStudents();
  const newStudent = {
    ...studentData,
    id: Math.random().toString(36).substr(2, 9),
  };
  
  const updatedStudents = [...students, newStudent];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStudents));
  return newStudent;
};

export const deleteStudent = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const students = await getStudents();
  const updatedStudents = students.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStudents));
  return true;
};
