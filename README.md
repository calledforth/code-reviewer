# Code Review Bot

## Description
The **Code Review Bot** is an automated tool designed to streamline the code review process for Java repositories. It ensures adherence to coding standards, provides actionable feedback, and integrates seamlessly with GitHub for real-time updates. The bot combines static analysis tools (e.g., Checkstyle, PMD) with AI/ML models to deliver comprehensive feedback on code quality, readability, and guideline adherence.

---

## Features
- Fetches Java files from GitHub repositories.
- Analyzes code using static analysis tools and AI/ML for contextual feedback.
- Validates company-specific guidelines extracted from uploaded PDFs or text files.
- Posts feedback on GitHub PRs or commits.
- Provides real-time updates on file structure, current file being analyzed, and feedback.

---

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js (for frontend)
- Java (for static analysis tools like Checkstyle, PMD)
- GitHub Personal Access Token (for repository access)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/code-review-bot.git
   cd code-review-bot
   ```

2. **Set Up Backend**
   - Install Python dependencies:
     ```bash
     pip install -r backend/requirements.txt
     ```
   - Download static analysis tools:
     - [Checkstyle](https://checkstyle.org/)
     - [PMD](https://pmd.github.io/)

3. **Set Up Frontend**
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install Node.js dependencies:
     ```bash
     npm install
     ```

4. **Environment Variables**
   - Create a `.env` file in the `backend` directory with the following variables:
     ```env
     GEMINI_API_KEY=your_openai_api_key
     ```

---

## Running the Application

### Backend
1. Start the Flask/FastAPI server:
   ```bash
   python code-reviewer/main.py
   ```
   The backend will run on `http://localhost:5000`.

### Frontend
1. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`.

---

## Tools and Tech Stack

### Backend
- **Programming Language**: Python
- **Web Framework**: Flask/FastAPI
- **Static Analysis Tools**: Checkstyle, PMD
- **GitHub Integration**: PyGithub
- **Real-Time Updates**: WebSockets/SSE
- **Concurrency**: Threading/Asyncio

### Frontend
- **Framework**: React
- **State Management**: Redux (optional)
- **Styling**: Tailwind CSS/SCSS

### CI/CD ( To be done )
- **Pipeline**: GitHub Actions, Azure app services for deployment 
- **Testing**: pytest (backend), Jest (frontend)

---

## Usage
1. Enter the GitHub repository URL in the frontend form.
2. Optionally, upload a PDF or text file containing company-specific guidelines.
3. Submit the form to initiate the code review process.
4. View real-time updates on the frontend, including file structure and feedback.
5. Feedback will also be posted as comments on the GitHub PR or commit.

---

## Acknowledgments
- [Checkstyle](https://checkstyle.org/)
- [PMD](https://pmd.github.io/)
- [OpenAI](https://openai.com/)
- [PyGithub](https://pygithub.readthedocs.io/)
```
