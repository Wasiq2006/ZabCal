// ============================================
// GRADING POLICY - SZABIST
// ============================================

const GRADING_POLICY = {
    90: { grade: 'A+', gpa: 4.0 },
    85: { grade: 'A', gpa: 3.75 },
    80: { grade: 'A-', gpa: 3.5 },
    75: { grade: 'B+', gpa: 3.25 },
    70: { grade: 'B', gpa: 3.0 },
    66: { grade: 'B-', gpa: 2.75 },
    63: { grade: 'C+', gpa: 2.5 },
    60: { grade: 'C', gpa: 2.0 },
    55: { grade: 'C-', gpa: 1.5 },
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
        if (this.setupSemesterListeners) this.setupSemesterListeners();
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

        // Combine courses from current table and tracked semesters
        let allCompletedCourses = courses.filter(c => c.marks !== null);
        if (state.semesters) {
            Object.values(state.semesters).forEach(sem => {
                if (sem.courses) {
                    allCompletedCourses = allCompletedCourses.concat(sem.courses.filter(c => c.marks !== null));
                }
            });
        }

        // Calculate metrics
        const completedCoursesForSummary = courses.filter(c => c.marks !== null);
        const totalCredits = allCompletedCourses.reduce((sum, c) => sum + c.credits, 0);
        const totalRemainingCredits = state.program
            ? this.curriculumHandler.getProgramTotalCredits(state.program) - totalCredits
            : 0;

        const cgpa = this.gradingEngine.calculateCGPA(allCompletedCourses);
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

        // Render Semesters list
        if (this.renderSemestersList) this.renderSemestersList();

        // Update active table semester summary
        this.updateSemesterSummary(completedCoursesForSummary);
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

    // --- SEMESTER TRACKING LOGIC --- //

    setupSemesterListeners() {
        this.semesterMode = '';
        const modal = document.getElementById('addSemesterModal');
        const step1 = document.getElementById('semesterStep1');
        const step2 = document.getElementById('semesterStep2');
        const semYear = document.getElementById('semYear');
        
        document.getElementById('openAddSemesterModal')?.addEventListener('click', () => {
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.remove('opacity-0'), 10);
            step1.classList.remove('hidden');
            step2.classList.add('hidden');
            semYear.value = new Date().getFullYear();
        });

        document.getElementById('btnCloseAddModal')?.addEventListener('click', () => {
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
        });

        document.getElementById('btnSaveCurrent')?.addEventListener('click', () => {
            this.semesterMode = 'save_current';
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            step2.classList.add('flex');
        });

        document.getElementById('btnStartFresh')?.addEventListener('click', () => {
            this.semesterMode = 'start_fresh';
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            step2.classList.add('flex');
        });

        document.getElementById('btnConfirmSem')?.addEventListener('click', () => {
            const semNum = document.getElementById('semNumber').value;
            const semTerm = document.getElementById('semTerm').value;
            const year = document.getElementById('semYear').value;
            
            if (!year) return this.showError("Please enter a year");

            const state = this.stateManager.getState();
            state.semesters = state.semesters || {};
            
            const semKey = `S${semNum}-${year}`;
            let coursesToSave = [];
            
            if (this.semesterMode === 'save_current') {
                coursesToSave = [...(state.courses || [])];
                this.stateManager.setState({ courses: [] }); // Clear current table
                this.renderCoursesTable(this.stateManager.getState());
            }

            const activeCompleted = coursesToSave.filter(c => c.marks !== null);
            const sgpa = this.gradingEngine.calculateSGPA(activeCompleted);
            const credits = activeCompleted.reduce((s, c) => s + c.credits, 0);

            state.semesters[semKey] = {
                id: semKey,
                number: semNum,
                term: semTerm,
                year: year,
                courses: coursesToSave,
                sgpa: sgpa,
                credits: credits,
                timestamp: Date.now()
            };

            this.stateManager.setState({ semesters: state.semesters });
            
            // Close Modal & Go to View
            modal.classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
                this.navigateTo('semesters');
                this.updateAllMetrics();
            }, 300);
        });

        document.getElementById('viewAllSemestersBtn')?.addEventListener('click', () => this.navigateTo('semesters'));
        document.getElementById('btnBackToCalc')?.addEventListener('click', () => this.navigateTo('calculator'));
        document.getElementById('btnCloseDetails')?.addEventListener('click', () => {
            document.getElementById('semesterDetailsView').classList.add('hidden');
        });
        
        document.getElementById('btnDeleteSemester')?.addEventListener('click', () => {
            if(!this.currentlyViewedSemesterId) return;
            const state = this.stateManager.getState();
            if(confirm('Are you sure you want to delete this semester?')) {
                delete state.semesters[this.currentlyViewedSemesterId];
                this.stateManager.setState({ semesters: state.semesters });
                document.getElementById('semesterDetailsView').classList.add('hidden');
                this.updateAllMetrics();
            }
        });
    }

    navigateTo(view) {
        if (view === 'semesters') {
            document.getElementById('calculatorView').classList.add('hidden');
            document.getElementById('semestersView').classList.remove('hidden');
        } else {
            document.getElementById('semestersView').classList.add('hidden');
            document.getElementById('calculatorView').classList.remove('hidden');
        }
    }

    renderSemestersList() {
        const state = this.stateManager.getState();
        const semesters = state.semesters || {};
        
        const miniList = document.getElementById('miniSemestersList');
        const grid = document.getElementById('semestersGrid');
        
        if (!miniList || !grid) return;
        
        let sItems = Object.values(semesters).sort((a,b) => b.timestamp - a.timestamp);
        
        if (sItems.length === 0) {
            miniList.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full opacity-50">
                    <span class="material-symbols-outlined text-3xl mb-2">school</span>
                    <p class="text-xs text-center font-medium">No semesters added yet.</p>
                </div>`;
            grid.innerHTML = `
                <div class="col-span-full py-12 text-center text-on-surface-variant bg-surface-container rounded-2xl border border-outline-variant/30">
                    <span class="material-symbols-outlined text-5xl mb-4 opacity-50">auto_stories</span>
                    <p class="font-medium">You haven't tracked any semesters yet.</p>
                </div>`;
            return;
        }

        miniList.innerHTML = sItems.map(sem => `
            <div class="bg-surface-container-high p-3 rounded-xl border border-outline-variant/30 cursor-pointer hover:border-primary transition-colors flex justify-between items-center" onclick="window.uiManager.openSemDetails('${sem.id}')">
                <div>
                    <h5 class="text-xs font-bold text-on-surface">${sem.term} ${sem.year}</h5>
                    <p class="text-[9px] text-on-surface-variant font-medium">Sem ${sem.number} • ${sem.credits} Cr</p>
                </div>
                <div class="text-right">
                    <p class="text-xs font-black text-primary">${sem.sgpa.toFixed(2)}</p>
                </div>
            </div>
        `).join('');

        grid.innerHTML = sItems.map(sem => `
            <div class="bg-surface-container rounded-3xl p-6 border border-outline-variant/30 hover:border-primary/50 transition-all hover:shadow-[0_10px_40px_-10px_rgba(39,24,126,0.2)] cursor-pointer group" onclick="window.uiManager.openSemDetails('${sem.id}')">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <span class="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-3 py-1 rounded-full">Semester ${sem.number}</span>
                    </div>
                </div>
                <h3 class="text-xl font-black text-on-surface mb-6 group-hover:text-primary transition-colors">${sem.term} ${sem.year}</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-surface-container-high rounded-xl p-4 border border-outline-variant/20">
                        <p class="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider mb-1">SGPA</p>
                        <p class="text-2xl font-black text-primary">${sem.sgpa.toFixed(2)}</p>
                    </div>
                    <div class="bg-surface-container-high rounded-xl p-4 border border-outline-variant/20">
                        <p class="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider mb-1">Credits</p>
                        <p class="text-2xl font-black text-on-surface">${sem.credits}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    openSemDetails(id) {
        this.navigateTo('semesters');
        this.currentlyViewedSemesterId = id;
        const sem = this.stateManager.getState().semesters[id];
        if(!sem) return;

        document.getElementById('semesterDetailsView').classList.remove('hidden');
        document.getElementById('detailSemTitle').textContent = `${sem.term} ${sem.year} (Semester ${sem.number})`;
        document.getElementById('detailSemGPA').textContent = sem.sgpa.toFixed(2);
        document.getElementById('detailSemCredits').textContent = sem.credits;

        const tbody = document.getElementById('detailSemCourses');
        if(!sem.courses || sem.courses.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="py-4 text-center text-sm text-on-surface-variant">No courses found in this semester.</td></tr>`;
            return;
        }

        tbody.innerHTML = sem.courses.map(course => {
            const gradeObj = course.marks !== null ? this.gradingEngine.calculateGrade(course.marks) : null;
            const gradeStr = gradeObj ? gradeObj.grade : '-';
            return `
                <tr class="hover:bg-surface-container-high/50 transition-colors border-b border-outline-variant/10">
                    <td class="py-3 pr-4">
                        <div class="font-bold text-on-surface text-sm break-all max-w-[200px] truncate" title="${course.name}">${course.code}</div>
                        <div class="text-[10px] text-on-surface-variant truncate max-w-[200px]" title="${course.name}">${course.name}</div>
                    </td>
                    <td class="py-3 text-center">${course.credits}</td>
                    <td class="py-3 text-center">${course.marks !== null ? course.marks : '-'}</td>
                    <td class="py-3 text-right font-black text-primary">${gradeStr}</td>
                </tr>
            `;
        }).join('');
        
        // Scroll into view gently
        document.getElementById('semesterDetailsView').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ============================================
// INITIALIZE APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    window.uiManager = new UIManager();
});
