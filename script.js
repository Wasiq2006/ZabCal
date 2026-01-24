// ============================================
// GRADING POLICY - SZABIST
// ============================================

const GRADING_POLICY = {
    90: { grade: 'A+', gpa: 4.0 },
    85: { grade: 'A', gpa: 3.75 },
    80: { grade: 'B+', gpa: 3.5 },
    75: { grade: 'B', gpa: 3.25 },
    70: { grade: 'B-', gpa: 3.0 },
    66: { grade: 'C+', gpa: 2.75 },
    63: { grade: 'C', gpa: 2.5 },
    60: { grade: 'C-', gpa: 2.0 },
    55: { grade: 'D', gpa: 1.5 },
    0: { grade: 'F', gpa: 0.0 }
};

// ============================================
// LOCAL STORAGE & STATE
// ============================================

class StateManager {
    constructor() {
        this.storageKey = 'szabist-cgpa-session';
        this.state = this.loadFromStorage();
    }

    loadFromStorage() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing stored state:', e);
                return this.getDefaultState();
            }
        }
        return this.getDefaultState();
    }

    getDefaultState() {
        return {
            program: '',
            courses: [],
            theme: this.getSystemTheme(),
            semesters: {}
        };
    }

    getSystemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }

    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }

    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.saveToStorage();
    }

    getState() {
        return this.state;
    }
}

// ============================================
// CURRICULUM DATA HANDLER
// ============================================

class CurriculumHandler {
    constructor() {
        this.buildCourseLookup();
    }

    buildCourseLookup() {
        this.courseLookup = {};
        const curriculum = DATABASE.curriculum;
        Object.keys(curriculum).forEach(programKey => {
            const program = curriculum[programKey];
            Object.keys(program.semesters).forEach(semesterNum => {
                program.semesters[semesterNum].forEach(course => {
                    if (!this.courseLookup[course.code]) {
                        this.courseLookup[course.code] = {
                            code: course.code,
                            name: course.name,
                            credits: course.credits,
                            programs: []
                        };
                    }
                    if (!this.courseLookup[course.code].programs.includes(programKey)) {
                        this.courseLookup[course.code].programs.push(programKey);
                    }
                });
            });
        });
    }

    getCourseInfo(courseCode) {
        return DATABASE.getCourseByCode(courseCode) || null;
    }

    getAllCourseCodes() {
        return DATABASE.getAllCourseCodes();
    }

    getProgramCourses(programKey) {
        return DATABASE.getProgramCourses(programKey);
    }

    getProgramTotalCredits(programKey) {
        return DATABASE.getProgramTotalCredits(programKey);
    }
}

// ============================================
// GRADING & CALCULATION ENGINE
// ============================================

class GradingEngine {
    calculateGrade(marks) {
        if (marks < 0 || marks > 100) return null;

        const thresholds = Object.keys(GRADING_POLICY).map(Number).sort((a, b) => b - a);
        for (let threshold of thresholds) {
            if (marks >= threshold) {
                return GRADING_POLICY[threshold];
            }
        }
        return null;
    }

    calculateSGPA(courses) {
        if (!courses || courses.length === 0) return 0;

        const validCourses = courses.filter(c => c.marks !== null && c.marks !== undefined);
        if (validCourses.length === 0) return 0;

        let totalGradePoints = 0;
        let totalCredits = 0;

        validCourses.forEach(course => {
            const grade = this.calculateGrade(course.marks);
            if (grade) {
                totalGradePoints += grade.gpa * course.credits;
                totalCredits += course.credits;
            }
        });

        return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    }

    calculateCGPA(allCourses) {
        return this.calculateSGPA(allCourses);
    }

    getStanding(credits, cgpa) {
        if (credits === 0) return 'Freshman';
        if (credits < 32) return 'Freshman';
        if (credits < 64) return 'Sophomore';
        if (credits < 96) return 'Junior';
        return 'Senior';
    }
}

// ============================================
// UI MANAGER
// ============================================

class UIManager {
    constructor() {
        this.stateManager = new StateManager();
        this.curriculumHandler = new CurriculumHandler();
        this.gradingEngine = new GradingEngine();
        this.initializeUI();
    }

    initializeUI() {
        this.setupTheme();
        this.setupEventListeners();
        this.restoreState();
        this.updateAllMetrics();
    }

    setupTheme() {
        const theme = this.stateManager.getState().theme;
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        }

