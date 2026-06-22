# 🎓 ZabCal - SZABIST CGPA Calculator

A modern, intuitive, and lightweight CGPA calculator designed specifically for SZABIST students. Track your academic performance with real-time GPA calculations, course management, and degree progress tracking.

![CGPA Calculator](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## ✨ Features

### Core Functionality

- **📊 Real-time CGPA Calculation**: Automatically calculate your cumulative GPA as you add courses.
- **📚 Course Management**: Add, remove, and manage multiple courses with ease.
- **🎯 Clear All Courses**: Remove all courses at once with a single click (with confirmation).
- **📈 Progress Tracking**: Visual degree progress bar showing your completion percentage.
- **🔢 Academic Standing**: Automatic classification based on credits and CGPA.

### Program Support

The application comes pre-loaded with curricula for:
- BS Computer Science (BSCS)
- BS Artificial Intelligence (BSAI)
- BS Software Engineering (BSSE)
- Bachelor of Business Administration (BBA)
- BS Accounting & Finance (BSAF)
- BS Business Analytics (BSBA)
- BS Media Sciences (BSMS)

### User Experience

- **🌙 Dark/Light Mode**: Toggle between themes with automatic system detection.
- **🔍 Smart Autocomplete**: Search for courses by code (e.g., "CSC") or name.
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices via Tailwind CSS.
- **💾 Local Data Storage**: Uses Browser LocalStorage — your data never leaves your device.
- **⚡ Instant Updates**: All metrics update immediately as marks are entered.

---

## 🚀 Getting Started

### Prerequisites
No installation required! This is a client-side application.

### How to Use
1. **Launch**: Open `index.html` in any modern web browser.
2. **Set Program**: Select your degree program from the dropdown to enable progress tracking.
3. **Add Courses**: Start typing a course code or name, select from suggestions, enter marks (0-100), and add.
4. **Monitor**: Track your **CGPA**, **Total Credits**, and **Academic Standing** in the dashboard.
5. **Manage**: Edit marks or remove courses to see real-time impact on your GPA.

---

## 📋 SZABIST Grading Scale

| Marks  | Grade | GPA  |
| ------ | ----- | ---- |
| 90–100 | A+    | 4.00 |
| 85–89  | A     | 3.75 |
| 80–84  | B+    | 3.50 |
| 75–79  | B     | 3.25 |
| 70–74  | B−    | 3.00 |
| 66–69  | C+    | 2.75 |
| 63–65  | C     | 2.50 |
| 60–62  | C−    | 2.00 |
| 55–59  | D     | 1.50 |
| 0–54   | F     | 0.00 |

---

## 🏗️ Technical Architecture

### Technology Stack
- **Frontend**: HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript (ES6+).
- **Storage**: Browser `localStorage` API.
- **Data**: In-memory curriculum database (`database.js`).
- **UI Components**: Glassmorphism design with Inter font family.

### Implementation Details
The project follows an object-oriented approach to separate concerns:
- **`StateManager`**: Handles persistence and state transitions.
- **`CurriculumHandler`**: Manages the lookup and filtering of the course database.
- **`GradingEngine`**: Pure logic for converting marks $\rightarrow$ GPA and calculating weighted averages.
- **`UIManager`**: Bridges the logic and the DOM, handling events and rendering.

---

## 📁 File Structure

```text
ZabCal/
├── index.html    # UI structure and Tailwind configurations
├── script.js     # Application logic (State, Grading, and UI Management)
├── database.js  # Comprehensive SZABIST curriculum data
└── README.md      # Project documentation
```

---

## 🔐 Privacy & Security

- **100% Client-Side**: No backend, no API calls, no data transmission.
- **Data Ownership**: Your academic records are stored only in your browser's local storage.
- **Zero Tracking**: No analytics or cookies used.

---

## 🛠️ Customization

### Adding New Programs
To add a new degree program, modify the `CURRICULUM` object in `database.js`:
```javascript
PROGRAM_CODE: {
    name: 'Program Name',
    totalCredits: 120,
    semesters: {
        1: [{ code: 'XYZ 101', name: 'Course Name', credits: 3, type: 'Core' }]
    }
}
```

### Modifying Grading Policy
Update the `GRADING_POLICY` constant in `script.js` to adjust grade boundaries or GPA values.

---

## 🤝 Contributing

Contributions are welcome! 
1. **Bugs**: Report issues via [GitHub Issues](https://github.com/Wasiq2006).
2. **Features**: Submit a Pull Request or suggest improvements via email.
3. **Data**: Help expand the `database.js` with updated course lists.

---

## 📞 Support & Feedback

- **Creator**: Wasiq Mansoor
- **GitHub**: [@Wasiq2006](https://github.com/Wasiq2006)
- **LinkedIn**: [Muhammad Wasiq Mansoor](https://www.linkedin.com/in/muhammad-wasiq-mansoor-35332927a)
- **Email**: [wasiqmansoor69@gmail.com](mailto:wasiqmansoor2006@gmail.com)

---

## 📜 License
This project is licensed under the **MIT License**.

**Last Updated**: June 2026  
**Status**: ✅ Active and Maintained

_ZabCal - Simplifying Academic Excellence_ 🎓