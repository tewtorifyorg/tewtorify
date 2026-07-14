// ============================================================
// Tewtorify — Bangladesh-Specific Constants
// ============================================================

// ---------- Class / Level Taxonomy ----------

export const CLASS_LEVELS = [
  // Pre-Primary
  { value: 'play', label: 'Play', group: 'Pre-Primary' },
  { value: 'nursery', label: 'Nursery', group: 'Pre-Primary' },
  { value: 'kg', label: 'KG', group: 'Pre-Primary' },

  // Primary (Class 1–5)
  { value: 'class-1', label: 'Class 1', group: 'Primary' },
  { value: 'class-2', label: 'Class 2', group: 'Primary' },
  { value: 'class-3', label: 'Class 3', group: 'Primary' },
  { value: 'class-4', label: 'Class 4', group: 'Primary' },
  { value: 'class-5', label: 'Class 5', group: 'Primary' },

  // Junior (Class 6–8)
  { value: 'class-6', label: 'Class 6', group: 'Junior' },
  { value: 'class-7', label: 'Class 7', group: 'Junior' },
  { value: 'class-8', label: 'Class 8', group: 'Junior' },

  // SSC (Class 9–10)
  { value: 'class-9', label: 'Class 9', group: 'SSC' },
  { value: 'class-10', label: 'Class 10', group: 'SSC' },

  // HSC (Class 11–12)
  { value: 'class-11', label: 'Class 11', group: 'HSC' },
  { value: 'class-12', label: 'Class 12', group: 'HSC' },

  // Admission Test Prep
  { value: 'engineering-admission', label: 'Engineering Admission', group: 'Admission Prep' },
  { value: 'medical-admission', label: 'Medical Admission', group: 'Admission Prep' },
  { value: 'university-ka-unit', label: 'University Admission (Ka Unit)', group: 'Admission Prep' },
  { value: 'university-kha-unit', label: 'University Admission (Kha Unit)', group: 'Admission Prep' },
  { value: 'university-gha-unit', label: 'University Admission (Gha Unit)', group: 'Admission Prep' },
  { value: 'university-other-unit', label: 'University Admission (Other Unit)', group: 'Admission Prep' },

  // Bachelor's
  { value: 'bachelors-cse', label: "Bachelor's — CSE", group: "Bachelor's" },
  { value: 'bachelors-eee', label: "Bachelor's — EEE", group: "Bachelor's" },
  { value: 'bachelors-bba', label: "Bachelor's — BBA", group: "Bachelor's" },
  { value: 'bachelors-english', label: "Bachelor's — English", group: "Bachelor's" },
  { value: 'bachelors-other', label: "Bachelor's — Other", group: "Bachelor's" },

  // Language Courses
  { value: 'english-spoken', label: 'English Spoken', group: 'Language' },
  { value: 'ielts', label: 'IELTS Preparation', group: 'Language' },
  { value: 'arabic', label: 'Arabic', group: 'Language' },
  { value: 'language-other', label: 'Other Language', group: 'Language' },

  // Skill-based
  { value: 'programming', label: 'Programming', group: 'Skill-based' },
  { value: 'freelancing', label: 'Freelancing / Digital Marketing', group: 'Skill-based' },
  { value: 'music', label: 'Music', group: 'Skill-based' },
  { value: 'art', label: 'Art / Drawing', group: 'Skill-based' },
] as const;

export type ClassLevelValue = typeof CLASS_LEVELS[number]['value'];

// ---------- Subjects by Level Group ----------

export const SUBJECTS: Record<string, string[]> = {
  'Pre-Primary': ['Bangla', 'English', 'Math', 'Drawing', 'General Knowledge'],
  'Primary': [
    'Bangla', 'English', 'Math', 'Bangladesh & Global Studies',
    'Primary Science', 'Religion', 'Drawing',
  ],
  'Junior': [
    'Bangla', 'English', 'Math', 'Bangladesh & Global Studies',
    'General Science', 'ICT', 'Religion', 'Agriculture',
    'Home Science', 'Arts & Crafts',
  ],
  'SSC': [
    'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
    'Math', 'Higher Math', 'Physics', 'Chemistry', 'Biology',
    'ICT', 'Bangladesh & Global Studies', 'Religion',
    'Accounting', 'Finance & Banking', 'Business Entrepreneurship',
    'Economics', 'Geography', 'Civics',
    'Agriculture', 'Home Science',
  ],
  'HSC': [
    'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
    'Physics', 'Chemistry', 'Biology', 'Higher Math',
    'ICT', 'Statistics',
    'Accounting', 'Finance & Banking', 'Management',
    'Economics', 'Civics & Good Governance', 'History',
    'Sociology', 'Social Work', 'Logic', 'Psychology',
  ],
  'Admission Prep': [
    'Physics', 'Chemistry', 'Biology', 'Math', 'Higher Math',
    'English', 'Bangla', 'General Knowledge', 'ICT',
    'Accounting', 'Management', 'Economics',
  ],
  "Bachelor's": [
    'Department Specific', 'Programming', 'Data Structures',
    'Calculus', 'Linear Algebra', 'Statistics',
    'Accounting', 'Management', 'Marketing', 'Finance',
    'English Literature', 'Linguistics',
  ],
  'Language': ['English Spoken', 'IELTS Reading', 'IELTS Writing', 'IELTS Listening', 'IELTS Speaking', 'Arabic'],
  'Skill-based': [
    'Web Development', 'Python', 'C/C++', 'Java',
    'Graphic Design', 'SEO', 'Social Media Marketing',
    'Guitar', 'Piano', 'Vocal', 'Drawing', 'Painting',
  ],
};

