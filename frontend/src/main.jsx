import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext.jsx';
//import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    <AuthProvider >
        <MenuProvider>
            <StrictMode>
            <App />
            </StrictMode>
        </MenuProvider>
    </AuthProvider>

)
