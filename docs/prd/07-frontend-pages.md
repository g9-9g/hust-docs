# 07. Frontend Pages (Chương 11)

## 7.1. Public pages

### Home page

Mục tiêu:

- Giải thích ngắn gọn giá trị sản phẩm.
- Cho phép search nhanh.
- Hiển thị tài liệu nổi bật/mới nhất.
- Hiển thị top contributors nếu có.

Sections:

- Hero: "Tìm tài liệu HUST nhanh hơn, đáng tin hơn"
- Search bar lớn
- Bộ lọc nhanh theo chuyên ngành/môn học
- Tài liệu mới nhất
- Tài liệu được upvote nhiều
- CTA upload tài liệu

### Documents listing page

Mục tiêu:

- Tìm kiếm và lọc tài liệu.

Components:

- Search bar
- Filter sidebar
- Sort dropdown
- Document cards/table
- Pagination

### Document detail page

Mục tiêu:

- Xem thông tin, preview, vote, comment, download.

Components:

- Document header
- Metadata panel
- Preview panel
- Download button
- Vote buttons
- Comment list
- Related documents, optional

### Login/Register pages

Mục tiêu:

- Đăng nhập/đăng ký nhanh.

---

## 7.2. Authenticated pages

### Upload document page

Components:

- File picker
- Form metadata
- Category dropdown
- Subject/major dropdown
- Tags input
- Submit button
- Upload progress indicator, optional

### My profile page

Components:

- User info
- Contribution points
- Uploaded documents
- Basic statistics

### Reward store page

Components:

- Tổng điểm hiện có
- Danh sách phần quà có thể đổi
- Chi tiết điểm yêu cầu của từng phần quà
- Nút đổi quà
- Lịch sử đổi quà

---

## 7.3. Admin pages

### Admin document management

Components:

- Table tài liệu
- Filter theo status
- Button hide/delete/verify

### Admin category management, optional

Components:

- CRUD subject
- CRUD major
- CRUD category

### Admin reward management

Components:

- CRUD phần quà
- Cập nhật số lượng quà
- Ẩn/hiện phần quà
- Xem và xử lý lịch sử đổi quà của người dùng
