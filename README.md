# Payment Processing System

A modern payment processing system with both Server-to-Server and Iframe integration methods.

## Features

- Server-to-Server (S2S) payment integration
- Iframe payment integration
- Real-time transaction status updates
- Order history with detailed transaction information
- Card number validation using Luhn algorithm
- Secure handling of sensitive card data
- Modern and responsive UI

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd payment-processing-system
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the backend server:
```bash
npm run server
```

2. In a new terminal, start the frontend development server:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

- `src/` - Frontend React application
  - `components/` - Reusable UI components
  - `pages/` - Main application pages
  - `App.tsx` - Main application component
  - `index.tsx` - Application entry point
- `server/` - Backend Express server
  - `index.ts` - Server implementation

## Security Features

- Card data is never stored in the frontend
- Sensitive data is masked in the UI
- Server-side validation of card numbers
- Secure API communication

## Technologies Used

- React
- TypeScript
- Material-UI
- Express.js
- Socket.IO
- Axios 