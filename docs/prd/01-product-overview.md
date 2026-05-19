# 01. Tổng quan sản phẩm (Chương 1–3)

## 1. Tên sản phẩm

**Tên tạm thời:** HUST Docs (bố đéo nghĩ ra tên)\
**Loại sản phẩm:** Web application chia sẻ tài liệu học tập cho sinh viên HUST\
**Phiên bản PRD:** v1.0 – MVP\
**Tech stack dự kiến:** MERN Stack

- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Storage giai đoạn MVP:** Local server storage để lưu file tài liệu, kết hợp MongoDB để lưu metadata

> Lưu ý: Trong PRD này, "local storage" được hiểu là lưu file vật lý trên ổ đĩa server ở giai đoạn MVP, ví dụ thư mục `/uploads`. Browser localStorage chỉ nên dùng cho trạng thái giao diện tạm thời, không dùng để lưu tài liệu thật.

---

## 2. Bối cảnh và vấn đề cần giải quyết

Qua phỏng vấn người dùng trong file khảo sát, nhóm người dùng chính là sinh viên HUST. Người dùng thường gặp khó khăn trong việc tìm tài liệu học tập, đặc biệt là tài liệu chuyên ngành **như Nhúng, Androi**d, An toàn thông tin, Học máy hoặc các môn ít phổ biến.

Vấn đề hiện tại không chỉ là "không có tài liệu", mà là tài liệu bị phân tán ở nhiều nguồn khác nhau như bạn bè, anh chị khóa trên, Google, Facebook group, Tailieuhust, Studocu hoặc AI. Các nguồn này có thể hữu ích nhưng thường thiếu tính hệ thống, khó kiểm chứng độ tin cậy, không chắc có bám sát chương trình HUST hay không. Điều này khiến sinh viên mất nhiều thời gian tìm kiếm, nhất là trước kỳ thi, và dễ rơi vào trạng thái lo lắng vì sợ ôn sai trọng tâm.

Từ khảo sát, 100% người được hỏi gặp vấn đề vào các thời điểm quan trọng như đầu kỳ hoặc cuối kỳ. Khoảng 80% người dùng nhận định các giải pháp hiện tại chỉ mang tính tạm thời. Trong phỏng vấn giải pháp, 100% người dùng hiểu giá trị cốt lõi của ứng dụng là chia sẻ tài liệu; 80% nhận diện hệ thống điểm thưởng là một điểm hấp dẫn; 50% coi tìm kiếm/xem/tải tài liệu là tính năng quan trọng nhất; 40% mong muốn có preview tài liệu trước khi tải; và 30% đề cập nhu cầu kiểm duyệt hoặc xác thực để tăng độ tin cậy.

---

## 3. Mục tiêu sản phẩm

### 3.1. Mục tiêu chính

Xây dựng một web app giúp sinh viên HUST **tìm kiếm, xem trước, tải xuống và chia sẻ tài liệu học tập theo môn học/chuyên ngành một cách nhanh chóng và đáng tin cậy**.

Sản phẩm cần giải quyết ba nhu cầu cốt lõi:

1. **Giảm thời gian tìm tài liệu:** sinh viên có thể tìm theo môn học, chuyên ngành, loại tài liệu, từ khóa, độ phổ biến hoặc ngày đăng.
2. **Tăng độ tin cậy của tài liệu:** thông qua upvote/downvote, bình luận, thông tin người đăng, số lượt tải, số lượt xem và trạng thái xác thực.
3. **Khuyến khích sinh viên chia sẻ tài liệu:** thông qua điểm thưởng, điểm đóng góp, xếp hạng hoặc huy hiệu đơn giản.

### 3.2. Mục tiêu MVP

Trong bản MVP, sản phẩm chưa cần trở thành nền tảng lớn như Studocu. Mục tiêu là chứng minh được rằng sinh viên có thể:

- Upload tài liệu học tập.
- Tìm kiếm/lọc tài liệu theo môn học, chuyên ngành, loại tài liệu.
- Xem thông tin và preview tài liệu trước khi tải.
- Download tài liệu.
- Đánh giá độ hữu ích của tài liệu bằng upvote/downvote.
- Bình luận để xác nhận, bổ sung hoặc cảnh báo về chất lượng tài liệu.
- Nhận điểm đóng góp cơ bản khi upload tài liệu hoặc khi tài liệu nhận được upvote.
