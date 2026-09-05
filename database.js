/**
 * SZABIST CGPA Calculator - Database Module
 * Contains all curriculum data for all programs
 * 
 * Programs:
 * - BSCS: BS Computer Science
 * - BSAI: BS Artificial Intelligence
 * - BSSE: BS Software Engineering
 * - BBA: Bachelor of Business Administration
 * - BSAF: BS Accounting & Finance
 * - BSBA: BS Business Analytics
 * - BSMS: BS Media Sciences
 */

const DATABASE = {
  // Cached lookup
  _courseLookupCache: null,

  // ============================================
  // CURRICULUM DATA
  // ============================================
  
  curriculum: {
    BSCS: {
      name: "BS Computer Science",
      totalCredits: 132,
      semesters: {
        1: [
          { code: "CSC 1101", name: "Calculus and Analytical Geometry", credits: 3, type: "Core" },
          { code: "CSC 1102", name: "English Composition and Comprehension", credits: 3, type: "Core" },
          { code: "CSC 1103", name: "Fundamentals of Programming", credits: 3, type: "Core" },
          { code: "CSCL 1103", name: "Lab: Fundamentals of Programming", credits: 1, type: "Core" },
          { code: "CSC 1107", name: "Applied Physics", credits: 2, type: "Core" },
          { code: "CSCL 1107", name: "Lab: Applied Physics", credits: 1, type: "Core" },
          { code: "CSC 1108", name: "Introduction to Computer Science", credits: 2, type: "Core" },
          { code: "CSCL 1108", name: "Lab: Introduction to Computer Science", credits: 1, type: "Core" }
        ],
        2: [
          { code: "CSC 1207", name: "Digital Logic Design", credits: 2, type: "Core" },
          { code: "CSCL 1207", name: "Lab: Digital Logic Design", credits: 1, type: "Core" },
          { code: "CSC 1208", name: "Object Oriented Programming Techniques", credits: 3, type: "Core" },
          { code: "CSCL 1208", name: "Lab: Object Oriented Programming Techniques", credits: 1, type: "Core" },
          { code: "CSC 1206", name: "Probability and Statistics", credits: 3, type: "Core" },
          { code: "CSC 1209", name: "Islamic Studies/ Humanities", credits: 2, type: "Core" },
          { code: "CSC 3515", name: "Understanding of Holy Quran-I (Muslim Students)", credits: 1, type: "Core" },
          { code: "CSC 1109", name: "Pakistan Studies", credits: 2, type: "Core" },
          { code: "CSC 2101", name: "Communication and Presentation Skills", credits: 3, type: "Core" }
        ],
        3: [
          { code: "CSC 1201", name: "Discrete Mathematical Structures", credits: 3, type: "Core" },
          { code: "CSC 1202", name: "Multivariate Calculus", credits: 3, type: "Core" },
          { code: "CSC 2102", name: "Data Structures and Algorithms", credits: 3, type: "Core" },
          { code: "CSCL 2102", name: "Lab: Data Structures and Algorithms", credits: 1, type: "Core" },
          { code: "CSC 3105", name: "Computer Organization and Assembly Language", credits: 2, type: "Core", keywords: ["COAL"] },
          { code: "CSCL 3105", name: "Lab: Computer Organization and Assembly Language", credits: 1, type: "Core", keywords: ["COAL", "COAL Lab"] },
          { code: "CSC 3106", name: "HCI & Computer Graphics", credits: 2, type: "Core" },
          { code: "CSCL 3106", name: "Lab: HCI & Computer Graphics", credits: 1, type: "Core" },
          { code: "CSC 3215", name: "Understanding of Holy Quran-II (Muslim Students)", credits: 1, type: "Core" },
          { code: "CSC xxxx", name: "Ethics and Morality (Non-Muslim Students)", credits: 2, type: "Core" },
          { code: "CSC xxxx", name: "University Elective-1", credits: 2, type: "Elective" }
        ],
        4: [
          { code: "CSC 2203", name: "Database Systems", credits: 3, type: "Core" },
          { code: "CSCL 2203", name: "Lab: Database Systems", credits: 1, type: "Core" },
          { code: "CSC 2204", name: "Finite Automata Theory and Formal Languages", credits: 3, type: "Core" },
          { code: "CSC 2206", name: "Linear Algebra", credits: 3, type: "Core" },
          { code: "CSC 3101", name: "Computer Architecture", credits: 3, type: "Core" },
          { code: "CSC 3202", name: "Design and Analysis of Algorithms", credits: 3, type: "Core" },
          { code: "CSC 1211", name: "Ideology and Constitution of Pakistan", credits: 2, type: "Core" }
        ],
        5: [
          { code: "CSC 3107", name: "Operating Systems", credits: 2, type: "Core" },
          { code: "CSCL 3107", name: "Lab: Operating Systems", credits: 1, type: "Core" },
          { code: "CSC 3108", name: "Advance Database Management Systems", credits: 2, type: "Core" },
          { code: "CSCL 3108", name: "Lab: Advance Database Management Systems", credits: 1, type: "Core" },
          { code: "CSC 3109", name: "Software Engineering", credits: 3, type: "Core" },
          { code: "CSC 3201", name: "Compiler Construction", credits: 3, type: "Core" },
          { code: "CSC 3110", name: "Community Service", credits: 1, type: "Core" },
          { code: "CSC 3111", name: "Entrepreneurship", credits: 2, type: "Core" }
        ],
        6: [
          { code: "CSC 1205", name: "Technical and Business Writing", credits: 3, type: "Core" },
          { code: "CSC 3206", name: "Artificial Intelligence", credits: 2, type: "Core" },
          { code: "CSCL 3206", name: "Lab: Artificial Intelligence", credits: 1, type: "Core" },
          { code: "CSC 3209", name: "Computer Networks", credits: 2, type: "Core" },
          { code: "CSCL 3209", name: "Lab: Computer Networks", credits: 1, type: "Core" },
          { code: "CSC xxxx", name: "CS Elective-1", credits: 3, type: "Elective" },
          { code: "CSC xxxx", name: "CS Elective-2", credits: 3, type: "Elective" }
        ],
        7: [
          { code: "CSC 4105", name: "Final Year Project-I", credits: 3, type: "Core" },
          { code: "CSC 4107", name: "Information Security", credits: 2, type: "Core" },
          { code: "CSCL 4107", name: "Lab: Information Security", credits: 1, type: "Core" },
          { code: "CSC 4109", name: "Professional Practices", credits: 2, type: "Core" },
          { code: "CSC xxxx", name: "CS Elective-3", credits: 3, type: "Elective" },
          { code: "CSC xxxx", name: "CS Elective-4", credits: 3, type: "Elective" },
          { code: "CSC xxxx", name: "University Elective-2", credits: 3, type: "Elective" }
        ],
        8: [
          { code: "CSC 4106", name: "Parallel and Distributed Computing", credits: 3, type: "Core" },
          { code: "CSC 4205", name: "Final Year Project-II", credits: 3, type: "Core" },
          { code: "CSC xxxx", name: "CS Elective-5", credits: 3, type: "Elective" },
          { code: "CSC xxxx", name: "CS Elective-6", credits: 3, type: "Elective" },
          { code: "CSC xxxx", name: "CS Elective-7", credits: 3, type: "Elective" }
        ]
      }
    },
    BSSE: {
      name: "BS Software Engineering",
      totalCredits: 132,
      semesters: {
        1: [
          { code: "CSC 1101", name: "Calculus and Analytical Geometry", credits: 3, type: "Core" },
          { code: "CSC 1102", name: "English Composition and Comprehension", credits: 3, type: "Core" },
          { code: "CSC 1103", name: "Fundamentals of Programming", credits: 3, type: "Core" },
          { code: "CSCL 1103", name: "Lab: Fundamentals of Programming", credits: 1, type: "Core" },
          { code: "CSC 1108", name: "Introduction to Computer Science", credits: 2, type: "Core" },
          { code: "CSCL 1108", name: "Lab: Introduction to Computer Science", credits: 1, type: "Core" },
          { code: "CSC 1107", name: "Applied Physics", credits: 2, type: "Core" },
          { code: "CSCL 1107", name: "Lab: Applied Physics", credits: 1, type: "Core" }
        ],
        2: [
          { code: "CSC 1208", name: "Object Oriented Programming Techniques", credits: 3, type: "Core" },
          { code: "CSCL 1208", name: "Lab: Object Oriented Programming Techniques", credits: 1, type: "Core" },
          { code: "CSC 1206", name: "Probability and Statistics", credits: 3, type: "Core" },
          { code: "CSC 1207", name: "Digital Logic Design", credits: 2, type: "Core" },
          { code: "CSCL 1207", name: "Lab: Digital Logic Design", credits: 1, type: "Core" },
          { code: "CSC 1209", name: "Islamic Studies/ Humanities", credits: 2, type: "Core" },
          { code: "CSC 3115", name: "Understanding of Holy Quran-I (Muslim Students)", credits: 1, type: "Core" },
          { code: "CSC 1109", name: "Pakistan Studies", credits: 2, type: "Core" },
          { code: "CSC 2101", name: "Communication and Presentation Skills", credits: 3, type: "Core" }
        ],
        3: [
          { code: "CSC 2102", name: "Data Structures and Algorithms", credits: 3, type: "Core" },
          { code: "CSCL 2102", name: "Lab: Data Structures and Algorithms", credits: 1, type: "Core" },
          { code: "CSC 1201", name: "Discrete Mathematical Structures", credits: 3, type: "Core" },
          { code: "CSC 2206", name: "Linear Algebra", credits: 3, type: "Core" },
          { code: "CSC 3105", name: "Computer Organization and Assembly Language", credits: 2, type: "Core", keywords: ["COAL"] },
          { code: "CSCL 3105", name: "Lab: Computer Organization and Assembly Language", credits: 1, type: "Core", keywords: ["COAL", "COAL Lab"] },
          { code: "CSC 3109", name: "Software Engineering", credits: 3, type: "Core" },
          { code: "CSC 3215", name: "Understanding of Holy Quran-II (Muslim Students)", credits: 1, type: "Core" },
          { code: "CSC xxxx", name: "Ethics and Morality (Non-Muslim Students)", credits: 2, type: "Core" },
          { code: "SEC xxxx", name: "University Elective-1", credits: 2, type: "Elective" }
        ],
        4: [
          { code: "CSC 3107", name: "Operating Systems", credits: 2, type: "Core" },
          { code: "CSCL 3107", name: "Lab: Operating Systems", credits: 1, type: "Core" },
          { code: "CSC 2203", name: "Database Systems", credits: 3, type: "Core" },
          { code: "CSCL 2203", name: "Lab: Database Systems", credits: 1, type: "Core" },
          { code: "SEC 2406", name: "Software Design and Architecture", credits: 3, type: "Core" },
          { code: "CSC 1202", name: "Multivariate Calculus", credits: 3, type: "Core" },
          { code: "SEC 2407", name: "Software Requirement Engineering", credits: 2, type: "Core" },
          { code: "SECL 2407", name: "Lab: Software Requirement Engineering", credits: 1, type: "Core" },
          { code: "CSC 1211", name: "Ideology and Constitution of Pakistan", credits: 2, type: "Core" }
        ],
        5: [
          { code: "SEC 3604", name: "Software Construction and Development", credits: 2, type: "Core" },
          { code: "SECL 3604", name: "Lab: Software Construction and Development", credits: 1, type: "Core" },
          { code: "CSC 3209", name: "Computer Networks", credits: 2, type: "Core" },
          { code: "CSCL 3209", name: "Lab: Computer Networks", credits: 1, type: "Core" },
          { code: "CSC 1205", name: "Technical and Business Writing", credits: 3, type: "Core" },
          { code: "CSC 3202", name: "Design and Analysis of Algorithms", credits: 3, type: "Core" },
          { code: "CSC 3110", name: "Community Service", credits: 1, type: "Core" },
          { code: "CSC 3111", name: "Entrepreneurship", credits: 2, type: "Core" }
        ],
        6: [
          { code: "SEC 3608", name: "Software Quality Engineering and Testing", credits: 3, type: "Core" },
          { code: "CSC 4107", name: "Information Security", credits: 2, type: "Core" },
          { code: "CSC 4107", name: "Lab: Information Security", credits: 1, type: "Core" },
          { code: "CSC 4109", name: "Professional Practices", credits: 2, type: "Core" },
          { code: "SEC xxxx", name: "SE Elective-1", credits: 3, type: "Elective" },
          { code: "SEC xxxx", name: "SE Elective-2", credits: 3, type: "Elective" },
          { code: "CSC 3206", name: "Artificial Intelligence", credits: 2, type: "Core" },
          { code: "CSCL 3206", name: "Lab: Artificial Intelligence", credits: 1, type: "Core" }
        ],
        7: [
          { code: "CSC 4105", name: "Final Year Project-I", credits: 3, type: "Core" },
          { code: "SEC 3603", name: "Software Project Management", credits: 3, type: "Core" },
          { code: "SEC xxxx", name: "SE Elective-3", credits: 3, type: "Elective" },
          { code: "SEC xxxx", name: "SE Elective-4", credits: 3, type: "Elective" },
          { code: "CSC 4106", name: "Parallel and Distributed Computing", credits: 3, type: "Core" }
        ],
        8: [
          { code: "CSC 4205", name: "Final Year Project-II", credits: 3, type: "Core" },
          { code: "SEC xxxx", name: "University Elective-2", credits: 2, type: "Elective" },
          { code: "SEC xxxx", name: "SE Elective-5", credits: 3, type: "Elective" },
          { code: "SEC xxxx", name: "SE Elective-6", credits: 3, type: "Elective" },
          { code: "SEC xxxx", name: "SE Elective-7", credits: 3, type: "Elective" }
        ]
      }
    },
    BBA: {
      name: "Bachelor of Business Administration",
      totalCredits: 146,
      semesters: {
        1: [
          { code: "BA 1108", name: "IT in Business", credits: 3, type: "Core" },
          { code: "BA 1109", name: "Personal Management and Communication", credits: 3, type: "Core" },
          { code: "BA 1203", name: "Management Principles", credits: 3, type: "Core" },
          { code: "BA 1206", name: "Oral Communication and Presentation Skills", credits: 3, type: "Core" },
          { code: "BA 1122", name: "Islamic Studies / Humanities", credits: 2, type: "Core" },
          { code: "BA 2313", name: "Sociology", credits: 2, type: "Core" },
          { code: "BA 1215", name: "Ideology and Constitution of Pakistan", credits: 2, type: "Core" },
          { code: "BA 1120", name: "Understanding of Holy Quran-I (Muslim Students)", credits: 1, type: "Core" }
        ],
        2: [
          { code: "BA 1101", name: "Introduction to Accounting", credits: 3, type: "Core" },
          { code: "BA 1102", name: "Microeconomics", credits: 3, type: "Core" },
          { code: "BA 1105", name: "English Writing Skills", credits: 3, type: "Core" },
          { code: "BA 1204", name: "Math for Business", credits: 3, type: "Core" },
          { code: "BA 2403", name: "Business Ethics", credits: 3, type: "Core" },
          { code: "BA 2312", name: "Human Behavior", credits: 3, type: "Core" },
          { code: "BA 1220", name: "Understanding of Holy Quran-II (Muslim Students)", credits: 1, type: "Core" },
          { code: "BA xxxx", name: "Ethics and Morality (Non-Muslim Students)", credits: 2, type: "Core" }
        ],
        3: [
          { code: "BA 1201", name: "Financial Accounting", credits: 3, type: "Core" },
          { code: "BA 1211", name: "Logic and Critical Thinking", credits: 3, type: "Core" },
          { code: "BA 3504", name: "Organizational Behavior", credits: 3, type: "Core" },
          { code: "BA 2303", name: "Marketing Principles", credits: 3, type: "Core" },
          { code: "BA 1202", name: "Macroeconomics", credits: 3, type: "Core" },
          { code: "BA 2406", name: "Business and Electronic Communication", credits: 3, type: "Core" }
        ],
        4: [
          { code: "BA 2311", name: "Business Statistics", credits: 3, type: "Core" },
          { code: "BA 2411", name: "Cost and Management Accounting", credits: 3, type: "Core" },
          { code: "BA 3502", name: "Entrepreneurship", credits: 3, type: "Core" },
          { code: "BA 2413", name: "Consumer Behavior", credits: 2, type: "Core" },
          { code: "BA 2415", name: "Community Service Project", credits: 2, type: "Core" },
          { code: "BA 2418", name: "Pakistan Studies", credits: 2, type: "Core" },
          { code: "BA xxxx", name: "Natural Science Elective", credits: 3, type: "Elective" }
        ],
        5: [
          { code: "BA 2301", name: "Introduction to Business Finance", credits: 3, type: "Core" },
          { code: "BA 3501", name: "Financial Markets and Institutions", credits: 3, type: "Core" },
          { code: "BA 3508", name: "Media Management", credits: 3, type: "Core" },
          { code: "BA 3605", name: "Statistical Inference", credits: 3, type: "Core" },
          { code: "BA 4706", name: "Development Economics", credits: 3, type: "Core" },
          { code: "BA xxxx", name: "University Elective", credits: 3, type: "Elective" }
        ],
        6: [
          { code: "BA 3601", name: "Financial Management", credits: 3, type: "Core" },
          { code: "BA 3602", name: "Marketing Management", credits: 3, type: "Core" },
          { code: "BA 3603", name: "Business Research Methods", credits: 3, type: "Core" },
          { code: "BA 3607", name: "Operations Management", credits: 3, type: "Core" },
          { code: "BA 3630", name: "Human Resource Management", credits: 3, type: "Core" },
          { code: "BA 4804", name: "Internship/Field Experience", credits: 3, type: "Core" }
        ],
        7: [
          { code: "BA 2402", name: "Retail Management", credits: 3, type: "Core" },
          { code: "BA 3609", name: "Pakistan Economy", credits: 3, type: "Core" },
          { code: "BA 4704", name: "Management Information Systems", credits: 3, type: "Core" },
          { code: "BA 4705", name: "Services Marketing", credits: 3, type: "Core" },
          { code: "BA xxxx", name: "Program Elective-I", credits: 3, type: "Elective" },
          { code: "BA xxxx", name: "Program Elective-II", credits: 3, type: "Elective" }
        ],
        8: [
          { code: "BA 3505", name: "Quantitative Skills", credits: 3, type: "Core" },
          { code: "BA 4710", name: "Business Project", credits: 3, type: "Core" },
          { code: "BA 4801", name: "Law and Taxation", credits: 3, type: "Core" },
          { code: "BA 4814", name: "Project Management", credits: 3, type: "Core" },
          { code: "BA xxxx", name: "Program Elective-III", credits: 3, type: "Elective" },
          { code: "BA xxxx", name: "Program Elective-IV", credits: 3, type: "Elective" }
        ]
      }
    },
    BSBA: {
      name: "BS Business Analytics",
      totalCredits: 146,
      semesters: {
        1: [
          { code: "BSA 1102", name: "Fundamentals of IT & Business Analytics", credits: 3, type: "Core" },
          { code: "BSA 1101", name: "English Writing Skills & OCPS", credits: 3, type: "Core" },
          { code: "BSA 1106", name: "Management Principles", credits: 3, type: "Core" },
          { code: "BSA 1104", name: "Introduction to Accounting", credits: 3, type: "Core" },
          { code: "BSA 1105", name: "Islamic Studies / Humanities", credits: 2, type: "Core" },
          { code: "BSA 1210", name: "Understanding of the Holy Quran-I", credits: 1, type: "Core" },
          { code: "BSA 1107", name: "Sociology", credits: 2, type: "Core" },
          { code: "BSA 1103", name: "Ideology and Constitution of Pakistan", credits: 2, type: "Core" }
        ],
        2: [
          { code: "BSA 1203", name: "Financial Accounting", credits: 3, type: "Core" },
          { code: "BSA 1204", name: "Marketing Principles", credits: 3, type: "Core" },
          { code: "BSA 1202", name: "Business and Technical Writing", credits: 3, type: "Core" },
          { code: "BSA 1205", name: "Maths for Business", credits: 3, type: "Core" },
          { code: "BSA 1201", name: "Artificial Intelligence in Business", credits: 3, type: "Core" },
          { code: "BSA 1206", name: "Programming for Business 1", credits: 2, type: "Core" },
          { code: "BSAL 1206", name: "Lab: Programming for Business 1", credits: 1, type: "Core" },
          { code: "BSA 2410", name: "Understanding of the Holy Quran-II", credits: 1, type: "Core" },
          { code: "BSA xxxx", name: "Ethics and Morality (Non-Muslims)", credits: 2, type: "Core" }
        ],
        3: [
          { code: "BSA 2302", name: "Environmental Science and Sustainability for Business", credits: 3, type: "Core" },
          { code: "BSA 2303", name: "Logic, Critical Thinking and Decision Science", credits: 3, type: "Core" },
          { code: "BSA 2305", name: "Organizational Behaviour", credits: 3, type: "Core" },
          { code: "BSA 2304", name: "Microeconomics", credits: 3, type: "Core" },
          { code: "BSA 2301", name: "Business Statistics", credits: 3, type: "Core" },
          { code: "BSA 2306", name: "Programming for Business 2", credits: 2, type: "Core" },
          { code: "BSAL 2306", name: "Lab: Programming for Business 2", credits: 1, type: "Core" }
        ],
        4: [
          { code: "BSA 2403", name: "Data Structures & Business Applications", credits: 3, type: "Core" },
          { code: "BSA 2404", name: "Introduction to Business Finance", credits: 3, type: "Core" },
          { code: "BSA 2401", name: "Calculus for Business", credits: 3, type: "Core" },
          { code: "BSA 2402", name: "Community Service Project / Civic Engagement", credits: 2, type: "Core" },
          { code: "BSA 2407", name: "Technopreneurship / Entrepreneurship and Innovation in Analytics", credits: 2, type: "Core" },
          { code: "BSA 2406", name: "Pakistan Studies", credits: 2, type: "Core" },
          { code: "BSA 2405", name: "Macroeconomics", credits: 3, type: "Core" }
        ],
        5: [
          { code: "BSA 3502", name: "Business Ethics", credits: 3, type: "Core" },
          { code: "BSA 3506", name: "Marketing Management", credits: 3, type: "Core" },
          { code: "BSA 3503", name: "Data Visualization and Storytelling", credits: 3, type: "Core" },
          { code: "BSA 3504", name: "Database Management Systems for Business", credits: 2, type: "Core" },
          { code: "BSAL 3504", name: "Lab: Database Management Systems for Business", credits: 1, type: "Core" },
          { code: "BSA 3505", name: "Introduction to Econometrics", credits: 3, type: "Core" },
          { code: "BSA 3501", name: "Advanced Business Analytics", credits: 3, type: "Core" }
        ],
        6: [
          { code: "BSA 3604", name: "Human Resource Management", credits: 3, type: "Core" },
          { code: "BSA 3605", name: "Islamic Banking and Finance", credits: 3, type: "Core" },
          { code: "BSA 3602", name: "Business Research Methods", credits: 3, type: "Core" },
          { code: "BSA 3606", name: "Predictive Analytics for Business", credits: 3, type: "Core" },
          { code: "BSA 3603", name: "Financial Management", credits: 3, type: "Core" },
          { code: "BSA 3610", name: "Internship / Field Experience", credits: 3, type: "Core" }
        ],
        7: [
          { code: "BSA 4701", name: "Business Intelligence Tools and Techniques for Big Data", credits: 3, type: "Core" },
          { code: "BSA 4703", name: "Machine Learning for Business Analytics", credits: 2, type: "Core" },
          { code: "BSAL 4703", name: "Lab: Machine Learning for Business Analytics", credits: 1, type: "Core" },
          { code: "BSA 4702", name: "Capstone / Business Project", credits: 3, type: "Core" },
          { code: "BSA 4704", name: "Services Marketing", credits: 3, type: "Core" },
          { code: "BSA 4xxx", name: "Program Elective-I", credits: 3, type: "Elective" },
          { code: "BSA 4xxx", name: "Program Elective-II", credits: 3, type: "Elective" }
        ],
        8: [
          { code: "BSA 4803", name: "Project Management", credits: 3, type: "Core" },
          { code: "BSA 4802", name: "Business Forecasting and Simulation", credits: 3, type: "Core" },
          { code: "BSA 4801", name: "Business Data and Text Mining", credits: 2, type: "Core" },
          { code: "BSAL 4801", name: "Lab: Business Data and Text Mining", credits: 1, type: "Core" },
          { code: "BSA 4804", name: "Auditing", credits: 3, type: "Core" },
          { code: "BSA 4xxx", name: "Program Elective-III", credits: 3, type: "Elective" },
          { code: "BSA 4xxx", name: "Program Elective-IV", credits: 3, type: "Elective" }
        ]
      }
    },
    BSAF: {
      name: "BS Accounting & Finance",
      totalCredits: 146,
      semesters: {
        1: [
          { code: "AF 1101", name: "Introduction to Accounting", credits: 3, type: "Core" },
          { code: "AF 1102", name: "IT in Business", credits: 3, type: "Core" },
          { code: "AF 1103", name: "Personal Management and Communication", credits: 3, type: "Core" },
          { code: "AF 1104", name: "Management Principles", credits: 3, type: "Core" },
          { code: "AF 1105", name: "Islamic Studies / Humanities", credits: 2, type: "Core" },
          { code: "AF 1106", name: "Sociology", credits: 2, type: "Core" },
          { code: "AF 1107", name: "Ideology and Constitution of Pakistan", credits: 2, type: "Core" },
          { code: "AF 1108", name: "Understanding of Holy Quran-I (Muslim Students)", credits: 1, type: "Core" }
        ],
        2: [
          { code: "AF 1201", name: "Financial Accounting", credits: 3, type: "Core" },
          { code: "AF 1202", name: "Microeconomics", credits: 3, type: "Core" },
          { code: "AF 1203", name: "English Writing Skills", credits: 3, type: "Core" },
          { code: "AF 1204", name: "Math for Business", credits: 3, type: "Core" },
          { code: "AF 1205", name: "Business Ethics", credits: 3, type: "Core" },
          { code: "AF 1206", name: "Human Behavior", credits: 3, type: "Core" },
          { code: "AF 1207", name: "Understanding of Holy Quran-II (Muslim Students)", credits: 1, type: "Core" },
          { code: "AF xxxx", name: "Ethics and Morality (Non-Muslim Students)", credits: 2, type: "Core" }
        ],
        3: [
          { code: "AF 2301", name: "Cost Accounting", credits: 3, type: "Core" },
          { code: "AF 2302", name: "Macroeconomics", credits: 3, type: "Core" },
          { code: "AF 2303", name: "Business and Electronic Communication", credits: 3, type: "Core" },
          { code: "AF 2304", name: "Logic and Critical Thinking", credits: 3, type: "Core" },
          { code: "AF 2305", name: "Organizational Behavior", credits: 3, type: "Core" },
          { code: "AF 2306", name: "Pakistan Studies", credits: 2, type: "Core" }
        ],
        4: [
          { code: "AF 2401", name: "Business Statistics", credits: 3, type: "Core" },
          { code: "AF 2402", name: "Financial Management", credits: 3, type: "Core" },
          { code: "AF 2403", name: "Entrepreneurship", credits: 3, type: "Core" },
          { code: "AF 2404", name: "Cost and Management Accounting", credits: 3, type: "Core" },
          { code: "AF 2405", name: "Community Service Project", credits: 2, type: "Core" },
          { code: "AF xxxx", name: "Natural Science Elective", credits: 3, type: "Elective" }
        ],
        5: [
          { code: "AF 3501", name: "Corporate Finance", credits: 3, type: "Core" },
          { code: "AF 3502", name: "Taxation", credits: 3, type: "Core" },
          { code: "AF 3503", name: "Auditing", credits: 3, type: "Core" },
          { code: "AF 3504", name: "Financial Markets and Institutions", credits: 3, type: "Core" },
          { code: "AF 3505", name: "Development Economics", credits: 3, type: "Core" },
          { code: "AF xxxx", name: "University Elective", credits: 3, type: "Elective" }
        ],
        6: [
          { code: "AF 3601", name: "Advanced Financial Accounting", credits: 3, type: "Core" },
          { code: "AF 3602", name: "Investment Analysis and Portfolio Management", credits: 3, type: "Core" },
          { code: "AF 3603", name: "Business Research Methods", credits: 3, type: "Core" },
          { code: "AF 3604", name: "Islamic Banking and Finance", credits: 3, type: "Core" },
          { code: "AF 3605", name: "Human Resource Management", credits: 3, type: "Core" },
          { code: "AF 3606", name: "Internship / Field Experience", credits: 3, type: "Core" }
        ],
        7: [
          { code: "AF 4701", name: "Financial Reporting", credits: 3, type: "Core" },
          { code: "AF 4702", name: "Corporate Governance", credits: 3, type: "Core" },
          { code: "AF 4703", name: "Services Marketing", credits: 3, type: "Core" },
          { code: "AF xxxx", name: "Program Elective-I", credits: 3, type: "Elective" },
          { code: "AF xxxx", name: "Program Elective-II", credits: 3, type: "Elective" }
        ],
        8: [
          { code: "AF 4801", name: "Strategic Financial Management", credits: 3, type: "Core" },
          { code: "AF 4802", name: "Business Project", credits: 3, type: "Core" },
          { code: "AF 4803", name: "Law and Taxation", credits: 3, type: "Core" },
          { code: "AF 4804", name: "Project Management", credits: 3, type: "Core" },
          { code: "AF xxxx", name: "Program Elective-III", credits: 3, type: "Elective" },
          { code: "AF xxxx", name: "Program Elective-IV", credits: 3, type: "Elective" }
        ]
      }
    },
    BSMS: {
      name: "BS Media Sciences",
      totalCredits: 132,
      semesters: {
        1: [
          { code: "MS 1101", name: "Introduction to Media Studies", credits: 3, type: "Core" },
          { code: "MS 1102", name: "Functional English", credits: 3, type: "Core" },
          { code: "MS 1103", name: "Mass Communication", credits: 3, type: "Core" },
          { code: "MS 1104", name: "Introduction to Sociology", credits: 3, type: "Core" },
          { code: "MS 1105", name: "Islamic Studies / Humanities", credits: 2, type: "Core" },
          { code: "MS 1106", name: "Understanding of Holy Quran-I (Muslim Students)", credits: 1, type: "Core" }
        ],
        2: [
          { code: "MS 1201", name: "Writing for Media", credits: 3, type: "Core" },
          { code: "MS 1202", name: "Introduction to Journalism", credits: 3, type: "Core" },
          { code: "MS 1203", name: "Communication Skills", credits: 3, type: "Core" },
          { code: "MS 1204", name: "Media and Society", credits: 3, type: "Core" },
          { code: "MS 1205", name: "Pakistan Studies", credits: 2, type: "Core" },
          { code: "MS 1206", name: "Understanding of Holy Quran-II (Muslim Students)", credits: 1, type: "Core" }
        ],
        3: [
          { code: "MS 2101", name: "Reporting and News Writing", credits: 3, type: "Core" },
          { code: "MS 2102", name: "Media Ethics and Law", credits: 3, type: "Core" },
          { code: "MS 2103", name: "Broadcast Journalism", credits: 3, type: "Core" },
          { code: "MS 2104", name: "Introduction to Advertising", credits: 3, type: "Core" },
          { code: "MS xxxx", name: "University Elective-I", credits: 3, type: "Elective" }
        ],
        4: [
          { code: "MS 2201", name: "Public Relations", credits: 3, type: "Core" },
          { code: "MS 2202", name: "Media Research Methods", credits: 3, type: "Core" },
          { code: "MS 2203", name: "Development Communication", credits: 3, type: "Core" },
          { code: "MS 2204", name: "Media Psychology", credits: 3, type: "Core" },
          { code: "MS xxxx", name: "University Elective-II", credits: 3, type: "Elective" }
        ],
        5: [
          { code: "MS 3101", name: "Digital Media", credits: 3, type: "Core" },
          { code: "MS 3102", name: "Advertising Campaigns", credits: 3, type: "Core" },
          { code: "MS 3103", name: "Feature and Column Writing", credits: 3, type: "Core" },
          { code: "MS 3104", name: "Media Management", credits: 3, type: "Core" },
          { code: "MS xxxx", name: "Program Elective-I", credits: 3, type: "Elective" }
        ],
        6: [
          { code: "MS 3201", name: "Film and TV Production", credits: 3, type: "Core" },
          { code: "MS 3202", name: "Documentary Production", credits: 3, type: "Core" },
          { code: "MS 3203", name: "Research Project", credits: 3, type: "Core" },
          { code: "MS xxxx", name: "Program Elective-II", credits: 3, type: "Elective" },
          { code: "MS xxxx", name: "Program Elective-III", credits: 3, type: "Elective" }
        ],
        7: [
          { code: "MS 4101", name: "Internship", credits: 3, type: "Core" },
          { code: "MS 4102", name: "Strategic Communication", credits: 3, type: "Core" },
          { code: "MS xxxx", name: "Program Elective-IV", credits: 3, type: "Elective" },
          { code: "MS xxxx", name: "Program Elective-V", credits: 3, type: "Elective" }
        ],
        8: [
          { code: "MS 4201", name: "Final Year Project", credits: 6, type: "Core" },
          { code: "MS xxxx", name: "Program Elective-VI", credits: 3, type: "Elective" },
          { code: "MS xxxx", name: "Program Elective-VII", credits: 3, type: "Elective" }
        ]
      }
    },
    BSAI: {
      name: "BS Artificial Intelligence",
      totalCredits: 132,
      semesters: {
        1: [
          { code: "CSC 1101", name: "Calculus and Analytical Geometry", credits: 3, type: "Core" },
          { code: "CSC 1102", name: "English Composition and Comprehension", credits: 3, type: "Core" },
          { code: "CSC 1103", name: "Fundamentals of Programming", credits: 3, type: "Core" },
          { code: "CSCL 1103", name: "Lab: Fundamentals of Programming", credits: 1, type: "Core" },
          { code: "CSC 1108", name: "Introduction to Computer Science", credits: 2, type: "Core" },
          { code: "CSCL 1108", name: "Lab: Introduction to Computer Science", credits: 1, type: "Core" },
          { code: "CSC 1107", name: "Applied Physics", credits: 2, type: "Core" },
          { code: "CSCL 1107", name: "Lab: Applied Physics", credits: 1, type: "Core" }
        ],
        2: [
          { code: "CSC 1208", name: "Object Oriented Programming Techniques", credits: 3, type: "Core" },
          { code: "CSCL 1208", name: "Lab: Object Oriented Programming Techniques", credits: 1, type: "Core" },
          { code: "CSC 1206", name: "Probability and Statistics", credits: 3, type: "Core" },
          { code: "CSC 1207", name: "Digital Logic Design", credits: 2, type: "Core" },
          { code: "CSCL 1207", name: "Lab: Digital Logic Design", credits: 1, type: "Core" },
          { code: "CSC 1209", name: "Islamic Studies / Humanities", credits: 2, type: "Core" },
          { code: "CSC 3115", name: "Understanding of Holy Quran-I (Muslim Students)", credits: 1, type: "Core" },
          { code: "CSC 1109", name: "Pakistan Studies", credits: 2, type: "Core" },
          { code: "CSC 2101", name: "Communication and Presentation Skills", credits: 3, type: "Core" }
        ],
        3: [
          { code: "CSC 2102", name: "Data Structures and Algorithms", credits: 3, type: "Core" },
          { code: "CSCL 2102", name: "Lab: Data Structures and Algorithms", credits: 1, type: "Core" },
          { code: "CSC 3105", name: "Computer Organization and Assembly Language", credits: 2, type: "Core", keywords: ["COAL"] },
          { code: "CSCL 3105", name: "Lab: Computer Organization and Assembly Language", credits: 1, type: "Core", keywords: ["COAL", "COAL Lab"] },
          { code: "CSC 1201", name: "Discrete Mathematical Structures", credits: 3, type: "Core" },
          { code: "CSC 3206", name: "Artificial Intelligence", credits: 2, type: "Core" },
          { code: "CSCL 3206", name: "Lab: Artificial Intelligence", credits: 1, type: "Core" },
          { code: "CSC 1202", name: "Multivariate Calculus", credits: 3, type: "Core" },
          { code: "CSC 1211", name: "Ideology and Constitution of Pakistan", credits: 2, type: "Core" },
          { code: "CSC 3215", name: "Understanding of Holy Quran-II (Muslim Students)", credits: 1, type: "Core" },
          { code: "CSC xxxx", name: "Ethics and Morality (Non-Muslim Students)", credits: 2, type: "Core" }
        ],
        4: [
          { code: "CSC 3209", name: "Computer Networks", credits: 2, type: "Core" },
          { code: "CSCL 3209", name: "Lab: Computer Networks", credits: 1, type: "Core" },
          { code: "CSC 2203", name: "Database Systems", credits: 3, type: "Core" },
          { code: "CSCL 2203", name: "Lab: Database Systems", credits: 1, type: "Core" },
          { code: "CSC 3202", name: "Design and Analysis of Algorithms", credits: 3, type: "Core" },
          { code: "AIC 2401", name: "Programming for Artificial Intelligence", credits: 2, type: "Core" },
          { code: "AICL 2401", name: "Lab: Programming for Artificial Intelligence", credits: 1, type: "Core" },
          { code: "CSC 2206", name: "Linear Algebra", credits: 3, type: "Core" },
          { code: "AIC xxxx", name: "AI Elective - I", credits: 3, type: "Elective" }
        ],
        5: [
          { code: "CSC 3107", name: "Operating Systems", credits: 2, type: "Core" },
          { code: "CSCL 3107", name: "Lab: Operating Systems", credits: 1, type: "Core" },
          { code: "AIC 3501", name: "Artificial Neural Networks", credits: 2, type: "Core" },
          { code: "AICL 3501", name: "Lab: Artificial Neural Networks", credits: 1, type: "Core" },
          { code: "AIC 3503", name: "Machine Learning", credits: 2, type: "Core" },
          { code: "AICL 3503", name: "Lab: Machine Learning", credits: 1, type: "Core" },
          { code: "AIC 3502", name: "Knowledge Representation and Reasoning", credits: 3, type: "Core" },
          { code: "AIC xxxx", name: "AI Elective - II", credits: 3, type: "Elective" },
          { code: "CSC 3111", name: "Entrepreneurship", credits: 2, type: "Core" }
        ],
        6: [
          { code: "CSC 1205", name: "Technical and Business Writing", credits: 3, type: "Core" },
          { code: "AIC 3605", name: "Computer Vision", credits: 2, type: "Core" },
          { code: "AICL 3605", name: "Lab: Computer Vision", credits: 1, type: "Core" },
          { code: "AIC xxxx", name: "University Elective - I", credits: 2, type: "Elective" },
          { code: "CSC 3109", name: "Software Engineering", credits: 3, type: "Core" },
          { code: "AIC xxxx", name: "AI Elective - III", credits: 3, type: "Elective" },
          { code: "CSC 3110", name: "Community Service", credits: 1, type: "Core" }
        ],
        7: [
          { code: "CSC 4107", name: "Information Security", credits: 2, type: "Core" },
          { code: "CSCL 4107", name: "Lab: Information Security", credits: 1, type: "Core" },
          { code: "CSC 4109", name: "Professional Practices", credits: 2, type: "Core" },
          { code: "AIC 4xxx", name: "AI Elective - IV", credits: 3, type: "Elective" },
          { code: "AIC 4xxx", name: "AI Elective - V", credits: 3, type: "Elective" },
          { code: "AIC 4707", name: "Final Year Project - I", credits: 3, type: "Core" },
          { code: "AIC xxxx", name: "AI Elective - VI", credits: 3, type: "Elective" }
        ],
        8: [
          { code: "AIC 4807", name: "Final Year Project - II", credits: 3, type: "Core" },
          { code: "AIC 4xxx", name: "AI Elective - VII", credits: 3, type: "Elective" },
          { code: "CSC 4106", name: "Parallel and Distributed Computing", credits: 3, type: "Core" },
          { code: "CSC xxxx", name: "University Elective - II", credits: 2, type: "Elective" }
        ]
      }
    }
  },

  // ============================================
  // ELECTIVES DATA (From SZABIST Curriculum)
  // ============================================
  electives: {
    BSCS: [
      { code: "CSC 4703", name: "Applied Data Mining", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Data Mining"] },
      { code: "CSC 4706", name: "Digital Image Processing", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "DIP"] },
      { code: "CSC 4708", name: "Enterprise Resource Planning", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "ERP"] },
      { code: "CSC 4712", name: "IT Innovations", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE"] },
      { code: "CSC 4714", name: "Network Security and Encryption", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Security"] },
      { code: "CSC 4716", name: "Switching and Routing", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Networking"] },
      { code: "CSC 4717", name: "Web Technologies-I", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Web", "WT-1"] },
      { code: "CSC 4719", name: "Game Development", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Game"] },
      { code: "CSC 4721", name: "Introduction to Cloud Computing", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Cloud"] },
      { code: "CSC 4722", name: "Introduction to Blockchain Technology", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Blockchain"] },
      { code: "CSC 4723", name: "Blockchain and Smart Contract Development", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Blockchain", "Smart Contracts"] },
      { code: "CSC 4802", name: "Android Application Development", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Android", "Mobile"] },
      { code: "CSC 4803", name: "Auditing Information Systems", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Audit"] },
      { code: "CSC 4805", name: "Data and Network Security", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Security"] },
      { code: "CSC 4808", name: "Ethical Hacking", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Hacking", "Cybersecurity"] },
      { code: "CSC 4814", name: "Software Project Management", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "SPM"] },
      { code: "CSC 4816", name: "Technopreneurship", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Entrepreneurship"] },
      { code: "CSC 4817", name: "Web Technologies-II", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Web", "WT-2"] },
      { code: "CSC 4823", name: "Interaction Design", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "UI", "UX"] },
      { code: "CSC 4824", name: "Embedded Systems", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE"] },
      { code: "CSC 4825", name: "Computer Graphics", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "CG"] },
      { code: "CSC 4826", name: "Introduction to Data Sciences", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Data Science"] },
      { code: "CSC 4724", name: "User Interface Design", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "UI", "UX"] },
      { code: "CSC 4725", name: "Introduction to Development and Operations", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "DevOps"] },
      { code: "CSC 4726", name: "Systems and Network Administration", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "SysAdmin"] },
      { code: "CSC 4827", name: "Software Quality Engineering and Testing", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "SQE", "Testing"] },
      { code: "CSC 4727", name: "Hybrid Mobile Application Development", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Mobile", "React Native"] },
      { code: "CSC 4728", name: "No Code Programming", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE"] },
      { code: "CSC 4828", name: "Algorithmic Trading", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "CS Elective", "DE", "Trading", "Finance"] },
      { code: "CSC 4501", name: "Business and Technology Ethics", credits: 2, type: "University Elective", category: "University Elective", keywords: ["CSC xxxx", "University Elective", "UE", "Ethics"] },
      { code: "CSC 4502", name: "Design and Creativity", credits: 2, type: "University Elective", category: "University Elective", keywords: ["CSC xxxx", "University Elective", "UE", "Design"] },
      { code: "CSC 4503", name: "Introduction to Accounting", credits: 2, type: "University Elective", category: "University Elective", keywords: ["CSC xxxx", "University Elective", "UE", "Accounting"] },
      { code: "CSC 4504", name: "Organizational Behavior", credits: 2, type: "University Elective", category: "University Elective", keywords: ["CSC xxxx", "University Elective", "UE", "OB"] },
      { code: "CSC 4505", name: "Foreign Languages", credits: 2, type: "University Elective", category: "University Elective", keywords: ["CSC xxxx", "University Elective", "UE", "Language", "French", "German", "Chinese", "Arabic"] },
      { code: "CSC 4506", name: "History of Scientific Ideas", credits: 2, type: "University Elective", category: "University Elective", keywords: ["CSC xxxx", "University Elective", "UE", "History"] },
      { code: "CSC 4507", name: "Management Principles", credits: 2, type: "University Elective", category: "University Elective", keywords: ["CSC xxxx", "University Elective", "UE", "Management"] },
      { code: "CSC 4508", name: "Research Report", credits: 2, type: "University Elective", category: "University Elective", keywords: ["CSC xxxx", "University Elective", "UE", "Research"] },
      { code: "CSC 4509", name: "Sociology", credits: 2, type: "University Elective", category: "University Elective", keywords: ["CSC xxxx", "University Elective", "UE", "Sociology"] },
      { code: "CSC 4510", name: "Psychology", credits: 2, type: "University Elective", category: "University Elective", keywords: ["CSC xxxx", "University Elective", "UE", "Psychology"] }
    ],
    BSSE: [
      { code: "SEC 3612", name: "Mobile Application Development", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "Mobile", "Android", "iOS"] },
      { code: "SEC 3614", name: "Computer Graphics", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "CG"] },
      { code: "SEC 4511", name: "e-Commerce", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "eCommerce"] },
      { code: "SEC 4514", name: "Introduction to Data Science", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "Data Science"] },
      { code: "SEC 4515", name: "Digital Image Processing", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "DIP"] },
      { code: "SEC 4518", name: "Visual Programming", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "C#", ".NET"] },
      { code: "SEC 4519", name: "Software Engineering Economics", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "Economics"] },
      { code: "SEC 4521", name: "Agent Based Software Engineering", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "Agents"] },
      { code: "SEC 4522", name: "Big Data Analytics", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "Big Data"] },
      { code: "SEC 4524", name: "Computer Vision", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "CV"] },
      { code: "SEC 4525", name: "Data Encryption and Security", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "Security", "Encryption"] },
      { code: "SEC 4526", name: "Design Patterns", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "Architecture"] },
      { code: "SEC 4529", name: "Global Software Development", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE"] },
      { code: "SEC 4531", name: "Information Systems Audit", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "Audit"] },
      { code: "SEC 4532", name: "Introduction to Cloud Computing", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "Cloud"] },
      { code: "SEC 4533", name: "Management Information Systems", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "MIS"] },
      { code: "SEC 4535", name: "Multimedia Communication", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE"] },
      { code: "SEC 4536", name: "Natural Language Processing", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "NLP"] },
      { code: "SEC 4538", name: "Real Time Systems", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE"] },
      { code: "SEC 4539", name: "Semantic Web", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE"] },
      { code: "SEC 4542", name: "Software Metrics", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE"] },
      { code: "SEC 4543", name: "Systems Programming", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE"] },
      { code: "SEC 4544", name: "Technopreneurship", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "Entrepreneurship"] },
      { code: "SEC 4549", name: "User Interface Design", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "UI", "UX"] },
      { code: "SEC 4547", name: "Virtual and Augmented Reality", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "VR", "AR"] },
      { code: "SEC 4546", name: "AI in Game Development", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "AI", "Game"] },
      { code: "SEC 4548", name: "Introduction to Development Operations", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "SE Elective", "DE", "DevOps"] },
      { code: "SEC 4501", name: "Financial Accounting", credits: 2, type: "University Elective", category: "University Elective", keywords: ["SEC xxxx", "University Elective", "UE", "Accounting"] },
      { code: "SEC 4502", name: "Business and Technology Ethics", credits: 2, type: "University Elective", category: "University Elective", keywords: ["SEC xxxx", "University Elective", "UE", "Ethics"] },
      { code: "SEC 4503", name: "Human Resource Management", credits: 2, type: "University Elective", category: "University Elective", keywords: ["SEC xxxx", "University Elective", "UE", "HRM"] },
      { code: "SEC 4504", name: "Sociology", credits: 2, type: "University Elective", category: "University Elective", keywords: ["SEC xxxx", "University Elective", "UE", "Sociology"] },
      { code: "SEC 4505", name: "Foreign Languages", credits: 2, type: "University Elective", category: "University Elective", keywords: ["SEC xxxx", "University Elective", "UE", "Language", "French", "German", "Chinese", "Arabic"] },
      { code: "SEC 4506", name: "Management Principles", credits: 2, type: "University Elective", category: "University Elective", keywords: ["SEC xxxx", "University Elective", "UE", "Management"] },
      { code: "SEC 4507", name: "Organizational Behavior", credits: 2, type: "University Elective", category: "University Elective", keywords: ["SEC xxxx", "University Elective", "UE", "OB"] },
      { code: "SEC 4508", name: "Psychology", credits: 2, type: "University Elective", category: "University Elective", keywords: ["SEC xxxx", "University Elective", "UE", "Psychology"] },
      { code: "SEC 4509", name: "Design and Creativity", credits: 2, type: "University Elective", category: "University Elective", keywords: ["SEC xxxx", "University Elective", "UE", "Design"] },
      { code: "SEC 4510", name: "Introduction to Accounting", credits: 2, type: "University Elective", category: "University Elective", keywords: ["SEC xxxx", "University Elective", "UE", "Accounting"] },
      { code: "SEC 4512", name: "History of Scientific Ideas", credits: 2, type: "University Elective", category: "University Elective", keywords: ["SEC xxxx", "University Elective", "UE", "History"] },
      { code: "SEC 4513", name: "Research Report", credits: 2, type: "University Elective", category: "University Elective", keywords: ["SEC xxxx", "University Elective", "UE", "Research"] },
      { code: "SEC 4516", name: "Introduction to Marketing", credits: 2, type: "University Elective", category: "University Elective", keywords: ["SEC xxxx", "University Elective", "UE", "Marketing"] }
    ],
    BSAI: [
      { code: "AIC 4701", name: "Advanced Statistics", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "Stats"] },
      { code: "AIC 4706", name: "Theory of Automata and Formal Languages", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "Automata"] },
      { code: "AIC 4802", name: "Data Mining", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "Data Mining"] },
      { code: "AIC 4702", name: "Deep Learning", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "DL", "Neural Networks"] },
      { code: "AIC 4805", name: "Speech Processing", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "Audio"] },
      { code: "AIC 4804", name: "Reinforcements Learning", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "RL"] },
      { code: "AIC 4803", name: "Fuzzy Systems", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE"] },
      { code: "AIC 4703", name: "Evolutionary Computing", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "Genetic Algorithms"] },
      { code: "AIC 4705", name: "Swarm Intelligence", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE"] },
      { code: "AIC 4816", name: "Agent Based Modeling", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE"] },
      { code: "AIC 4704", name: "Knowledge Based Systems", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE"] },
      { code: "AIC 4814", name: "Numerical Computing", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE"] },
      { code: "AIC 4712", name: "Game Artificial Intelligence", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "Game AI"] },
      { code: "AIC 4815", name: "Virtual and Augmented Reality", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "VR", "AR"] },
      { code: "AIC 4715", name: "Web Programming with Django", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "Python", "Django", "Web"] },
      { code: "AIC 4713", name: "Mobile Application Development", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "Mobile", "Android", "iOS"] },
      { code: "AIC 4811", name: "Digital Image and Video Processing", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "DIP", "Video"] },
      { code: "AIC 4812", name: "Generative AI", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "GenAI", "LLM"] },
      { code: "AIC 4711", name: "Big Data Analytics", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "Big Data"] },
      { code: "AIC 4813", name: "HCI and Computer Graphics", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "HCI", "Graphics"] },
      { code: "AIC 4714", name: "Natural Language Processing", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "NLP"] },
      { code: "AIC 4716", name: "Embedded Systems", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "AI Elective", "DE", "IoT"] },
      { code: "AIC 4501", name: "Business and Technology Ethics", credits: 2, type: "University Elective", category: "University Elective", keywords: ["AIC xxxx", "University Elective", "UE", "Ethics"] },
      { code: "AIC 4502", name: "Design and Creativity", credits: 2, type: "University Elective", category: "University Elective", keywords: ["AIC xxxx", "University Elective", "UE", "Design"] },
      { code: "AIC 4503", name: "Introduction to Accounting", credits: 2, type: "University Elective", category: "University Elective", keywords: ["AIC xxxx", "University Elective", "UE", "Accounting"] },
      { code: "AIC 4504", name: "Organizational Behavior", credits: 2, type: "University Elective", category: "University Elective", keywords: ["AIC xxxx", "University Elective", "UE", "OB"] },
      { code: "AIC 4505", name: "Foreign Languages", credits: 2, type: "University Elective", category: "University Elective", keywords: ["AIC xxxx", "University Elective", "UE", "Language", "French", "German", "Chinese", "Arabic"] },
      { code: "AIC 4506", name: "History of Scientific Ideas", credits: 2, type: "University Elective", category: "University Elective", keywords: ["AIC xxxx", "University Elective", "UE", "History"] },
      { code: "AIC 4507", name: "Management Principles", credits: 2, type: "University Elective", category: "University Elective", keywords: ["AIC xxxx", "University Elective", "UE", "Management"] },
      { code: "AIC 4508", name: "Research Report", credits: 2, type: "University Elective", category: "University Elective", keywords: ["AIC xxxx", "University Elective", "UE", "Research"] },
      { code: "AIC 4509", name: "Sociology", credits: 2, type: "University Elective", category: "University Elective", keywords: ["AIC xxxx", "University Elective", "UE", "Sociology"] },
      { code: "AIC 4510", name: "Psychology", credits: 2, type: "University Elective", category: "University Elective", keywords: ["AIC xxxx", "University Elective", "UE", "Psychology"] },
      { code: "AIC 4511", name: "Financial Accounting", credits: 2, type: "University Elective", category: "University Elective", keywords: ["AIC xxxx", "University Elective", "UE", "Accounting"] },
      { code: "AIC 4512", name: "Introduction to Marketing", credits: 2, type: "University Elective", category: "University Elective", keywords: ["AIC xxxx", "University Elective", "UE", "Marketing"] }
    ],
    BBA: [
      { code: "BA 3506", name: "Foreign Languages", credits: 3, type: "University Elective", category: "University Elective", keywords: ["University Elective", "University Elective", "Elective"] },
      { code: "BA 3519", name: "Current Affairs", credits: 3, type: "University Elective", category: "University Elective", keywords: ["University Elective", "University Elective", "Elective"] },
      { code: "BA 3613", name: "World Economy", credits: 3, type: "University Elective", category: "University Elective", keywords: ["University Elective", "University Elective", "Elective"] },
      { code: "BA 3614", name: "Business Analysis and Forecasting", credits: 3, type: "University Elective", category: "University Elective", keywords: ["University Elective", "University Elective", "Elective"] },
      { code: "BA 3619", name: "Enterprise Management", credits: 3, type: "University Elective", category: "University Elective", keywords: ["University Elective", "University Elective", "Elective"] },
      { code: "BA 4701", name: "Islamic Banking and Finance", credits: 3, type: "University Elective", category: "University Elective", keywords: ["University Elective", "University Elective", "Elective"] },
      { code: "BA 4707", name: "Marketing Research", credits: 3, type: "University Elective", category: "University Elective", keywords: ["University Elective", "University Elective", "Elective"] },
      { code: "BA 3515", name: "Graphic Design for Multimedia", credits: 3, type: "University Elective", category: "University Elective", keywords: ["University Elective", "University Elective", "Elective"] },
      { code: "BA 3621", name: "Professional Development", credits: 3, type: "University Elective", category: "University Elective", keywords: ["University Elective", "University Elective", "Elective"] },
      { code: "BA 3521", name: "Auditing", credits: 3, type: "University Elective", category: "University Elective", keywords: ["University Elective", "University Elective", "Elective"] },
      { code: "BA 3522", name: "Social Advocacy and Community Service", credits: 3, type: "University Elective", category: "University Elective", keywords: ["University Elective", "University Elective", "Elective"] },
      { code: "BA 3622", name: "e-Commerce", credits: 3, type: "University Elective", category: "University Elective", keywords: ["University Elective", "University Elective", "Elective"] },
      { code: "BA 3523", name: "Software Tools for Business", credits: 3, type: "University Elective", category: "University Elective", keywords: ["University Elective", "University Elective", "Elective"] },
      { code: "BA 3513", name: "Fundamentals of Artificial Intelligence", credits: 3, type: "University Elective", category: "University Elective", keywords: ["University Elective", "University Elective", "Elective"] },
      { code: "BA 3512", name: "Cooperative Societies", credits: 3, type: "University Elective", category: "University Elective", keywords: ["University Elective", "University Elective", "Elective"] },
      { code: "BA 3623", name: "Agricultural Science", credits: 3, type: "Natural Science Elective", category: "Natural Science Electives", keywords: ["Natural Science Electives", "Natural Science Elective", "Elective"] },
      { code: "BA 3624", name: "Ecology", credits: 3, type: "Natural Science Elective", category: "Natural Science Electives", keywords: ["Natural Science Electives", "Natural Science Elective", "Elective"] },
      { code: "BA 3625", name: "Environmental Science", credits: 3, type: "Natural Science Elective", category: "Natural Science Electives", keywords: ["Natural Science Electives", "Natural Science Elective", "Elective"] },
      { code: "BA 3626", name: "Theory of Science", credits: 3, type: "Natural Science Elective", category: "Natural Science Electives", keywords: ["Natural Science Electives", "Natural Science Elective", "Elective"] },
      { code: "BA 4115", name: "Derivatives", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "Domain Elective", "Elective"] },
      { code: "BA 4214", name: "Micro Finance", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "Domain Elective", "Elective"] },
      { code: "BA 4218", name: "Financial Research", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "Domain Elective", "Elective"] },
      { code: "BA 4735", name: "Islamic Banking and Finance", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "Domain Elective", "Elective"] },
      { code: "BA 4719", name: "Investment Banking", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "Domain Elective", "Elective"] },
      { code: "BA 4724", name: "Financial Modeling", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "Domain Elective", "Elective"] },
      { code: "BA 4727", name: "Dynamics of Banking", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "Domain Elective", "Elective"] },
      { code: "BA 4752", name: "Financial Reporting and Analysis", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "Domain Elective", "Elective"] },
      { code: "BA 4831", name: "Portfolio and Investment Management", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "Domain Elective", "Elective"] },
      { code: "BA 4833", name: "Security Analysis", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "Domain Elective", "Elective"] },
      { code: "BA 4834", name: "Treasury and Funds Management", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "Domain Elective", "Elective"] },
      { code: "BA 4855", name: "Financial Risk Analysis", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "Domain Elective", "Elective"] },
      { code: "BA 4867", name: "Business Analysis and Forecasting", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "Domain Elective", "Elective", "Business Analysis"] },
      { code: "BA 4769", name: "Fintech", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "Domain Elective", "Elective"] },
      { code: "BA 4774", name: "Alternative Investments", credits: 3, type: "Domain Elective", category: "Domain Elective", keywords: ["Domain Elective", "Domain Elective", "Elective"] },
      { code: "BA 4116", name: "Supply Chain Management", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective", "Supply Chain Management", "Management"] },
      { code: "BA 4125", name: "Emerging Media", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective"] },
      { code: "BA 4126", name: "Trade Marketing", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective", "Supply Chain Management"] },
      { code: "BA 4217", name: "Experiential Marketing", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective"] },
      { code: "BA 4836", name: "Marketing Research", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective"] },
      { code: "BA 4721", name: "Advertising", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective"] },
      { code: "BA 4722", name: "Brand Management", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective"] },
      { code: "BA 4739", name: "Export Marketing", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective", "Supply Chain Management"] },
      { code: "BA 4815", name: "Event Management", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective", "Management"] },
      { code: "BA 4816", name: "Industrial Marketing", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective"] },
      { code: "BA 4821", name: "Media Planning", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective"] },
      { code: "BA 4824", name: "Sales Management", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective", "Supply Chain Management"] },
      { code: "BA 4842", name: "Graphic Design for Multimedia", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective", "Information Technology"] },
      { code: "BA 4859", name: "Product Innovation and Design", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective", "Supply Chain Management"] },
      { code: "BA 4866", name: "Integrated Marketing Communications", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective"] },
      { code: "BA 4762", name: "Digital Marketing", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective"] },
      { code: "BA 4868", name: "Marketing Analytics", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective", "Business Analysis"] },
      { code: "BA 4874", name: "e-Commerce", credits: 3, type: "Domain Elective", category: "Marketing", keywords: ["Marketing", "Domain Elective", "Elective"] },
      { code: "BA 4768", name: "Total Quality Management", credits: 3, type: "Domain Elective", category: "Supply Chain Management", keywords: ["Supply Chain Management", "Domain Elective", "Elective"] },
      { code: "BA 4742", name: "Customer Relationship Management", credits: 3, type: "Domain Elective", category: "Supply Chain Management", keywords: ["Supply Chain Management", "Domain Elective", "Elective"] },
      { code: "BA 4764", name: "Dynamics of Logistics and Distribution", credits: 3, type: "Domain Elective", category: "Supply Chain Management", keywords: ["Supply Chain Management", "Domain Elective", "Elective"] },
      { code: "BA 4117", name: "Salary and Compensation", credits: 3, type: "Domain Elective", category: "Management", keywords: ["Management", "Domain Elective", "Elective"] },
      { code: "BA 4711", name: "Change Management", credits: 3, type: "Domain Elective", category: "Management", keywords: ["Management", "Domain Elective", "Elective"] },
      { code: "BA 4712", name: "Industrial Relations and Labor Laws", credits: 3, type: "Domain Elective", category: "Management", keywords: ["Management", "Domain Elective", "Elective"] },
      { code: "BA 4713", name: "Leadership and Motivation Techniques", credits: 3, type: "Domain Elective", category: "Management", keywords: ["Management", "Domain Elective", "Elective"] },
      { code: "BA 4812", name: "Recruitment and Selection", credits: 3, type: "Domain Elective", category: "Management", keywords: ["Management", "Domain Elective", "Elective"] },
      { code: "BA 4813", name: "Training and Development", credits: 3, type: "Domain Elective", category: "Management", keywords: ["Management", "Domain Elective", "Elective"] },
      { code: "BA 4826", name: "Talent Management", credits: 3, type: "Domain Elective", category: "Management", keywords: ["Management", "Domain Elective", "Elective"] },
      { code: "BA 4837", name: "Performance Appraisal", credits: 3, type: "Domain Elective", category: "Management", keywords: ["Management", "Domain Elective", "Elective"] },
      { code: "BA 4844", name: "Operations Research", credits: 3, type: "Domain Elective", category: "Management", keywords: ["Management", "Domain Elective", "Elective", "Information Technology"] },
      { code: "BA 4224", name: "e-Marketing Strategies", credits: 3, type: "Domain Elective", category: "Information Technology", keywords: ["Information Technology", "Domain Elective", "Elective"] },
      { code: "BA 4745", name: "Information System Audit", credits: 3, type: "Domain Elective", category: "Information Technology", keywords: ["Information Technology", "Domain Elective", "Elective"] },
      { code: "BA 4822", name: "Media Production", credits: 3, type: "Domain Elective", category: "Information Technology", keywords: ["Information Technology", "Domain Elective", "Elective"] },
      { code: "BA 4773", name: "Programming for Business", credits: 3, type: "Domain Elective", category: "Business Analysis", keywords: ["Business Analysis", "Domain Elective", "Elective"] },
      { code: "BA 4871", name: "Business Intelligence Tools and Techniques", credits: 3, type: "Domain Elective", category: "Business Analysis", keywords: ["Business Analysis", "Domain Elective", "Elective"] },
      { code: "BA 4872", name: "Consumer Insights and Analytics", credits: 3, type: "Domain Elective", category: "Business Analysis", keywords: ["Business Analysis", "Domain Elective", "Elective"] },
      { code: "BA 4771", name: "Block Chain for Business", credits: 3, type: "Domain Elective", category: "Business Analysis", keywords: ["Business Analysis", "Domain Elective", "Elective"] },
      { code: "BA 4772", name: "Digital Assets", credits: 3, type: "Domain Elective", category: "Business Analysis", keywords: ["Business Analysis", "Domain Elective", "Elective"] },
      { code: "BA 4869", name: "Social Media Analytics", credits: 3, type: "Domain Elective", category: "Business Analysis", keywords: ["Business Analysis", "Domain Elective", "Elective"] },
      { code: "BA 4873", name: "Software Tools for Business", credits: 3, type: "Domain Elective", category: "Business Analysis", keywords: ["Business Analysis", "Domain Elective", "Elective"] }
    ]
  },

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Get curriculum data for a specific program
   */
  getCurriculum(programKey) {
    return this.curriculum[programKey] || null;
  },

  /**
   * Get all available program keys
   */
  getAllPrograms() {
    return Object.keys(this.curriculum);
  },

  /**
   * Build a flat lookup for all courses
   */
  // Course acronyms and keyword mappings
  courseKeywords: {
    "COAL": ["CSC 3105", "CSCL 3105"],
    "CSC XXXX": ["CSC 4501", "CSC 4502", "CSC 4503", "CSC 4504", "CSC 4505", "CSC 4506", "CSC 4507", "CSC 4508", "CSC 4509", "CSC 4510"],
    "SEC XXXX": ["SEC 4501", "SEC 4502", "SEC 4503", "SEC 4504", "SEC 4505", "SEC 4506", "SEC 4507", "SEC 4508", "SEC 4509", "SEC 4510", "SEC 4512", "SEC 4513", "SEC 4516"],
    "AIC XXXX": ["AIC 4501", "AIC 4502", "AIC 4503", "AIC 4504", "AIC 4505", "AIC 4506", "AIC 4507", "AIC 4508", "AIC 4509", "AIC 4510", "AIC 4511", "AIC 4512"]
  },

  buildCourseLookup() {
    if (this._courseLookupCache) return this._courseLookupCache;
    const lookup = {};

    // 1. Core curriculum courses from program semesters
    Object.keys(this.curriculum).forEach(programKey => {
      const program = this.curriculum[programKey];
      Object.keys(program.semesters).forEach(semesterNum => {
        program.semesters[semesterNum].forEach(course => {
          // Skip generic elective placeholders
          if (course.code.includes('xxxx') || course.code.includes('4xxx')) return;
          if (!lookup[course.code]) {
            lookup[course.code] = {
              code: course.code,
              name: course.name,
              credits: course.credits,
              type: course.type || "Core",
              category: course.category || "Core",
              keywords: course.keywords ? [...course.keywords] : [],
              programs: []
            };
          } else if (course.keywords) {
            course.keywords.forEach(k => {
              if (!lookup[course.code].keywords.includes(k)) {
                lookup[course.code].keywords.push(k);
              }
            });
          }
          if (!lookup[course.code].programs.includes(programKey)) {
            lookup[course.code].programs.push(programKey);
          }
        });
      });
    });

    // 2. Electives (Domain Electives, University Electives, Specializations)
    if (this.electives) {
      Object.keys(this.electives).forEach(programKey => {
        this.electives[programKey].forEach(course => {
          if (!lookup[course.code]) {
            lookup[course.code] = {
              code: course.code,
              name: course.name,
              credits: course.credits,
              type: course.type || "Elective",
              category: course.category || "Elective",
              keywords: course.keywords ? [...course.keywords] : [],
              programs: [programKey]
            };
          } else {
            if (!lookup[course.code].programs.includes(programKey)) {
              lookup[course.code].programs.push(programKey);
            }
            if (course.category && !lookup[course.code].category) {
              lookup[course.code].category = course.category;
            }
            if (course.keywords) {
              course.keywords.forEach(k => {
                if (!lookup[course.code].keywords.includes(k)) {
                  lookup[course.code].keywords.push(k);
                }
              });
            }
          }
        });
      });
    }

    if (this.courseKeywords) {
      Object.entries(this.courseKeywords).forEach(([kw, codes]) => {
        codes.forEach(cCode => {
          if (lookup[cCode]) {
            if (!lookup[cCode].keywords) lookup[cCode].keywords = [];
            if (!lookup[cCode].keywords.includes(kw)) {
              lookup[cCode].keywords.push(kw);
            }
          }
        });
      });
    }

    this._courseLookupCache = lookup;
    return lookup;
  },

  /**
   * Get all unique course codes
   */
  getAllCourseCodes() {
    const lookup = this.buildCourseLookup();
    return Object.keys(lookup);
  },

  /**
   * Get course details by course code
   */
  getCourseByCode(courseCode) {
    const lookup = this.buildCourseLookup();
    const clean = courseCode.toUpperCase().trim();
    if (lookup[clean]) return lookup[clean];
    if (this.courseKeywords && this.courseKeywords[clean]) {
      const target = this.courseKeywords[clean];
      const targetCode = Array.isArray(target) ? target[0] : target;
      if (lookup[targetCode]) return lookup[targetCode];
    }
    return null;
  },

  /**
   * Get all courses for a specific program
   */
  getProgramCourses(programKey) {
    const program = this.curriculum[programKey];
    if (!program) return [];

    const courses = [];
    Object.keys(program.semesters).forEach(semesterNum => {
      program.semesters[semesterNum].forEach(course => {
        if (!courses.find(c => c.code === course.code)) {
          courses.push({
            code: course.code,
            name: course.name,
            credits: course.credits,
            semester: semesterNum
          });
        }
      });
    });
    return courses;
  },

  /**
   * Get total credits for a program
   */
  getProgramTotalCredits(programKey) {
    const program = this.curriculum[programKey];
    return program ? program.totalCredits : 0;
  },

  /**
   * Get program name by key
   */
  getProgramName(programKey) {
    const program = this.curriculum[programKey];
    return program ? program.name : null;
  },

  /**
   * Get all available programs list
   */
  getProgramsList() {
    return Object.keys(this.curriculum).map(key => ({
      key: key,
      name: this.curriculum[key].name,
      totalCredits: this.curriculum[key].totalCredits
    }));
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DATABASE;
}
