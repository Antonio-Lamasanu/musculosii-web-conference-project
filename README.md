Conference Management Application

Project Overview

This is a Full-Stack Web Application designed to manage the submission, peer review, and approval workflow for scientific conference articles. The system features automated reviewer assignment and distinct user dashboards based on roles (Organizer, Reviewer, and Author).

This project fulfills the academic requirements for a modern distributed architecture: SPA (React) client, RESTful Node.js backend, and a Relational Database with ORM.

Technical Stack & Dependencies

Frontend (SPA): React.js / Vite - Component-based UI for all user roles.

Backend (API): Node.js (Express) - RESTful interface, business logic, and automated assignment handlers.

Database: PostgreSQL / MySQL - Persistent storage for users, conferences, and articles.

ORM: Sequelize (or equivalent) - Data mapping and management.

External Service: Gravatar API - Used by the Backend to generate profile image URLs based on user emails.

Feature Set Summary

The application supports three distinct user roles and manages the following core processes:

Organizer: Creates conferences, monitors the status of all submissions, and allocates reviewers to the pool.

Author: Submits papers, uploads revisions, and checks the review status.

Reviewer: Receives auto-allocated articles, submits feedback, and approves/rejects submissions.

Core Workflow: The system automatically assigns 2 available Reviewers when a new Article is submitted.

Repository Structure

The project follows a standard mono-repository structure separating the frontend and backend components.

/
├── client/          # Frontend: React.js SPA source code
├── server/          # Backend: Node.js/Express API and ORM logic
├── .gitignore       # Critical: Ignores node_modules, build artifacts, and .env files
├── README.md        # This file (Project instructions)
└── project_plan_conference.md # Detailed specifications and data model


Setup and Running Instructions

NOTE: These instructions are required for Stage 2 (Functional RESTful Service). For Stage 1, only the plan and structure are required.

1. Prerequisites (Mandatory)

Node.js (v18+)

npm or yarn

A relational database instance (e.g., PostgreSQL or MySQL).

2. Backend (Server) Setup

2.1. Navigate to the server directory:

cd server


2.2. Install dependencies:

npm install


2.3. Configure Environment: Create a .env file in the /server directory and add your database credentials and any other configuration variables (e.g., ports).

# Example content for .env
DB_HOST=localhost
DB_USER=user
DB_PASS=password
DB_NAME=conference_db
PORT=3001


2.4. Run Migrations/Sync: (Instructions for initializing the database models via ORM will be added here later).

2.5. Start the server:

npm start


3. Frontend (Client) Setup

3.1. Navigate to the client directory:

cd client


3.2. Install dependencies:

npm install


3.3. Start the client application:

npm start


The application will typically be available at http://localhost:3000.

Team Collaborators

This is a three-person team project.

Lămășanu Antonio
Carabă Codrin
Căpraru Victor-Sebastian

Coordinating professor: Cîmpeanu Ionuț
