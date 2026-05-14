# SmartATS – AI-Assisted Applicant Tracking System

🚀 **Live Server / Demo:** [https://smart-ats-two.vercel.app](https://smart-ats-two.vercel.app)

## 📌 Project Overview
SmartATS is a modern, production-ready full-stack Applicant Tracking System designed to help recruiters find top talent and empower candidates to land their dream roles. It features dynamic role-based dashboards, secure authentication, and an integrated Google Gemini AI engine to objectively score candidates against job descriptions.

## ✨ Features
* **Role-Based Workflows:** Distinct UI and permissions for Candidates and Recruiters.
* **Authentication:** Secure JWT-based sessions using NextAuth and bcryptjs password hashing.
* **Recruiter Dashboard:** Post roles, view candidate data tables, and update hiring statuses.
* **Candidate Dashboard:** Browse jobs, submit one-click applications, and track status.
* **AI Match Scoring:** Integration with Google Gemini AI to analyze candidate skills against job descriptions for unbiased fit-scoring.
* **Responsive UI:** Built with Tailwind CSS for a seamless desktop and mobile experience.

## 🛠️ Tech Stack
* **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, Lucide Icons, React Hot Toast
* **Backend:** Next.js Route Handlers (REST APIs)
* **Database:** MongoDB Atlas & Mongoose ORM
* **Authentication:** NextAuth.js v4 (JWT Strategy)
* **AI Integration:** Google Generative AI (Gemini 1.5 Flash)
* **Language:** TypeScript
* **Deployment:** Vercel

## 🚀 Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/baburathod/SmartATS.git
   cd SmartATS/smartats
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔐 Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
# MongoDB Connection String (Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smartats

# NextAuth Secret (Generate a strong random string)
NEXTAUTH_SECRET=your_super_secret_string_here

# Base URL for NextAuth
NEXTAUTH_URL=http://localhost:3000

# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🌐 API Routes
* `POST /api/auth/register` - Registers a new candidate or recruiter.
* `GET/POST /api/jobs` - Fetches all active jobs or creates a new job.
* `GET/POST /api/applications` - Fetches applications based on role, or submits a new application.
* `PATCH /api/applications/[id]` - Updates the status of an application.
* `POST /api/applications/[id]/ai-score` - Triggers the Gemini AI to generate a match score.
* `GET/PUT /api/users/profile` - Manages candidate profile data.

## 🤖 AI Usage Explanation
SmartATS utilizes the `gemini-1.5-flash` model to analyze qualitative data. When a recruiter clicks "Analyze with AI", the backend aggregates the Candidate's skills and cover letter, along with the Job's description and department. This context is securely passed to Gemini with strict instructions to return a JSON payload containing a `matchScore` (0-100) and a concise `summary`. This eliminates manual resume screening fatigue.

### AI Hallucination Prevention Methods
* **Strict Prompt Formatting:** The prompt explicitly requires a JSON output, preventing conversational hallucinations.
* **Context Anchoring:** The AI is strictly fed only the database values (Candidate Skills vs Job Description) and is instructed not to make external assumptions.
* **Deterministic Parsing:** The `responseMimeType: "application/json"` configuration forces the model to adhere to a rigid schema, preventing syntax errors in the backend parser.

## 🌍 Deployment
This project is officially deployed on Vercel. Continuous deployment is configured with the GitHub repository. To update the live server, simply commit and push your code to the `main` branch.

## 🔮 Future Improvements
* Add AWS S3 / Cloudinary for actual PDF resume uploads.
* Implement a dark mode toggle button.
* Set up email notifications (via Resend/SendGrid) when application statuses change.
* Add comprehensive unit testing using Jest and React Testing Library.

---
*Built by Ramavath Babu for the future of recruitment.*
