Here is a clean, structured development phase list based on your project blueprint, keeping the admin panel completely decoupled as a separate, external application.

---

### **Phase 1: Foundation & App Shell**

* Set up the Next.js project with Tailwind CSS and Shadcn/ui.
* Establish the "Clean. Calm. Technical" design system (neutral palette, Inter/Geist typography, subtle borders, and a robust dark mode).
* Build the core responsive layout (sidebar navigation for desktop, top/bottom navigation for mobile).

### **Phase 2: Authentication & Database Setup**

* Configure Supabase for PostgreSQL database, secure storage buckets, and Auth (Email/Password & Google login).
* Implement Row Level Security (RLS) policies so user data is strictly isolated.
* Build the basic onboarding flow (select branch, year, semester) to seed initial profile data.

### **Phase 3: Core Student Notebook (MVP)**

* **Dashboard:** Build the home view with active semester info, quick actions, and recent notes.
* **Subjects & Syllabus:** Create the subject management hierarchy.
* **Notes Editor:** Implement a rich-text/markdown editor (using TipTap or BlockNote) supporting code blocks, math equations, and custom engineering blocks (definitions, formulas, algorithms).
* **Tags & Favorites:** Add tagging and pin/favorite functionality for fast filtering.

### **Phase 4: Academic & Project Extensions**

* **Labs:** Build the structured lab record workspace (experiments, aims, code, inputs/outputs, and results).
* **Projects:** Implement project management tracking (milestones, tasks, tech stacks, and status columns).
* **Questions & Revision:** Add the questions vault and basic revision states for exam preparation.

### **Phase 5: Search, Export & Polish**

* **Universal Search:** Set up PostgreSQL full-text search across notes, labs, and projects.
* **Command Palette (`Cmd/Ctrl + K`):** Add keyboard-first navigation for quick creation and switching.
* **Data Export:** Build Markdown/JSON/PDF export features so users truly own their data.

---

### **External Admin Panel (Standalone App)**

To keep management completely out of the student web app, build a separate, lightweight admin dashboard (e.g., a protected Next.js admin app or an internal Retool/admin script).

#### **Admin App Features:**

* **Isolated Access:** Secured via strict admin-only environment variables and database role-checks (ignoring standard student RLS rules via service-role key handled safely on the backend server).
* **User Management Table:**
* List all registered students (Email, Name, Branch, Created Date).
* Ability to deactivate or delete accounts if needed.


* **Storage Monitoring:**
* Track total Supabase Storage consumed per user (tracking attachments, PDF uploads, and images).
* Set storage quota limits per user to prevent abuse.


* **Platform Metrics:** View aggregate health metrics (total active students, total notes created, system-wide database size) without looking at private note content.

---

Which part of the student stack or database schema would you like to map out first code-wise?