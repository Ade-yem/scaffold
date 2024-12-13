import { useEffect, useState } from "react"

export const useLocalStorage = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "">("");
  useEffect(() => {
    const them = localStorage.getItem("theme");
    if (them) setTheme(them as "light" | "dark" | "");   
  }, [])
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme])
  return {theme, setTheme};
}