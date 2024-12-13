import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import ForgotPassword from "./pages/auth/forgotPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/profile";
import ProfileSettings from "./pages/profile/Settings";
import { HomeLayout } from "./components/layouts/HomeLayout";
import "./App.css";
import { ProfileLayout } from "./components/layouts/ProfileLayout";

function App() {
  return (
    <div className="w-full min-h-screen text-black dark:text-white bg-white dark:bg-black/50">
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="/auth">
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
          </Route>
        </Route>
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<Profile />} />
          <Route path="/profile/settings" element={<ProfileSettings />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
