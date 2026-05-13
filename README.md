# SmartATS – AI-Assisted Applicant Tracking System

![SmartATS Banner](https://via.placeholder.com/1200x400.png?text=SmartATS+-+Next-Gen+Recruitment)

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
* **Database:** MongoDB & Mongoose ORM
* **Authentication:** NextAuth.js v5
* **AI Integration:** Google Generative AI (Gemini 1.5 Flash)
* **Language:** TypeScript

## 📂 Folder Structure
```
smartats/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login & Register Pages
│   │   ├── (dashboard)/        # Recruiter & Candidate Dashboards
│   │   ├── api/                # REST API Routes (Jobs, Auth, Applications, AI)
│   │   ├── globals.css         # Global Tailwind Directives
│   │   ├── layout.tsx          # Root Layout & Session Provider
│   │   └── page.tsx            # Main Landing Page
│   ├── components/             # Reusable UI Components (Navbar, etc.)
│   ├── lib/                    # Utilities (MongoDB Connection, Auth Options)
│   └── models/                 # Mongoose Schemas (User, Job, Application)
├── public/                     # Static Assets
├── .env.local                  # Environment Variables
├── next.config.mjs             # Next.js Configuration
├── tailwind.config.ts          # Tailwind Configuration
└── package.json                # Project Dependencies
```

## 🚀 Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smartats
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
# MongoDB Connection String (Local or Atlas)
MONGODB_URI=mongodb://localhost:27017/smartats

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

## 📸 Screenshots
*(Add your application screenshots here)*
* Landing Page
* Recruiter Application Table
* AI Analysis Result
* Candidate Application Tracker

## 🌍 Deployment Steps
1. Create a free **MongoDB Atlas** cluster and update your `MONGODB_URI` environment variable.
2. Push your code to **GitHub**.
3. Log in to [Vercel](https://vercel.com/) and create a new project from your GitHub repository.
4. Add all environment variables from your `.env.local` into the Vercel project settings.
5. Click **Deploy**. Vercel will automatically build and host your Next.js application.

## 🔮 Future Improvements
* Add AWS S3 / Cloudinary for actual PDF resume uploads.
* Implement a dark mode toggle button.
* Set up email notifications (via Resend/SendGrid) when application statuses change.
* Add comprehensive unit testing using Jest and React Testing Library.

---
*Built by a Senior Full-Stack Engineer for the future of recruitment.*
