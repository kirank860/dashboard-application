# React Chat Dashboard

A performance-optimized dashboard application with real-time chat functionality and role-based authentication.

## Features

- User authentication with JWT
- Role-based access control (Admin/User)
- Real-time chat functionality
- Group and private chat rooms
- File sharing capabilities
- Modern Material-UI design
- Performance optimized with React best practices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Login Credentials

For testing purposes, you can use the following credentials:

**Admin User:**
- Email: admin@example.com
- Password: admin123

**Regular User:**
- Email: user@example.com
- Password: user123

### Features

1. **Authentication:**
   - Login with email and password
   - JWT-based authentication
   - Protected routes based on user roles

2. **Chat Functionality:**
   - Create new chat rooms (group or private)
   - Join existing chat rooms
   - Send text messages
   - Share files and images
   - Real-time message updates

3. **User Interface:**
   - Responsive design
   - Modern Material-UI components
   - Toast notifications for user feedback
   - Intuitive navigation

## Project Structure

```
src/
  ├── components/        # React components
  ├── contexts/         # React contexts
  ├── services/         # Service modules
  ├── types/           # TypeScript type definitions
  ├── utils/           # Utility functions
  ├── App.tsx          # Main application component
  └── main.tsx         # Application entry point
```

## Performance Optimizations

- Code splitting with React.lazy and Suspense
- Memoization with useMemo and useCallback
- Efficient re-rendering with React.memo
- Optimized bundle size with tree shaking
- Lazy loading of components and routes
