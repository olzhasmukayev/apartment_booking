import { RefObject, useEffect } from "react";

type RefsType = Array<RefObject<HTMLElement | null>>;

export default function useOnClickOutside(
  refs: RefsType,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      let isOutside = true;

      for (const ref of refs) {
        if (ref.current && ref.current.contains(event.target as Node)) {
          isOutside = false;
          break;
        }
      }

      if (isOutside) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [refs, handler]);
}
