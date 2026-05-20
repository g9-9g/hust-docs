# HUST Docs

Kho tài liệu sinh viên Bách khoa — MVP. Giao diện theo phong cách Studocu với tông màu đỏ đặc trưng HUST, built bằng React + shadcn/ui ở frontend và Express + MongoDB ở backend.

## Phạm vi MVP đã làm

- **FR-01** Đăng ký / Đăng nhập / Đăng xuất (JWT)
- **FR-02** Upload tài liệu (Multer + local storage, validate type/size)
- **FR-03** Danh sách tài liệu (card grid, sort)
- **FR-04** Tìm kiếm theo từ khoá (title, description, tags, teacher)
- **FR-05** Bộ lọc theo chuyên ngành / môn học / loại tài liệu / sort
- **FR-06 / FR-07 / FR-08** Trang chi tiết, preview (PDF + ảnh + Office), download
- **FR-09** Upvote / downvote tài liệu — toggle trạng thái, chống tự vote
- **FR-11 (một phần)** Cơ chế tích **điểm thưởng** + lịch sử điểm + trang điểm cá nhân
  - Nhận `+2` điểm khi tài liệu được upvote (sticky — chỉ tính một lần / người vote)
  - Nhận `+20` điểm khi tài liệu đạt mốc 50 lượt tải (khử trùng theo tài khoản)
  - Lượt xem / lượt tải được khử trùng (theo ngày / theo người) để chống lạm dụng

> **Quà tặng:** điểm thưởng sẽ dùng để **đổi quà tặng** ở giai đoạn sau — catalog quà,
> luồng đổi quà và trang admin quản lý quà chưa nằm trong phạm vi MVP hiện tại.

Các FR còn lại (comment, đổi quà tặng, admin, onboarding, report, pending review) đã có sẵn data model hoặc đặt vị trí trong code để mở rộng.

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
- **LibreOffice** — bắt buộc để tạo preview PDF cho file PowerPoint (`.ppt` / `.pptx`).
  Server gọi lệnh `soffice` ở chế độ headless để convert. Nếu thiếu, upload vẫn chạy
  nhưng tài liệu Office sẽ không có preview.
  - Windows: tải từ [libreoffice.org](https://www.libreoffice.org/download/) và cài đặt.
  - macOS: `brew install --cask libreoffice` · Ubuntu/Debian: `sudo apt install libreoffice`
  - Đảm bảo lệnh `soffice` nằm trong `PATH`, hoặc trỏ biến môi trường `LIBREOFFICE_PATH`
    tới đường dẫn binary (vd. `C:\Program Files\LibreOffice\program\soffice.exe`).

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
| GET  | `/api/documents/:id` | Chi tiết + đếm lượt xem (khử trùng theo ngày) + `myVote` |
| GET  | `/api/documents/:id/download` | Tải file + đếm lượt tải (khử trùng theo người) |
| GET  | `/api/documents/:id/preview` | Stream file inline cho preview |
| POST | `/api/documents/:id/vote` | Upvote / downvote tài liệu (cần auth) |
| GET  | `/api/points/me` | Số dư điểm thưởng + lịch sử tích điểm (cần auth) |

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
