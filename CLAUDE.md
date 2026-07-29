# Project Instructions: ZabCal

## Tech Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: Tailwind CSS (via CDN), Custom Glassmorphism CSS
- **Storage**: Browser `localStorage`
- **Visualization**: Chart.js
- **PWA**: Manifest-based mobile installation

## Code Style
- **Patterns**: Class-based separation of concerns (`StateManager`, `CurriculumHandler`, `GradingEngine`, `UIManager`).
- **Naming**: `PascalCase` for classes, `camelCase` for methods and variables.
- **State**: Centralized state in `StateManager` $\rightarrow$ `localStorage` persistence.
- **UI**: Single Page Application (SPA) using view toggling via the `hidden` class.

## Testing & Validation
- **Approach**: Manual testing via browser.
- **Validation**: Input validation for marks (0-100) and course code existence in `database.js`.

## Build & Run
- **Dev**: Open `index.html` in any modern web browser.
- **PWA**: Serve via HTTPS to enable installation via `manifest.json`.

## Project Structure
- `index.html` $\rightarrow$ UI structure and theme definitions.
- `script.js` $\rightarrow$ Application logic, grading engine, and UI orchestration.
- `database.js` $\rightarrow$ SZABIST curriculum source of truth.
- `manifest.json` $\rightarrow$ PWA configuration.

## Conventions
- **Grading**: Marks are rounded to the nearest integer before GPA lookup.
- **Persistence**: Key `szabist-cgpa-session` is used for all local data.
- **Theming**: Dark mode uses `document.documentElement.classList.toggle('dark')`.
- **Notifications**: Use `uiManager.showToast(message, type)` for user feedback.
