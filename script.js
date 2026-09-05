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

function showVersionDetails() {
    const modal = document.getElementById('versionModal');
    const content = document.getElementById('versionModalContent');
    if (!modal || !content) return;

    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
    content.classList.remove('scale-95');
    content.classList.add('scale-100');

    document.getElementById('btnCloseVersionModal').onclick = () => {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
        content.classList.add('scale-95');
        content.classList.remove('scale-100');
    };
}


// ============================================
// CURRICULUM DATA HANDLER
// ============================================

class CurriculumHandler {
    constructor() {
        // Trigger cache build once on init
        DATABASE.buildCourseLookup();
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

function showVersionDetails() {
    const modal = document.getElementById('versionModal');
    const content = document.getElementById('versionModalContent');
    if (!modal || !content) return;

    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
    content.classList.remove('scale-95');
    content.classList.add('scale-100');

    document.getElementById('btnCloseVersionModal').onclick = () => {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
        content.classList.add('scale-95');
        content.classList.remove('scale-100');
    };
}


// ============================================
// GRADING & CALCULATION ENGINE
// ============================================

class GradingEngine {
    constructor() {
        this._thresholds = Object.keys(GRADING_POLICY).map(Number).sort((a, b) => b - a);
    }

    calculateGrade(marks) {
        if (marks === null || marks < 0 || marks > 100) return null;
        
        // Round to nearest integer: .5 and above goes up (e.g., 65.5 -> 66)
        const roundedMarks = Math.round(marks);
        
        for (const threshold of this._thresholds) {
            if (roundedMarks >= threshold) {
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

function showVersionDetails() {
    const modal = document.getElementById('versionModal');
    const content = document.getElementById('versionModalContent');
    if (!modal || !content) return;

    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
    content.classList.remove('scale-95');
    content.classList.add('scale-100');

    document.getElementById('btnCloseVersionModal').onclick = () => {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
        content.classList.add('scale-95');
        content.classList.remove('scale-100');
    };
}


// ============================================
// UI MANAGER
// ============================================

class UIManager {
    constructor() {
        this.stateManager = new StateManager();
        this.curriculumHandler = new CurriculumHandler();
        this.gradingEngine = new GradingEngine();
        this._autocompleteTimeout = null;
        this.currentlyViewedSemesterId = null;
        this.semesterMode = '';
        this._activeView = 'calculator';
        this._isInitialized = false;
        this.selectedDepartment = 'ALL';
        this.isEditingSemester = false;
        this.tempEditedCourses = [];
        this.initializeUI();
    }

    initializeUI() {
        if (!this._isInitialized) {
            this.initChart();
            this.setupTheme();
            this.initIntroAnimation();
            this.setupEventListeners();
            this.setupSemesterListeners();
            this.setupDataManagementListeners();
            this._isInitialized = true;
        }
        this.restoreState();
        this.updateAllMetrics();
    }

    initIntroAnimation() {
        const introContainer = document.getElementById('zabcal-intro');
        const overlay = document.getElementById('introOverlay');

        if (!introContainer || typeof ZabCalIntro === 'undefined') {
            if (overlay) overlay.style.display = 'none';
            return;
        }

        const isDark = document.documentElement.classList.contains('dark');
        const anim = new ZabCalIntro(introContainer, {
            loop: false,
            holdMs: 2200,
            background: 'transparent',
            ink: isDark ? '#c6c0ff' : '#12005d',
            subtitleColor: isDark ? '#c8c4d4' : '#474552',
            title: 'ZabCal',
            subtitle: 'SZABIST CGPA Calculator',
            onComplete: () => {
                this.dismissIntroOverlay();
            }
        });

        if (overlay) {
            overlay.addEventListener('click', () => {
                this.dismissIntroOverlay();
            }, { once: true });
        }

        anim.play();
    }

    dismissIntroOverlay() {
        const overlay = document.getElementById('introOverlay');
        if (overlay && !overlay.classList.contains('dismissed')) {
            overlay.classList.add('dismissed');
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        }
    }

    setupTheme() {
        const theme = this.stateManager.getState().theme;
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        this._updateThemeIcon();

        document.getElementById('themeToggle').addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            this.stateManager.setState({ theme: isDark ? 'dark' : 'light' });
            this._updateThemeIcon();
            // Re-render chart with correct theme colors
            if (this.gradeChart) {
                const state = this.stateManager.getState();
                let all = (state.courses || []).filter(c => c.marks !== null);
                Object.values(state.semesters || {}).forEach(s => {
                    if (s.courses) all = all.concat(s.courses.filter(c => c.marks !== null));
                });
                this.updateGradeChart(all);
            }
        });
    }

    _updateThemeIcon() {
        const isDark = document.documentElement.classList.contains('dark');
        const btn = document.getElementById('themeToggle');
        if (!btn) return;
        const sun = btn.querySelector('.icon-sun');
        const moon = btn.querySelector('.icon-moon');
        if (sun) sun.style.display = isDark ? 'none' : 'block';
        if (moon) moon.style.display = isDark ? 'block' : 'none';
    }

    updateProgramUI(progKey) {
        const programSelect = document.getElementById('programSelect');
        if (programSelect) programSelect.value = progKey || '';
    }

    setupEventListeners() {
        const programSelect = document.getElementById('programSelect');
        const courseCodeInput = document.getElementById('courseCodeInput');
        const autocompleteSuggestions = document.getElementById('autocompleteSuggestions');
        let highlightedIndex = -1;
        let currentSuggestions = [];

        programSelect?.addEventListener('change', (e) => {
            const newProg = e.target.value;
            this.stateManager.setState({ program: newProg });
            this.updateProgramUI(newProg);
            this.updateAllMetrics();
            if (courseCodeInput) {
                filterSuggestionsByProgram();
            }
        });

        const filterSuggestionsByProgram = () => {
            const input = courseCodeInput.value.trim().toUpperCase();
            const currentProg = this.stateManager.getState().program || '';
            const allCourses = this.curriculumHandler.getAllCourseCodes();
            const inputLower = input.toLowerCase();

            let filteredCourses = allCourses;
            if (currentProg) {
                filteredCourses = allCourses.filter(code => {
                    const info = this.curriculumHandler.getCourseInfo(code);
                    return info && info.programs && info.programs.includes(currentProg);
                });
            }

            let matching = [];
            if (input.length === 0) {
                if (currentProg) {
                    matching = filteredCourses.slice(0, 8);
                }
            } else {
                matching = filteredCourses
                    .filter(code => {
                        const courseInfo = this.curriculumHandler.getCourseInfo(code);
                        if (!courseInfo) return false;
                        const keywordMatch = courseInfo.keywords &&
                            courseInfo.keywords.some(k => k.toLowerCase().includes(inputLower));
                        const categoryMatch = courseInfo.category &&
                            courseInfo.category.toLowerCase().includes(inputLower);
                        const typeMatch = courseInfo.type &&
                            courseInfo.type.toLowerCase().includes(inputLower);
                        return code.toLowerCase().includes(inputLower) ||
                            courseInfo.name.toLowerCase().includes(inputLower) ||
                            keywordMatch ||
                            categoryMatch ||
                            typeMatch;
                    })
                    .sort((a, b) => {
                        const aInfo = this.curriculumHandler.getCourseInfo(a);
                        const bInfo = this.curriculumHandler.getCourseInfo(b);
                        const aCodeLower = a.toLowerCase();
                        const bCodeLower = b.toLowerCase();
                        // Exact code match
                        if (aCodeLower === inputLower) return -1;
                        if (bCodeLower === inputLower) return 1;
                        // Starts with code
                        const aCodeStarts = aCodeLower.startsWith(inputLower);
                        const bCodeStarts = bCodeLower.startsWith(inputLower);
                        if (aCodeStarts && !bCodeStarts) return -1;
                        if (!aCodeStarts && bCodeStarts) return 1;
                        // Starts with name
                        const aNameStarts = aInfo?.name?.toLowerCase().startsWith(inputLower);
                        const bNameStarts = bInfo?.name?.toLowerCase().startsWith(inputLower);
                        if (aNameStarts && !bNameStarts) return -1;
                        if (!aNameStarts && bNameStarts) return 1;
                        // Keyword exact match
                        const aKw = aInfo?.keywords?.some(k => k.toLowerCase() === inputLower);
                        const bKw = bInfo?.keywords?.some(k => k.toLowerCase() === inputLower);
                        if (aKw && !bKw) return -1;
                        if (!aKw && bKw) return 1;
                        return 0;
                    })
                    .slice(0, 10);
            }

            if (matching.length === 0) {
                autocompleteSuggestions.classList.remove('show');
                currentSuggestions = [];
                return;
            }
            currentSuggestions = matching;
            highlightedIndex = -1;
            this.renderAutocompleteSuggestions(matching);
        };

        courseCodeInput.addEventListener('focus', () => {
            const currentProg = this.stateManager.getState().program || '';
            if (currentProg && courseCodeInput.value.trim().length === 0) {
                filterSuggestionsByProgram();
            }
        });

        courseCodeInput.addEventListener('input', () => {
            clearTimeout(this._autocompleteTimeout);
            this._autocompleteTimeout = setTimeout(() => {
                filterSuggestionsByProgram();
            }, 80);
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
        this.updateProgramUI(state.program || '');
        this.renderCoursesList();
    }

    addCourse(courseCode, marks = null) {
        let code = courseCode.trim().toUpperCase();

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

        // Use canonical course code in case a keyword/alias was entered
        code = courseInfo.code;

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

    isCourseInSavedSemesters(courseCode) {
        const state = this.stateManager.getState();
        const clean = (courseCode || '').trim().toUpperCase();
        if (!state.semesters) return false;
        return Object.values(state.semesters).some(sem =>
            sem.courses && sem.courses.some(c => c.code.trim().toUpperCase() === clean)
        );
    }

    isCourseRepeatedAcrossSemesters(courseCode) {
        const state = this.stateManager.getState();
        const clean = (courseCode || '').trim().toUpperCase();
        let count = 0;
        if (state.semesters) {
            Object.values(state.semesters).forEach(sem => {
                if (sem.courses && sem.courses.some(c => c.code.trim().toUpperCase() === clean)) {
                    count++;
                }
            });
        }
        return count >= 2;
    }

    renderCoursesList() {
        const state = this.stateManager.getState();
        const courses = state.courses || [];
        const tbody = document.getElementById('coursesTableBody');
        const mobileList = document.getElementById('coursesMobileList');
        const clearAllBtn = document.getElementById('clearAllBtn');

        if (tbody) tbody.innerHTML = '';
        if (mobileList) mobileList.innerHTML = '';

        if (courses.length === 0) {
            if (tbody) {
                tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No courses added. Add a course to get started.</td></tr>';
            }
            if (mobileList) {
                mobileList.innerHTML = `
                    <div class="empty-mobile-courses p-6 text-center text-xs font-medium text-on-surface-variant bg-surface-container-low rounded-2xl border border-outline-variant/20 flex flex-col items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-3xl text-primary">menu_book</span>
                        <p>No courses added. Add a course to get started.</p>
                    </div>
                `;
            }
            if (clearAllBtn) clearAllBtn.style.display = 'none';
        } else {
            if (clearAllBtn) clearAllBtn.style.display = 'flex';
            courses.forEach((course, index) => {
                this.renderCourseRow(course, index);
                this.updateGradeDisplay(index);
            });
        }
    }

    renderCourseRow(course, courseIndex) {
        const isRepeated = this.isCourseInSavedSemesters(course.code);
        const tbody = document.getElementById('coursesTableBody');
        const mobileList = document.getElementById('coursesMobileList');

        // 1. Desktop Table Row
        if (tbody) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="font-bold text-on-surface">${course.code}</div>
                    ${isRepeated ? `<div class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 mt-1"><span class="material-symbols-outlined text-[12px]">repeat</span> Repeating Course</div>` : ''}
                </td>
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

            const marksInput = row.querySelector('.marks-input');
            if (marksInput) {
                marksInput.addEventListener('input', (e) => {
                    this.updateCourseMarks(courseIndex, e.target.value);
                });
            }

            const deleteBtn = row.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.removeCourse(courseIndex);
                });
            }

            tbody.appendChild(row);
        }

        // 2. Mobile Course Card
        if (mobileList) {
            const card = document.createElement('div');
            card.className = 'course-mobile-card p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/20 shadow-sm flex flex-col gap-2.5 transition-all';
            card.setAttribute('data-course-index', courseIndex);
            card.innerHTML = `
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-black text-xs tracking-wide">${course.code}</span>
                        <span class="px-2 py-0.5 rounded-md bg-surface-container-highest text-on-surface-variant text-[11px] font-semibold">${course.credits} Cr</span>
                        ${isRepeated ? `<span class="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20"><span class="material-symbols-outlined text-[12px]">repeat</span> Repeat</span>` : ''}
                    </div>
                    <button class="delete-btn p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors" data-course-index="${courseIndex}" title="Remove Course">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
                <div class="text-xs font-bold text-on-surface leading-snug">${course.name}</div>
                <div class="flex items-center justify-between gap-3 pt-1 border-t border-outline-variant/10">
                    <div class="flex items-center gap-2">
                        <label class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Marks:</label>
                        <input 
                            type="number" 
                            class="marks-input w-20 px-2.5 py-1.5 bg-surface-container-highest border border-outline-variant/30 rounded-lg text-xs font-bold text-center text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                            min="0" 
                            max="100" 
                            placeholder="0-100"
                            data-course-index="${courseIndex}"
                            ${course.marks !== null ? `value="${course.marks}"` : ''}
                        >
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="flex flex-col items-center">
                            <span class="text-[9px] uppercase tracking-wider text-on-surface-variant font-bold">Grade</span>
                            <span class="grade-cell text-xs font-black text-primary px-2 py-0.5 rounded-md bg-surface-container-highest min-w-[28px] text-center" data-course-index="${courseIndex}">-</span>
                        </div>
                        <div class="flex flex-col items-center">
                            <span class="text-[9px] uppercase tracking-wider text-on-surface-variant font-bold">GPA</span>
                            <span class="gpa-cell text-xs font-black text-primary px-2 py-0.5 rounded-md bg-surface-container-highest min-w-[36px] text-center" data-course-index="${courseIndex}">0.00</span>
                        </div>
                    </div>
                </div>
            `;

            const marksInput = card.querySelector('.marks-input');
            if (marksInput) {
                marksInput.addEventListener('input', (e) => {
                    this.updateCourseMarks(courseIndex, e.target.value);
                });
            }

            const deleteBtn = card.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.removeCourse(courseIndex);
                });
            }

            mobileList.appendChild(card);
        }
    }

