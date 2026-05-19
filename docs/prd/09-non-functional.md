# 09. Non-functional Requirements (Chương 13)

## 9.1. Performance

- Trang danh sách tài liệu phản hồi dưới 2 giây với dữ liệu MVP.
- Search/filter phản hồi dưới 2 giây với tối đa vài nghìn documents.
- Upload file 20–50MB hoạt động ổn định trong môi trường local/dev.
- Preview PDF không làm treo UI.

## 9.2. Security

- Password phải được hash bằng bcrypt hoặc thư viện tương đương.
- API upload cần kiểm tra MIME type và extension.
- Không cho upload file thực thi như `.exe`, `.sh`, `.bat`.
- File lưu local cần đổi tên để tránh trùng và tránh path traversal.
- API admin cần middleware kiểm tra role.
- Cần giới hạn dung lượng file.
- Cần sanitize input cơ bản để tránh XSS trong comment/description.

## 9.3. Reliability

- Nếu lưu metadata thành công nhưng lưu file thất bại, cần rollback hoặc báo lỗi rõ ràng.
- Nếu xóa tài liệu, cần xử lý cả metadata và file vật lý.
- Nếu file vật lý bị mất, API download cần trả lỗi thân thiện.

## 9.4. Maintainability

- Backend nên chia module rõ ràng: auth, users, documents, votes, comments, admin, subjects.
- Không hard-code danh mục môn học trong frontend nếu có thể lưu trong database.
- Tách service xử lý file storage để sau này chuyển từ local sang cloud.
