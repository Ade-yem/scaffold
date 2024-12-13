import { Dispatch, SetStateAction, useRef, useState } from "react";
import ChangeTheme from "./themeChanger";
import { useOutsideClick } from "../hooks/outsideClick";
import { Link, useLocation } from "react-router-dom";

const Burger = ({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div onClick={() => setOpened(!opened)} className="cursor-pointer">
      {!opened ? (
        <svg
          width="40px"
          height="40px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g id="Menu / Menu_Alt_02">
              {" "}
              <path
                id="Vector"
                d="M11 17H19M5 12H19M11 7H19"
                className="stroke-slate-600 dark:stroke-white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
            </g>{" "}
          </g>
        </svg>
      ) : (
        <svg
          width="40px"
          height="40px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          transform="matrix(-1, 0, 0, 1, 0, 0)"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g id="Menu / Menu_Alt_02">
              {" "}
              <path
                id="Vector"
                d="M11 17H19M5 12H19M11 7H19"
                className="stroke-slate-600 dark:stroke-white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
            </g>{" "}
          </g>
        </svg>
      )}
    </div>
  );
};
const Logo = () => {
  return (
    <div className="flex space-x-2 h-fit justify-center items-center text-pretty text-xl">
      <span className="dm-mono-medium text-black dark:text-white">
        Scaffold<span className="opacity-90">.</span>
        <span className="opacity-80">dev</span>
      </span>
    </div>
  );
};
const MenuLinks = () => {
  const links = [
    { path: "/", name: "Home" },
    { path: "/profile", name: "Profile" },
    { path: "/auth/login", name: "Login" },
    { path: "/auth/register", name: "Register" },
  ];
  const pathname = useLocation().pathname;
  return (
    <div className="flex dark:text-white/60 text-slate-800 space-x-2 h-fit justify-center items-center text-pretty text-base">
      {links.map(({ path, name }, index) => (
        <Link
          to={path}
          key={index}
          className={`py-2 px-4 hover:opacity-70 rounded-md ${pathname === path ? "border-b border-b-slate-500" : ""}`}
        >
          {name}
        </Link>
      ))}
    </div>
  );
};

const SideBar = ({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) => {
  const openedRef = useRef<HTMLDivElement>(null);
  useOutsideClick(openedRef, () => setOpened(false));
  const pathname = useLocation().pathname;
  const links = [
    { path: "/", name: "Home" },
    { path: "/profile", name: "Profile" },
    { path: "/auth/login", name: "Login" },
    { path: "/auth/register", name: "Register" },
  ];
  return (
    <div
      className={`z-10 duration-200 bg-dark-bg absolute top-0 right-0 h-screen py-4 bg-white dark:bg-black w-[300px] rounded-sm shadow-sm ${
        opened ? "block" : "hidden"
      }`}
      ref={openedRef}
    >
      <div className="flex justify-between p-4 border-b border-b-slate-500 ">
        <div onClick={() => setOpened(false)} className="p-2 rounded-full">
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18 17.94 6M18 18 6.06 6"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col justify-start py-3 text-lg dark:text-white/60 text-slate-600 space-x-3 dm-mono-regular">
        <Link
          to="/"
          onClick={() => setOpened(false)}
          className="border-b border-b-slate-500 py-2 px-4 hover:opacity-70 rounded-md"
        >
          <Logo />
        </Link>
        {links.map(({ path, name }, index) => (
          <Link
            to={path}
            key={index}
            onClick={() => setOpened(false)}
            className={`border-b border-b-slate-500 py-2 px-4 hover:opacity-70 rounded-md ${pathname === path ? "shadow-md" : ""}`}
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
};


export default function Header() {
  const [opened, setOpened] = useState(false);
  return (
    <div className="dark:bg-black p-4 shadow-sm rounded-md bg-white min-h-fit max-h-24 flex justify-between items-center relative">
      <div className="sm:hidden w-full flex justify-between">
        <Logo />
        <Burger opened={opened} setOpened={setOpened} />
      </div>
      <div className="hidden space-x-5 sm:flex justify-around items-center h-fit">
        <Logo />
        <MenuLinks />
      </div>
      <div className="flex justify-end w-fit">
        <ChangeTheme />
      </div>
      <SideBar opened={opened} setOpened={setOpened} />
    </div>
  );
}