// Helper to get all unique subjects
export const ALL_SUBJECTS = [...new Set(Object.values(SUBJECTS).flat())].sort();

// ---------- Pabna Location Data ----------

export const PABNA_THANAS = [
  'Pabna Sadar',
  'Ishwardi',
  'Bera',
  'Sujanagar',
  'Chatmohar',
  'Bhangura',
  'Faridpur (Pabna)',
  'Santhia',
  'Atgharia',
] as const;

// Common mohalla/area suggestions for Pabna Sadar (extensible)
export const PABNA_SADAR_AREAS = [
  'Shalgaria',
  'Radhanagar',
  'Abdulpur',
  'Court Para',
  'Thana Para',
  'Gokul Nagar',
  'Arambagh',
  'Hemayetpur',
  'Shibpur',
  'Lakshmipur',
  'Station Bazar',
  'Hospital Para',
  'Jubilee Tank',
  'Zero Point',
  'Edward College Area',
  'PUST Campus Area',
  'Medical College Area',
] as const;

export type ThanaValue = typeof PABNA_THANAS[number];

// ---------- Salary Ranges (BDT per month) ----------

export interface SalaryRange {
  group: string;
  min: number;
  max: number;
  defaultMin: number;
  defaultMax: number;
}

export const SALARY_RANGES: Record<string, SalaryRange> = {
  'Pre-Primary': { group: 'Pre-Primary', min: 1000, max: 5000, defaultMin: 2000, defaultMax: 3000 },
  'Primary': { group: 'Primary', min: 1000, max: 6000, defaultMin: 2000, defaultMax: 4000 },
  'Junior': { group: 'Junior', min: 2000, max: 8000, defaultMin: 3000, defaultMax: 6000 },
  'SSC': { group: 'SSC', min: 3000, max: 12000, defaultMin: 4000, defaultMax: 8000 },
  'HSC': { group: 'HSC', min: 4000, max: 15000, defaultMin: 5000, defaultMax: 10000 },
  'Admission Prep': { group: 'Admission Prep', min: 4000, max: 20000, defaultMin: 6000, defaultMax: 12000 },
  "Bachelor's": { group: "Bachelor's", min: 3000, max: 20000, defaultMin: 5000, defaultMax: 15000 },
  'Language': { group: 'Language', min: 2000, max: 15000, defaultMin: 3000, defaultMax: 8000 },
  'Skill-based': { group: 'Skill-based', min: 3000, max: 20000, defaultMin: 5000, defaultMax: 15000 },
};

// ---------- Tutoring Mode Options ----------

export const TUTORING_MODES = [
  { value: 'in-person', label: 'In-person (Home Tuition)' },
  { value: 'online', label: 'Online' },
  { value: 'both', label: 'Both' },
] as const;

// ---------- Qualification Levels ----------

export const QUALIFICATION_LEVELS = [
  { value: 'ssc', label: 'SSC Completed' },
  { value: 'hsc', label: 'HSC Completed' },
  { value: 'bachelors-running', label: "Bachelor's Running" },
  { value: 'bachelors-completed', label: "Bachelor's Completed" },
  { value: 'masters-running', label: "Master's Running" },
  { value: 'masters-completed', label: "Master's Completed" },
] as const;

// ---------- Institution Suggestions ----------

export const INSTITUTION_SUGGESTIONS = [
  'Pabna University of Science and Technology (PUST)',
  'Pabna Medical College',
  'Pabna Cadet College',
  'Edward College',
  'Government Edward College',
  'Pabna Polytechnic Institute',
  'Rajshahi University',
  'Rajshahi University of Engineering and Technology (RUET)',
  'Rajshahi Medical University',
  'Islamic University, Kushtia',
  'Dhaka University',
  'BUET',
  'Other',
] as const;

// ---------- Gender Options ----------

export const GENDER_OPTIONS = [
  { value: null, label: 'No Preference' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
] as const;

// ---------- Days of the Week ----------

export const DAYS_OF_WEEK = [
  'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
] as const;
