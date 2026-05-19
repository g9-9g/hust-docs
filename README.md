# HUST Docs

Kho tài liệu sinh viên Bách khoa — MVP. Giao diện theo phong cách Studocu với tông màu đỏ đặc trưng HUST, built bằng React + shadcn/ui ở frontend và Express + MongoDB ở backend.

## Phạm vi MVP đã làm

- **FR-01** Đăng ký / Đăng nhập / Đăng xuất (JWT)
- **FR-02** Upload tài liệu (Multer + local storage, validate type/size)
- **FR-03** Danh sách tài liệu (card grid, sort)
- **FR-04** Tìm kiếm theo từ khoá (title, description, tags, teacher)
- **FR-05** Bộ lọc theo chuyên ngành / môn học / loại tài liệu / sort
- **FR-06 / FR-07 / FR-08** Trang chi tiết, preview (PDF + ảnh), download

Các FR còn lại (vote, comment, reward, admin, onboarding, report, pending review) đã có sẵn data model hoặc đặt vị trí trong code để mở rộng.

## Cấu trúc

```
hust-docs/
  client/        # Vite + React 18 + TypeScript + Tailwind + shadcn/ui
  server/        # Express + TypeScript + Mongoose + Multer + JWT
  docs/          # PRD gốc
```

## Yêu cầu

- Node.js ≥ 18
- MongoDB ≥ 6 (local hoặc Atlas)

## Chạy local

### 1. Backend

```powershell
cd server
cp .env.example .env   # rồi sửa MONGODB_URI, JWT_SECRET nếu cần
npm install
npm run seed           # tạo Major + Subject mẫu (CNTT, Toán, Cơ khí, Điện)
npm run dev            # listening on http://localhost:4000
```

### 2. Frontend

Mở terminal khác:

```powershell
cd client
npm install
npm run dev            # http://localhost:5173
```

Vite đã được cấu hình proxy `/api → http://localhost:4000`, không cần đổi CORS thủ công khi dev.

## Theme HUST

- Primary: `#A50034` (HSL `343 100% 32%`) — phối với gradient `hust-600 → hust-800`.
- Toàn bộ token Tailwind/shadcn (`primary`, `accent`, `ring`, `secondary`) trỏ vào palette này, cộng thêm scale `hust-50…hust-900` ở `tailwind.config.js`.

## API tóm tắt

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| GET  | `/api/auth/me` | Lấy thông tin user hiện tại |
| GET  | `/api/majors` | Danh sách chuyên ngành |
| GET  | `/api/subjects?majorId=` | Danh sách môn học theo major |
| GET  | `/api/documents` | List + search + filter + sort + paginate |
| POST | `/api/documents` | Upload (multipart, cần auth) |
| GET  | `/api/documents/:id` | Chi tiết + tăng viewCount |
| GET  | `/api/documents/:id/download` | Tải file + tăng downloadCount |
| GET  | `/api/documents/:id/preview` | Stream file inline cho preview |

## Build production

```powershell
# Backend
cd server && npm run build && npm start

# Frontend
cd client && npm run build && npm run preview
```

## Hướng mở rộng

- Vote, comment, report → thêm module dưới `server/src/modules/`, model đã sẵn sàng được mở rộng.
- Storage migrate lên S3: thay phần `multer.diskStorage` bằng `StorageService` (xem PRD §10.7).
- Admin dashboard: thêm route `/admin` + middleware `requireAdmin`.
