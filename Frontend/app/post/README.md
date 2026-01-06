apps/user/
├─ src/
│ ├─ app/ # App-level setup
│ │ ├─ bootstrap.tsx # mount / unmount (MF entry)
│ │ ├─ mount.ts # export mount()
│ │ └─ routes.tsx
│
│ ├─ pages/ # Page-level (routing)
│ │ ├─ UserList/
│ │ └─ UserDetail/
│
│ ├─ features/ # Business features
│ │ ├─ profile/
│ │ │ ├─ components/
│ │ │ ├─ hooks/
│ │ │ ├─ services.ts
│ │ │ └─ types.ts
│ │ └─ settings/
│
│ ├─ components/ # UI components local
│ ├─ services/ # API calls
│ ├─ hooks/
│ ├─ store/ # Zustand / Redux
│ ├─ styles/
│ └─ main.tsx # standalone dev
│
├─ vite.config.ts
├─ federation.config.ts
└─ package.json
