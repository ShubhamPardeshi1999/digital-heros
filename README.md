# Digital Heroes - Lead Management Platform

Built for Digital Heroes Training Task (Role 04: Full Stack Development).
A robust lead management application built with Next.js 15, Tailwind CSS, Shadcn UI, and MongoDB.

## Features

- **Public Lead Capture:** A beautiful public-facing form for capturing lead inquiries.
- **Role-Based Access Control (RBAC):** Admin and Member roles enforced on both client and server.
- **Lead Lifecycle Management:** Track leads from 'New' to 'Won' with status updates.
- **Team Collaboration:** Assign leads to specific team members and add timestamped notes.
- **Activity Trail:** Audit log tracking every action taken on a lead.
- **Responsive Dashboard:** A modern, dark-themed dashboard with advanced filtering, search, and pagination.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + Shadcn UI
- **Database:** MongoDB (via Mongoose)
- **Authentication:** NextAuth.js (Auth.js v5)
- **Language:** TypeScript

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
AUTH_SECRET=a_random_secure_string_for_nextauth
NEXTAUTH_URL=http://localhost:3000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed the Database
Run the development server and visit the seed endpoint to create initial users:
```bash
npm run dev
# Then open your browser and go to:
# http://localhost:3000/api/seed
```
This will create two demo accounts:
- **Admin:** admin@leadflow.com / admin123
- **Member:** member@leadflow.com / member123

## API Documentation

All APIs return standard JSON responses.

### Public APIs

#### `POST /api/leads`
Submit a new lead inquiry from the public form.
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "company": "Acme Inc",
    "message": "Interested in your services"
  }
  ```
- **Response (201):** `{ "message": "Lead submitted successfully!", "lead": { "id": "..." } }`

### Authenticated APIs

#### `GET /api/leads`
Fetch a paginated list of leads.
- **Query Params:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `status` (string, optional filter)
  - `search` (string, optional search query)
- **Response (200):** `{ "leads": [...], "pagination": {...} }`

#### `GET /api/leads/:id`
Fetch a single lead with its notes and activity trail.
- **Response (200):** `{ "lead": {...}, "activities": [...] }`

#### `PATCH /api/leads/:id`
Update a lead (status change, assignment, or add note).
- **Actions:**
  - **Status:** `{ "action": "update_status", "status": "contacted" }`
  - **Assign:** `{ "action": "assign", "assignedTo": "user_id_or_null" }`
  - **Note:** `{ "action": "add_note", "text": "Had a good call." }`
- **Response (200):** `{ "message": "Lead updated successfully", "lead": {...}, "activities": [...] }`

### Admin Only APIs

#### `GET /api/users`
Fetch all team members.
- **Response (200):** `{ "users": [...] }`

#### `POST /api/users`
Create a new team member.
- **Body:** `{ "name": "...", "email": "...", "password": "...", "role": "member" }`
- **Response (201):** `{ "message": "User created successfully", "user": {...} }`

## AI Usage Statement
*(As per the task brief, here is where AI was utilized)*
AI models (Claude & Gemini) were used as coding assistants during the development of this project. They assisted in scaffolding the initial Next.js project structure, generating boilerplate Mongoose models, and accelerating the implementation of Shadcn UI components. All architectural decisions, component compositions, API endpoint designs, and the comprehensive business logic were directed and refined by the candidate.
