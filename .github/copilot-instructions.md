# Wellness Session Management App - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a full-stack wellness session management application that allows users to register, log in, and manage their own wellness sessions (like yoga/meditation flows). The application consists of:

- **Frontend**: Vite + React + TypeScript with Tailwind CSS
- **Backend**: Node.js + Express + MongoDB with JWT authentication

## Key Features

1. **Authentication**: JWT-based user registration and login
2. **Session Management**: Create, edit, auto-save, and publish wellness sessions
3. **Auto-save**: Automatic saving after 5s inactivity or every 30s with visual feedback
4. **Dashboard**: View and manage user sessions with filtering
5. **Session Editor**: Rich form editor for session details with auto-save indicators

## Architecture & Patterns

### Frontend Structure
- **Components**: Organized by feature (auth, sessions, dashboard)
- **Contexts**: AuthContext for global authentication state
- **Hooks**: Custom hooks like useAutoSave for auto-save functionality
- **API Layer**: Centralized API service with axios and interceptors
- **Types**: TypeScript interfaces for type safety

### Backend Structure
- **Models**: Mongoose schemas for User and Session
- **Routes**: Express routes with validation and error handling
- **Middleware**: Authentication middleware for protected routes
- **Validation**: express-validator for input validation
- **Security**: JWT tokens, password hashing with bcrypt

## Code Style & Guidelines

1. **TypeScript**: Use proper typing, prefer interfaces for object shapes
2. **React**: Functional components with hooks, proper prop typing
3. **Error Handling**: Comprehensive error handling in both frontend and backend
4. **Security**: Protected routes, input validation, sanitization
5. **Auto-save**: Visual feedback for auto-save status (saving, saved, error)

## Key Dependencies

### Frontend
- React Router for navigation
- React Query for API state management
- Axios for HTTP requests
- Tailwind CSS for styling
- Custom auto-save hook

### Backend
- Express.js for server framework
- Mongoose for MongoDB ODM
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- CORS for cross-origin requests

## Development Notes

- Auto-save triggers after 5 seconds of inactivity
- Fallback interval save every 30 seconds
- Visual indicators show save status
- Protected API routes require JWT token
- Clean error handling with user-friendly messages
- Responsive design with Tailwind CSS utilities
