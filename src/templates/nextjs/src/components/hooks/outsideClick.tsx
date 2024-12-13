import { RefObject, useEffect } from "react"

export const useOutsideClick = (
  ref: RefObject<HTMLDivElement>,
  closer: () => void
) => {
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        closer();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [ref, closer]);
}; 