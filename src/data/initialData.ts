import {
  Course,
  Teacher,
  AdmissionApplication,
  ContactMessage,
  GalleryItem,
  Notice,
  StudentResult,
  DashboardStats
} from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-matric-sci',
    title: 'Matriculation Science (9th & 10th)',
    category: 'Matric',
    shortDescription: 'Comprehensive Board preparation in Physics, Chemistry, Biology, and Mathematics with practical lab training.',
    fullDescription: 'Our Matric Science program provides rigorous exam preparation for BISE Faisalabad with weekly test sessions, individual mentoring, complete syllabus coverage, and past paper revisions.',
    duration: '1 Year per grade',
    fee: 4500,
    feePeriod: 'per month',
    image: 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?auto=format&fit=crop&q=80&w=800',
    features: [
      'BISE Faisalabad Board Pattern',
      'Daily Practice Worksheets & Tests',
      'Science Lab Practicals',
      'Special Focus on Physics & Chemistry Concepts',
      'Bi-weekly Progress Reports to Parents'
    ],
    schedule: 'Mon - Sat (3:00 PM - 6:00 PM)',
    instructor: 'Sir Izhar (Physics & Maths) & Mam Shiza (Chemistry)',
    appliesCount: 142,
    featured: true
  },
  {
    id: 'course-fsc-premed',
    title: 'F.Sc Pre-Medical (11th & 12th)',
    category: 'Intermediate',
    shortDescription: 'In-depth medical foundation covering Biology, Organic Chemistry, and Physics aimed at top medical college entries.',
    fullDescription: 'An elite pre-medical track designed to prepare students for BISE board exams and build a solid foundation for MDCAT. Taught by senior faculty with decades of top board position track records.',
    duration: '2 Years',
    fee: 6500,
    feePeriod: 'per month',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    features: [
      'Comprehensive Biology & Medical Concepts',
      'Integrated MDCAT Foundation Topics',
      'Weekly Conceptual Tests & Quizzes',
      'Small Batch Sizes for Personal Guidance',
      'Past 10 Years Solved Papers'
    ],
    schedule: 'Mon - Sat (2:00 PM - 5:30 PM)',
    instructor: 'Mam Mahnoor (Biology) & Mam Shiza (Chemistry)',
    appliesCount: 198,
    featured: true
  },
  {
    id: 'course-fsc-preeng',
    title: 'F.Sc Pre-Engineering (11th & 12th)',
    category: 'Intermediate',
    shortDescription: 'Advanced Mathematics, Physics, and Chemistry program structured for UET, NUST, and top engineering universities.',
    fullDescription: 'Targeted academic excellence for future engineers. Features deep problem-solving methodologies, calculus mastery, physics mechanics, and ECAT orientation.',
    duration: '2 Years',
    fee: 6500,
    feePeriod: 'per month',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    features: [
      'Advanced Mathematics & Mechanics',
      'ECAT Preliminary Drills',
      'Numerical Problem Solving Techniques',
      'Regular Mock Examinations',
      'Dedicated Doubt Clearing Hours'
    ],
    schedule: 'Mon - Sat (2:30 PM - 6:00 PM)',
    instructor: 'Sir Izhar (Physics & Maths) & Mam Shiza (Chemistry)',
    appliesCount: 165,
    featured: true
  },
  {
    id: 'course-ics',
    title: 'ICS (Computer Science / Math / Physics)',
    category: 'Intermediate',
    shortDescription: 'Modern computer science fundamentals, C++/Python programming, and mathematics for tech professionals.',
    fullDescription: 'Prepare for software engineering and IT degrees. Combines theoretical computer science, practical programming labs, logic building, and board syllabus mastery.',
    duration: '2 Years',
    fee: 6000,
    feePeriod: 'per month',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    features: [
      'C++ & Python Hands-on Labs',
      'Database & Database Concepts',
      'Mathematics Logic & Calculus',
      'Project-based Learning Modules',
      'Board Exam Strategy Sessions'
    ],
    schedule: 'Mon - Sat (3:00 PM - 6:30 PM)',
    instructor: 'Sir Abdul Hanan (Computer Science) & Sir Izhar (Maths & Physics)',
    appliesCount: 210,
    featured: true
  },
  {
    id: 'course-mdcat-ecat',
    title: 'MDCAT & ECAT Entry Test Preparation',
    category: 'Entry Test Preparation',
    shortDescription: 'High-intensity crash and comprehensive coaching for Medical (MDCAT) and Engineering (ECAT/NUST) entry tests.',
    fullDescription: 'Boost your score with short tricks, time management strategies, 10,000+ MCQs practice bank, full-length mock tests, and error analysis sessions.',
    duration: '3 Months Intensive',
    fee: 18000,
    feePeriod: 'total course fee',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    features: [
      '10,000+ Topic-wise Practice MCQs',
      '15+ Full Length Grand Mock Tests',
      'Time Management Short Cut Tricks',
      'Daily Ranking & Performance Analytics',
      'Doubt Solution Desk by Top Rankers'
    ],
    schedule: 'Mon - Sun (9:00 AM - 1:00 PM)',
    instructor: 'Sir Izhar (Physics/Math), Mam Shiza (Chem) & Mam Mahnoor (Bio)',
    appliesCount: 310,
    featured: true
  },
  {
    id: 'course-spoken-english',
    title: 'Spoken English & Public Speaking',
    category: 'Spoken English',
    shortDescription: 'Fluency, pronunciation, vocabulary enhancement, confidence building, and interview preparation course.',
    fullDescription: 'Transform your communication skills with interactive conversations, role plays, debate sessions, accent refinement, and professional etiquette training.',
    duration: '2 Months',
    fee: 5000,
    feePeriod: 'per month',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    features: [
      'Daily Conversation & Speaking Practice',
      'Vocabulary Expansion Exercises',
      'Grammar in Real Context',
      'Public Speaking & Presentation Skills',
      'Certificate of Completion'
    ],
    schedule: 'Mon, Wed, Fri (5:00 PM - 6:30 PM)',
    instructor: 'Miss Ayesha (English Teacher)',
    appliesCount: 125
  },
  {
    id: 'course-computer-it',
    title: 'Computer Short Courses & Web Development',
    category: 'Computer Courses',
    shortDescription: 'MS Office, Graphic Design, Web Development (HTML/CSS/JS), and Digital Marketing certifications.',
    fullDescription: 'Practical IT training on high-spec computer labs. Learn essential office automation, graphic designing basics, or modern web frontend development skills.',
    duration: '3 Months',
    fee: 6000,
    feePeriod: 'per month',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    features: [
      '100% Practical Computer Lab Training',
      'MS Office & Advanced Excel',
      'Web Design Fundamentals',
      'Freelancing & Online Earning Intro',
      'Government Recognized Certificate'
    ],
    schedule: 'Tue, Thu, Sat (4:00 PM - 6:00 PM)',
    instructor: 'Sir Abdul Hanan (Senior IT Instructor)',
    appliesCount: 180
  },
  {
    id: 'course-tuition-classes',
    title: 'Evening Academy Tuition (Class 6th to 8th)',
    category: 'Tuition Classes',
    shortDescription: 'Strong foundation building in Science, Mathematics, English, and Urdu for junior grades.',
    fullDescription: 'Disciplined evening tuition ensuring homework completion, conceptual clarity, weekly revision tests, and base strengthening for higher board classes.',
    duration: 'Ongoing Academic Session',
    fee: 3500,
    feePeriod: 'per month',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
    features: [
      'Homework Assistance & Supervision',
      'Mathematics Foundation Building',
      'Urdu & English Reading & Writing Skills',
      'Monthly Progress Review',
      'Disciplined Learning Atmosphere'
    ],
    schedule: 'Mon - Sat (3:30 PM - 5:30 PM)',
    instructor: 'Junior Academy Faculty Team',
    appliesCount: 95
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'teach-1',
    name: 'Miss Ayesha Wadood',
    role: 'Principal & Senior Director',
    qualification: 'M.Sc Bio Informatics',
    experience: '18+ Years',
    subject: 'Bioinformatics & Administration',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    bio: 'Renowned educationist with 18+ years of experience. Spearheading academic development and strategic leadership at Royal Academy.',
    email: 'ayesha.wadood@royalacademy.edu.pk',
    phone: '03290247580',
    featured: true
  },
  {
    id: 'teach-2',
    name: 'Mam Mahnoor',
    role: 'Head of Biology & Medical Studies',
    qualification: 'M.Phil Biology',
    experience: '10+ Years',
    subject: 'Biology & MDCAT Prep',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    bio: 'Specialist in F.Sc Biology and MDCAT entry test preparation. Author of biology concept guidebooks.',
    email: 'mahnoor@royalacademy.edu.pk',
    phone: '+92 333 3291033',
    featured: true
  },
  {
    id: 'teach-3',
    name: 'Sir Izhar',
    role: 'Senior Faculty of Physics & Mathematics',
    qualification: 'M.Sc Physics & Mathematics',
    experience: '12+ Years',
    subject: 'Physics, Mathematics & ECAT Prep',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    bio: 'Passionate math and physics mentor specializing in calculus, mechanics, and entry-test conceptual drills.',
    email: 'izhar@royalacademy.edu.pk',
    phone: '+92 322 6030712',
    featured: true
  },
  {
    id: 'teach-4',
    name: 'Sir Abdul Hanan',
    role: 'Head of Computer Science & IT',
    qualification: 'M.S. Computer Science',
    experience: '10+ Years',
    subject: 'Computer Science & IT Applications',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    bio: 'Expert in programming, database structures, and board syllabus guidelines. Dedicated to practical programming labs.',
    email: 'abdulhanan@royalacademy.edu.pk',
    phone: '+92 302 3967929',
    featured: true
  },
  {
    id: 'teach-5',
    name: 'Mam Shiza',
    role: 'Senior Chemistry Lecturer',
    qualification: 'M.Sc Chemistry',
    experience: '8+ Years',
    subject: 'Chemistry & Board Exam Prep',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    bio: 'Expert in organic chemistry reaction mechanisms and general board exam prep structures.',
    email: 'shiza@royalacademy.edu.pk',
    phone: '+92 335 6665877',
    featured: true
  },
  {
    id: 'teach-6',
    name: 'Miss Ayesha',
    role: 'English Lecturer & Advisor',
    qualification: 'M.A. English Literature',
    experience: '8+ Years',
    subject: 'English & Spoken Skills',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    bio: 'Expert instructor leading public speaking workshops, English conversation modules, and board prep revision panels.',
    email: 'ayesha.english@royalacademy.edu.pk',
    phone: '03290247580',
    featured: true
  }
];

