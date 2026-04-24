# 🎓 ZabCal - SZABIST CGPA Calculator

A modern, intuitive, and lightweight CGPA calculator designed specifically for SZABIST students. Track your academic performance with real-time GPA calculations, course management, and degree progress tracking.

![CGPA Calculator](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## ✨ Features

### Core Functionality

- **📊 Real-time CGPA Calculation**: Automatically calculate your cumulative GPA as you add courses
- **📚 Course Management**: Add, remove, and manage multiple courses with ease
- **🎯 Clear All Courses**: Remove all courses at once with a single click (with confirmation)
- **📈 Progress Tracking**: Visual degree progress bar showing your completion percentage
- **🔢 Academic Standing**: Automatic classification based on credits and CGPA

### Program Support

- BS Computer Science (BSCS)
- BS Artificial Intelligence (BSAI)
- BS Software Engineering (BSSE)
- Bachelor of Business Administration (BBA)
- BS Accounting & Finance (BSAF)
- BS Business Analytics (BSBA)
- BS Media Sciences (BSMS)

### User Experience

- **🌙 Dark/Light Mode**: Toggle between dark and light themes
- **🔍 Smart Autocomplete**: Quickly search for courses by code or name
- **📱 Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **💾 Local Data Storage**: All calculations run locally in your browser - no data is sent to servers
- **⚡ Instant Updates**: See your metrics update in real-time as you enter marks
- **♿ Accessible Design**: Clean, intuitive interface suitable for all users

---

## 🚀 Getting Started

### Prerequisites

No installation required! This is a browser-based application that works on any modern web browser.

### How to Use

1. **Open the Application**
   - Simply open `index.html` in your web browser

2. **Select Your Program**
   - Choose your degree program from the dropdown menu
   - This helps track your degree progress accurately

3. **Add Courses**
   - Enter the course code (e.g., CSC 1101) or course name in the search field
   - Use the autocomplete suggestions to quickly find your course
   - Enter your marks (0-100)
   - Click "Add Course" or press Enter

4. **View Your Metrics**
   - **Current CGPA**: Your cumulative grade point average
   - **Total Credits**: Credits completed so far
   - **Standing**: Your academic standing classification
   - **Degree Progress**: Visual representation of completion percentage

5. **Manage Courses**
   - Update marks anytime - metrics update instantly
   - Remove individual courses with the "Remove" button
   - Clear all courses at once with the "Clear All Courses" button

6. **Check the Grading Scale**
   - Refer to the SZABIST Grading Scale table to understand how marks convert to grades and GPA

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

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Storage**: Browser LocalStorage API
- **Database**: JavaScript-based in-memory curriculum database
- **Design Pattern**: Object-Oriented Programming (OOP)

### Core Classes

#### StateManager

Manages application state and local storage persistence

- `loadFromStorage()`: Retrieves saved state from browser
- `saveToStorage()`: Persists state to local storage
- `setState()`: Updates application state

#### CurriculumHandler

Handles all curriculum and course-related operations

- `buildCourseLookup()`: Indexes all available courses
- `getCourseInfo()`: Retrieves course details
- `getProgramCourses()`: Gets courses for a specific program

#### GradingEngine

Performs all grading and GPA calculations

- `calculateGrade()`: Converts marks to grade and GPA
- `calculateCGPA()`: Computes cumulative GPA
- `calculateSGPA()`: Calculates semester GPA
- `getStanding()`: Determines academic standing

#### UIManager

Handles all user interface interactions

- `setupEventListeners()`: Initializes all event handlers
- `addCourse()`: Adds a course to the calculator
- `removeCourse()`: Removes a course
- `clearAllCourses()`: Clears all courses at once
- `updateAllMetrics()`: Updates all dashboard metrics

---

## 📁 File Structure

```
ZabCal/
├── index.html          # Main HTML structure
├── script.js           # Core application logic
├── style.css           # Styling and responsive design
├── database.js         # Curriculum database
└── README.md           # This file
```

---

## 🎨 Features in Detail

### Autocomplete Search

- Search courses by code (e.g., "CSC") or name (e.g., "Programming")
- Arrow keys to navigate suggestions
- Enter to select or add custom course

### Real-time Metrics

- **CGPA**: Weighted average of all grades
- **Credits**: Total completed credit hours
- **Standing**: Based on CGPA and total credits
  - Outstanding: CGPA ≥ 3.5
  - Excellent: CGPA ≥ 3.0
  - Good: CGPA ≥ 2.5
  - Satisfactory: CGPA ≥ 2.0
  - Passing: CGPA ≥ 1.5
  - Failing: CGPA < 1.5

### Data Persistence

- All your data is saved locally in your browser
- Your data persists even after closing the browser
- No data is ever sent to any server
- Complete privacy and security

### Dark Mode

- Automatically detects system theme preference
- Toggle between dark and light modes manually
- Preference is saved for your next visit

---

## 🔐 Privacy & Security

✅ **100% Local Processing**

- All calculations run entirely in your browser
- No data transmission to external servers
- No user tracking or analytics
- No cookies (except for storing your preferences)

✅ **Data Ownership**

- You have complete control over your data
- Data can be cleared anytime using "Clear All Courses"
- Browser cache/history controls your data retention

---

## 🛠️ Customization & Extension

### Adding New Programs

Edit the `database.js` file to add curriculum for new programs:

```javascript
BSNEW: {
    name: 'BS New Program',
    totalCredits: 132,
    semesters: {
        1: [
            { code: 'NEW 1001', name: 'Course Name', credits: 3 },
            // ... more courses
        ],
        // ... more semesters
    }
}
```

### Modifying Grading Scale

Update the `GRADING_POLICY` object in `script.js` to change grade thresholds or GPA values.

---

## 🐛 Known Limitations

- Maximum 100 characters for course code input
- Marks must be between 0-100
- Requires JavaScript enabled in browser
- Best viewed on modern browsers (Chrome, Firefox, Safari, Edge)

---

## 🤝 Contributing

We welcome contributions! If you have suggestions, improvements, or want to add curriculum for new programs:

### How to Contribute

1. **Found a Bug?** Report it via [GitHub Issues](https://github.com/Wasiq2006)
2. **Have an Idea?** Send suggestions via [Email](mailto:wasiqmansoor69@gmail.com?subject=SZABIST%20CGPA%20Calculator%20–%20Suggestions)
3. **Want to Contribute Code?** Fork the repository and submit a pull request on [GitHub](https://github.com/Wasiq2006)

### Contribution Ideas

- Add new program curriculums
- Improve UI/UX design
- Add export functionality (PDF, Excel)
- Implement semester-wise tracking
- Add more themes
- Improve accessibility
- Optimize performance

---

## 📞 Support & Feedback

### Contact Information

- **Email**: [wasiqmansoor69@gmail.com](mailto:wasiqmansoor2006@gmail.com)
- **GitHub**: [@Wasiq2006](https://github.com/Wasiq2006)
- **LinkedIn**: [Muhammad Wasiq Mansoor](https://www.linkedin.com/in/muhammad-wasiq-mansoor-35332927a)

### Report Issues

Found a bug or have a feature request? Please reach out via email or GitHub issues.

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

MIT License - This means you can:

- ✅ Use this project for any purpose
- ✅ Modify the code
- ✅ Distribute copies
- ⚠️ Must include license and copyright notice

---

## 👨‍💻 About the Creator

**Wasiq Mansoor** - A passionate developer dedicated to creating tools that simplify academic life for students.

_Made with ❤️ for SZABIST students_

---

## 🔄 Version History

### v1.0.0 (January 2026)

- ✅ Initial release
- ✅ Core CGPA calculation
- ✅ Multi-program support
- ✅ Dark mode
- ✅ Clear All Courses feature
- ✅ Real-time metrics
- ✅ Responsive design
- ✅ Local data storage

---

## 🎓 Education Impact

ZabCal is designed to:

- 📊 Help students track academic progress
- 🎯 Encourage informed course planning
- 📈 Provide transparent GPA calculations
- 🔍 Eliminate calculation errors
- 💡 Support academic decision-making

---

## 🚀 Roadmap

### Coming Soon 🔜

#### Q1 2026

- 📥 **PDF Export**: Download your academic transcript as a professional PDF document
- 📊 **Grade Distribution Charts**: Visualize your grades with interactive charts and graphs
- 💾 **Data Backup & Restore**: Backup your data and restore it anytime
- 📋 **Semester-wise Tracking**: View SGPA (Semester GPA) for each semester separately

#### Q2 2026

- 🎯 **GPA Goals & Projections**: Set target GPA and see what grades you need
- 📊 **What-If Analysis**: Simulate grades to see impact on CGPA
- 🔄 **Course History Archive**: Keep records of past semesters and courses
- 📈 **Academic Performance Reports**: Detailed analytics on your progress

#### Q3 2026

- 🌐 **Multi-Language Support**: Support for Urdu, English, and other languages
- 📧 **Email Results**: Send your grades and report card via email
- 👥 **Multi-User Profiles**: Save multiple student profiles in one browser
- 🔐 **Secure Data Sync**: Optional cloud sync with encryption

#### Q4 2026

- 📱 **Progressive Web App (PWA)**: Install as an app on your device
- 📱 **Mobile App Version**: Native iOS and Android applications
- 🤖 **AI Grade Advisor**: Get personalized recommendations based on your grades
- 🏆 **Achievement Badges**: Earn badges for academic milestones

### Long-term Vision 🎯

- 🔗 **Integration with Student Portals**: Connect directly to your university portal
- 👥 **Peer Comparison (Anonymous)**: Compare performance anonymously with classmates
- 📚 **Study Material Recommendations**: Get course-specific study resources
- 🎓 **Career Path Guidance**: Academic suggestions based on grades and interests

---

## ✨ Feature Comparison

| Feature           | Current | Q1 2026 | Q2 2026 | Q3 2026 | Q4 2026 |
| ----------------- | ------- | ------- | ------- | ------- | ------- |
| CGPA Calculation  | ✅      | ✅      | ✅      | ✅      | ✅      |
| Course Management | ✅      | ✅      | ✅      | ✅      | ✅      |
| PDF Export        | ❌      | ✅      | ✅      | ✅      | ✅      |
| Grade Charts      | ❌      | ✅      | ✅      | ✅      | ✅      |
| GPA Projections   | ❌      | ❌      | ✅      | ✅      | ✅      |
| Multi-Language    | ❌      | ❌      | ❌      | ✅      | ✅      |
| Mobile App        | ❌      | ❌      | ❌      | ❌      | ✅      |
| AI Advisor        | ❌      | ❌      | ❌      | ❌      | ✅      |

---

## ⭐ Show Your Support

If ZabCal helped you track your academic performance, consider:

- ⭐ Starring the GitHub repository
- 💬 Sharing with other students
- 📝 Providing feedback
- 🤝 Contributing to the project

---

**Last Updated**: January 24, 2026  
**Status**: ✅ Active and Maintained

---

_ZabCal - Simplifying Academic Excellence_ 🎓
