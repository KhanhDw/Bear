Khi cần thêm dependency cho 1 microservice

❌ KHÔNG:

```bash
cd backend/services/post-service
npm install fastify
```

✅ ĐÚNG:

```bash
npm install fastify -w backend/services/post-service
```

✅ ĐÚNG:

```bash
npm i -D @originjs/vite-plugin-federation -w frontend/shell-app
```

Hoặc nếu package.json của service có name:

```bash
npm install fastify -w @services/post-service
```

command find all folder name node_module:

```bash
find . -name "node_modules" -type d
```
