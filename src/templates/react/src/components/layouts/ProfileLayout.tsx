import { useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/authContext";
import { logout } from "../../services/auth";
import ChangeTheme from "../ui/themeChanger";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const ProfileLayout = () => {
  const pathname= useLocation().pathname;
  const userContext = useContext(AuthContext);
  const navigate = useNavigate();
  if (!userContext) {
    console.log("Could not find user");
  }
  // @ts-expect-error it will throw type error
  const {user} = userContext;

  const paths = [
    {"path": "/profile", "name": "Profile"},
    {"path": "/profile/settings", "name": "Settings"},
  ]


  return (
    <div className="block space-x-4 p-4 w-full">
      <div className="flex justify-between border-b border-slate-500 px-5">
        {user.image && (
          <img
            src={user.image}
            alt="user image"
            width={200}
            height={200}
            className="rounded-full"
          />
        )}

        <div className="flex space-around">
          {paths.map((route, index) => (
            <Link
              key={index}
              to={route.path}
              className={`px-4 py-2 ${route.path === pathname ? "border-b-2 border-black dark:border-white" : ""} dark:text-white`}
            >
              {" "}
              {route.name}{" "}
            </Link>
          ))}
        </div>
        <div className="flex space-x-2">
          <span
            className="px-4 py-2 bg-transparent dark:text-white text-sm border border-slate-600 rounded-md hover:bg-opacity-80"
            role="button"
            onClick={async () => {
              try {
                const message = await logout();
                toast.success(message, { id: "auth" });
                navigate("/auth/login", {replace: true})
              } catch (error) {
                if (error instanceof AxiosError)
                  toast.error(error.response?.data.message, { id: "auth" });
              }
            }}
          >
            Logout
          </span>
          <ChangeTheme />
        </div>
      </div>
      <Outlet />
    </div>
  );
}