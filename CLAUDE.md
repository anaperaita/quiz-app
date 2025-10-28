# Quiz App - Investment Modules

Interactive quiz web application for studying investment module questions: Equity, Fixed Income, and Commodities.

See @README.md for full project overview and feature details.

## Tech Stack

- **Framework**: React 19 with Vite
- **Routing**: React Router v7
- **Styling**: CSS (vanilla, no framework)
- **State Management**: Context API (QuizContext)
- **Storage**: LocalStorage for persistence
- **PWA**: vite-plugin-pwa for offline capabilities
- **Deployment**: GitHub Pages with GitHub Actions CI/CD

## Project Structure

```
quizz-app/
├── quiz/                          # Main application directory
│   ├── src/
│   │   ├── context/
│   │   │   └── QuizContext.jsx    # Global state and quiz logic
│   │   ├── data/
│   │   │   ├── modules.config.json # Module configuration (ADD NEW MODULES HERE)
│   │   │   ├── modulo4.json       # Module 4: Equity (60 questions)
│   │   │   ├── modulo5.json       # Module 5: Fixed Income (60 questions)
│   │   │   └── modulo6.json       # Module 6: Commodities (78 questions)
│   │   ├── screens/
│   │   │   ├── HomeScreen.jsx     # Main menu
│   │   │   ├── QuizScreen.jsx     # Quiz mode
│   │   │   ├── ReviewScreen.jsx   # Review failed/marked questions
│   │   │   └── StatisticsScreen.jsx # Stats and progress
│   │   ├── App.jsx                # Main component with routing
│   │   ├── App.css                # App-level styles
│   │   ├── index.css              # Global styles
│   │   └── main.jsx               # Entry point
│   ├── public/                    # Static assets (icons, manifest)
│   ├── vite.config.js             # Vite and PWA configuration
│   └── package.json               # Dependencies and scripts
├── .github/workflows/deploy.yml   # Automated deployment
├── CLAUDE.md                      # This file - Claude Code context
└── README.md                      # Project documentation
```

## Available Commands

From the `/quiz` directory:

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Core Architecture

### QuizContext Pattern
- Single source of truth for all quiz state
- Manages statistics, question history, bookmarks per module
- Handles intelligent question selection algorithm
- Persists data to LocalStorage automatically

### Intelligent Question Algorithm
- Prioritizes unanswered questions
- Weights questions by failure rate
- Increases probability for less-seen questions
- Creates adaptive learning experience

### Screen Components
- Each screen is self-contained in `/src/screens/`
- All screens consume QuizContext for state
- Responsive design with mobile-first approach

## Code Style & Conventions

- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Documentation**: Add JSDoc comments for complex functions and component props
- **File Organization**:
  - Screens: `/src/screens/`
  - Context: `/src/context/`
  - Hooks: `/src/hooks/`
  - Services: `/src/services/`
  - Components: `/src/components/`
  - Constants: `/src/constants/`
- **No Files Off-Limits**: All files can be modified when necessary
- **Code Quality**: All ESLint warnings resolved, clean lint output maintained

## Development Guidelines

### When Adding Features
1. Consider impact on existing modules and statistics
2. Maintain data structure consistency across modulo*.json files
3. Update QuizContext if state management changes needed
4. Ensure responsive design works on mobile/tablet/desktop
5. Update README.md to document new features

### Before Suggesting Changes
- **Proactive Improvements**: Suggest optimizations when noticed, but WAIT for approval before implementing
- **Major Architecture Changes**: Always ask for confirmation and explain trade-offs
- **Implementation**: Execute major changes step by step, validating each step

### Code Quality
- Validation level: **Relaxed** - no mandatory testing before changes
- Optional: Run `npm run lint` to check code style
- Optional: Test with `npm run dev` for significant changes

## Adding New Modules

**The app now supports dynamic module loading - NO CODE CHANGES NEEDED!**

To add a new module (e.g., Módulo 7):

1. **Create the JSON file** in `quiz/src/data/` following the format below
2. **Add one entry** to `quiz/src/data/modules.config.json`:
   ```json
   {
     "id": "modulo7",
     "name": "Módulo 7: Your Topic Name",
     "file": "modulo7.json"
   }
   ```
3. **Done!** The module will appear automatically in the app

### Module JSON Format

Each module file should have this structure:

```json
{
  "module": "Módulo X",
  "title": "Module Title",
  "totalQuestions": 50,
  "questions": [...]
}
```

### Question Format

Each question follows this structure:

```json
{
  "id": "m7-1",
  "block": "BLOQUE I: Block name",
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 2,
  "explanation": "Detailed explanation"
}
```

**Important**:
- Question IDs must be unique across all modules
- `correctAnswer` is zero-indexed (0 = first option, 1 = second, etc.)
- All questions in a module should follow consistent ID pattern (e.g., m7-1, m7-2, m7-3...)

## Key Features to Preserve

- **Dynamic module system**: Config-based module loading via modules.config.json
- **Multi-module support**: Independent modules with separate statistics
- **Adaptive algorithm**: Smart question weighting system
- **Study modes**: Quiz, review failures, review by block, bookmarked questions
- **PWA capability**: Offline-first, installable
- **LocalStorage persistence**: All progress saved locally
- **Responsive design**: Mobile, tablet, desktop optimized

## Deployment

- Auto-deploys to GitHub Pages on push to `main` branch
- GitHub Actions workflow handles build and deployment
- Base path configured for GitHub Pages in vite.config.js

## Notes

- Working directory: `/home/ana/git/quizz-app`
- Main code is in `quiz/` subdirectory
- Application available at GitHub Pages (configured in repository)
- All user data stored client-side only (no backend)
