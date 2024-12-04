import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './components/context/authContext.tsx';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <GoogleOAuthProvider clientId={""}>
      <StrictMode>
        <App />
      </StrictMode>
    </GoogleOAuthProvider>
  </AuthProvider>
)
