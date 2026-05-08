# Zangoh AI Agent Supervisor Workstation - Submission

Welcome to the submission for the Zangoh AI Agent Supervisor Workstation Challenge! This document contains instructions on how to set up, run, and verify the application, as well as notes on the implementation.

## 🚀 Setup and Running Instructions

### Prerequisites
- Node.js (v16 or later)
- MongoDB (Running locally on `mongodb://localhost:27017/zangoh` or via Docker)
- npm or yarn

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend-starter
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:8080`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend-starter
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm start
   ```
   The frontend will open in your browser at `http://localhost:3000`.

### 3. Running Tests
1. Open a new terminal and navigate to the testing directory:
   ```bash
   cd testing
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install axios ws puppeteer
   ```
3. Run the test suite:
   ```bash
   node test-runner.js
   ```
   All **13 tests** should pass successfully.

---

## 📝 Implementation Notes

### Features Completed
- **Dashboard**: Connected real-time metrics (CSAT, Response Time, Escalation Rate) derived directly from the active conversations data.
- **Sidebar**: Redesigned to be a narrow, icons-only sidebar as per the provided visual reference.
- **Templates Page**: Updated the grid cards and the edit modal preview to match the requested design.
- **Agent Configuration**: Overhauled the layout with sliders, tags, and boxes to match the image provided.
- **Real-Time Data**: Fixed issues with WebSocket updates overwriting local UI states.

### Challenges Faced & Solutions

1. **`chalk` Error in Test Runner**:
   - *Challenge*: The test runner failed with a `TypeError: chalk.red is not a function` due to module resolution/version issues with `chalk`.
   - *Solution*: Implemented a Proxy-based mock for `chalk` at the top of `test-runner.js` to safely handle any color chaining like `chalk.red.bold`.

2. **Message Disappearing Bug**:
   - *Challenge*: When sending a message in the chat, it appeared for 1 second and then disappeared.
   - *Solution*: Discovered that the backend `conversations_update` WebSocket event did not include messages, causing the frontend to overwrite the message list with empty data. Fixed it by merging the new data with the previous state in `AppDataContext.js` to preserve messages.

3. **Missing Imports and Syntax Errors**:
   - *Challenge*: Files like `Templates.js` had missing imports (`Heading`), and `AgentConfig.js` had trailing syntax errors.
   - *Solution*: Fixed all syntax errors and added missing imports to ensure a smooth build.

---
Thank you for reviewing this submission!
