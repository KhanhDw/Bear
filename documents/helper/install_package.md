Cách cài đặt thư viện (Rất quan trọng)
Thay vì cd vào từng thư mục, bạn nên đứng ở thư mục gốc để cài đặt. Việc này giúp npm cập nhật đúng file package-lock.json ở root:

Cài thư viện cho Backend:

```Bash
npm install <tên_thư_viện> -w Backend
```

Cài thư viện cho Frontend:

```Bash
npm install <tên_thư_viện> -w Frontend
```

Cài thư viện dùng chung cho cả 2 (ví dụ: nodemon, dotenv, prettier):

```Bash
npm install <tên_thư_viện> -D
```

(Cài ở root với flag -D để dùng cho công cụ phát triển)
