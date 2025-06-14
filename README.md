# CartNest

## Table of Contents


- [Features](#features)
- [Tech Stack](#tech-stack)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Demo](#demo)


## Features

- **User Authentication**

  - Register with username, email and password, gender and user photo
  - Secure login with JWT-based authentication
  - access token using JWT

- **User Profile**

  - View user information with ability to update them:
    - Profile photo.
    - Username.
    - Email.
    - Password.
    - gender.
  
  - View user orders that are currently pending for approval by the admin and have the ability to cancel those orders

- **Home**
  - View Promotion products

- **Protected Routes**
  - Only authenticated users can access Products page and buy products.
  - Only admin user can access products page to create, edit and delete products.
  - Only admin user can access orders page to approve or reject orders
 

## Tech Stack

**Frontend:**

- Angular 19 - Tailwind CSS - DaisyUI

**Backend:**

- Typescript Express v5 - JsonWebToken - CORS - PostgreSQL - TypeORM - [argon2](https://github.com/P-H-C/phc-winner-argon2) (password hashing)


## Backend Setup

1. **Install dependencies:**

   ```bash
   cd Backend
   npm install
   ```

2. **Configure environment variables:**

   - Create a `.env` file in `backend/` and have:
     ```
     PORT=
     JWT_SECRET=
     JWT_EXPIRES_IN=
     MAX_AGE=
     DB_HOST=
     DB_PORT=
     DB_USERNAME=
     DB_PASSWORD=
     DB_NAME=
     IMGBB_API_KEY=
     ```

3. **Start the backend server:**
   ```bash
   npm start
   ```
   The backend will run at `http://localhost:3000`.

## Frontend Setup


1. **Install dependencies:**

   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:4200` by default.

## Demo

https://github.com/user-attachments/assets/a33124b6-e42a-4cde-b5ad-0521d445ba5d

