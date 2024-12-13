import { Outlet } from "react-router-dom"
import Header from "../ui/Header"

export const HomeLayout = () => {
  return(
    <div className="block space-x-4">
      <Header />
      <Outlet />
    </div>
  );
}