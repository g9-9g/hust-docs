# 13. Release Plan & Risks (Chương 20–21)

## 13.1. Phase 0 – Setup nền tảng

Deliverables:

- Khởi tạo MERN project.
- Kết nối MongoDB.
- Cấu hình Express server.
- Cấu hình React routing.
- Cấu hình local upload folder.
- Thiết kế schema User, Document, Subject, Major.

## 13.2. Phase 1 – Core document flow

Deliverables:

- Upload tài liệu.
- Lưu file local.
- Lưu metadata vào MongoDB.
- Xem danh sách tài liệu.
- Xem chi tiết tài liệu.
- Download tài liệu.

Đây là phase quan trọng nhất. Sau phase này, sản phẩm đã có luồng chia sẻ tài liệu cơ bản.

## 13.3. Phase 2 – Search, filter, preview

Deliverables:

- Search keyword.
- Filter theo môn/chuyên ngành/category.
- Sort theo mới nhất, upvote, download.
- Preview PDF.
- Empty/loading/error states.

Phase này giải quyết trực tiếp feedback: cần tìm nhanh, lọc tốt, xem trước trước khi tải.

## 13.4. Phase 3 – Trust & community

Deliverables:

- Upvote/downvote.
- Comment.
- Score tài liệu.
- Contribution points cơ bản.
- Profile người dùng cơ bản.

Phase này giải quyết nhu cầu tin cậy và khuyến khích chia sẻ bền vững. Trong phase này cũng nên triển khai trang đổi điểm lấy quà ở mức MVP, bao gồm danh sách quà, đổi quà, trừ điểm và lịch sử đổi quà.

## 13.5. Phase 4 – Admin & polish

Deliverables:

- Admin document management.
- Ẩn/xóa/verify tài liệu.
- Tối ưu UI.
- Responsive layout.
- Seed dữ liệu demo.
- Test trước demo.

---

## 13.6. Risks và hướng xử lý

### Rủi ro: Không đủ tài liệu ban đầu

Từ feedback, người dùng đánh giá điểm yếu lớn là số lượng tài liệu còn ít. Nếu kho tài liệu trống, sản phẩm khó thuyết phục.

Hướng xử lý:

- Seed trước tài liệu mẫu cho các môn phổ biến.
- Tập trung vào 5–10 môn có nhu cầu cao.
- Khuyến khích nhóm/khóa upload tài liệu trước khi demo.
- Hiển thị empty state kêu gọi upload.

### Rủi ro: Tài liệu không đáng tin

Hướng xử lý:

- Hiển thị upvote/downvote/comment rõ ràng.
- Có admin verify thủ công.
- Cho phép người dùng báo cáo tài liệu, optional.

### Rủi ro: Upload file gây lỗi hoặc mất file

Hướng xử lý:

- Validate file type và size.
- Lưu file bằng generated filename.
- Kiểm tra file tồn tại trước khi download.
- Tách StorageService để dễ thay thế.

### Rủi ro: Scope quá lớn

Hướng xử lý:

- Không làm AI, premium, chat, recommendation trong MVP.
- Ưu tiên document flow trước.
- Điểm thưởng chỉ làm ở mức cộng điểm cơ bản.
