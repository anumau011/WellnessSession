# Wellness Session Management App

A full-stack web application that allows users to register, log in, and manage their own wellness sessions (like yoga/meditation flows). Users can create, auto-save, and publish sessions with a rich editing interface and real-time auto-save functionality.

## Features

### 🔐 Authentication
- User registration and login with JWT tokens
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- Persistent login sessions

### 📝 Session Management
- Create and edit wellness sessions
- Auto-save functionality (5s inactivity or 30s intervals)
- Visual feedback for auto-save status
- Session categorization (yoga, meditation, breathing, etc.)
- Difficulty levels and duration tracking
- Tag system for easy organization

### 📊 Dashboard
- View all user sessions with filtering
- Draft and published status management
- Quick actions (edit, view, publish, delete)
- Responsive grid layout
- Session metadata display

### 🎨 User Experience
- Modern, responsive design with Tailwind CSS
- Real-time auto-save indicators
- Smooth loading states and error handling
- Mobile-friendly interface

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router Dom
- **State Management**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **UI Components**: Headless UI, Heroicons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: CORS, input sanitization

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Environment Setup:**
   
   Frontend (.env):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
   
   Backend (backend/.env):
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/wellness-sessions
   JWT_SECRET=wellness-session-super-secret-jwt-key-2025
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

### Running the Application

1. **Start the backend server:**
   ```bash
   npm run backend
   ```
   The API will be available at http://localhost:5000

2. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Sessions
- `GET /api/sessions` - Get all published sessions (public)
- `GET /api/sessions/my-sessions` - Get user's sessions (protected)
- `GET /api/sessions/:id` - Get single session
- `POST /api/sessions` - Create session (protected)
- `PUT /api/sessions/:id` - Update session (protected)
- `PATCH /api/sessions/:id/autosave` - Auto-save session (protected)
- `PATCH /api/sessions/:id/publish` - Publish session (protected)
- `DELETE /api/sessions/:id` - Delete session (protected)

## Features in Detail

### Auto-Save System
- **Debounced Auto-Save**: Saves after 5 seconds of inactivity
- **Interval Auto-Save**: Fallback save every 30 seconds
- **Visual Feedback**: Shows saving status (saving, saved, error)
- **Smart Saving**: Only saves when data has actually changed
- **Error Recovery**: Handles network failures gracefully

### Session Editor
- Rich form with title, description, tags, and metadata
- Real-time auto-save with visual indicators
- Category selection (yoga, meditation, breathing, etc.)
- Difficulty levels (beginner, intermediate, advanced)
- Duration tracking in minutes
- JSON URL field for external session data
- Tag management with easy add/remove

### Dashboard Features
- Filter sessions by status (all, draft, published)
- Grid layout with session cards
- Quick actions for each session
- Session metadata display
- Responsive design for all screen sizes

## Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
npm run backend      # Start backend in development mode
npm run backend:start # Start backend in production mode
```

## Project Structure

```
wellness-session/
├── src/                     # Frontend source code
│   ├── components/
│   │   ├── auth/           # Login/Register forms
│   │   ├── sessions/       # Session editor and components
│   │   └── Dashboard.tsx   # Main dashboard
│   ├── contexts/           # React contexts (Auth)
│   ├── hooks/             # Custom hooks (useAutoSave)
│   ├── lib/               # API service layer
│   ├── types/             # TypeScript type definitions
│   └── App.tsx            # Main app with routing
├── backend/               # Node.js Express API
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express route handlers
│   ├── middleware/       # Auth middleware
│   ├── server.js        # Main server file
│   └── package.json
├── tailwind.config.js    # Tailwind configuration
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## License

This project is licensed under the MIT License.
