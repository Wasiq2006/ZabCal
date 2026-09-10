// timetableData.js
// Structured timetable schedule for SZABIST sections.
// Can easily be updated or replaced with official scheduling data.

window.TIMETABLE_DATA = {
    lastUpdated: "September 8, 2026",
    academicSession: "Fall 2026",
    sections: {
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
        ]
    }
};
