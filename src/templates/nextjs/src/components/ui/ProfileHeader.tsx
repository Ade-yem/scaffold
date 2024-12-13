"use client";

import { useContext } from "react";
import { AuthContext } from "@/components/context/authContext";
import { logout } from "@/services/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import ChangeTheme from "@/components/ui/themeChanger";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const ProfileHeader = () => {
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user }: any = useContext(AuthContext);
  const paths = [
    { path: "/profile", name: "Profile" },
    { path: "/profile/settings", name: "Settings" },
  ];
  const router = useRouter();
  return (
    <div className="flex justify-between border-b border-slate-500 px-5">
      {user.image && (
        <Image
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
            href={route.path}
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
              router.replace("/auth/login");
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
  );
};
