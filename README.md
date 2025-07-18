# Book Review API

## Overview

This backend project is a RESTful API built with **Node.js** and **Express** to manage a book review platform. It supports user registration, authentication via **JWT tokens** stored in session, and book review operations. The API exposes both public and authenticated endpoints for managing users, books, and reviews.

---

## Features

- User registration and login with session-based JWT authentication
- Add, modify, and delete book reviews for authenticated users
- Retrieve book details by ISBN, author, or title (public access)
- View all available books and their reviews
- Secure protected routes under `/customer/auth/*` with JWT verification

---

## Technologies

- **Node.js** runtime
- **Express** web framework
- **jsonwebtoken** for JWT token management
- **express-session** for session handling
- **axios** for internal HTTP requests
- Modular Express routers (`auth_users.js`, `general.js`) for route separation