    addCourseToTable(course) {
        const tbody = document.getElementById('coursesTableBody');
        const mobileList = document.getElementById('coursesMobileList');
        const clearAllBtn = document.getElementById('clearAllBtn');

        if (tbody) {
            const emptyRow = tbody.querySelector('.empty-row');
            if (emptyRow) emptyRow.remove();
        }
        if (mobileList) {
            const emptyMobile = mobileList.querySelector('.empty-mobile-courses');
            if (emptyMobile) emptyMobile.remove();
        }

        if (clearAllBtn) clearAllBtn.style.display = 'flex';

        const state = this.stateManager.getState();
        let courseIndex = state.courses.findIndex(c => c.code === course.code);
        if (courseIndex === -1) courseIndex = state.courses.length - 1;

        this.renderCourseRow(course, courseIndex);
    }

    updateCourseMarks(courseIndex, marks) {
        const state = this.stateManager.getState();
        const course = state.courses[courseIndex];
        if (!course) return;

        if (marks === '') {
            course.marks = null;
        } else {
            const marksNum = parseFloat(marks);
            if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
                this.showToast('Marks must be between 0 and 100', 'error');
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
        if (!course) return;

        const gradeCells = document.querySelectorAll(`.grade-cell[data-course-index="${courseIndex}"]`);
        const gpaCells = document.querySelectorAll(`.gpa-cell[data-course-index="${courseIndex}"]`);

        let gradeText = '-';
        let gpaText = '0.00';

        if (course.marks !== null) {
            const grade = this.gradingEngine.calculateGrade(course.marks);
            gradeText = grade ? grade.grade : 'F';
            gpaText = grade ? grade.gpa.toFixed(2) : '0.00';
        }

        gradeCells.forEach(cell => { cell.textContent = gradeText; });
        gpaCells.forEach(cell => { cell.textContent = gpaText; });

        // Keep marks inputs synchronized across desktop and mobile
        const marksInputs = document.querySelectorAll(`.marks-input[data-course-index="${courseIndex}"]`);
        marksInputs.forEach(input => {
            const val = course.marks !== null ? String(course.marks) : '';
            if (input.value !== val) {
                input.value = val;
            }
        });
    }

    removeCourse(courseIndex) {
        const state = this.stateManager.getState();
        state.courses.splice(courseIndex, 1);
        this.stateManager.setState({ courses: state.courses });
        this.renderCoursesList();
        this.updateAllMetrics();
    }

    clearAllCourses() {
        this.stateManager.setState({ courses: [] });
        this.renderCoursesList();
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

        // Apply SZABIST Repeating Course Policy (Highest grade attempt counted in CGPA, credits counted once)
        const grouped = {};
        allCompletedCourses.forEach(course => {
            const key = course.code.trim().toUpperCase();
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(course);
        });

        let effectiveCoursesForCGPA = [];
        let totalCredits = 0;

        Object.values(grouped).forEach(attempts => {
            if (attempts.length === 1) {
                effectiveCoursesForCGPA.push(attempts[0]);
                totalCredits += attempts[0].credits;
            } else {
                // Pick the highest grade/marks attempt
                attempts.sort((a, b) => {
                    const aGrade = a.marks !== null ? this.gradingEngine.calculateGrade(a.marks) : { gpa: 0 };
                    const bGrade = b.marks !== null ? this.gradingEngine.calculateGrade(b.marks) : { gpa: 0 };
                    if (bGrade.gpa !== aGrade.gpa) return bGrade.gpa - aGrade.gpa;
                    return (b.marks || 0) - (a.marks || 0);
                });
                const best = attempts[0];
                effectiveCoursesForCGPA.push(best);
                totalCredits += best.credits; // Credit counted only once towards degree
            }
        });

        // Calculate metrics
        const completedCoursesForSummary = courses.filter(c => c.marks !== null);
        const totalRemainingCredits = state.program
            ? this.curriculumHandler.getProgramTotalCredits(state.program) - totalCredits
            : 0;

        const cgpa = this.gradingEngine.calculateCGPA(effectiveCoursesForCGPA);
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

        // Update Total Courses Completed on Progress card (unique completed courses from saved semesters)
        let savedSemesterCoursesCount = 0;
        if (state.semesters) {
            const uniqueCodes = new Set();
            Object.values(state.semesters).forEach(sem => {
                if (sem.courses) {
                    sem.courses.filter(c => c.marks !== null).forEach(c => uniqueCodes.add(c.code.trim().toUpperCase()));
                }
            });
            savedSemesterCoursesCount = uniqueCodes.size;
        }

        const totalCompletedEl = document.getElementById('totalCoursesCompleted');
        const coursesCompletedContainer = document.getElementById('coursesCompletedContainer');
        if (totalCompletedEl) {
            totalCompletedEl.textContent = savedSemesterCoursesCount;

            if (coursesCompletedContainer) {
                coursesCompletedContainer.title = "This only updates when you save a semester in the Semesters section.";
            }
        }

        if (this.renderSemestersList) this.renderSemestersList();

        // Update active table semester summary
        this.updateSemesterSummary(completedCoursesForSummary);

        if (this.updateGradeChart) this.updateGradeChart(allCompletedCourses);
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
            if (!courseInfo) return '';

            let badgeHtml = '';
            if (courseInfo.category && courseInfo.category !== 'Core') {
                const isDomain = courseInfo.category.toLowerCase().includes('domain') ||
                                 ['marketing', 'management', 'finance', 'supply chain', 'information technology', 'business analysis'].some(c => courseInfo.category.toLowerCase().includes(c));
                const badgeClass = isDomain
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20';
                badgeHtml = `<span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${badgeClass} shrink-0">${courseInfo.category}</span>`;
            } else if (courseInfo.keywords && courseInfo.keywords.length > 0 && !courseInfo.keywords[0].includes('xxxx')) {
                badgeHtml = `<span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">${courseInfo.keywords[0]}</span>`;
            }

            const creditsHtml = courseInfo.credits ? `<span class="text-[10px] font-black px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant shrink-0">${courseInfo.credits} Cr</span>` : '';

            return `
                <div class="autocomplete-item ${index === 0 ? 'highlighted' : ''} flex items-center justify-between gap-2" data-index="${index}" data-code="${code}">
                    <div class="flex items-center gap-2 min-w-0 flex-1">
                        <span class="autocomplete-item-code shrink-0">${code}</span>
                        <span class="autocomplete-item-name truncate">${courseInfo.name}</span>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0 ml-2">
                        ${badgeHtml}
                        ${creditsHtml}
                    </div>
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

    showToast(message, type = 'error') {
        const container = document.getElementById('toastContainer');
        if (!container) { alert(message); return; }
        const toast = document.createElement('div');
        const icons = { error: 'error', success: 'check_circle', info: 'info' };
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px">${icons[type] || 'info'}</span><span>${message}</span>`;
        container.appendChild(toast);
        requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 350);
        }, 3000);
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    // --- SEMESTER TRACKING LOGIC --- //

    setupSemesterListeners() {
        this.semesterMode = '';
        const modal = document.getElementById('addSemesterModal');
        const step1 = document.getElementById('semesterStep1');
        const step2 = document.getElementById('semesterStep2');
        const semYear = document.getElementById('semYear');
        const semTermSelect = document.getElementById('semTerm');
        const semNumSelect = document.getElementById('semNumber');

        const updateSummerSemesterState = () => {
            if (!semTermSelect || !semNumSelect) return;
            if (semTermSelect.value === 'Summer') {
                semNumSelect.value = 'Summer';
                semNumSelect.disabled = true;
                semNumSelect.classList.add('opacity-60', 'cursor-not-allowed', 'bg-surface-container-high/40');
            } else {
                semNumSelect.disabled = false;
                semNumSelect.classList.remove('opacity-60', 'cursor-not-allowed', 'bg-surface-container-high/40');
                if (semNumSelect.value === 'Summer') {
                    semNumSelect.value = '1';
                }
            }
        };

        semTermSelect?.addEventListener('change', updateSummerSemesterState);
        semNumSelect?.addEventListener('change', () => {
            if (semNumSelect.value === 'Summer') {
                semTermSelect.value = 'Summer';
                updateSummerSemesterState();
            }
        });

        document.getElementById('openAddSemesterModal')?.addEventListener('click', () => {
            window.lenis?.stop();
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.remove('opacity-0'), 10);
            step1.classList.remove('hidden');
            step2.classList.add('hidden');
            semYear.value = new Date().getFullYear();
        });

        document.getElementById('btnCloseAddModal')?.addEventListener('click', () => {
            modal.classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
                window.lenis?.start();
            }, 300);
        });

        document.getElementById('btnSaveCurrent')?.addEventListener('click', () => {
            this.semesterMode = 'save_current';
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            step2.classList.add('flex');

            updateSummerSemesterState();

            // Detect and display repeated courses notice
            const state = this.stateManager.getState();
            const noticeBox = document.getElementById('semRepeatedCoursesNotice');
            const noticeList = document.getElementById('semRepeatedCoursesList');
            if (noticeBox && noticeList) {
                const repeatedCourses = (state.courses || []).filter(c => this.isCourseInSavedSemesters(c.code));
                if (repeatedCourses.length > 0) {
                    noticeList.innerHTML = repeatedCourses.map(c => `
                        <li><span class="font-bold text-on-surface">${c.code}</span> (${c.name}): <span class="font-bold text-amber-600 dark:text-amber-400">Repeating Course</span></li>
                    `).join('');
                    noticeBox.classList.remove('hidden');
                } else {
                    noticeBox.classList.add('hidden');
                }
            }
        });

        document.getElementById('btnStartFresh')?.addEventListener('click', () => {
            if (confirm("This will clear your current table. Are you sure?")) {
                this.clearAllCourses();

                // Close Modal
                modal.classList.add('opacity-0');
                setTimeout(() => modal.classList.add('hidden'), 300);
            }
        });

        document.getElementById('btnConfirmSem')?.addEventListener('click', () => {
            const semTerm = semTermSelect ? semTermSelect.value : 'Fall';
            const rawSemNum = semNumSelect ? semNumSelect.value : '1';
            const isSummer = semTerm === 'Summer' || rawSemNum === 'Summer';
            const semNum = isSummer ? 'Summer' : rawSemNum;
            const year = document.getElementById('semYear').value;

            if (!year) return this.showError("Please enter a year");

            const state = this.stateManager.getState();
            state.semesters = state.semesters || {};

            const semKey = isSummer ? `Summer-${year}-${Date.now().toString().slice(-4)}` : `S${semNum}-${semTerm}-${year}`;
            let coursesToSave = [];

            if (this.semesterMode === 'save_current') {
                coursesToSave = (state.courses || []).map(c => ({
                    ...c,
                    isRepeated: this.isCourseInSavedSemesters(c.code)
                }));
                this.clearAllCourses(); // Clear current table UI and state
            } else {
                this.showError('Please select "Use Current Table Courses" to save a semester.');
                return;
            }

            if (coursesToSave.length === 0) {
                this.showError('No courses found in table. Add courses before saving a semester.');
                return;
            }

            const activeCompleted = coursesToSave.filter(c => c.marks !== null);
            const sgpa = this.gradingEngine.calculateSGPA(activeCompleted);
            const credits = activeCompleted.reduce((s, c) => s + c.credits, 0);

            state.semesters[semKey] = {
                id: semKey,
                number: semNum,
                term: isSummer ? 'Summer' : semTerm,
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
                window.lenis?.start();
                this.navigateTo('semesters');
                this.updateAllMetrics();
            }, 300);
        });

        document.getElementById('viewAllSemestersBtn')?.addEventListener('click', () => this.navigateTo('semesters'));
        document.getElementById('btnBackToCalc')?.addEventListener('click', () => this.navigateTo('calculator'));

        document.getElementById('btnCloseDetails')?.addEventListener('click', () => {
            this.isEditingSemester = false;
            this.tempEditedCourses = [];
            document.getElementById('semesterDetailsView').classList.add('hidden');
        });

        document.getElementById('btnEditSemMarks')?.addEventListener('click', () => {
            if (!this.currentlyViewedSemesterId) return;
            const sem = this.stateManager.getState().semesters[this.currentlyViewedSemesterId];
            if (!sem || !sem.courses || sem.courses.length === 0) return;
            this.tempEditedCourses = JSON.parse(JSON.stringify(sem.courses));
            this.openSemDetails(this.currentlyViewedSemesterId, true);
        });

        document.getElementById('btnCancelEditMarks')?.addEventListener('click', () => {
            if (!this.currentlyViewedSemesterId) return;
            this.tempEditedCourses = [];
            this.openSemDetails(this.currentlyViewedSemesterId, false);
        });

        document.getElementById('btnSaveEditMarks')?.addEventListener('click', () => {
            if (!this.currentlyViewedSemesterId) return;
            const state = this.stateManager.getState();
            const sem = state.semesters[this.currentlyViewedSemesterId];
            if (!sem) return;

            // Validate tempEditedCourses marks
            for (const c of this.tempEditedCourses) {
                if (c.marks !== null && (isNaN(c.marks) || c.marks < 0 || c.marks > 100)) {
                    this.showError(`Invalid marks for ${c.code}. Must be between 0 and 100.`);
                    return;
                }
            }

            sem.courses = this.tempEditedCourses;
            const completed = sem.courses.filter(c => c.marks !== null);
            sem.sgpa = this.gradingEngine.calculateSGPA(completed);
            sem.credits = completed.reduce((s, c) => s + c.credits, 0);

            this.stateManager.setState({ semesters: state.semesters });
            this.tempEditedCourses = [];
            this.openSemDetails(this.currentlyViewedSemesterId, false);
            this.updateAllMetrics();

            // Refresh grade chart
            let all = (state.courses || []).filter(c => c.marks !== null);
            if (state.semesters) {
                Object.values(state.semesters).forEach(s => {
                    if (s.courses) all = all.concat(s.courses.filter(c => c.marks !== null));
                });
            }
            this.updateGradeChart(all);

            this.showSuccess("Semester marks updated and SGPA recalculated!");
        });

        document.getElementById('btnDeleteSemester')?.addEventListener('click', () => {
            if (!this.currentlyViewedSemesterId) return;
            const state = this.stateManager.getState();
            if (confirm('Are you sure you want to delete this semester?')) {
                delete state.semesters[this.currentlyViewedSemesterId];
                this.stateManager.setState({ semesters: state.semesters });
                document.getElementById('semesterDetailsView').classList.add('hidden');
                this.updateAllMetrics();
            }
        });
    }

    navigateTo(view) {
        const views = {
            calculator: document.getElementById('calculatorView'),
            semesters: document.getElementById('semestersView'),
            about: document.getElementById('aboutView')
        };

        const incoming = views[view] || views.calculator;

        this._activeView = view in views ? view : 'calculator';

        Object.entries(views).forEach(([name, element]) => {
            if (!element) return;

            if (name === this._activeView) {
                element.classList.remove('hidden');
                element.classList.add('view-entering');
                requestAnimationFrame(() => {
                    element.classList.add('view-entering-active');
                });
            } else {
                element.classList.add('hidden');
                element.classList.remove('view-entering', 'view-entering-active');
            }
        });

        const detailsView = document.getElementById('semesterDetailsView');
        if (detailsView && this._activeView !== 'semesters') {
            detailsView.classList.add('hidden');
        }

        this._syncNavState(this._activeView);
        if (this._activeView === 'about') {
            const aboutCard = document.getElementById('aboutHeroCard');
            if (window.lenis) {
                window.lenis.scrollTo(aboutCard, { offset: -24, duration: 1.2 });
            } else {
                aboutCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            if (window.lenis) {
                window.lenis.scrollTo(0, { duration: 0.7 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }

    _syncNavState(activeView) {
        document.querySelectorAll('[data-nav-view]').forEach(link => {
            const isActive = link.dataset.navView === activeView;
            link.classList.toggle('active', isActive);
            link.classList.toggle('bg-primary/10', isActive);
            link.classList.toggle('text-primary', isActive);
            link.classList.toggle('hover:bg-primary/10', !isActive);
            link.classList.toggle('text-on-surface-variant', !isActive);
            link.classList.toggle('hover:text-primary', !isActive);
        });
    }

    renderSemestersList() {
        const state = this.stateManager.getState();
        const semesters = state.semesters || {};

        const miniList = document.getElementById('miniSemestersList');
        const grid = document.getElementById('semestersGrid');

        if (!miniList || !grid) return;

        let sItems = Object.values(semesters)
            .filter(sem => sem && sem.id && sem.term && sem.year)
            .sort((a, b) => b.timestamp - a.timestamp);

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

        miniList.innerHTML = sItems.map(sem => {
            const isSummer = sem.number === 'Summer' || sem.term === 'Summer';
            const semBadge = isSummer ? 'Summer Semester' : `Sem ${sem.number}`;
            const semTitle = isSummer ? `Summer Semester ${sem.year}` : `${sem.term} ${sem.year}`;
            return `
            <div class="bg-surface-container-high p-3 rounded-xl border border-outline-variant/30 cursor-pointer hover:border-primary transition-colors flex justify-between items-center" onclick="window.uiManager.openSemDetails('${sem.id}')">
                <div>
                    <h5 class="text-xs font-bold text-on-surface">${semTitle}</h5>
                    <p class="text-[9px] text-on-surface-variant font-medium">${semBadge} • ${sem.credits} Cr • ${sem.courses ? sem.courses.length : 0} Courses</p>
                </div>
                <div class="text-right">
                    <p class="text-xs font-black text-primary">${sem.sgpa.toFixed(2)}</p>
                </div>
            </div>
        `}).join('');

        grid.innerHTML = sItems.map(sem => {
            const isSummer = sem.number === 'Summer' || sem.term === 'Summer';
            const semBadge = isSummer ? 'Summer Semester' : `Semester ${sem.number}`;
            const semTitle = isSummer ? `Summer Semester ${sem.year}` : `${sem.term} ${sem.year}`;
            return `
            <div class="bg-surface-container rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-outline-variant/30 hover:border-primary/50 transition-all hover:shadow-[0_10px_40px_-10px_rgba(39,24,126,0.2)] cursor-pointer group" onclick="window.uiManager.openSemDetails('${sem.id}')">
                <div class="flex justify-between items-center mb-3">
                    <span class="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-3 py-1 rounded-full">${semBadge}</span>
                    <span class="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full">${sem.courses ? sem.courses.length : 0} Courses</span>
                </div>
                <h3 class="text-xl font-black text-on-surface mb-4 group-hover:text-primary transition-colors">${semTitle}</h3>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-surface-container-high rounded-xl p-3 sm:p-4 border border-outline-variant/20">
                        <p class="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider mb-1">SGPA</p>
                        <p class="text-2xl font-black text-primary">${sem.sgpa.toFixed(2)}</p>
                    </div>
                    <div class="bg-surface-container-high rounded-xl p-3 sm:p-4 border border-outline-variant/20">
                        <p class="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider mb-1">Credits</p>
                        <p class="text-2xl font-black text-on-surface">${sem.credits}</p>
                    </div>
                </div>
                <div class="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs font-semibold text-primary group-hover:opacity-80 transition-opacity">
                    <span>View course details</span>
                    <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
            </div>
        `}).join('');
    }

    openSemDetails(id, isEditMode = false) {
        this.navigateTo('semesters');
        this.currentlyViewedSemesterId = id;
        this.isEditingSemester = isEditMode;
        const sem = this.stateManager.getState().semesters[id];
        if (!sem) return;

        const detailsView = document.getElementById('semesterDetailsView');
        detailsView.classList.remove('hidden');

        const editActionBar = document.getElementById('semEditActionBar');
        const btnEditMarks = document.getElementById('btnEditSemMarks');

        if (isEditMode) {
            editActionBar?.classList.remove('hidden');
            btnEditMarks?.classList.add('hidden');
        } else {
            editActionBar?.classList.add('hidden');
            btnEditMarks?.classList.remove('hidden');
        }

        const isSummer = sem.number === 'Summer' || sem.term === 'Summer';
        const semTitleDisplay = isSummer ? `Summer Semester ${sem.year}` : `${sem.term} ${sem.year} (Semester ${sem.number})`;
        document.getElementById('detailSemTitle').textContent = semTitleDisplay;
        document.getElementById('detailSemGPA').textContent = sem.sgpa.toFixed(2);
        document.getElementById('detailSemCredits').textContent = sem.credits;

        const coursesToRender = isEditMode ? this.tempEditedCourses : sem.courses;
        const countEl = document.getElementById('detailSemCoursesCount');
        if (countEl) countEl.textContent = coursesToRender ? coursesToRender.length : 0;

        const tbody = document.getElementById('detailSemCourses');
        const mobileContainer = document.getElementById('detailSemCoursesMobile');

        if (!coursesToRender || coursesToRender.length === 0) {
            if (tbody) tbody.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-sm text-on-surface-variant">No courses found in this semester.</td></tr>`;
            if (mobileContainer) mobileContainer.innerHTML = `<div class="p-6 text-center text-sm text-on-surface-variant bg-surface-container-low rounded-2xl border border-outline-variant/20">No courses found in this semester.</div>`;
            return;
        }

        const updateLiveEdit = (index, val) => {
            const num = val.trim() === '' ? null : parseFloat(val);
            if (num !== null && (isNaN(num) || num < 0 || num > 100)) return;
            this.tempEditedCourses[index].marks = num;

            const active = this.tempEditedCourses.filter(c => c.marks !== null);
            const liveSGPA = this.gradingEngine.calculateSGPA(active);
            document.getElementById('detailSemGPA').textContent = liveSGPA.toFixed(2);

            const gradeObj = num !== null ? this.gradingEngine.calculateGrade(num) : null;
            const gradeStr = gradeObj ? gradeObj.grade : '-';

            // Update row desktop
            const rowGradeEl = document.querySelector(`.sem-live-grade-${index}`);
            if (rowGradeEl) rowGradeEl.textContent = gradeStr;

            // Update card mobile
            const cardGradeEl = document.querySelector(`.sem-live-card-grade-${index}`);
            if (cardGradeEl) cardGradeEl.textContent = gradeStr;
            const cardGpaEl = document.querySelector(`.sem-live-card-gpa-${index}`);
            if (cardGpaEl) cardGpaEl.textContent = gradeObj ? `GPA ${gradeObj.gpa.toFixed(2)}` : '';
        };

        // Render Desktop Table (clean, no truncation, full names wrapping properly)
        if (tbody) {
            tbody.innerHTML = coursesToRender.map((course, idx) => {
                const gradeObj = course.marks !== null ? this.gradingEngine.calculateGrade(course.marks) : null;
                const gradeStr = gradeObj ? gradeObj.grade : '-';
                const isRepeated = course.isRepeated || this.isCourseRepeatedAcrossSemesters(course.code);

                const marksDisplay = isEditMode ? `
                    <div class="flex items-center justify-center">
                        <input type="number" min="0" max="100" 
                            class="sem-edit-mark-input w-20 px-2 py-1 text-center font-bold bg-surface-container-high border border-outline-variant/40 rounded-lg text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all text-sm" 
                            value="${course.marks !== null ? course.marks : ''}" 
                            data-index="${idx}">
                    </div>
                ` : `${course.marks !== null ? course.marks : '-'}`;

                return `
                    <tr class="hover:bg-surface-container-high/20 transition-colors border-b border-outline-variant/10">
                        <td class="py-3.5 pr-4">
                            <div class="font-bold text-on-surface text-sm flex flex-wrap items-center gap-2">
                                <span>${course.code}</span>
                                ${isRepeated ? `<span class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20"><span class="material-symbols-outlined text-[12px]">repeat</span> Repeating Course</span>` : ''}
                            </div>
                            <div class="text-xs text-on-surface-variant leading-snug break-words mt-0.5">${course.name}</div>
                        </td>
                        <td class="py-3.5 text-center font-medium text-on-surface">${course.credits}</td>
                        <td class="py-3.5 text-center font-medium text-on-surface">${marksDisplay}</td>
                        <td class="py-3.5 text-right font-black text-primary text-base sem-live-grade-${idx}">${gradeStr}</td>
                    </tr>
                `;
            }).join('');
        }

        // Render Mobile Cards (optimized for phone screens)
        if (mobileContainer) {
            mobileContainer.innerHTML = coursesToRender.map((course, idx) => {
                const gradeObj = course.marks !== null ? this.gradingEngine.calculateGrade(course.marks) : null;
                const gradeStr = gradeObj ? gradeObj.grade : '-';
                const isRepeated = course.isRepeated || this.isCourseRepeatedAcrossSemesters(course.code);

                const marksDisplay = isEditMode ? `
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-semibold text-on-surface-variant">Marks:</span>
                        <input type="number" min="0" max="100" 
                            class="sem-edit-mark-input w-20 px-2 py-1 text-center font-bold bg-surface-container border border-outline-variant/40 rounded-lg text-on-surface focus:ring-2 focus:ring-primary outline-none text-sm" 
                            value="${course.marks !== null ? course.marks : ''}" 
                            data-index="${idx}">
                    </div>
                ` : `
                    <div class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm text-primary">grade</span>
                        <span>Marks: <strong class="text-on-surface font-bold">${course.marks !== null ? course.marks : '-'}</strong></span>
                    </div>
                `;

                return `
                    <div class="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/20 flex flex-col gap-2.5">
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0 flex-1">
                                <div class="flex flex-wrap items-center gap-1.5 mb-1">
                                    <span class="inline-block px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">${course.code}</span>
                                    ${isRepeated ? `<span class="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20"><span class="material-symbols-outlined text-[11px]">repeat</span> Repeating Course</span>` : ''}
                                </div>
                                <h5 class="font-bold text-on-surface text-sm leading-snug break-words">${course.name}</h5>
                            </div>
                            <div class="flex flex-col items-end shrink-0">
                                <span class="px-2.5 py-1 rounded-xl bg-primary/10 border border-primary/20 text-primary font-black text-base sem-live-card-grade-${idx}">${gradeStr}</span>
                                <span class="text-[10px] text-on-surface-variant font-medium mt-0.5 sem-live-card-gpa-${idx}">${gradeObj ? `GPA ${gradeObj.gpa.toFixed(2)}` : ''}</span>
                            </div>
                        </div>
                        <div class="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-outline-variant/10">
                            <div class="flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-sm text-primary">credit_card</span>
                                <span>Credits: <strong class="text-on-surface font-bold">${course.credits}</strong></span>
                            </div>
                            ${marksDisplay}
                        </div>
                    </div>
                `;
            }).join('');
        }

        if (isEditMode) {
            document.querySelectorAll('.sem-edit-mark-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    const idx = parseInt(e.target.dataset.index, 10);
                    updateLiveEdit(idx, e.target.value);
                    document.querySelectorAll(`.sem-edit-mark-input[data-index="${idx}"]`).forEach(inp => {
                        if (inp !== e.target) inp.value = e.target.value;
                    });
                });
            });
        }

        // Scroll into view gently on mobile and desktop
        if (!isEditMode) {
            setTimeout(() => {
                if (window.lenis) {
                    window.lenis.scrollTo(detailsView, { offset: -24, duration: 1.0 });
                } else {
                    detailsView.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 50);
        }
    }

    setupDataManagementListeners() {
        document.getElementById('btnExportData')?.addEventListener('click', () => {
            const state = this.stateManager.getState();
            const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.href = URL.createObjectURL(blob);
            downloadAnchorNode.download = "zabcal_backup_" + new Date().toISOString().split('T')[0] + ".json";
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            URL.revokeObjectURL(downloadAnchorNode.href);
            downloadAnchorNode.remove();
        });

        const importInput = document.getElementById('importDataInput');
        document.getElementById('btnImportData')?.addEventListener('click', () => {
            importInput.click();
        });

        importInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const normalizeImportedState = (rawText) => {
                let text = (rawText || '').trim();

                if (text.startsWith('data:application/json') || text.startsWith('data:text/json')) {
                    const commaIndex = text.indexOf(',');
                    if (commaIndex !== -1) {
                        text = decodeURIComponent(text.slice(commaIndex + 1));
                    }
                }

                if (text.charCodeAt(0) === 0xFEFF) {
                    text = text.slice(1);
                }

                const parsed = JSON.parse(text);
                if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                    throw new Error('Backup must contain an object payload.');
                }

                return {
                    ...this.stateManager.getDefaultState(),
                    ...parsed,
                    courses: Array.isArray(parsed.courses) ? parsed.courses : [],
                    semesters: parsed.semesters && typeof parsed.semesters === 'object' && !Array.isArray(parsed.semesters)
                        ? parsed.semesters
                        : {}
                };
            };

            file.text()
                .then((rawText) => {
                    const importedState = normalizeImportedState(rawText);
                    this.stateManager.setState(importedState);
                    this.restoreState();
                    this.updateAllMetrics();
                    this.navigateTo('calculator');
                    this.showSuccess('Data successfully imported!');
                })
                .catch((error) => {
                    console.error('Error importing backup:', error);
                    this.showError('Failed to parse backup file.');
                })
                .finally(() => {
                    importInput.value = '';
                });
        });
    }

    initChart() {
        const ctx = document.getElementById('gradeDistributionChart');
        if (!ctx) return;

        // Ensure Chart.js is loaded
        if (typeof Chart === 'undefined') {
            setTimeout(() => this.initChart(), 200);
            return;
        }

        this.gradeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'F'],
                datasets: [{
                    label: 'Grade Count',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(39, 24, 126, 0.7)',
                    borderColor: '#27187e',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {},
                        grid: {}
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 },
                        grid: {}
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Initialize data immediately after chart creation
        const state = this.stateManager.getState();
        let all = (state.courses || []).filter(c => c.marks !== null);
        if (state.semesters) {
            Object.values(state.semesters).forEach(s => {
                if (s.courses) all = all.concat(s.courses.filter(c => c.marks !== null));
            });
        }
        this.updateGradeChart(all);
    }

    updateGradeChart(courses) {
        if (!this.gradeChart) return;

        const gradeCounts = { 'A+': 0, 'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0, 'C+': 0, 'C': 0, 'C-': 0, 'F': 0 };
        let hasData = false;

        const validCourses = courses || [];
        validCourses.forEach(c => {
            const gradeObj = this.gradingEngine.calculateGrade(c.marks);
            if (gradeObj && gradeCounts.hasOwnProperty(gradeObj.grade)) {
                gradeCounts[gradeObj.grade]++;
                hasData = true;
            }
        });

        const msgEl = document.getElementById('noChartDataMsg');
        if (hasData) {
            msgEl?.classList.add('hidden');
            this.gradeChart.canvas.style.display = 'block';
            this.gradeChart.data.datasets[0].data = Object.values(gradeCounts);

            // Adjust colors based on theme
            const isDark = document.documentElement.classList.contains('dark');
            this.gradeChart.options.scales.x.ticks.color = isDark ? '#c8c4d4' : '#474552';
            this.gradeChart.options.scales.y.ticks.color = isDark ? '#c8c4d4' : '#474552';
            this.gradeChart.options.scales.x.grid.color = isDark ? 'rgba(198, 192, 255, 0.1)' : 'rgba(200, 196, 212, 0.2)';
            this.gradeChart.options.scales.y.grid.color = isDark ? 'rgba(198, 192, 255, 0.1)' : 'rgba(200, 196, 212, 0.2)';

            this.gradeChart.update();
        } else {
            msgEl?.classList.remove('hidden');
            this.gradeChart.canvas.style.display = 'none';
        }
    }
}

function showVersionDetails() {
    const modal = document.getElementById('versionModal');
    const content = document.getElementById('versionModalContent');
    if (!modal || !content) return;

    window.lenis?.stop();
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
    content.classList.remove('scale-95');
    content.classList.add('scale-100');

    document.getElementById('btnCloseVersionModal').onclick = () => {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            window.lenis?.start();
        }, 300);
        content.classList.add('scale-95');
        content.classList.remove('scale-100');
    };
}


// ============================================
// LENIS SMOOTH SCROLL INITIALIZATION
// ============================================

function initLenis() {
    if (typeof Lenis === 'undefined') return null;

    // Respect user's motion preferences
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return null;
    }

    // On touch devices (phones/tablets), native scrolling runs on hardware-accelerated compositor threads (up to 120Hz).
    // Running JS virtual scrollers on touch screens adds input delay and perceived chopiness.
    // Delegating touch to native while using Lenis on desktop gives zero-jank buttery scrolling everywhere.
    const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024;
    if (isTouchDevice) {
        return null;
    }

    try {
        const lenis = new Lenis({
            lerp: 0.12, // Silky smooth linear interpolation with zero sluggish delay or dragging
            wheelMultiplier: 1.0,
            touchMultiplier: 1.0,
            syncTouch: false,
            autoRaf: true,
            anchors: true
        });

        window.lenis = lenis;
        return lenis;
    } catch (err) {
        console.warn('Lenis smooth scroll initialization error:', err);
        return null;
    }
}


// ============================================
// INITIALIZE APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    window.uiManager = new UIManager();
});