export const INITIAL_ADMISSIONS: AdmissionApplication[] = [
  {
    id: 'APP-2026-101',
    studentName: 'Hamza Bilal',
    fatherName: 'Bilal Mustafa',
    email: 'hamza.bilal@example.com',
    phone: '0300-9876543',
    gender: 'Male',
    dateOfBirth: '2008-05-14',
    address: 'Street 5, Mansoorabad, Faisalabad',
    courseId: 'course-fsc-premed',
    courseName: 'F.Sc Pre-Medical (11th & 12th)',
    previousEducation: 'Matric Science (1020/1100 marks)',
    cnicBForm: '33100-1234567-1',
    guardianPhone: '0321-7654321',
    status: 'Approved',
    createdAt: '2026-07-20T10:30:00Z',
    adminNotes: 'Documents verified. Scholarship tier 1 approved.'
  },
  {
    id: 'APP-2026-102',
    studentName: 'Ayesha Fatima',
    fatherName: 'Tariq Javed',
    email: 'ayesha.tariq@example.com',
    phone: '0312-3456789',
    gender: 'Female',
    dateOfBirth: '2008-09-22',
    address: 'Farooqabad, Street 12, Faisalabad',
    courseId: 'course-ics',
    courseName: 'ICS (Computer Science / Math / Physics)',
    previousEducation: 'Matric Science (980/1100 marks)',
    cnicBForm: '33100-7654321-2',
    guardianPhone: '0300-1122334',
    status: 'Pending',
    createdAt: '2026-07-24T14:15:00Z'
  },
  {
    id: 'APP-2026-103',
    studentName: 'Usman Ali',
    fatherName: 'Liaquat Ali',
    email: 'usman.ali@example.com',
    phone: '0333-8877665',
    gender: 'Male',
    dateOfBirth: '2007-02-10',
    address: 'Madina Town, Faisalabad',
    courseId: 'course-mdcat-ecat',
    courseName: 'MDCAT & ECAT Entry Test Preparation',
    previousEducation: 'F.Sc Pre-Engineering (480/520 Part 1)',
    cnicBForm: '33102-3344556-9',
    guardianPhone: '0333-8877665',
    status: 'Under Review',
    createdAt: '2026-07-25T09:45:00Z',
    adminNotes: 'Awaiting intermediate board mark sheet copy.'
  }
];

