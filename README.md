# Full-Stack Authentication System

A secure user authentication application built with **HTML, CSS, and Vanilla JavaScript** on the frontend, **Node.js (Express)** on the backend, and **MongoDB (Mongoose)** for credential storage.

---

## Features

- **User Registration**: Create an account with username, email, and password.
- **Secure Password Storage**: Passwords are automatically hashed with `bcryptjs` (salt rounds: 10) before being saved to MongoDB. Plain-text passwords are never stored.
- **Credential Verification & Login**: Authenticate with username or email + password.
- **JWT Authentication**: Generates a secure JSON Web Token upon successful sign-in.
- **Protected Profile / Dashboard**: Displays authenticated user details and allows one-click sign out.
- **Persistent Session**: Auto-logs in on page refresh if a valid token is present in `localStorage`.
- **Responsive & Modern UI**: Built with pure CSS glassmorphism, responsive controls, password show/hide toggles, and live alerts.

---

## Project Structure

```
Project1/
├── package.json              # Project dependencies and npm scripts
├── .env.example              # Environment variables template
├── .env                      # Active environment configuration
├── server.js                 # Express server & MongoDB connection
├── models/
│   └── User.js               # Mongoose schema for user credentials
├── middleware/
│   └── authMiddleware.js     # JWT verification middleware
├── routes/
│   └── auth.js               # Register, login, and user profile routes
├── public/
│   ├── index.html            # Main authentication & dashboard UI
│   ├── style.css             # Glassmorphism aesthetic stylesheet
│   └── app.js                # Frontend API calls & DOM interactions
└── README.md
```

---

## Getting Started

### 1. Prerequisites
Ensure you have the following installed on your computer:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [MongoDB](https://www.mongodb.com/) (either running locally via MongoDB Community Server, or a free cloud cluster from [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 2. Install Dependencies
Open your terminal or PowerShell inside this directory (`c:\Users\acer\Documents\Project1`) and run:

```bash
npm install
```

This installs:
- `express`: Web server framework
- `mongoose`: MongoDB object modeling
- `bcryptjs`: Password hashing
- `jsonwebtoken`: Authentication token generation
- `dotenv`: Environment configuration
- `cors`: Cross-origin request handling

---

### 3. Configure Database (.env)
Open the `.env` file and check your MongoDB URI:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth_db
JWT_SECRET=supersecretjwtkey_change_in_production_12345
```

- **Local MongoDB**: If MongoDB is installed locally on your machine, keep `mongodb://localhost:27017/auth_db`.
- **MongoDB Atlas (Cloud)**: Replace `MONGODB_URI` with your connection string:
  ```env
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/auth_db?retryWrites=true&w=majority
  ```

---

### 4. Start the Application

Run the server with:

```bash
npm start
```

Or for development mode with automatic reload:

```bash
npm run dev
```

Once started, open your web browser and navigate to:
```
http://localhost:5000
```

---

## API Endpoints

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| `POST` | `/api/auth/register` | Create a new user account & hash password | No |
| `POST` | `/api/auth/login` | Check username/email & password, return JWT | No |
| `GET`  | `/api/auth/me` | Fetch authenticated user data using Bearer Token | Yes (JWT) |

### Request Examples

#### Register (`POST /api/auth/register`)
```json
{
  "username": "alex_smith",
  "email": "alex@example.com",
  "password": "SecurePassword123"
}
```

#### Login (`POST /api/auth/login`)
```json
{
  "identifier": "alex_smith",
  "password": "SecurePassword123"
}
```
*(You can pass either the `username` or `email` as `identifier`)*
