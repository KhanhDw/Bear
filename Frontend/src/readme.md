src/
├── app/ # app bootstrap
├── assets/
├── shared/ # dùng chung toàn app
│ ├── components/
│ ├── hooks/
│ ├── utils/
│ ├── styles/
│ └── types/
├── domains/ # ⭐ cực kỳ quan trọng
│ ├── feed/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── services/ # API gọi backend
│ │ └── types.ts
│ ├── post/
│ ├── user/
│ ├── search/
│ └── comment/
├── routes/
├── store/
└── main.tsx

dự án làm theo kiến trúc Aggregate -> BFF -> Miro-Frontend