export const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Muhammad Imran',
    email: 'imran.faisalabad@gmail.com',
    phone: '0321-9988776',
    subject: 'Inquiry about Evening Matric Classes Fee',
    message: 'Respected Sir, I want to know if there is any discount for siblings enrolling in 9th and 10th science classes? Kindly share timing details.',
    date: '2026-07-26T11:20:00Z',
    status: 'Unread'
  },
  {
    id: 'msg-2',
    name: 'Saima Usman',
    email: 'saima.usman@yahoo.com',
    phone: '0305-4433221',
    subject: 'MDCAT Entry Test Batch Timing',
    message: 'Hello, please let me know when the new MDCAT crash course batch starts after F.Sc board exams?',
    date: '2026-07-25T16:00:00Z',
    status: 'Read'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Modern Science & Physics Lab Sessions',
    category: 'Classroom',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    date: 'June 2026',
    description: 'Students conducting hands-on physics and chemistry experiments under faculty supervision.'
  },
  {
    id: 'gal-2',
    title: 'Annual Position Holders Prize Distribution',
    category: 'Achievements',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800',
    date: 'May 2026',
    description: 'Celebrating high achievers in BISE Faisalabad board examinations with shields and cash prizes.'
  },
  {
    id: 'gal-3',
    title: 'Interactive High-Tech Computer Lab',
    category: 'Classroom',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    date: 'April 2026',
    description: 'ICS students learning C++ programming and web development in modern desktop workstations.'
  },
  {
    id: 'gal-4',
    title: 'Royal Academy Annual Sports Day',
    category: 'Activities',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    date: 'March 2026',
    description: 'Cricket, badminton, and athletic competitions encouraging physical wellness alongside academics.'
  },
  {
    id: 'gal-5',
    title: 'MDCAT & Entry Test Seminar',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
    date: 'February 2026',
    description: 'Orientation session for pre-medical and pre-engineering aspirants on cracking entry test MCQs.'
  },
  {
    id: 'gal-6',
    title: 'Spoken English & Public Speaking Contest',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
    date: 'January 2026',
    description: 'Debate and presentation competition boosting student confidence and speech fluency.'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Admissions Open for Session 2026-2027 (Limited Seats)',
    category: 'General',
    content: 'Royal Academy is now accepting online and physical admission applications for Matric, F.Sc, ICS, and Entry Test classes. Apply early to secure early bird fee waivers.',
    date: '2026-07-26',
    urgent: true
  },
  {
    id: 'not-2',
    title: 'BISE Faisalabad Board Examination Revision Series',
    category: 'Academic',
    content: 'Special past paper revision and grand test sessions for 9th, 10th, 11th, and 12th classes will commence from Monday at 3:00 PM.',
    date: '2026-07-22',
    urgent: false
  },
  {
    id: 'not-3',
    title: 'Parent-Teacher Meeting (PTM) Schedule',
    category: 'Event',
    content: 'Monthly PTM for all Intermediate sections will be held on Saturday from 10:00 AM to 1:00 PM. Student attendance cards and test performance will be shared.',
    date: '2026-07-18',
    urgent: false
  }
];

