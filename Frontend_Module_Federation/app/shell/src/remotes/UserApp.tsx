import React, { Suspense } from "react";

const RemoteUserApp = React.lazy(() =>
  import("user/UserApp").then((m) => ({
    default: function RemoteWrapper() {
      const ref = React.useRef<HTMLDivElement>(null);

      React.useEffect(() => {
        if (ref.current) {
          m.default.mount(ref.current);
        }
      }, []);

      return <div ref={ref} />;
    },
  }))
);

export default function UserPage() {
  return (
    <Suspense fallback={<div>Loading User...</div>}>
      <RemoteUserApp />
    </Suspense>
  );
}
