# 🍌 Banana iPad Store - Backend API

Backend hoàn chỉnh cho website bán iPad **"Banana iPad Store"** xây dựng bằng **Node.js**, **TypeScript**, **Express.js**, **Cloudflare Workers** và **Cloudflare D1 Database**.

---

## 🛠️ 1. Tech Stack

- **Node.js** & **TypeScript**
- **Express.js** (chạy trên môi trường Cloudflare Workers qua `serverless-http` và `nodejs_compat`)
- **Cloudflare Workers** (Serverless Computing platform)
- **Cloudflare D1** (Serverless SQL Database dựa trên SQLite)
- **Wrangler CLI** (Quản lý, test local và deploy Cloudflare Workers & D1)
- **Web Crypto API** (`crypto.subtle`) để hash mật khẩu an toàn.

---

## 📁 2. Cấu trúc Project

```text
banana-ipad-store-backend/
├── src/
│   ├── index.ts                     # Cloudflare Worker entry point (Fetch handler)
│   ├── app.ts                       # Cấu hình Express app, CORS, Middleware & Routes
│   ├── routes/
│   │   └── registration.routes.ts   # Khai báo các đường dẫn API /api/registrations
│   ├── controllers/
│   │   └── registration.controller.ts # Xử lý request, validate dữ liệu, response JSON
│   ├── services/
│   │   └── registration.service.ts  # Tương tác với Cloudflare D1 Database
│   ├── middleware/
│   │   └── error.middleware.ts      # Middleware xử lý lỗi tập trung (Centralized error handler)
│   ├── utils/
│   │   └── crypto.utils.ts          # Mã hóa mật khẩu bằng Web Crypto API (SHA-256)
│   └── types/
│       └── env.d.ts                 # Định nghĩa TypeScript cho Cloudflare Env (D1Database)
├── migrations/
│   └── 0001_create_registrations.sql # Script khởi tạo bảng registrations & index
├── package.json                     # Scripts & Dependencies
├── tsconfig.json                    # Cấu hình TypeScript
├── wrangler.toml                    # Cấu hình Cloudflare Workers & D1 Binding
├── .gitignore                       # File bỏ qua khi commit Git
├── .dev.vars.example                # File mẫu biến môi trường local
└── README.md                        # Hướng dẫn chi tiết
```

---

## 🚀 3. Hướng dẫn Chạy Local (Local Development)

### Bước 1: Cài đặt Dependencies

```bash
npm install
```

### Bước 2: Chạy Database Migration trên môi trường Local

Tạo bảng `registrations` trong cơ sở dữ liệu D1 local:

```bash
npx wrangler d1 migrations apply banana-ipad-store-db --local
```

Nhấn `y` để xác nhận chạy migration nếu được hỏi.

### Bước 3: Khởi chạy Dev Server Local

```bash
npm run dev
```

Server local sẽ chạy mặc định tại: `http://localhost:8787`

---

## 🧪 4. Hướng dẫn Test API (Local & Production)

### 4.1. Health Check API

Kiểm tra server đang hoạt động:

```bash
curl http://localhost:8787/
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Banana iPad Store API is running"
}
```

---

### 4.2. API 1 – Khách hàng đăng ký (POST /api/registrations)

#### Request thành công (HTTP 201 Created):

```bash
curl -X POST http://localhost:8787/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn An",
    "phoneNumber": "0987654321",
    "address": "Hà Nội",
    "username": "nguyenvanan",
    "password": "12345678"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "id": "c1f7a2b9-1234-4567-89ab-cdef01234567",
    "fullName": "Nguyễn Văn An",
    "phoneNumber": "0987654321",
    "address": "Hà Nội",
    "username": "nguyenvanan",
    "createdAt": "2026-09-15T00:00:00.000Z"
  }
}
```

> **Lưu ý:** Password và password_hash **tuyệt đối không bị trả về** cho client.

---

#### Validation: Thiếu trường dữ liệu (HTTP 400 Bad Request):

```bash
curl -X POST http://localhost:8787/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "  ",
    "phoneNumber": "0987654321",
    "address": "Hà Nội",
    "username": "nguyenvanan",
    "password": "12345678"
  }'
```

**Response:**

```json
{
  "success": false,
  "message": "Vui lòng nhập đầy đủ thông tin"
}
```

---

#### Validation: Số điện thoại không hợp lệ (HTTP 400 Bad Request):

```bash
curl -X POST http://localhost:8787/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn An",
    "phoneNumber": "abc12345",
    "address": "Hà Nội",
    "username": "nguyenvanan2",
    "password": "12345678"
  }'
```

**Response:**

```json
{
  "success": false,
  "message": "Số điện thoại không hợp lệ"
}
```

---

#### Validation: Trùng Username (HTTP 409 Conflict):

Thử đăng ký lại với cùng username `nguyenvanan`:

```bash
curl -X POST http://localhost:8787/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn An",
    "phoneNumber": "0987654321",
    "address": "Hà Nội",
    "username": "nguyenvanan",
    "password": "12345678"
  }'
```

**Response:**

```json
{
  "success": false,
  "message": "Tên đăng nhập đã được đăng ký"
}
```

---

### 4.3. API 2 – Lấy danh sách khách hàng (GET /api/registrations)

```bash
curl http://localhost:8787/api/registrations
```

**Response (HTTP 200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "c1f7a2b9-1234-4567-89ab-cdef01234567",
      "fullName": "Nguyễn Văn An",
      "phoneNumber": "0987654321",
      "address": "Hà Nội",
      "username": "nguyenvanan",
      "createdAt": "2026-09-15T00:00:00.000Z"
    }
  ]
}
```

---

## ☁️ 5. Hướng dẫn Deploy lên Cloudflare

### Bước 1: Đăng nhập Cloudflare bằng Wrangler

```bash
npx wrangler login
```

Trình duyệt sẽ mở ra để bạn xác thực tài khoản Cloudflare.

### Bước 2: Tạo D1 Database trên Cloudflare Production

```bash
npx wrangler d1 create banana-ipad-store-db
```

Output sau khi tạo sẽ hiển thị thông tin như sau:

```text
[[d1_databases]]
binding = "DB"
database_name = "banana-ipad-store-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Bước 3: Cập nhật `database_id` vào file `wrangler.toml`

Mở file `wrangler.toml` và dán `database_id` vừa nhận được vào:

```toml
[[d1_databases]]
binding = "DB"
database_name = "banana-ipad-store-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
migrations_dir = "migrations"
```

### Bước 4: Chạy Database Migration trên Cloudflare Remote

Tạo bảng trên cơ sở dữ liệu thật của Cloudflare:

```bash
npx wrangler d1 migrations apply banana-ipad-store-db --remote
```

### Bước 5: Deploy Worker ứng dụng

```bash
npm run deploy
```

Sau khi deploy thành công, Wrangler sẽ trả về URL API Production của bạn, ví dụ:
`https://banana-ipad-store-backend.<your-subdomain>.workers.dev`

---

## 🔒 6. Lưu ý về Bảo mật & CORS (Production)

Trong file `src/app.ts`, CORS hiện đang mở cho tất cả tên miền (`*`) phù hợp cho quá trình phát triển (development).
Khi đưa lên Production, bạn nên giới hạn tên miền frontend được phép truy cập trong `cors()`:

```ts
app.use(cors({
  origin: 'https://banana-ipad-store.com'
}));
```
