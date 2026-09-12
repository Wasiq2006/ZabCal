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

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

function getGradeBadgeStyle(grade) {
    if (!grade || grade === '-') {
        return {
            badge: 'bg-surface-container-highest text-on-surface-variant/70 border border-outline-variant/30',
            dot: 'bg-outline-variant'
        };
    }
    if (grade.startsWith('A')) {
        return {
            badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
            dot: 'bg-emerald-500'
        };
    }
    if (grade.startsWith('B')) {
        return {
            badge: 'bg-primary/15 text-primary border border-primary/30',
            dot: 'bg-primary'
        };
    }
    if (grade.startsWith('C')) {
        return {
            badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
            dot: 'bg-amber-500'
        };
    }
    return {
        badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30',
        dot: 'bg-rose-500'
    };
}

// ============================================
// LOCAL STORAGE & STATE
// ============================================

class StateManager {
    constructor() {
        this.storageKey = 'szabist-cgpa-session';
        this.schemaVersion = 2;
        this.state = this.loadFromStorage();
    }

    loadFromStorage() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                    return {
                        schemaVersion: this.schemaVersion,
                        program: typeof parsed.program === 'string' ? parsed.program : '',
                        courses: this.sanitizeCourses(parsed.courses),
                        theme: parsed.theme === 'dark' || parsed.theme === 'light' ? parsed.theme : this.getSystemTheme(),
                        semesters: this.sanitizeSemesters(parsed.semesters)
                    };
                }
            } catch (e) {
                console.error('Error parsing stored state:', e);
                return this.getDefaultState();
            }
        }
        return this.getDefaultState();
    }

    getDefaultState() {
        return {
            schemaVersion: this.schemaVersion,
            program: '',
            courses: [],
            theme: this.getSystemTheme(),
            semesters: {}
        };
    }

    sanitizeCourses(courses) {
        if (!Array.isArray(courses)) return [];
        return courses.map(c => {
            if (!c || typeof c !== 'object') return null;
            const code = typeof c.code === 'string' ? c.code.trim().toUpperCase().slice(0, 32) : '';
            if (!code) return null;
            const name = typeof c.name === 'string' ? c.name : code;
            const credits = Number(c.credits);
            let marks = null;
            if (c.marks !== null && c.marks !== undefined) {
                const m = Number(c.marks);
                if (!isNaN(m) && m >= 0 && m <= 100) marks = m;
            }
            return {
                code: code,
                name: name,
                credits: Number.isFinite(credits) && credits > 0 ? credits : 0,
                marks: marks,
                isRepeated: !!c.isRepeated
            };
        }).filter(Boolean);
    }

    sanitizeSemesters(semesters) {
        if (!semesters || typeof semesters !== 'object' || Array.isArray(semesters)) return {};
        const currentYear = String(new Date().getFullYear());
        const clean = {};
        Object.entries(semesters).forEach(([key, sem]) => {
            if (!sem || typeof sem !== 'object') return;
            const courses = this.sanitizeCourses(sem.courses);
            const completedCredits = courses
                .filter(c => c.marks !== null)
                .reduce((sum, c) => sum + c.credits, 0);
            const rawCredits = Number(sem.credits);
            const year = /^\d{4}$/.test(String(sem.year)) ? String(sem.year) : currentYear;
            clean[key] = {
                id: typeof sem.id === 'string' ? sem.id : key,
                number: sem.number !== undefined && sem.number !== null ? String(sem.number) : '1',
                term: typeof sem.term === 'string' && sem.term ? sem.term : 'Fall',
                year: year,
                courses: courses,
                credits: Number.isFinite(rawCredits) && rawCredits > 0 ? rawCredits : completedCredits,
                sgpa: Number.isFinite(Number(sem.sgpa)) ? Number(sem.sgpa) : 0,
                timestamp: Number(sem.timestamp) || Date.now()
            };
        });
        return clean;
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
        return GRADING_POLICY[0];
    }

    calculateSGPA(courses) {
        if (!courses || courses.length === 0) return 0;
        let totalCredits = 0;
        let totalPoints = 0;

        courses.forEach(course => {
            if (course.marks !== null) {
                const gradeInfo = this.calculateGrade(course.marks);
                if (gradeInfo) {
                    totalCredits += course.credits;
                    totalPoints += gradeInfo.gpa * course.credits;
                }
            }
        });

        return totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    }

    calculateCGPA(allCourses) {
        if (!allCourses || allCourses.length === 0) return 0;
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
        this._autocompleteTimeout = null;
        this._chartInitTries = 0;
        this.currentlyViewedSemesterId = null;
        this.semesterMode = '';
        this._activeView = 'calculator';
        this._isInitialized = false;
        this.selectedDepartment = 'ALL';
        this.isEditingSemester = false;
        this.tempEditedCourses = [];

        // Timetable state
        const isMobileDevice = window.innerWidth < 768;
        this.currentTimetableDepartment = localStorage.getItem('zabcal_selected_department') || 'Computer Science';
        this.currentTimetableSection = localStorage.getItem('zabcal_selected_section') || 'BCS-3E';
        this.currentTimetableDayFilter = 'ALL';
        this.currentTimetableSearchQuery = '';
        this.currentTimetableViewMode = localStorage.getItem('zabcal_timetable_view_mode') || (isMobileDevice ? 'interactive' : 'pdf');

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
            this.initTimetable();
            this._isInitialized = true;
        }
        this.restoreState();
        this.updateAllMetrics();

        // Initial route handling based on hash
        const initialHash = window.location.hash.replace('#', '');
        if (['calculator', 'semesters', 'timetable', 'about'].includes(initialHash)) {
            this.navigateTo(initialHash);
        } else {
            this.navigateTo('calculator');
        }

        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            const h = window.location.hash.replace('#', '');
            if (['calculator', 'semesters', 'timetable', 'about'].includes(h) && h !== this._activeView) {
                this.navigateTo(h);
            }
        });
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

        // Failsafe: never let the intro overlay block input indefinitely.
        this._introDismissTimer = setTimeout(() => this.dismissIntroOverlay(), 6000);
    }

    dismissIntroOverlay() {
        if (this._introDismissTimer) {
            clearTimeout(this._introDismissTimer);
            this._introDismissTimer = null;
        }
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
            highlightedIndex = 0;
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
                    this.addCurrentCourse();
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
            this.addCurrentCourse();
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

    addCurrentCourse() {
        const courseCodeInput = document.getElementById('courseCodeInput');
        const marksInput = document.getElementById('courseMarksInput');
        if (!courseCodeInput || !marksInput) return;

        const courseCode = courseCodeInput.value.trim();
        const marks = marksInput.value.trim();

        if (!courseCode) {
            this.showError('Please enter a course code');
            return;
        }

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
        marksInput.value = '';
        courseCodeInput.focus();
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
                    <div class="font-bold text-on-surface">${escapeHtml(course.code)}</div>
                    ${isRepeated ? `<div class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 mt-1"><span class="material-symbols-outlined text-[12px]">repeat</span> Repeating Course</div>` : ''}
                </td>
                <td>${escapeHtml(course.name)}</td>
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
                        <span class="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-black text-xs tracking-wide">${escapeHtml(course.code)}</span>
                        <span class="px-2 py-0.5 rounded-md bg-surface-container-highest text-on-surface-variant text-[11px] font-semibold">${course.credits} Cr</span>
                        ${isRepeated ? `<span class="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20"><span class="material-symbols-outlined text-[12px]">repeat</span> Repeat</span>` : ''}
                    </div>
                    <button class="delete-btn p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors" data-course-index="${courseIndex}" title="Remove Course">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
                <div class="text-xs font-bold text-on-surface leading-snug">${escapeHtml(course.name)}</div>
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
        document.getElementById('progressInfo').textContent = `${Math.min(100, Math.round(progress))}%`;

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
                badgeHtml = `<span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${badgeClass} shrink-0">${escapeHtml(courseInfo.category)}</span>`;
            } else if (courseInfo.keywords && courseInfo.keywords.length > 0 && !courseInfo.keywords[0].includes('xxxx')) {
                badgeHtml = `<span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">${escapeHtml(courseInfo.keywords[0])}</span>`;
            }

            const creditsHtml = courseInfo.credits ? `<span class="text-[10px] font-black px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant shrink-0">${courseInfo.credits} Cr</span>` : '';

            return `
                <div class="autocomplete-item ${index === 0 ? 'highlighted' : ''} flex items-center justify-between gap-2" data-index="${index}" data-code="${code}">
                    <div class="flex items-center gap-2 min-w-0 flex-1">
                        <span class="autocomplete-item-code shrink-0">${escapeHtml(code)}</span>
                        <span class="autocomplete-item-name truncate">${escapeHtml(courseInfo.name)}</span>
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
        toast.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px">${icons[type] || 'info'}</span><span>${escapeHtml(message)}</span>`;
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

        const closeAddModal = () => {
            modal.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                modal.classList.add('hidden');
                window.lenis?.start();
            }, 300);
        };

        document.getElementById('openAddSemesterModal')?.addEventListener('click', () => {
            window.lenis?.stop();
            const currentCourses = this.stateManager.getState().courses || [];
            const countText = document.getElementById('step1CountText');
            if (countText) {
                countText.textContent = currentCourses.length === 1 ? '1 course in table' : `${currentCourses.length} courses in table`;
            }
            modal.classList.remove('hidden');
            requestAnimationFrame(() => {
                modal.classList.remove('opacity-0', 'pointer-events-none');
            });
            step1.classList.remove('hidden');
            step2.classList.add('hidden');
            step2.classList.remove('flex');
            semYear.value = new Date().getFullYear();
        });

        document.getElementById('btnCloseAddModal')?.addEventListener('click', closeAddModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAddModal();
        });

        document.getElementById('btnBackToAddStep1')?.addEventListener('click', () => {
            step2.classList.add('hidden');
            step2.classList.remove('flex');
            step1.classList.remove('hidden');
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
                        <li><span class="font-bold text-on-surface">${escapeHtml(c.code)}</span> (${escapeHtml(c.name)}): <span class="font-bold text-amber-600 dark:text-amber-400">Repeating Course</span></li>
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
                closeAddModal();
            }
        });

        document.getElementById('btnConfirmSem')?.addEventListener('click', () => {
            const semTerm = semTermSelect ? semTermSelect.value : 'Fall';
            const rawSemNum = semNumSelect ? semNumSelect.value : '1';
            const isSummer = semTerm === 'Summer' || rawSemNum === 'Summer';
            const semNum = isSummer ? 'Summer' : rawSemNum;
            const year = document.getElementById('semYear').value;

            if (!year || !/^\d{4}$/.test(String(year).trim()) || Number(year) < 1990 || Number(year) > 2100) {
                return this.showError("Please enter a valid year between 1990 and 2100");
            }

            const state = this.stateManager.getState();
            state.semesters = state.semesters || {};

            const semKey = isSummer ? `Summer-${year}-${Date.now().toString().slice(-4)}` : `S${semNum}-${semTerm}-${year}`;

            // Avoid silently overwriting an existing semester that shares the same deterministic key
            if (!isSummer && state.semesters[semKey]) {
                const overwrite = confirm(`A "${semKey}" semester already exists. Overwrite it with the current course data?`);
                if (!overwrite) return;
            }
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
            this.closeSemDetails();
        });

        document.getElementById('semesterDetailsView')?.addEventListener('click', (e) => {
            if (e.target.id === 'semesterDetailsView') {
                this.closeSemDetails();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const semModal = document.getElementById('semesterDetailsView');
                if (semModal && semModal.classList.contains('sem-modal-active')) {
                    this.closeSemDetails();
                }
                const addModal = document.getElementById('addSemesterModal');
                if (addModal && !addModal.classList.contains('hidden') && !addModal.classList.contains('opacity-0')) {
                    closeAddModal();
                }
            }
        });

        document.addEventListener('click', (e) => {
            const card = e.target.closest('[data-sem-id]');
            if (card && card.dataset.semId) {
                this.openSemDetails(card.dataset.semId);
            }
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
                this.closeSemDetails();
                this.updateAllMetrics();
            }
        });
    }

    navigateTo(view) {
        const views = {
            calculator: document.getElementById('calculatorView'),
            semesters: document.getElementById('semestersView'),
            timetable: document.getElementById('timetableView'),
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

        if (this._activeView === 'semesters') {
            this.renderSemestersList();
        } else if (this._activeView === 'timetable') {
            this.renderTimetableInteractive();
            this.renderPDFPreview();
        } else if (this._activeView === 'calculator') {
            this.updateAllMetrics();
        }

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
            <div class="bg-surface-container-high p-3 rounded-xl border border-outline-variant/30 cursor-pointer hover:border-primary transition-colors flex justify-between items-center" data-sem-id="${escapeHtml(sem.id)}">
                <div>
                    <h5 class="text-xs font-bold text-on-surface">${escapeHtml(semTitle)}</h5>
                    <p class="text-[9px] text-on-surface-variant font-medium">${escapeHtml(semBadge)} • ${sem.credits} Cr • ${sem.courses ? sem.courses.length : 0} Courses</p>
                </div>
                <div class="text-right">
                    <p class="text-xs font-black text-primary">${typeof sem.sgpa === 'number' ? sem.sgpa.toFixed(2) : '0.00'}</p>
                </div>
            </div>
        `}).join('');

        grid.innerHTML = sItems.map(sem => {
            const isSummer = sem.number === 'Summer' || sem.term === 'Summer';
            const semBadge = isSummer ? 'Summer Semester' : `Semester ${sem.number}`;
            const semTitle = isSummer ? `Summer Semester ${sem.year}` : `${sem.term} ${sem.year}`;
            return `
            <div class="bg-surface-container rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-outline-variant/30 hover:border-primary/50 transition-all hover:shadow-[0_10px_40px_-10px_rgba(39,24,126,0.2)] cursor-pointer group" data-sem-id="${escapeHtml(sem.id)}">
                <div class="flex justify-between items-center mb-3">
                    <span class="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-3 py-1 rounded-full">${escapeHtml(semBadge)}</span>
                    <span class="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full">${sem.courses ? sem.courses.length : 0} Courses</span>
                </div>
                <h3 class="text-xl font-black text-on-surface mb-4 group-hover:text-primary transition-colors">${escapeHtml(semTitle)}</h3>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-surface-container-high rounded-xl p-3 sm:p-4 border border-outline-variant/20">
                        <p class="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider mb-1">SGPA</p>
                        <p class="text-2xl font-black text-primary">${typeof sem.sgpa === 'number' ? sem.sgpa.toFixed(2) : '0.00'}</p>
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

    closeSemDetails() {
        const detailsView = document.getElementById('semesterDetailsView');
        if (!detailsView || detailsView.classList.contains('hidden')) return;
        this.isEditingSemester = false;
        this.tempEditedCourses = [];
        detailsView.classList.remove('sem-modal-active');
        setTimeout(() => {
            detailsView.classList.add('hidden');
            window.lenis?.start();
        }, 500);
    }

    openSemDetails(id, isEditMode = false) {
        if (this._activeView !== 'semesters') {
            this.navigateTo('semesters');
        }
        this.currentlyViewedSemesterId = id;
        this.isEditingSemester = isEditMode;
        const sem = this.stateManager.getState().semesters[id];
        if (!sem) return;

        const detailsView = document.getElementById('semesterDetailsView');
        if (!detailsView) return;

        window.lenis?.stop();
        detailsView.classList.remove('hidden');
        // Force reflow so browser registers pre-transition base state (Firefox/Zen compat)
        void detailsView.offsetHeight;
        detailsView.classList.add('sem-modal-active');

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
        const semBadgeText = isSummer ? `Summer ${sem.year}` : `Semester ${sem.number} • ${sem.term} ${sem.year}`;

        const badgeEl = document.getElementById('detailSemBadge');
        if (badgeEl) badgeEl.textContent = semBadgeText;
        document.getElementById('detailSemTitle').textContent = semTitleDisplay;
        document.getElementById('detailSemGPA').textContent = sem.sgpa.toFixed(2);
        document.getElementById('detailSemCredits').textContent = sem.credits;

        const coursesToRender = isEditMode ? this.tempEditedCourses : sem.courses;
        const countEl = document.getElementById('detailSemCoursesCount');
        if (countEl) countEl.textContent = coursesToRender ? coursesToRender.length : 0;

        const tbody = document.getElementById('detailSemCourses');
        const mobileContainer = document.getElementById('detailSemCoursesMobile');

        if (!coursesToRender || coursesToRender.length === 0) {
            if (tbody) tbody.innerHTML = `<tr><td colspan="4" class="py-8 text-center text-sm font-semibold text-on-surface-variant">No courses found in this semester.</td></tr>`;
            if (mobileContainer) mobileContainer.innerHTML = `<div class="p-6 text-center text-sm font-semibold text-on-surface-variant bg-surface-container-low rounded-2xl border border-outline-variant/20">No courses found in this semester.</div>`;
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
            const badgeStyle = getGradeBadgeStyle(gradeStr);

            // Update row desktop
            const rowBadgeEl = document.querySelector(`.sem-live-grade-${index}`);
            if (rowBadgeEl) {
                rowBadgeEl.className = `inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${badgeStyle.badge} sem-live-grade-${index}`;
                const dot = rowBadgeEl.querySelector(`.sem-live-dot-${index}`);
                if (dot) dot.className = `w-1.5 h-1.5 rounded-full ${badgeStyle.dot} sem-live-dot-${index}`;
                const txt = rowBadgeEl.querySelector(`.sem-live-grade-text-${index}`);
                if (txt) txt.textContent = gradeStr;
            }

            // Update card mobile
            const cardBadgeEl = document.querySelector(`.sem-live-card-badge-${index}`);
            if (cardBadgeEl) {
                cardBadgeEl.className = `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-xs ${badgeStyle.badge} sem-live-card-badge-${index}`;
                const dot = cardBadgeEl.querySelector(`.sem-live-card-dot-${index}`);
                if (dot) dot.className = `w-1.5 h-1.5 rounded-full ${badgeStyle.dot} sem-live-card-dot-${index}`;
                const txt = cardBadgeEl.querySelector(`.sem-live-card-grade-${index}`);
                if (txt) txt.textContent = gradeStr;
            }
            const cardGpaEl = document.querySelector(`.sem-live-card-gpa-${index}`);
            if (cardGpaEl) cardGpaEl.textContent = gradeObj ? `GPA ${gradeObj.gpa.toFixed(2)}` : '';
        };

        // Render Desktop Table (clean, modern pill badges, monospace code, wrapping course names)
        if (tbody) {
            tbody.innerHTML = coursesToRender.map((course, idx) => {
                const gradeObj = course.marks !== null ? this.gradingEngine.calculateGrade(course.marks) : null;
                const gradeStr = gradeObj ? gradeObj.grade : '-';
                const badgeStyle = getGradeBadgeStyle(gradeStr);
                const isRepeated = course.isRepeated || this.isCourseRepeatedAcrossSemesters(course.code);

                const marksDisplay = isEditMode ? `
                    <div class="flex items-center justify-center">
                        <input type="number" min="0" max="100" 
                            class="sem-edit-mark-input w-20 px-2.5 py-1 text-center font-bold bg-surface-container-high border border-outline-variant/40 rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all text-sm shadow-xs" 
                            value="${course.marks !== null ? course.marks : ''}" 
                            data-index="${idx}">
                    </div>
                ` : `<span class="font-bold text-on-surface">${course.marks !== null ? course.marks : '-'}</span>`;

                return `
                    <tr class="hover:bg-surface-container-high/30 dark:hover:bg-white/5 transition-colors border-b border-outline-variant/10 dark:border-white/5">
                        <td class="py-3 px-4">
                            <div class="font-bold text-on-surface text-sm flex flex-wrap items-center gap-2">
                                <span class="px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/20">${escapeHtml(course.code)}</span>
                                ${isRepeated ? `<span class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20"><span class="material-symbols-outlined text-[12px]">repeat</span> Repeating</span>` : ''}
                            </div>
                            <div class="text-xs text-on-surface-variant leading-snug break-words mt-1">${escapeHtml(course.name)}</div>
                        </td>
                        <td class="py-3 px-2 text-center font-semibold text-on-surface text-sm">${course.credits}</td>
                        <td class="py-3 px-2 text-center font-semibold text-on-surface text-sm">${marksDisplay}</td>
                        <td class="py-3 px-4 text-right">
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${badgeStyle.badge} sem-live-grade-${idx}">
                                <span class="w-1.5 h-1.5 rounded-full ${badgeStyle.dot} sem-live-dot-${idx}"></span>
                                <span class="sem-live-grade-text-${idx}">${gradeStr}</span>
                            </span>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        // Render Mobile Cards (optimized iOS cards with badges)
        if (mobileContainer) {
            mobileContainer.innerHTML = coursesToRender.map((course, idx) => {
                const gradeObj = course.marks !== null ? this.gradingEngine.calculateGrade(course.marks) : null;
                const gradeStr = gradeObj ? gradeObj.grade : '-';
                const badgeStyle = getGradeBadgeStyle(gradeStr);
                const isRepeated = course.isRepeated || this.isCourseRepeatedAcrossSemesters(course.code);

                const marksDisplay = isEditMode ? `
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-semibold text-on-surface-variant">Marks:</span>
                        <input type="number" min="0" max="100" 
                            class="sem-edit-mark-input w-20 px-2 py-1 text-center font-bold bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none text-sm shadow-xs" 
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
                    <div class="p-3.5 bg-surface-container-low/80 dark:bg-black/25 rounded-2xl border border-outline-variant/15 dark:border-white/5 flex flex-col gap-2.5">
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0 flex-1">
                                <div class="flex flex-wrap items-center gap-1.5 mb-1">
                                    <span class="inline-block px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-mono font-bold text-xs border border-primary/20">${escapeHtml(course.code)}</span>
                                    ${isRepeated ? `<span class="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20"><span class="material-symbols-outlined text-[11px]">repeat</span> Repeating</span>` : ''}
                                </div>
                                <h5 class="font-bold text-on-surface text-sm leading-snug break-words">${escapeHtml(course.name)}</h5>
                            </div>
                            <div class="flex flex-col items-end shrink-0">
                                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-xs ${badgeStyle.badge} sem-live-card-badge-${idx}">
                                    <span class="w-1.5 h-1.5 rounded-full ${badgeStyle.dot} sem-live-card-dot-${idx}"></span>
                                    <span class="sem-live-card-grade-${idx}">${gradeStr}</span>
                                </span>
                                <span class="text-[10px] text-on-surface-variant font-medium mt-1 sem-live-card-gpa-${idx}">${gradeObj ? `GPA ${gradeObj.gpa.toFixed(2)}` : ''}</span>
                            </div>
                        </div>
                        <div class="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-outline-variant/10 dark:border-white/5">
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
                    courses: this.stateManager.sanitizeCourses(parsed.courses),
                    semesters: this.stateManager.sanitizeSemesters(parsed.semesters)
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

        // Ensure Chart.js is loaded (bounded retry to avoid infinite loop)
        if (typeof Chart === 'undefined') {
            this._chartInitTries = (this._chartInitTries || 0) + 1;
            if (this._chartInitTries > 25) {
                console.warn('Chart.js failed to load after multiple retries; skipping chart init.');
                return;
            }
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
            this.gradeChart.data.datasets[0].backgroundColor = isDark ? 'rgba(198, 192, 255, 0.55)' : 'rgba(39, 24, 126, 0.7)';
            this.gradeChart.data.datasets[0].borderColor = isDark ? '#c6c0ff' : '#27187e';
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

    // ============================================
    // TIMETABLE ENGINE & RENDERING
    // ============================================

    getSectionsForDepartment(dept) {
        const timetableData = window.TIMETABLE_DATA || { sections: {} };
        if (timetableData.departmentSections && timetableData.departmentSections[dept]) {
            return timetableData.departmentSections[dept];
        }
        const all = Object.keys(timetableData.sections || {});
        const normalizedDept = (dept || '').toLowerCase();
        if (normalizedDept.includes('computer')) {
            return all.filter(s => s.startsWith('BCS') || s.startsWith('BSAI') || s.startsWith('BSSE') || s.startsWith('CSC'));
        } else if (normalizedDept.includes('manage') || normalizedDept.includes('manag')) {
            return all.filter(s => s.startsWith('BBA') || s.startsWith('BSAF') || s.startsWith('BSBA') || s.startsWith('BA'));
        } else if (normalizedDept.includes('media')) {
            return all.filter(s => s.startsWith('BMS') || s.startsWith('BSMS') || s.startsWith('MS'));
        }
        return all;
    }

    getDepartmentForSection(section) {
        const timetableData = window.TIMETABLE_DATA || { sections: {} };
        if (timetableData.departmentSections) {
            for (const [dept, secs] of Object.entries(timetableData.departmentSections)) {
                if (secs.includes(section)) return dept;
            }
        }
        if (section.startsWith('BCS') || section.startsWith('BSAI') || section.startsWith('BSSE') || section.startsWith('CSC')) {
            return 'Computer Science';
        }
        if (section.startsWith('BBA') || section.startsWith('BSAF') || section.startsWith('BSBA') || section.startsWith('BA')) {
            return 'Management Sciences';
        }
        if (section.startsWith('BMS') || section.startsWith('BSMS') || section.startsWith('MS')) {
            return 'Media Science';
        }
        return 'Computer Science';
    }

    populateSectionOptions(selectedDept) {
        const sectionSelector = document.getElementById('sectionSelector');
        if (!sectionSelector) return;

        const sections = this.getSectionsForDepartment(selectedDept);
        sectionSelector.innerHTML = '';

        if (sections.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'No sections available';
            opt.disabled = true;
            opt.selected = true;
            sectionSelector.appendChild(opt);
            this.currentTimetableSection = '';
            return;
        }

        sections.forEach(sec => {
            const opt = document.createElement('option');
            opt.value = sec;
            opt.textContent = sec;
            if (sec === this.currentTimetableSection) {
                opt.selected = true;
            }
            sectionSelector.appendChild(opt);
        });

        // If current section does not belong to selected department, select first section
        if (!sections.includes(this.currentTimetableSection)) {
            this.currentTimetableSection = sections[0];
            sectionSelector.value = sections[0];
            localStorage.setItem('zabcal_selected_section', this.currentTimetableSection);
        }
    }

    initTimetable() {
        const departmentSelector = document.getElementById('departmentSelector');
        const sectionSelector = document.getElementById('sectionSelector');
        const deptBadge = document.getElementById('timetableDepartmentBadge');
        const sessionBadge = document.getElementById('timetableSessionBadge');
        const lastUpdatedText = document.getElementById('timetableLastUpdatedText');
        const searchInput = document.getElementById('timetableSearchInput');
        const btnClearSearch = document.getElementById('btnClearTimetableSearch');
        const btnViewModeInteractive = document.getElementById('btnViewModeInteractive');
        const btnViewModePDF = document.getElementById('btnViewModePDF');
        const btnPrintTimetable = document.getElementById('btnPrintTimetable');
        const dayTabs = document.getElementById('timetableDayTabs');

        const timetableData = window.TIMETABLE_DATA || { sections: {} };
        if (sessionBadge && timetableData.academicSession) {
            sessionBadge.textContent = timetableData.academicSession;
        }
        if (lastUpdatedText && timetableData.lastUpdated) {
            lastUpdatedText.textContent = timetableData.lastUpdated;
        }

        const departments = timetableData.departments || ["Computer Science", "Management Sciences", "Media Science"];

        // Validate and sync active department
        if (!departments.includes(this.currentTimetableDepartment)) {
            this.currentTimetableDepartment = this.getDepartmentForSection(this.currentTimetableSection) || departments[0];
            localStorage.setItem('zabcal_selected_department', this.currentTimetableDepartment);
        }

        // Initialize Department Dropdown
        if (departmentSelector) {
            departmentSelector.innerHTML = '';
            departments.forEach(dept => {
                const opt = document.createElement('option');
                opt.value = dept;
                opt.textContent = dept;
                if (dept === this.currentTimetableDepartment) {
                    opt.selected = true;
                }
                departmentSelector.appendChild(opt);
            });

            departmentSelector.addEventListener('change', (e) => {
                this.currentTimetableDepartment = e.target.value;
                localStorage.setItem('zabcal_selected_department', this.currentTimetableDepartment);
                if (deptBadge) {
                    deptBadge.textContent = this.currentTimetableDepartment;
                }
                this.populateSectionOptions(this.currentTimetableDepartment);
                this.renderTimetableInteractive();
                this.renderPDFPreview();
            });
        }

        if (deptBadge) {
            deptBadge.textContent = this.currentTimetableDepartment;
        }

        // Initialize Section Dropdown based on selected department
        this.populateSectionOptions(this.currentTimetableDepartment);

        if (sectionSelector) {
            sectionSelector.addEventListener('change', (e) => {
                this.currentTimetableSection = e.target.value;
                localStorage.setItem('zabcal_selected_section', this.currentTimetableSection);
                this.renderTimetableInteractive();
                this.renderPDFPreview();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentTimetableSearchQuery = e.target.value.trim().toLowerCase();
                if (btnClearSearch) {
                    btnClearSearch.classList.toggle('hidden', !this.currentTimetableSearchQuery);
                }
                this.renderTimetableInteractive();
            });
        }

        if (btnClearSearch && searchInput) {
            btnClearSearch.addEventListener('click', () => {
                searchInput.value = '';
                this.currentTimetableSearchQuery = '';
                btnClearSearch.classList.add('hidden');
                this.renderTimetableInteractive();
            });
        }

        if (dayTabs) {
            dayTabs.addEventListener('click', (e) => {
                const pill = e.target.closest('.timetable-day-pill');
                if (!pill) return;

                this.currentTimetableDayFilter = pill.dataset.day || 'ALL';

                dayTabs.querySelectorAll('.timetable-day-pill').forEach(btn => {
                    const isSelected = (btn.dataset.day || 'ALL') === this.currentTimetableDayFilter;
                    btn.className = isSelected
                        ? 'timetable-day-pill active px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer snap-start'
                        : 'timetable-day-pill px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer snap-start';
                });

                this.renderTimetableInteractive();
            });
        }

        if (btnViewModeInteractive && btnViewModePDF) {
            btnViewModeInteractive.addEventListener('click', () => {
                this.setTimetableViewMode('interactive');
            });

            btnViewModePDF.addEventListener('click', () => {
                this.setTimetableViewMode('pdf');
            });
        }

        if (btnPrintTimetable) {
            btnPrintTimetable.addEventListener('click', () => {
                this.renderPDFPreview();
                window.print();
            });
        }

        // Apply initial view mode and render
        this.setTimetableViewMode(this.currentTimetableViewMode);
    }

    setTimetableViewMode(mode) {
        this.currentTimetableViewMode = mode;
        localStorage.setItem('zabcal_timetable_view_mode', mode);

        const interactiveView = document.getElementById('timetableInteractiveView');
        const docPreviewView = document.getElementById('timetableDocPreviewView');
        const btnViewModeInteractive = document.getElementById('btnViewModeInteractive');
        const btnViewModePDF = document.getElementById('btnViewModePDF');

        if (mode === 'interactive') {
            interactiveView?.classList.remove('hidden');
            docPreviewView?.classList.add('hidden');

            if (btnViewModeInteractive) {
                btnViewModeInteractive.className = 'timetable-view-mode-btn active flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer';
            }
            if (btnViewModePDF) {
                btnViewModePDF.className = 'timetable-view-mode-btn flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer';
            }
            this.renderTimetableInteractive();
        } else {
            interactiveView?.classList.add('hidden');
            docPreviewView?.classList.remove('hidden');

            if (btnViewModePDF) {
                btnViewModePDF.className = 'timetable-view-mode-btn active flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer';
            }
            if (btnViewModeInteractive) {
                btnViewModeInteractive.className = 'timetable-view-mode-btn flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer';
            }
            this.renderPDFPreview();
        }
    }

    renderTimetableMetrics(classes) {
        const activeDaysEl = document.getElementById('metricActiveDays');
        const totalSessionsEl = document.getElementById('metricTotalSessions');
        const creditHoursEl = document.getElementById('metricCreditHours');
        const venuesEl = document.getElementById('metricVenuesCount');

        if (!classes || classes.length === 0) {
            if (activeDaysEl) activeDaysEl.textContent = '0 Days';
            if (totalSessionsEl) totalSessionsEl.textContent = '0';
            if (creditHoursEl) creditHoursEl.textContent = '0 Cr';
            if (venuesEl) venuesEl.textContent = '0';
            return;
        }

        const distinctDays = new Set(classes.map(c => c.day));
        const totalSessions = classes.length;
        // Deduplicate courses by code so a 3-credit course meeting twice isn't counted as 6
        const uniqueCourses = new Map();
        classes.forEach(c => {
            if (c.code && !uniqueCourses.has(c.code)) {
                uniqueCourses.set(c.code, c.creditHours || 0);
            }
        });
        const totalCredits = Array.from(uniqueCourses.values()).reduce((sum, cr) => sum + cr, 0);
        const distinctVenues = new Set(classes.map(c => c.venue).filter(Boolean));

        if (activeDaysEl) activeDaysEl.textContent = `${distinctDays.size} Days`;
        if (totalSessionsEl) totalSessionsEl.textContent = `${totalSessions}`;
        if (creditHoursEl) creditHoursEl.textContent = `${totalCredits} Cr`;
        if (venuesEl) venuesEl.textContent = `${distinctVenues.size}`;
    }

    renderTimetableInteractive() {
        const container = document.getElementById('timetableCardsContainer');
        if (!container) return;

        const section = this.currentTimetableSection;
        const allClasses = window.TIMETABLE_DATA?.sections?.[section] || [];

        // Update metrics for this section
        this.renderTimetableMetrics(allClasses);

        // Filter by search query
        let filtered = allClasses;
        const query = (this.currentTimetableSearchQuery || '').toLowerCase().trim();
        if (query) {
            filtered = filtered.filter(c =>
                (c.courseName && c.courseName.toLowerCase().includes(query)) ||
                (c.code && c.code.toLowerCase().includes(query)) ||
                (c.teacher && c.teacher.toLowerCase().includes(query)) ||
                (c.venue && c.venue.toLowerCase().includes(query))
            );
        }

        // Filter by day
        if (this.currentTimetableDayFilter && this.currentTimetableDayFilter !== 'ALL') {
            filtered = filtered.filter(c => c.day.toLowerCase() === this.currentTimetableDayFilter.toLowerCase());
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="text-center py-16 px-4 bg-surface-container rounded-2xl border border-outline-variant/20">
                    <span class="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3 block">event_busy</span>
                    <h3 class="text-base font-bold text-on-surface mb-1">No lectures found</h3>
                    <p class="text-xs text-on-surface-variant max-w-sm mx-auto">
                        ${query ? 'No lectures match your search filter. Try clearing your search.' : 'No lectures scheduled for this selection.'}
                    </p>
                </div>
            `;
            return;
        }

        // Group by day
        const grouped = {};
        const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        filtered.forEach(c => {
            if (!grouped[c.day]) grouped[c.day] = [];
            grouped[c.day].push(c);
        });

        const displayDays = daysOrder.filter(d => grouped[d] && grouped[d].length > 0);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = dayNames[new Date().getDay()];

        let html = '';
        displayDays.forEach(day => {
            const dayClasses = grouped[day];
            const isToday = day.toLowerCase() === todayName.toLowerCase();
            const dayCredits = dayClasses.reduce((s, c) => s + (c.creditHours || 0), 0);

            // 1. Desktop Cards (iOS Grid Layout)
            let desktopCardsHTML = '';
            dayClasses.forEach(c => {
                const isLab = !!c.isLab;
                desktopCardsHTML += `
                    <div class="timetable-event-card ui-card group p-4 sm:p-5 rounded-2xl transition-all flex flex-col justify-between gap-3 relative overflow-hidden">
                        <div class="flex items-start justify-between gap-2">
                            <span class="timetable-course-badge text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-lg">
                                ${escapeHtml(c.code) || 'COURSE'}
                            </span>
                            <div class="flex items-center gap-1.5">
                                ${isLab ? `<span class="timetable-lab-badge text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Lab</span>` : ''}
                                <span class="timetable-cr-badge text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    ${c.creditHours ? c.creditHours + ' Cr' : '-'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-sm sm:text-base font-bold leading-snug">
                                ${escapeHtml(c.courseName)}
                            </h4>
                            <div class="flex items-center gap-1.5 mt-2 text-xs font-medium text-on-surface-variant">
                                <span class="material-symbols-outlined text-[16px] text-primary">person</span>
                                <span>${escapeHtml(c.teacher) || 'Not Assigned'}</span>
                            </div>
                        </div>
                        <div class="pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs font-semibold gap-2 flex-wrap">
                            <div class="flex items-center gap-1.5 text-on-surface-variant">
                                <span class="material-symbols-outlined text-[16px] text-primary">schedule</span>
                                <span>${escapeHtml(c.timing) || '-'}</span>
                            </div>
                            <div class="timetable-venue-chip flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold">
                                <span class="material-symbols-outlined text-[14px]">meeting_room</span>
                                <span>${escapeHtml(c.venue) || '-'}</span>
                            </div>
                        </div>
                    </div>
                `;
            });

            // 2. Mobile Cards (iOS Inset Grouped Event Cards)
            let mobileCardsHTML = '';
            dayClasses.forEach((c) => {
                const isLab = !!c.isLab;
                mobileCardsHTML += `
                    <div class="timetable-event-card p-3.5 sm:p-4 rounded-2xl ${isLab ? 'border-l-[4px] border-l-amber-500' : 'border-l-[4px] border-l-primary'} transition-all active:scale-[0.99] flex flex-col gap-2.5 w-full min-w-0">
                        <!-- Top Bar: iOS Time Pill, Lab & Course Badges -->
                        <div class="flex items-center justify-between gap-2 flex-wrap min-w-0">
                            <span class="timetable-time-pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shrink-0">
                                <span class="material-symbols-outlined text-[15px]">schedule</span>
                                <span class="tracking-tight">${escapeHtml(c.timing) || 'TBA'}</span>
                            </span>
                            <div class="flex items-center gap-1.5 shrink-0 flex-wrap">
                                ${isLab ? `
                                <span class="timetable-lab-badge inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                    <span class="material-symbols-outlined text-[12px]">science</span>
                                    Lab
                                </span>` : ''}
                                <span class="timetable-course-badge text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                                    ${escapeHtml(c.code) || 'COURSE'}
                                </span>
                                <span class="timetable-cr-badge text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                    ${c.creditHours ? c.creditHours + ' Cr' : '-'}
                                </span>
                            </div>
                        </div>

                        <!-- Course Title -->
                        <div class="min-w-0">
                            <h4 class="text-[15px] font-bold leading-snug break-words">
                                ${escapeHtml(c.courseName)}
                            </h4>
                        </div>

                        <!-- Details Footer: Teacher & Venue -->
                        <div class="pt-2 border-t border-outline-variant/15 flex items-center justify-between gap-2 text-xs font-medium min-w-0">
                            <div class="flex items-center gap-1.5 text-on-surface-variant min-w-0 flex-1">
                                <span class="material-symbols-outlined text-[16px] text-primary shrink-0">person</span>
                                <span class="truncate">${escapeHtml(c.teacher) || 'Not Assigned'}</span>
                            </div>
                            <div class="timetable-venue-chip flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold shrink-0">
                                <span class="material-symbols-outlined text-[14px]">meeting_room</span>
                                <span>${escapeHtml(c.venue) || '-'}</span>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `
                <div class="space-y-3 anim-fade-up">
                    <div class="flex items-center justify-between px-1">
                        <div class="flex items-center gap-2">
                            <h3 class="timetable-day-header text-base sm:text-lg font-bold tracking-tight">${day}</h3>
                            <span class="timetable-day-badge text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                                ${dayClasses.length} ${dayClasses.length === 1 ? 'lecture' : 'lectures'} • ${dayCredits} Cr. Hrs
                            </span>
                            ${isToday ? `<span class="px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">Today</span>` : ''}
                        </div>
                    </div>
                    <div class="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        ${desktopCardsHTML}
                    </div>
                    <div class="md:hidden flex flex-col gap-3">
                        ${mobileCardsHTML}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    renderPDFPreview() {
        const container = document.getElementById('timetableExportArea');
        if (!container) return;

        const section = this.currentTimetableSection;
        const classes = window.TIMETABLE_DATA?.sections?.[section] || [];
        const session = window.TIMETABLE_DATA?.academicSession || 'Fall 2026';
        const lastUpdated = window.TIMETABLE_DATA?.lastUpdated || 'September 8, 2026';

        if (classes.length === 0) {
            container.innerHTML = `
                <div class="text-center py-20">
                    <span class="material-symbols-outlined text-6xl text-gray-300 mb-4 block">event_note</span>
                    <p class="text-gray-500 font-medium">Select a section to preview its timetable</p>
                </div>
            `;
            return;
        }

        // Group by day
        const grouped = {};
        const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        classes.forEach(c => {
            if (!grouped[c.day]) grouped[c.day] = [];
            grouped[c.day].push(c);
        });

        let rowsHTML = '';
        daysOrder.forEach(day => {
            if (grouped[day] && grouped[day].length > 0) {
                const dayClasses = grouped[day];
                dayClasses.forEach((c, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === dayClasses.length - 1;
                    rowsHTML += `
                        <tr style="border-bottom: ${isLast ? '2px' : '1px'} solid #0f172a; page-break-inside: avoid; background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                            ${isFirst ? `<td rowspan="${dayClasses.length}" style="padding: 14px 12px; font-weight: 900; color: #0f172a; text-align: center; border-right: 2px solid #0f172a; border-left: 2px solid #0f172a; vertical-align: middle; font-size: 14px; background-color: #f1f5f9;">${day}</td>` : ''}
                            <td style="padding: 12px 14px; border-right: 1px solid #cbd5e1;">
                                <div style="font-weight: 800; color: #0f172a; font-size: 13px; margin-bottom: 3px; font-family: 'Inter', sans-serif;">
                                    ${c.courseName || '-'}
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                                    <div style="font-size: 11px; font-weight: 700; color: #27187e;">${c.teacher || 'Not Assigned'}</div>
                                    <div style="font-size: 10px; font-weight: 800; color: ${c.creditHours && c.creditHours > 1 ? '#e11d48' : '#d97706'}; text-transform: uppercase;">${c.creditHours ? c.creditHours + ' Credit Hours' : '? Credit Hours'}</div>
                                </div>
                            </td>
                            <td style="padding: 12px; text-align: center; font-weight: 600; color: #1e293b; font-size: 12px; border-right: 1px solid #cbd5e1; font-family: monospace;">${c.timing || '-'}</td>
                            <td style="padding: 12px; text-align: center; font-weight: 900; color: #0f172a; font-size: 13px; border-right: 2px solid #0f172a;">${c.venue || '-'}</td>
                        </tr>
                    `;
                });
            }
        });

        container.innerHTML = `
            <div style="background-color: #ffffff; color: #0f172a; padding: 28px; min-height: 100%; font-family: 'Inter', system-ui, -apple-system, sans-serif; position: relative;">
                <!-- Header Top Bar -->
                <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 18px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="material-symbols-outlined" style="color: #27187e; font-size: 34px; transform: rotate(-12deg); font-variation-settings: 'FILL' 1, 'wght' 700;">school</span>
                        <div>
                            <span style="font-size: 24px; font-weight: 900; color: #27187e; letter-spacing: -0.04em;">ZabCal</span>
                            <span style="font-size: 11px; font-weight: 700; color: #64748b; margin-left: 8px; text-transform: uppercase; letter-spacing: 0.1em;">• SZABIST Schedule</span>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em;">${session}</div>
                        <div style="font-size: 10px; font-weight: 600; color: #64748b;">Updated: ${lastUpdated}</div>
                    </div>
                </div>

                <!-- Section Title & Accent Line -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="display: inline-block; font-size: 38px; font-weight: 900; color: #1e88e5; letter-spacing: 0.02em; margin: 0; padding: 0 12px;">${section}</h2>
                    <div style="font-size: 13px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px;">Department of ${this.currentTimetableDepartment || 'Computer Science'}</div>
                </div>
                <div style="height: 4px; background: linear-gradient(90deg, #27187e 0%, #1e88e5 100%); margin-bottom: 20px; border-radius: 2px;"></div>

                <!-- Timetable Grid -->
                <table style="width: 100%; text-align: left; border-collapse: collapse; border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; background-color: #ffffff;">
                    <thead>
                        <tr style="border-bottom: 2px solid #0f172a; background-color: #f1f5f9;">
                            <th style="padding: 12px; font-weight: 900; color: #0f172a; text-align: center; width: 130px; border-left: 2px solid #0f172a; border-right: 2px solid #0f172a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Day</th>
                            <th style="padding: 12px; font-weight: 900; color: #0f172a; text-align: center; border-right: 1px solid #cbd5e1; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Course Name</th>
                            <th style="padding: 12px; font-weight: 900; color: #0f172a; text-align: center; border-right: 1px solid #cbd5e1; width: 220px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Timing</th>
                            <th style="padding: 12px; font-weight: 900; color: #0f172a; text-align: center; border-right: 2px solid #0f172a; width: 120px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Venue</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHTML}
                    </tbody>
                </table>

                <!-- Required Document Footer Text -->
                <div style="margin-top: 28px; padding-top: 14px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #27187e; font-weight: 800; font-size: 18px; margin: 0 0 3px 0; font-family: 'Inter', sans-serif;">Generate your TimeTable at!</p>
                    <p style="color: #1e88e5; font-weight: 700; font-size: 14px; margin: 0; font-family: 'Inter', sans-serif;">zabcal.vercel.app</p>
                </div>
            </div>
        `;
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
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
});
