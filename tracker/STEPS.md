# ML / DL Learning Roadmap - Local Usage Guide

This project is a **100% local** personal knowledge roadmap and practical implementation tracker. All your progress is stored directly as a clean, human-readable JSON file in this repository:
```
data/progress.json
```

---

## 1. How to Launch the Application From Anywhere

You can launch the app from **any terminal or directory** on your PC using either command:

```bash
ml-roadmap
# OR
ml-tracker
```

This will:
1. Start the server on `http://localhost:5100/`.
2. Automatically open your default browser.
3. Automatically sync any changes directly to `data/progress.json`.

*(To stop the server, press `Ctrl + C` in the terminal).*

---

## 2. Version-Controlling Your Progress in Git

Whenever you want to commit your learning milestones, notes, or knowledge gaps to your Git repository:

```bash
# Check diff of what you learned
git diff data/progress.json

# Commit your progress
git add data/progress.json
git commit -m "chore: update ML learning progress"
git push
```

---

## 3. Alternative Commands (Inside Project Directory)

If you are inside the `D:\AI & ML\Relearn ML\tracker` folder, you can also run:

```bash
# Start on port 5100 with auto-open
npm start

# Development mode
npm run dev

# Production build test
npm run build

# Run automated verification suite
node test/verify.js
```
