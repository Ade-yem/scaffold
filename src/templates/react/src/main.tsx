import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./components/context/authContext.tsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_PUBLIC_Google_Client_ID || ""}>
        <StrictMode>
          <App />
          <Toaster position="top-right" />
        </StrictMode>
      </GoogleOAuthProvider>
    </AuthProvider>
  </BrowserRouter>,
);
