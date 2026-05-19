# 03. Phạm vi MVP & User Journeys (Chương 6–7)

## 6. Phạm vi MVP

### 6.1. In-scope

MVP sẽ bao gồm các nhóm chức năng sau:

1. Quản lý tài liệu
2. Upload tài liệu
3. Tìm kiếm và lọc tài liệu
4. Xem danh sách tài liệu
5. Xem chi tiết tài liệu
6. Preview tài liệu
7. Download tài liệu
8. Upvote/downvote tài liệu
9. Bình luận tài liệu
10. Điểm đóng góp cơ bản
11. Xác thực người dùng cơ bản
12. Trang cá nhân cơ bản
13. Admin quản lý tài liệu/danh mục ở mức tối thiểu
14. Trang trao đổi điểm lấy phần quà (cửa hàng đổi điểm lấy quà)
15. Onboarding sau đăng ký: chọn chuyên ngành và môn học quan tâm (FR-14) — phục vụ cá nhân hóa homepage
16. Báo cáo (flag) tài liệu và bình luận (FR-15) — tăng trust signal và phòng vệ nội dung
17. Quy trình duyệt tài liệu (Pending review) cho tài khoản mới/auto-flag (FR-16) — phối hợp với admin queue

### 6.2. Out-of-scope cho MVP

Các chức năng sau không làm:

- Thanh toán online.
- Gói premium.
- AI summary/AI quiz như Studocu.
- Chat realtime giữa người dùng.
- Mobile app native.
- OCR tự động đọc nội dung file.
- Recommendation engine phức tạp.
- Kiểm duyệt tự động bằng AI.
- Lưu file lên cloud như AWS S3/Cloudinary/Google Drive.
- Tích hợp đăng nhập bằng tài khoản trường nếu chưa có API chính thức.
- Hệ thống gamification quá phức tạp như level, nhiệm vụ ngày.

---

## 7. User journey chính

### 7.1. Journey: Tìm và tải tài liệu

1. Người dùng truy cập trang chủ.
2. Người dùng nhập từ khóa hoặc chọn chuyên ngành/môn học.
3. Hệ thống hiển thị danh sách tài liệu phù hợp.
4. Người dùng lọc theo loại tài liệu, số upvote, ngày đăng, người đăng hoặc môn học.
5. Người dùng mở trang chi tiết tài liệu.
6. Người dùng xem metadata, preview, lượt tải, lượt xem, upvote/downvote, bình luận.
7. Người dùng quyết định tải tài liệu.
8. Sau khi dùng, người dùng có thể upvote/downvote hoặc để lại bình luận.

### 7.2. Journey: Upload tài liệu

1. Người dùng đăng nhập.
2. Người dùng bấm "Upload tài liệu".
3. Người dùng chọn file từ máy.
4. Người dùng điền thông tin: tiêu đề, môn học, chuyên ngành, loại tài liệu, học kỳ/năm học, mô tả, tag.
5. Hệ thống validate file và thông tin bắt buộc.
6. Hệ thống lưu file vào local server storage và lưu metadata vào MongoDB.
7. Hệ thống xác định trạng thái theo FR-16:
   - Mặc định: `public` (xuất hiện ngay trên danh sách).
   - `pending` nếu uploader thuộc nhóm rủi ro (tài khoản mới <3 ngày, có vi phạm trước đó, hoặc email chưa verify).
8. Nếu `public`: người dùng nhận điểm đóng góp cơ bản (FR-11). Nếu `pending`: chưa cộng điểm, chờ admin duyệt; điểm trigger sau khi approve.

### 7.3. Journey: Đánh giá độ tin cậy

1. Người dùng mở chi tiết tài liệu.
2. Người dùng xem preview và thông tin người đăng.
3. Người dùng đọc bình luận từ cộng đồng.
4. Người dùng xem số upvote/downvote, số lượt tải, số lượt xem.
5. Người dùng quyết định tải hoặc bỏ qua.
6. Người dùng có thể upvote/downvote sau khi xem/tải.

### 7.4. Journey: Onboarding sau đăng ký (FR-14)

1. Người dùng đăng ký tài khoản thành công.
2. Hệ thống điều hướng tới trang Onboarding (không phải trang chủ).
3. Người dùng chọn chuyên ngành (Major) từ danh sách có search.
4. Người dùng chọn 0..N môn học quan tâm trong các môn của chuyên ngành đó (có thể bỏ qua).
5. Người dùng xác nhận → hệ thống lưu `primaryMajorId` + `interestedSubjectIds` + `onboardingCompletedAt`.
6. Người dùng được điều hướng về trang chủ với các section cá nhân hóa hoạt động (Trending in your courses, gợi ý môn học quan tâm).
7. Nếu người dùng bỏ qua bước 3 ("Tôi sẽ chọn sau"): trang chủ hiển thị banner nhắc onboarding.

### 7.5. Journey: Báo cáo tài liệu/bình luận (FR-15)

1. Người dùng đang xem chi tiết tài liệu hoặc đọc comment phát hiện vi phạm.
2. Người dùng bấm "Báo cáo" trên tài liệu hoặc icon cờ cạnh comment.
3. Modal hiện ra: chọn lý do (SPAM, COPYRIGHT, INCORRECT_CONTENT, OFF_TOPIC, INAPPROPRIATE, OTHER) + ghi chú tùy chọn (bắt buộc nếu OTHER).
4. Người dùng submit.
5. Hệ thống ghi nhận Report, hiển thị toast xác nhận, không tiết lộ thông tin xử lý chi tiết về sau.
6. Nếu target đạt ngưỡng ≥5 báo cáo distinct/24h: tự động chuyển sang trạng thái pending (tài liệu — vào queue FR-16) hoặc hidden (comment), đồng thời thông báo uploader/author lý do tạm ẩn.
7. Admin xử lý báo cáo từ Report Inbox: resolved (áp dụng action) hoặc rejected (khôi phục).

### 7.6. Journey: Admin duyệt tài liệu pending (FR-16)

1. Admin đăng nhập, vào Admin → Pending Queue.
2. Hệ thống hiển thị danh sách tài liệu `status = 'pending'` sắp xếp FIFO, có filter theo `pendingReason` (NEW_ACCOUNT / AUTO_FLAGGED / PRIOR_VIOLATION / UNVERIFIED_EMAIL).
3. Admin mở 1 tài liệu, xem preview + metadata + thông tin uploader + danh sách báo cáo liên quan (nếu có).
4. Admin chọn một trong ba hành động:
   - **Approve** → tài liệu chuyển `public`, uploader được cộng điểm upload (FR-11), uploader nhận thông báo.
   - **Reject** → tài liệu chuyển `hidden` hoặc `deleted` kèm lý do, uploader nhận thông báo lý do.
   - **Request changes** → giữ `pending`, để lại note cho uploader. Uploader sửa metadata và resubmit.
5. Hệ thống ghi audit: `approvedBy/rejectedBy`, `approvedAt/rejectedAt`, `rejectionReason`, `adminNote`.
