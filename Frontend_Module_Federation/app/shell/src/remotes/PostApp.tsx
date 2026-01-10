import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function PostAppWrapper() {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (!ref.current) return;

    import("post/PostApp").then((m) => {
      m.mount(ref.current!, {
        initialPath: location.pathname,
      });
    });

    return () => {
      import("post/PostApp").then((m) => m.unmount());
    };
  }, [location.pathname]);

  return <div ref={ref} />;
}
