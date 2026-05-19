# 14. Definition of Done & Demo Scenario (Chương 22–23)

## 14.1. Definition of Done cho MVP

MVP được coi là hoàn thành khi:

1. Người dùng có thể đăng ký/đăng nhập.
2. Người dùng có thể upload tài liệu kèm metadata.
3. File được lưu local và metadata được lưu MongoDB.
4. Người dùng có thể xem danh sách tài liệu.
5. Người dùng có thể search/filter/sort tài liệu.
6. Người dùng có thể xem chi tiết tài liệu.
7. Người dùng có thể preview PDF.
8. Người dùng có thể download tài liệu.
9. Người dùng có thể upvote/downvote tài liệu.
10. Người dùng có thể bình luận tài liệu.
11. Điểm đóng góp cơ bản hoạt động.
12. Người dùng có thể xem danh sách quà và đổi điểm lấy quà.
13. Admin có thể quản lý phần quà và giao dịch đổi quà.
14. Admin có thể ẩn/xóa/verify tài liệu ở mức tối thiểu.
15. UI đủ rõ ràng để demo luồng chính trong 3–5 phút.

---

## 14.2. Demo scenarios

### Scenario 1: Người dùng tìm tài liệu ôn thi

1. Truy cập trang chủ.
2. Search "Nhúng" hoặc "Android".
3. Lọc theo chuyên ngành CNTT Việt–Nhật.
4. Sort theo upvote cao nhất.
5. Mở một tài liệu.
6. Xem preview PDF.
7. Đọc bình luận xác nhận tài liệu hữu ích.
8. Download tài liệu.
9. Upvote tài liệu.

### Scenario 2: Người dùng chia sẻ tài liệu

1. Đăng nhập.
2. Vào trang upload.
3. Chọn file PDF.
4. Điền môn học, chuyên ngành, loại tài liệu.
5. Submit upload.
6. Tài liệu xuất hiện trong danh sách.
7. Điểm đóng góp của user tăng.

### Scenario 3: Người dùng đổi điểm lấy quà

1. Người dùng đăng nhập.
2. Vào trang đổi quà.
3. Xem tổng điểm hiện có.
4. Chọn một phần quà đủ điều kiện đổi.
5. Bấm "Đổi quà".
6. Hệ thống trừ điểm và tạo lịch sử đổi quà.
7. Người dùng xem trạng thái giao dịch đổi quà trong lịch sử.

### Scenario 4: Admin kiểm duyệt tài liệu

1. Admin đăng nhập.
2. Vào trang quản lý tài liệu.
3. Xem tài liệu mới upload.
4. Gắn verified hoặc ẩn tài liệu.
5. Kiểm tra trạng thái hiển thị ở trang public.
