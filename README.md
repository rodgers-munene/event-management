### EVENT MANAGEMENT SYSTEM

A modern, responsive Event Management System built with **React** and **Vite**. This frontend application provides an intuitive user interface to manage events, including creating, viewing, updating, and deleting events. It is designed to integrate seamlessly with a backend API, which is being developed by our team.

  
## Features
- **Event Management**: Add, view, edit, and delete events (integrated with the backend).
- **Search & Filter**: Search for events and filter them by category, date, or location.
- **Responsive Design**: Fully optimized for desktop and mobile devices.
- **Dynamic User Interface**: Built with React's reusable components.
- **Fast Performance**: Powered by Vite for instant HMR (Hot Module Replacement).
- **State Management**: Leverages React's context API or other libraries like Redux (if used).
- **Form Validation**: User-friendly forms with validation for event creation and editing.
- **Dark/Light mode toggle**: Enables users to switch from light mode to dark mode
- **User Authentication**: Authenticates event Organizers to allow them to delete or update events
- **Search events Functionality**: Enables users to search for particular events they want to attend
- **Event image upload**: Enables image upload on the create events page
- **Error states with proper user feedback**

 

### These are the Front end system screenshots

## Login & Registration page

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/77a190a0-6da3-43ac-b97f-b945fef3b891" />

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/ad561129-bd7c-4403-982b-a875f36aee4f" />


## Landing Page

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/08328673-d294-4caf-b63d-dfb22b0ee8e7" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/4a8bc555-ab65-4477-9d1c-c9600f820928" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/620bf586-039c-43e6-a67f-ae7a43dfd71c" />



## Create Events page

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/9c5dc765-bde2-4043-a15e-d1a3d95dacf1" />

## Event Listings Page

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/93fad1ae-ecf6-4ddc-a43d-0671cc9f1402" />

## Payments Page

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/219aa925-96c5-4530-b877-05f628fb0aaf" />




# Event Management System - Frontend


## Tech Stack
  

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

## Database schema

![WhatsApp Image 2025-01-21 at 09 03 11_cba5180d](https://github.com/user-attachments/assets/41749646-52b9-4e1f-a40a-35874476f3ec)


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
- **M-Pesa API Integration** : Enable users make payments for events 

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature name"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License
This project is licensed under the [MIT License](LICENSE).
