// timetableData.js
// Structured timetable schedule for SZABIST sections across departments.
// Can easily be updated or replaced with official scheduling data.

window.TIMETABLE_DATA = {
    lastUpdated: "September 8, 2026",
    academicSession: "Fall 2026",
    departments: [
        "Computer Science",
        "Management Sciences",
        "Media Science"
    ],
    departmentSections: {
        "Computer Science": ["BCS-3E", "BCS-3A", "BCS-3B", "BCS-5A", "BSAI-3A"],
        "Management Sciences": ["BBA-1A", "BBA-3A", "BBA-5A"],
        "Media Science": ["BMS-1A", "BMS-3A"]
    },
    sections: {
        // ==========================================
        // COMPUTER SCIENCE
        // ==========================================
        "BCS-3E": [
            { day: "Monday", code: "CSC 3515", courseName: "Understanding of Holy Quran I / Ethics I", teacher: "Not Mentioned", timing: "08:30 AM - 10:20 AM", creditHours: 2, venue: "C-2", isLab: false },
            { day: "Monday", code: "CSC 1201", courseName: "Discrete Structures", teacher: "Ms. Rubab Janjua", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "F-303", isLab: false },
            { day: "Monday", code: "MTH 2101", courseName: "Linear Algebra", teacher: "Dr. Muzamil Hanif VF", timing: "02:30 PM - 03:50 PM", creditHours: 3, venue: "C-13", isLab: false },
            { day: "Tuesday", code: "CSC 3105", courseName: "Computer Organization and Assembly Language", teacher: "Ms. Aleena Ahmad", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "F-305", isLab: false },
            { day: "Tuesday", code: "CSCL 2102", courseName: "Data Structures Lab", teacher: "Mr. Bilal Ahmad", timing: "11:30 AM - 02:20 PM", creditHours: 1, venue: "Lab-14", isLab: true },
            { day: "Tuesday", code: "CSC 2102", courseName: "Data Structures", teacher: "Mr. Muhammad Naveed", timing: "02:30 PM - 03:50 PM", creditHours: 3, venue: "F-203", isLab: false },
            { day: "Wednesday", code: "CSC 1201", courseName: "Discrete Structures", teacher: "Ms. Rubab Janjua", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "F-303", isLab: false },
            { day: "Wednesday", code: "MTH 2101", courseName: "Linear Algebra", teacher: "Dr. Muzamil Hanif VF", timing: "02:30 PM - 03:50 PM", creditHours: 3, venue: "C-13", isLab: false },
            { day: "Thursday", code: "CSC 3105", courseName: "Computer Organization and Assembly Language", teacher: "Ms. Aleena Ahmad", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "F-305", isLab: false },
            { day: "Thursday", code: "CSCL 3105", courseName: "Computer Organization and Assembly Language Lab", teacher: "Ms. Amina Qaiser", timing: "11:30 AM - 02:20 PM", creditHours: 1, venue: "Lab-17", isLab: true },
            { day: "Thursday", code: "CSC 2102", courseName: "Data Structures", teacher: "Mr. Muhammad Naveed", timing: "02:30 PM - 03:50 PM", creditHours: 3, venue: "F-203", isLab: false }
        ],
        "BCS-3A": [
            { day: "Monday", code: "CSC 2102", courseName: "Data Structures and Algorithms", teacher: "Dr. Farooq Alam", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "F-101", isLab: false },
            { day: "Monday", code: "MTH 2101", courseName: "Linear Algebra", teacher: "Dr. Ahmed Hassan", timing: "10:00 AM - 11:20 AM", creditHours: 3, venue: "C-12", isLab: false },
            { day: "Tuesday", code: "CSC 1201", courseName: "Discrete Mathematical Structures", teacher: "Ms. Sana Tariq", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "F-105", isLab: false },
            { day: "Wednesday", code: "CSCL 2102", courseName: "Data Structures Lab", teacher: "Ms. Sara Sheikh", timing: "02:30 PM - 05:20 PM", creditHours: 1, venue: "Lab-11", isLab: true },
            { day: "Thursday", code: "CSC 3105", courseName: "Computer Organization and Assembly Language", teacher: "Mr. Usman Javed", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "F-302", isLab: false },
            { day: "Friday", code: "CSC 3515", courseName: "Understanding of Holy Quran I", teacher: "Qari Abdul Basit", timing: "09:00 AM - 10:20 AM", creditHours: 2, venue: "Auditorium", isLab: false }
        ],
        "BCS-3B": [
            { day: "Monday", code: "CSC 1201", courseName: "Discrete Mathematical Structures", teacher: "Dr. Bilal Siddiqui", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "C-10", isLab: false },
            { day: "Tuesday", code: "CSC 2102", courseName: "Data Structures and Algorithms", teacher: "Mr. Imran Khan", timing: "10:00 AM - 11:20 AM", creditHours: 3, venue: "F-201", isLab: false },
            { day: "Wednesday", code: "CSCL 3105", courseName: "Assembly Language Lab", teacher: "Mr. Hamza Ali", timing: "11:30 AM - 02:20 PM", creditHours: 1, venue: "Lab-12", isLab: true },
            { day: "Thursday", code: "MTH 2101", courseName: "Linear Algebra", teacher: "Dr. Ayesha Malik", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "C-10", isLab: false },
            { day: "Friday", code: "CSC 3105", courseName: "Computer Organization and Assembly", teacher: "Ms. Hira Noor", timing: "09:00 AM - 10:20 AM", creditHours: 3, venue: "F-301", isLab: false }
        ],
        "BCS-5A": [
            { day: "Monday", code: "CSC 3202", courseName: "Design and Analysis of Algorithms", teacher: "Dr. Zeeshan Haider", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "F-401", isLab: false },
            { day: "Tuesday", code: "CSC 3203", courseName: "Database Systems", teacher: "Ms. Sadia Munir", timing: "10:00 AM - 11:20 AM", creditHours: 3, venue: "F-402", isLab: false },
            { day: "Wednesday", code: "CSCL 3203", courseName: "Database Systems Lab", teacher: "Mr. Taha Rehman", timing: "11:30 AM - 02:20 PM", creditHours: 1, venue: "Lab-08", isLab: true },
            { day: "Thursday", code: "CSC 3204", courseName: "Operating Systems", teacher: "Dr. Kamran Qureshi", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "F-401", isLab: false },
            { day: "Friday", code: "CSCL 3204", courseName: "Operating Systems Lab", teacher: "Mr. Daniyal Ahmed", timing: "02:30 PM - 05:20 PM", creditHours: 1, venue: "Lab-09", isLab: true }
        ],
        "BSAI-3A": [
            { day: "Monday", code: "AI 2101", courseName: "Introduction to Artificial Intelligence", teacher: "Dr. Asim Karim", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "AI-101", isLab: false },
            { day: "Tuesday", code: "AIL 2101", courseName: "Artificial Intelligence Lab", teacher: "Ms. Mariam Tariq", timing: "11:30 AM - 02:20 PM", creditHours: 1, venue: "AI-Lab-1", isLab: true },
            { day: "Wednesday", code: "CSC 2102", courseName: "Data Structures", teacher: "Dr. Farooq Alam", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "F-101", isLab: false },
            { day: "Thursday", code: "MTH 2101", courseName: "Linear Algebra for AI", teacher: "Dr. Ahmed Hassan", timing: "10:00 AM - 11:20 AM", creditHours: 3, venue: "C-12", isLab: false },
            { day: "Friday", code: "AI 2201", courseName: "Programming for AI (Python)", teacher: "Mr. Bilal Sheikh", timing: "09:00 AM - 11:50 AM", creditHours: 3, venue: "AI-102", isLab: false }
        ],

        // ==========================================
        // MANAGEMENT SCIENCES
        // ==========================================
        "BBA-1A": [
            { day: "Monday", code: "BA 1101", courseName: "Introduction to Accounting", teacher: "Mr. Fawad Tariq", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "M-101", isLab: false },
            { day: "Monday", code: "BA 1102", courseName: "Microeconomics", teacher: "Dr. Salman Abbasi", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "M-102", isLab: false },
            { day: "Tuesday", code: "BA 1105", courseName: "English Writing Skills", teacher: "Ms. Maham Asif", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "M-103", isLab: false },
            { day: "Tuesday", code: "BA 1204", courseName: "Math for Business", teacher: "Dr. Rashid Mehmood", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "M-105", isLab: false },
            { day: "Wednesday", code: "BA 1101", courseName: "Introduction to Accounting", teacher: "Mr. Fawad Tariq", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "M-101", isLab: false },
            { day: "Wednesday", code: "BA 1102", courseName: "Microeconomics", teacher: "Dr. Salman Abbasi", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "M-102", isLab: false },
            { day: "Thursday", code: "BA 1105", courseName: "English Writing Skills", teacher: "Ms. Maham Asif", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "M-103", isLab: false },
            { day: "Thursday", code: "BA 1204", courseName: "Math for Business", teacher: "Dr. Rashid Mehmood", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "M-105", isLab: false },
            { day: "Friday", code: "BA 1120", courseName: "Understanding of Holy Quran I", teacher: "Qari Abdul Basit", timing: "09:00 AM - 10:20 AM", creditHours: 1, venue: "Auditorium", isLab: false }
        ],
        "BBA-3A": [
            { day: "Monday", code: "BA 1201", courseName: "Financial Accounting", teacher: "Dr. Tariq Basheer", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "M-201", isLab: false },
            { day: "Monday", code: "BA 2303", courseName: "Marketing Principles", teacher: "Ms. Ayesha Siddiqa", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "M-202", isLab: false },
            { day: "Tuesday", code: "BA 3504", courseName: "Organizational Behavior", teacher: "Mr. Adnan Sheikh", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "M-204", isLab: false },
            { day: "Tuesday", code: "BA 1202", courseName: "Macroeconomics", teacher: "Dr. Farhan Ali", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "M-205", isLab: false },
            { day: "Wednesday", code: "BA 1201", courseName: "Financial Accounting", teacher: "Dr. Tariq Basheer", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "M-201", isLab: false },
            { day: "Wednesday", code: "BA 2303", courseName: "Marketing Principles", teacher: "Ms. Ayesha Siddiqa", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "M-202", isLab: false },
            { day: "Thursday", code: "BA 2406", courseName: "Business and Electronic Communication", teacher: "Ms. Nadia Khan", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "M-206", isLab: false },
            { day: "Thursday", code: "BA 1211", courseName: "Logic and Critical Thinking", teacher: "Mr. Salman Qadir", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "M-201", isLab: false },
            { day: "Friday", code: "BA 3504", courseName: "Organizational Behavior", teacher: "Mr. Adnan Sheikh", timing: "09:00 AM - 10:20 AM", creditHours: 3, venue: "M-204", isLab: false }
        ],
        "BBA-5A": [
            { day: "Monday", code: "BA 2301", courseName: "Introduction to Business Finance", teacher: "Mr. Waseem Akhtar", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "M-301", isLab: false },
            { day: "Monday", code: "BA 3501", courseName: "Financial Markets and Institutions", teacher: "Dr. Kamran Siddiqui", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "M-302", isLab: false },
            { day: "Tuesday", code: "BA 3508", courseName: "Media Management", teacher: "Ms. Hina Riaz", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "M-303", isLab: false },
            { day: "Tuesday", code: "BA 3605", courseName: "Statistical Inference", teacher: "Dr. Naeem Ullah", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "M-304", isLab: false },
            { day: "Wednesday", code: "BA 2301", courseName: "Introduction to Business Finance", teacher: "Mr. Waseem Akhtar", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "M-301", isLab: false },
            { day: "Wednesday", code: "BA 4706", courseName: "Development Economics", teacher: "Dr. Shahzad Anwar", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "M-302", isLab: false },
            { day: "Thursday", code: "BA 3501", courseName: "Financial Markets and Institutions", teacher: "Dr. Kamran Siddiqui", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "M-302", isLab: false },
            { day: "Friday", code: "BA 3605", courseName: "Statistical Inference", teacher: "Dr. Naeem Ullah", timing: "09:00 AM - 10:20 AM", creditHours: 3, venue: "M-304", isLab: false }
        ],

        // ==========================================
        // MEDIA SCIENCE
        // ==========================================
        "BMS-1A": [
            { day: "Monday", code: "MS 1101", courseName: "Introduction to Mass Communication", teacher: "Ms. Fatima Shah", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "Studio-A", isLab: false },
            { day: "Monday", code: "MS 1102", courseName: "History of Media", teacher: "Dr. Kamran Hashmi", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "MS-102", isLab: false },
            { day: "Tuesday", code: "MS 1103", courseName: "Visual Communication", teacher: "Mr. Arsalan Baig", timing: "10:00 AM - 12:50 PM", creditHours: 3, venue: "Graphics Lab-2", isLab: true },
            { day: "Wednesday", code: "MS 1104", courseName: "English Composition", teacher: "Ms. Samina Rizvi", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "MS-104", isLab: false },
            { day: "Wednesday", code: "MS 1101", courseName: "Introduction to Mass Communication", teacher: "Ms. Fatima Shah", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "Studio-A", isLab: false },
            { day: "Thursday", code: "MS 1102", courseName: "History of Media", teacher: "Dr. Kamran Hashmi", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "MS-102", isLab: false },
            { day: "Friday", code: "MS 1106", courseName: "Understanding of Holy Quran I", teacher: "Qari Abdul Basit", timing: "09:00 AM - 10:20 AM", creditHours: 1, venue: "Auditorium", isLab: false }
        ],
        "BMS-3A": [
            { day: "Monday", code: "MS 2101", courseName: "Reporting and News Writing", teacher: "Mr. Junaid Zuberi", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "Studio-B", isLab: false },
            { day: "Monday", code: "MS 2102", courseName: "Media Ethics and Law", teacher: "Ms. Mahnoor Baloch", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "MS-201", isLab: false },
            { day: "Tuesday", code: "MS 2103", courseName: "Broadcast Journalism", teacher: "Mr. Rehan Aslam", timing: "11:30 AM - 02:20 PM", creditHours: 3, venue: "TV Control Room", isLab: true },
            { day: "Wednesday", code: "MS 2104", courseName: "Introduction to Advertising", teacher: "Ms. Zehra Kazmi", timing: "08:30 AM - 09:50 AM", creditHours: 3, venue: "MS-203", isLab: false },
            { day: "Wednesday", code: "MS 2101", courseName: "Reporting and News Writing", teacher: "Mr. Junaid Zuberi", timing: "11:30 AM - 12:50 PM", creditHours: 3, venue: "Studio-B", isLab: false },
            { day: "Thursday", code: "MS 3101", courseName: "Digital Media", teacher: "Mr. Usman Pirzada", timing: "11:30 AM - 02:20 PM", creditHours: 3, venue: "Mac Lab-1", isLab: true },
            { day: "Friday", code: "MS 2104", courseName: "Introduction to Advertising", teacher: "Ms. Zehra Kazmi", timing: "09:00 AM - 10:20 AM", creditHours: 3, venue: "MS-203", isLab: false }
        ]
    }
};
