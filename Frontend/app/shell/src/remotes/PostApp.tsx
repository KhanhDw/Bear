import React, { Suspense, useEffect, useRef } from "react";

const RemotePostApp = React.lazy(() =>
  import("post/PostApp").then((m) => ({
    default: function RemoteWrapper() {
      const ref = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (!ref.current) return;

        // flag cho remote biết đang chạy trong host
        (window as any).__HOST_APP__ = true;

        m.mount(ref.current);

        return () => {
          // cleanup khi host unmount
          m.unmount?.();
        };
      }, []);

      return <div ref={ref} />;
    },
  }))
);

export default function PostPage() {
  return (
    <Suspense fallback={<div>Loading Post App...</div>}>
      <RemotePostApp />
    </Suspense>
  );
}
