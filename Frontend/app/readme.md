đối với shell app thì có thể run bằng lệnh npm run localdev:F:shell ở root project
nhưng towards miro-app user or other miro app then they can not run by command localdev because
remoteEntry not exsit on dev enviroment which it just exsit product due to having to build and run preview then shell app just can see miro was called on shell app localdev

-> 1. run shell app by command: npm run localdev:F:shell
-> 2. build miro app by command: npm run build:F:<miro-app>
-> 3. run preview miro app by command: npm run preview:F:<miro-app>
=> final you can see miro appear in shell app

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
