Shell (Host App)
Chịu trách nhiệm

Global layout

Navbar / Sidebar

Auth / Permission

Route mount

Pages
Route Owner
/ feed-app
/login auth-app (hoặc user-app)
/settings user-app

- shell (404)

📌 Shell KHÔNG có page domain

sơ đồ trực quan shell app
Shell
├─ "/" ─────────────▶ feed-app (FeedPage)
├─ "/posts/new" ─────▶ post-app (CreatePostPage)
├─ "/posts/:id" ─────▶ post-app (PostDetailPage)
├─ "/users/:id" ─────▶ user-app (ProfilePage)
└─ "/settings" ──────▶ user-app

feed-app/
├─ pages/
│ ├─ FeedPage.tsx
│ ├─ FollowingFeed.tsx
│ └─ TrendingFeed.tsx
├─ components/
│ └─ FeedList.tsx
└─ services/
└─ feed.api.ts

post-app/
├─ pages/
│ ├─ PostDetailPage.tsx
│ ├─ CreatePostPage.tsx
│ └─ EditPostPage.tsx
├─ components/
│ ├─ PostItem.tsx
│ └─ PostEditor.tsx

# Federation expose cái gì?

```tsx
exposes: {
    "./FeedPage": "./src/pages/FeedPage",
}

exposes: {
    "./PostDetailPage": "./src/pages/PostDetailPage",
    "./PostItem": "./src/components/PostItem",
}

exposes: {
    "./ProfilePage": "./src/pages/ProfilePage",
    "./UserMini": "./src/components/UserMini",
}
```
