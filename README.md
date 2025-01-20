### EVENT MANAGEMENT SYSTEM

A modern, responsive Event Management System built with **React** and **Vite**. This frontend application provides an intuitive user interface to manage events, including creating, viewing, updating, and deleting events. It is designed to integrate seamlessly with a backend API, which is being developed by our team.


## 📋 Group Members Peer Group 16

- **Monicah Wamuhu** (Group Leader)  
- Isaac Limlim  
- Solomon Ngandu  
- Ryan Giggs  
- Rodgers Munene  
- Omar Mwakunyetta  
- Elphas Simiyu  
- Ali Aliow  
- Benson Muthangya  
- Fabius Simiyu  
- Farbean Makini  
- Phenny Mwaisaka  
- Micheal James  
- Joseph Roberts  
- Tabitha Wanjiku  
  

## Table of Contents
- [Event Management System - Frontend](#event-management-system---frontend)
  - [Group Members Peer Group 16](#-group-members-peer-group-16)
  - [Features](#features)
  - [System Screenshots](#these-are-the-front-end-system-screenshots)
    - [Login & Registration Page](#login--registration-page)
    - [Landing Page](#landing-page)
    - [Create Events Page](#create-events-page)
    - [Event Listings Page](#event-listings-page)
    - [Payments Page](#payments-page-in-dark-mode)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the App](#running-the-app)
  - [Folder Structure](#folder-structure)
- [Event Management System - Backend](#event-management-system---backend)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites-1)
  - [Installation](#installation-1)
  - [Running the Server](#running-the-server)
  - [Testing the Backend](#testing-the-backend)
  - [API Endpoints](#api-endpoints)
  - [Common Issues](#common-issues)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

  
## Features
- **Event Management**: Add, view, edit, and delete events (integrated with the backend).
- **Search & Filter**: Search for events and filter them by category, date, or location.
- **Responsive Design**: Fully optimized for desktop and mobile devices.
- **Dynamic User Interface**: Built with React's reusable components.
- **Fast Performance**: Powered by Vite for instant HMR (Hot Module Replacement).
- **State Management**: Leverages React's context API or other libraries like Redux (if used).
- **Form Validation**: User-friendly forms with validation for event creation and editing.
- **Dark/Light mode toggle**
- **User Authentication**
- **Search events Functionality**
- **Event image upload**
- **Error states with proper user feedback**

 

### These are the Front end system screenshots

## Login & Registration page

![Screenshot (264)](https://github.com/user-attachments/assets/418e3542-0769-4dda-ba99-0ce990707490)

![Screenshot (265)](https://github.com/user-attachments/assets/a66617c8-34f2-4ddf-b3b5-41582e2eb057)

## Landing Page

![Screenshot (259)](https://github.com/user-attachments/assets/0961a3d3-9d45-4f22-8cfa-c9676bfd3357)
![Screenshot (260)](https://github.com/user-attachments/assets/71be64d8-1ca0-4600-b2a2-1b6e615011c4)
![Screenshot (261)](https://github.com/user-attachments/assets/cea972c8-0958-402d-ab23-59621e71e6f9)


## Create Events page

![Screenshot (262)](https://github.com/user-attachments/assets/6bbc863b-ac00-4edf-ab64-1f8c4dec15c9)

## Event Listings Page

![Screenshot (263)](https://github.com/user-attachments/assets/13f8516f-2e0e-4a48-a212-ee98a0be76c7)

## Payments Page (in dark mode)

![Screenshot (268)](https://github.com/user-attachments/assets/40b5f66a-4d66-4bbb-b137-f7261b55d5a2)






# Event Management System - Frontend


## Tech Stack
- **Frontend Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Plain **CSS** and [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **State Management**: Context API or Redux Toolkit (if applicable)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **API Integration**: Axios or Fetch API (to connect with the backend)
  

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn (package manager)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/event-management-system-frontend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App
Start the development server:
```bash
npm run dev
# or
yarn dev
```
The app will be available at `http://localhost:5000`.

## Folder Structure
```
event-management-system-frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Page components
│   ├── styles/          # Global and modular styles
│   ├── hooks/           # Custom hooks
│   ├── context/         # Context API setup
│   ├── utils/           # Helper functions and utilities
│   ├── assets/          # Images, icons, etc.
│   ├── App.jsx          # Main App component
│   └── main.jsx         # Entry point for Vite
├── .env                 # Environment variables
├── package.json         # Project metadata and dependencies
└── vite.config.js       # Vite configuration
```


# Event Management System - Backend

This is the backend for the Event Management System, responsible for handling API requests, managing databases, and supporting the frontend.

## Project Structure

```
event-management-system/
│-- backend/
│   ├── node_modules/         # Node dependencies
│   ├── databases/            # Database files
│   │   ├── db.sql             # SQL schema and queries
│   ├── .env                   # Environment variables
│   ├── .gitignore              # Files to ignore in git
│   ├── db.js                   # Database connection file
│   ├── package.json            # Project dependencies
│   ├── package-lock.json        # Locked dependencies
│   ├── server.js                # Main backend server file
│   ├── test-db.js               # Database testing file
│   └── README.md                # Project documentation
│
│-- frontend/                   # Frontend of the application
│-- .gitignore                   # Global git ignore file
│-- README.md                    # Root project documentation
```

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v16+ recommended)
- **npm** (Node Package Manager)
- **MySQL** (or any compatible SQL database)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/event-management-system.git
   cd event-management-system/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the `backend/` directory and add:

   ```plaintext
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   PORT=5000
   ```

4. **Database setup:**

   Import the SQL schema:

   ```bash
   mysql -u your_user -p your_database < databases/db.sql
   ```


## Running the Server

Start the backend server using:

```bash
node server.js
```


By default, the server will run on `http://localhost:5000`. You can change the port in the `.env` file.

## Testing the Backend

You can test the API using tools like:

- **Postman** (recommended for manual testing)
- **cURL** (for command-line testing)

Run the test script:

```bash
node test-db.js
```

## API Endpoints

| Method | Endpoint           | Description               |
|--------|-------------------|---------------------------|
| GET    | `/events`          | Get all events            |
| POST   | `/events`          | Create a new event         |
| GET    | `/events/:id`      | Get event details by ID    |
| PUT    | `/events/:id`      | Update an event            |
| DELETE | `/events/:id`      | Delete an event            |

## Common Issues

- **Database connection errors:** Ensure MySQL is running and the credentials in `.env` are correct.
- **Port conflicts:** If port 5000 is in use, change it in the `.env` file.


## Future Enhancements
- **Backend Integration**: Continue to collaborate with the backend team to integrate the API for full functionality..
- **Calendar View**: Introduce a calendar view for events.
- **Notifications**: Add reminders and notifications for upcoming events.
- **Advanced Filtering**: Enhance filtering options for a better user experience.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature name"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License
This project is licensed under the [MIT License](LICENSE).