export const INITIAL_RESULTS: StudentResult[] = [
  {
    id: 'res-1',
    rollNumber: 'RA-2025-1001',
    studentName: 'Hamza Bilal',
    fatherName: 'Bilal Mustafa',
    className: 'Matric Science (10th)',
    examName: 'Annual BISE Board Exam 2025',
    marksObtained: 1042,
    totalMarks: 1100,
    percentage: 94.7,
    grade: 'A+',
    status: 'Pass'
  },
  {
    id: 'res-2',
    rollNumber: 'RA-2025-1002',
    studentName: 'Fatima Zahra',
    fatherName: 'Zahid Mahmood',
    className: 'F.Sc Pre-Medical (12th)',
    examName: 'Annual BISE Board Exam 2025',
    marksObtained: 1018,
    totalMarks: 1100,
    percentage: 92.5,
    grade: 'A+',
    status: 'Pass'
  },
  {
    id: 'res-3',
    rollNumber: 'RA-2025-1003',
    studentName: 'Zain Ul Abidin',
    fatherName: 'Abid Hussain',
    className: 'ICS (12th)',
    examName: 'Annual BISE Board Exam 2025',
    marksObtained: 985,
    totalMarks: 1100,
    percentage: 89.5,
    grade: 'A+',
    status: 'Pass'
  },
  {
    id: 'res-4',
    rollNumber: 'RA-2025-1004',
    studentName: 'Ahmad Hassan',
    fatherName: 'Hassan Raza',
    className: 'MDCAT Grand Mock',
    examName: 'MDCAT Practice Series Test 5',
    marksObtained: 188,
    totalMarks: 200,
    percentage: 94.0,
    grade: 'A+',
    status: 'Pass'
  }
];

export const INITIAL_STATS: DashboardStats = {
  totalStudents: 850,
  totalCourses: INITIAL_COURSES.length,
  pendingAdmissions: INITIAL_ADMISSIONS.filter(a => a.status === 'Pending').length,
  totalTeachers: INITIAL_TEACHERS.length,
  unreadMessages: INITIAL_CONTACT_MESSAGES.filter(m => m.status === 'Unread').length,
  totalApplications: INITIAL_ADMISSIONS.length
};
