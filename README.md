### EVENT MANAGEMENT SYSTEM

A modern, responsive Event Management System built with **React** and **Vite**. This frontend application provides an intuitive user interface to manage events, including creating, viewing, updating, and deleting events. It is designed to integrate seamlessly with a backend API, which is being developed by our team.

📋 Group Members
Monicah Wamuhu (Group Leader)
Isaac Limlim
Solomon Ngandu
Ryan Giggs
Rodgers Munene
Omar Mwakunyetta
Elphas Simiyu
Ali Aliow
Benson Muthangya
Fabius Simiyu
Farbean Makini
Phenny Mwaisaka
Micheal James
Joseph Roberts
Tabitha Wanjiku

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Folder Structure](#folder-structure)
- [Screenshots](#screenshots)
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

  Find the UI Design Below
**Login Page**
![WhatsApp Image 2025-01-18 at 21 05 31_196541c5](https://github.com/user-attachments/assets/963b5073-ba6e-4f76-829f-777aacff513c)

**Landing page**
![WhatsApp Image 2025-01-18 at 21 05 32_c39f3388](https://github.com/user-attachments/assets/e854e560-ef1b-4126-8796-ba263089d446)

**Create Event Page**
![WhatsApp Image 2025-01-18 at 21 05 46_2b02c817](https://github.com/user-attachments/assets/3f15e564-3c26-44b5-8f45-22a3bc6d4db1)

**Event Details Page**
![WhatsApp Image 2025-01-18 at 21 05 32_668f895d](https://github.com/user-attachments/assets/7a7d266c-ac0d-4ee7-b3c1-510c96ce7051)

**Payment Page**
![WhatsApp Image 2025-01-18 at 21 05 45_3ef4b35a](https://github.com/user-attachments/assets/16df393c-7271-43fa-beb2-33d81b0a75df)





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
   cd event-management-system-frontend
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
The app will be available at `http://localhost:5173`.

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



## Future Enhancements
- **Backend Integration**: Continue to collaborate with the backend team to integrate the API for full functionality.
- **User Authentication**: Add login and registration functionality once the backend supports it.
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