        document.getElementById('themeToggle').addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            this.stateManager.setState({ theme: isDark ? 'dark' : 'light' });
        });
    }

    setupEventListeners() {
        // Program selection
        document.getElementById('programSelect').addEventListener('change', (e) => {
            this.stateManager.setState({ program: e.target.value });
            this.updateAllMetrics();
        });

        // Course input with autocomplete
        const courseCodeInput = document.getElementById('courseCodeInput');
        const autocompleteSuggestions = document.getElementById('autocompleteSuggestions');
        let highlightedIndex = -1;
        let currentSuggestions = [];

        courseCodeInput.addEventListener('input', (e) => {
            const input = e.target.value.trim().toUpperCase();
            if (input.length === 0) {
                autocompleteSuggestions.classList.remove('show');
                currentSuggestions = [];
                return;
            }

            // Get all available courses
            const allCourses = this.curriculumHandler.getAllCourseCodes();
            const inputLower = input.toLowerCase();
            
            // Filter by both course code AND course name
            const matching = allCourses
                .filter(code => {
                    const courseInfo = this.curriculumHandler.getCourseInfo(code);
                    if (!courseInfo) return false;
                    
                    // Match by code or by course name
                    return code.toLowerCase().includes(inputLower) || 
                           courseInfo.name.toLowerCase().includes(inputLower);
                })
                .slice(0, 8);

            if (matching.length === 0) {
                autocompleteSuggestions.classList.remove('show');
                currentSuggestions = [];
                return;
            }

            currentSuggestions = matching;
            highlightedIndex = -1;
            this.renderAutocompleteSuggestions(matching);
        });

        courseCodeInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                highlightedIndex = Math.min(highlightedIndex + 1, currentSuggestions.length - 1);
                this.updateHighlightedSuggestion(highlightedIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                highlightedIndex = Math.max(highlightedIndex - 1, -1);
                this.updateHighlightedSuggestion(highlightedIndex);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (highlightedIndex >= 0) {
                    this.selectSuggestion(currentSuggestions[highlightedIndex]);
                } else {
                    this.addCourse(courseCodeInput.value);
                    courseCodeInput.value = '';
                }
            } else if (e.key === 'Escape') {
                autocompleteSuggestions.classList.remove('show');
                highlightedIndex = -1;
            }
        });

        document.addEventListener('click', (e) => {
            if (!courseCodeInput.contains(e.target) && !autocompleteSuggestions.contains(e.target)) {
                autocompleteSuggestions.classList.remove('show');
                highlightedIndex = -1;
            }
        });

        document.getElementById('addCourseBtn').addEventListener('click', () => {
            const courseCode = courseCodeInput.value.trim();
            const marks = document.getElementById('courseMarksInput').value.trim();
            
            if (!marks) {
                this.showError('Please enter marks for the course');
                return;
            }
            
            const marksNum = parseFloat(marks);
            if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
                this.showError('Please enter valid marks between 0 and 100');
                return;
            }
            
            this.addCourse(courseCode, marksNum);
            courseCodeInput.value = '';
            document.getElementById('courseMarksInput').value = '';
            courseCodeInput.focus();
        });

        // Clear All Courses button
        document.getElementById('clearAllBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all courses? This action cannot be undone.')) {
                this.clearAllCourses();
            }
        });
    }

    restoreState() {
        const state = this.stateManager.getState();
        if (state.program) {
            document.getElementById('programSelect').value = state.program;
        }
        if (state.courses && state.courses.length > 0) {
            state.courses.forEach((course, index) => {
                this.addCourseToTable(course);
                this.updateGradeDisplay(index);
            });
        }
    }

    addCourse(courseCode, marks = null) {
        const code = courseCode.trim().toUpperCase();

        // Validation
        if (!code) {
            this.showError('Please enter a course code');
            return;
        }

        const courseInfo = this.curriculumHandler.getCourseInfo(code);
        if (!courseInfo) {
            this.showError(`Course code "${code}" not found in curriculum`);
            return;
        }

        const state = this.stateManager.getState();
        if (state.courses.find(c => c.code === code)) {
            this.showError(`Course "${code}" already added`);
            return;
        }

        const course = {
            code: code,
            name: courseInfo.name,
            credits: courseInfo.credits,
            marks: marks
        };

        state.courses.push(course);
        this.stateManager.setState({ courses: state.courses });
        this.addCourseToTable(course);
        const courseIndex = state.courses.length - 1;
        this.updateGradeDisplay(courseIndex);
        this.updateAllMetrics();
    }

    addCourseToTable(course) {
        const tbody = document.getElementById('coursesTableBody');
        
        // Remove empty row if exists
        const emptyRow = tbody.querySelector('.empty-row');
        if (emptyRow) emptyRow.remove();

        // Show Clear All button
        document.getElementById('clearAllBtn').style.display = 'flex';

        const row = document.createElement('tr');
        const courseIndex = this.stateManager.getState().courses.findIndex(c => c.code === course.code);

        row.innerHTML = `
            <td>${course.code}</td>
            <td>${course.name}</td>
            <td>${course.credits}</td>
            <td>
                <input 
                    type="number" 
                    class="marks-input" 
                    min="0" 
                    max="100" 
                    placeholder="0-100"
                    data-course-index="${courseIndex}"
                    ${course.marks !== null ? `value="${course.marks}"` : ''}
                >
            </td>
            <td class="grade-cell" data-course-index="${courseIndex}">-</td>
            <td class="gpa-cell" data-course-index="${courseIndex}">0.00</td>
            <td>
                <button class="btn-danger delete-btn" data-course-index="${courseIndex}">Remove</button>
            </td>
        `;

        // Add event listeners
        const marksInput = row.querySelector('.marks-input');
        marksInput.addEventListener('input', (e) => {
            this.updateCourseMarks(courseIndex, e.target.value);
        });

        row.querySelector('.delete-btn').addEventListener('click', () => {
            this.removeCourse(courseIndex);
        });

        tbody.appendChild(row);
    }

    updateCourseMarks(courseIndex, marks) {
        const state = this.stateManager.getState();
        const course = state.courses[courseIndex];

        if (marks === '') {
            course.marks = null;
        } else {
            const marksNum = parseInt(marks);
            if (marksNum < 0 || marksNum > 100) {
                this.showError('Marks must be between 0 and 100');
                return;
            }
            course.marks = marksNum;
        }

        this.stateManager.setState({ courses: state.courses });
        this.updateGradeDisplay(courseIndex);
        this.updateAllMetrics();
    }

    updateGradeDisplay(courseIndex) {
        const course = this.stateManager.getState().courses[courseIndex];
        const gradeCell = document.querySelector(`.grade-cell[data-course-index="${courseIndex}"]`);
        const gpaCell = document.querySelector(`.gpa-cell[data-course-index="${courseIndex}"]`);

        if (course.marks === null) {
            gradeCell.textContent = '-';
            gpaCell.textContent = '0.00';
        } else {
            const grade = this.gradingEngine.calculateGrade(course.marks);
            gradeCell.textContent = grade ? grade.grade : 'F';
            gpaCell.textContent = grade ? grade.gpa.toFixed(2) : '0.00';
        }
    }

    removeCourse(courseIndex) {
        const state = this.stateManager.getState();
        state.courses.splice(courseIndex, 1);
        this.stateManager.setState({ courses: state.courses });

        const tbody = document.getElementById('coursesTableBody');
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => row.remove());

        if (state.courses.length === 0) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No courses added. Add a course to get started.</td></tr>';
            // Hide the Clear All button when no courses
            document.getElementById('clearAllBtn').style.display = 'none';
        } else {
            state.courses.forEach((course, index) => {
                // Update indices in remaining rows
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${course.code}</td>
                    <td>${course.name}</td>
                    <td>${course.credits}</td>
                    <td>
                        <input 
                            type="number" 
                            class="marks-input" 
                            min="0" 
                            max="100" 
                            placeholder="0-100"
                            data-course-index="${index}"
                            ${course.marks !== null ? `value="${course.marks}"` : ''}
                        >
                    </td>
                    <td class="grade-cell" data-course-index="${index}">-</td>
                    <td class="gpa-cell" data-course-index="${index}">0.00</td>
                    <td>
                        <button class="btn-danger delete-btn" data-course-index="${index}">Remove</button>
                    </td>
                `;

                const marksInput = row.querySelector('.marks-input');
                marksInput.addEventListener('input', (e) => {
                    this.updateCourseMarks(index, e.target.value);
                });

                row.querySelector('.delete-btn').addEventListener('click', () => {
                    this.removeCourse(index);
                });

                tbody.appendChild(row);
                this.updateGradeDisplay(index);
            });
        }

        this.updateAllMetrics();
    }

    clearAllCourses() {
        this.stateManager.setState({ courses: [] });
        
        const tbody = document.getElementById('coursesTableBody');
        tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No courses added. Add a course to get started.</td></tr>';
        
        // Hide the Clear All button
        document.getElementById('clearAllBtn').style.display = 'none';
        
        this.updateAllMetrics();
    }

    updateAllMetrics() {
        const state = this.stateManager.getState();
        const courses = state.courses;

        // Calculate metrics
        const completedCourses = courses.filter(c => c.marks !== null);
        const totalCredits = completedCourses.reduce((sum, c) => sum + c.credits, 0);
        const totalRemainingCredits = state.program
            ? this.curriculumHandler.getProgramTotalCredits(state.program) - totalCredits
            : 0;

        const cgpa = this.gradingEngine.calculateCGPA(completedCourses);
        const standing = this.gradingEngine.getStanding(totalCredits, cgpa);
        const programTotal = state.program ? this.curriculumHandler.getProgramTotalCredits(state.program) : 132;
        const progress = programTotal > 0 ? (totalCredits / programTotal) * 100 : 0;

        // Update CGPA card
        document.getElementById('cgpaValue').textContent = cgpa.toFixed(2);

        // Update Credits card
        document.getElementById('creditsValue').textContent = totalCredits;
        document.getElementById('creditsInfo').textContent = `${Math.max(0, totalRemainingCredits)} remaining`;

        // Update Standing card
        document.getElementById('standingValue').textContent = standing;
        const gpaStatus = cgpa >= 3.0 ? 'Good' : cgpa >= 2.0 ? 'Satisfactory' : 'At Risk';
        document.getElementById('standingInfo').textContent = `GPA: ${gpaStatus}`;

        // Update Progress card
        document.getElementById('progressFill').style.width = `${Math.min(100, progress)}%`;
        document.getElementById('progressInfo').textContent = `${Math.round(progress)}%`;

        // Update semester summary
        this.updateSemesterSummary(completedCourses);
    }

    updateSemesterSummary(courses) {
        const summary = document.getElementById('semesterSummary');

        if (courses.length === 0) {
            summary.style.display = 'none';
            return;
        }

        summary.style.display = 'block';

        let totalCredits = 0;
        let totalGradePoints = 0;

        courses.forEach(course => {
            const grade = this.gradingEngine.calculateGrade(course.marks);
            if (grade) {
                totalCredits += course.credits;
                totalGradePoints += grade.gpa * course.credits;
            }
        });

        const sgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

        document.getElementById('semesterTotalCredits').textContent = totalCredits;
        document.getElementById('semesterGradePoints').textContent = totalGradePoints.toFixed(2);
        document.getElementById('semesterGPA').textContent = sgpa.toFixed(2);
    }

    toggleProgression(type, button) {
        document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        // Placeholder - chart implementation optional
    }

    renderAutocompleteSuggestions(suggestions) {
        const container = document.getElementById('autocompleteSuggestions');
        container.innerHTML = suggestions.map((code, index) => {
            const courseInfo = this.curriculumHandler.getCourseInfo(code);
            return `
                <div class="autocomplete-item ${index === 0 ? 'highlighted' : ''}" data-index="${index}" data-code="${code}">
                    <span class="autocomplete-item-code">${code}</span>
                    <span class="autocomplete-item-name">${courseInfo.name}</span>
                </div>
            `;
        }).join('');

        container.classList.add('show');
        container.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectSuggestion(item.dataset.code);
            });
        });
    }

    updateHighlightedSuggestion(index) {
        const items = document.querySelectorAll('.autocomplete-item');
        items.forEach(item => item.classList.remove('highlighted'));
        if (index >= 0 && index < items.length) {
            items[index].classList.add('highlighted');
            items[index].scrollIntoView({ block: 'nearest' });
        }
    }

    selectSuggestion(courseCode) {
        const courseCodeInput = document.getElementById('courseCodeInput');
        courseCodeInput.value = courseCode;
        document.getElementById('autocompleteSuggestions').classList.remove('show');
        document.getElementById('courseMarksInput').focus();
    }

    showError(message) {
        alert(message);
    }
}

// ============================================
// INITIALIZE APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    new UIManager();
});
