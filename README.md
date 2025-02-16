Recruitment Process Management System
A comprehensive Recruitment Process Management System designed for HRs, Recruiters, Interviewers, and Candidates to streamline the hiring process from job creation to candidate onboarding.

🚀 Features
1️⃣ Job Creation & Position Management
✅ Recruiters can create & manage job openings.
✅ Define job details, required & preferred skills.
✅ Open positions can be on hold or closed with reasons.

2️⃣ Candidate Profile Management
✅ Upload candidate profiles via Excel sheets, or manual entry.
✅ Centralized database for all candidate records.
✅ Automated profile matching based on skills & job requirements.

3️⃣ Resume Screening & Shortlisting
✅ Assign Reviewers to screen CVs.
✅ Add comments, skill ratings & experience levels.
✅ Track candidate history across previous screenings & interviews.

4️⃣ Interview Scheduling & Process
✅ Define custom interview rounds per position.
✅ Schedule Panel Interviews.
✅ Send automated meeting invites for interviews.

5️⃣ Feedback & Evaluation
✅ Interviewers can provide ratings & comments for each skill.
✅ Integrated automated scoring system for evaluation.

6️⃣ Document Verification & Selection
✅ Shortlisted candidates can upload documents.
✅ HRs verify & track background checks.
✅ System-generated offer letters & onboarding tracking.

8️⃣ User Roles & Access Control
✅ Role-Based Access Control (RBAC):

Admin – Manages users, roles, system settings.
Recruiter – Manages jobs, candidates, and interviews.
HR – Handles documentation, background checks, final hiring.
Reviewer – Screens resumes & shortlists candidates.
Interviewer – Conducts interviews & provides feedback.
Candidate – Applies for jobs & uploads documents.

9️⃣ Reporting & Analytics
✅ Generate position-wise, technology-wise, and experience-wise reports.
✅ Interactive charts & graphs for visualization.

🛠 Tech Stack
🔹 Frontend
React.js + TypeScript
Axios for API requests
Tailwind CSS for styling
Recharts.js for charts & graphs
🔹 Backend
.NET Core API
Entity Framework Core (EF Core) for database management
JWT Authentication for secure login
SQL Server as the database
💻 Installation & Setup
🔹 Prerequisites
Node.js & npm/yarn installed
.NET 6/7 SDK installed
SQL Server database
🔹 Clone the Repository
sh
Copy
Edit
git clone https://github.com/hazzy18/Recruitment-Management-System.git
cd Recruitment-Management-System
🔹 Setup Backend (.NET API)
sh
Copy
Edit
cd backend
dotnet restore
dotnet ef database update  # Run migrations
dotnet run
API will be available at http://localhost:5283.

🔹 Setup Frontend (React)
sh
Copy
Edit
cd frontend
npm install
npm start
Frontend will be available at http://localhost:3000.

