# Product Requirements Document (PRD)

## 1. Tên sản phẩm

**Tên tạm thời:** HUST Docs (bố đéo nghĩ ra tên)\
**Loại sản phẩm:** Web application chia sẻ tài liệu học tập cho sinh viên HUST\
**Phiên bản PRD:** v1.0 – MVP\
**Tech stack dự kiến:** MERN Stack

- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Storage giai đoạn MVP:** Local server storage để lưu file tài liệu, kết hợp MongoDB để lưu metadata

> Lưu ý: Trong PRD này, “local storage” được hiểu là lưu file vật lý trên ổ đĩa server ở giai đoạn MVP, ví dụ thư mục `/uploads`. Browser localStorage chỉ nên dùng cho trạng thái giao diện tạm thời, không dùng để lưu tài liệu thật.

---

## 2. Bối cảnh và vấn đề cần giải quyết

Qua phỏng vấn người dùng trong file khảo sát, nhóm người dùng chính là sinh viên HUST. Người dùng thường gặp khó khăn trong việc tìm tài liệu học tập, đặc biệt là tài liệu chuyên ngành **như Nhúng, Androi**d, An toàn thông tin, Học máy hoặc các môn ít phổ biến.

Vấn đề hiện tại không chỉ là “không có tài liệu”, mà là tài liệu bị phân tán ở nhiều nguồn khác nhau như bạn bè, anh chị khóa trên, Google, Facebook group, Tailieuhust, Studocu hoặc AI. Các nguồn này có thể hữu ích nhưng thường thiếu tính hệ thống, khó kiểm chứng độ tin cậy, không chắc có bám sát chương trình HUST hay không. Điều này khiến sinh viên mất nhiều thời gian tìm kiếm, nhất là trước kỳ thi, và dễ rơi vào trạng thái lo lắng vì sợ ôn sai trọng tâm.

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

---

## 4. Người dùng mục tiêu

### 4.1. Primary users

**Sinh viên HUST cần tìm tài liệu học tập**

Đặc điểm:

- Cần tài liệu sát chương trình học ở HUST.
- Thường tìm tài liệu vào đầu kỳ, trước giữa kỳ hoặc trước cuối kỳ.
- Quan tâm đến đề thi cũ, slide, note, bài tập lớn, tài liệu tham khảo, hướng dẫn ôn tập.
- Muốn biết tài liệu có đáng tin không trước khi tải.

### 4.2. Secondary users

**Sinh viên có tài liệu và muốn chia sẻ**

Đặc điểm:

- Có slide, note, đề cũ, tài liệu ôn thi, project mẫu hoặc tài liệu tự tổng hợp.
- Có thể sẵn sàng chia sẻ nếu thao tác đơn giản và có động lực đóng góp.
- Bị hấp dẫn bởi điểm thưởng, ranking, huy hiệu hoặc sự công nhận từ cộng đồng.

### 4.3. Admin/Moderator trong MVP

Ở MVP, vai trò admin có thể đơn giản, phục vụ kiểm thử và quản lý dữ liệu:

- Xem danh sách tài liệu.
- Ẩn hoặc xóa tài liệu vi phạm.
- Gắn trạng thái “verified” cho tài liệu hoặc người dùng.
- Quản lý danh mục môn học/chuyên ngành.

---

---

## 5. Giá trị cốt lõi của sản phẩm

### 6.1. Đối với người tìm tài liệu

- Tìm tài liệu nhanh hơn.
- Tài liệu được phân loại theo đúng bối cảnh học ở HUST.
- Có thể kiểm tra sơ bộ nội dung qua preview.
- Có tín hiệu đánh giá từ cộng đồng trước khi tải.
- Giảm cảm giác lo lắng vì không biết tài liệu có đáng tin không.

### 6.2. Đối với người chia sẻ tài liệu

- Có nơi lưu trữ và chia sẻ tài liệu lâu dài.
- Được ghi nhận thông qua điểm đóng góp, upvote hoặc huy hiệu.
- Tài liệu không bị trôi như trong group chat/Facebook.

### 6.3. Đối với cộng đồng sinh viên HUST

- Hình thành kho tài liệu tập trung theo môn học.
- Giảm phụ thuộc vào truyền miệng hoặc nguồn không chính thống.
- Tạo văn hóa chia sẻ tài liệu bền vững giữa các khóa.

---

## 6. Phạm vi MVP

### 7.1. In-scope

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

### 7.2. Out-of-scope cho MVP

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

### 8.1. Journey: Tìm và tải tài liệu

1. Người dùng truy cập trang chủ.
2. Người dùng nhập từ khóa hoặc chọn chuyên ngành/môn học.
3. Hệ thống hiển thị danh sách tài liệu phù hợp.
4. Người dùng lọc theo loại tài liệu, số upvote, ngày đăng, người đăng hoặc môn học.
5. Người dùng mở trang chi tiết tài liệu.
6. Người dùng xem metadata, preview, lượt tải, lượt xem, upvote/downvote, bình luận.
7. Người dùng quyết định tải tài liệu.
8. Sau khi dùng, người dùng có thể upvote/downvote hoặc để lại bình luận.

### 8.2. Journey: Upload tài liệu

1. Người dùng đăng nhập.
2. Người dùng bấm “Upload tài liệu”.
3. Người dùng chọn file từ máy.
4. Người dùng điền thông tin: tiêu đề, môn học, chuyên ngành, loại tài liệu, học kỳ/năm học, mô tả, tag.
5. Hệ thống validate file và thông tin bắt buộc.
6. Hệ thống lưu file vào local server storage và lưu metadata vào MongoDB.
7. Tài liệu được hiển thị ở trạng thái “public” hoặc “pending review” tùy cơ chế MVP.
8. Người dùng nhận điểm đóng góp cơ bản.

### 8.3. Journey: Đánh giá độ tin cậy

1. Người dùng mở chi tiết tài liệu.
2. Người dùng xem preview và thông tin người đăng.
3. Người dùng đọc bình luận từ cộng đồng.
4. Người dùng xem số upvote/downvote, số lượt tải, số lượt xem.
5. Người dùng quyết định tải hoặc bỏ qua.
6. Người dùng có thể upvote/downvote sau khi xem/tải.

---

## 8. Yêu cầu chức năng chi tiết

## FR-01. Đăng ký, đăng nhập, đăng xuất

### Mục tiêu

Cho phép người dùng có tài khoản để upload tài liệu, vote, bình luận, theo dõi điểm đóng góp và quản lý tài liệu đã đăng.

### Mô tả

Người dùng có thể đăng ký bằng email, username và password. Trong MVP, có thể chưa cần xác thực email thật. Tuy nhiên nên thiết kế database để sau này có thể thêm email verification.

### Trường dữ liệu

- Full name
- Username
- Email
- Password
- Role: `user`, `admin`
- Avatar URL, optional
- Contribution points
- Verified status, optional

### Acceptance criteria

- Người dùng có thể đăng ký tài khoản mới với email chưa tồn tại.
- Người dùng không thể đăng ký nếu email hoặc username đã tồn tại.
- Password được hash trước khi lưu vào database.
- Người dùng có thể đăng nhập bằng email/username và password.
- Sau khi đăng nhập, frontend lưu token để gọi API.
- Người dùng có thể đăng xuất.

### Priority

**P1 – Cần cho MVP**, vì upload, vote và comment cần định danh người dùng.

---

## FR-02. Upload tài liệu

### Mục tiêu

Cho phép sinh viên đóng góp tài liệu vào kho chung.

### Mô tả

Người dùng đăng nhập có thể upload file tài liệu học tập. File được lưu vào local server storage. Metadata được lưu vào MongoDB để phục vụ tìm kiếm, lọc và hiển thị.

### File type đề xuất cho MVP

- PDF
- DOC/DOCX
- PPT/PPTX
- XLS/XLSX
- ZIP, optional
- PNG/JPG, optional nếu tài liệu dạng ảnh

### Giới hạn MVP

- Dung lượng tối đa mỗi file: 20MB hoặc 50MB tùy cấu hình.
- Mỗi lần upload một file.
- Chưa cần upload nhiều file cùng lúc.

### Metadata bắt buộc

- Title
- Subject/Course (search;  danh sách Subject/Course sẵn có đi kèm với danh sách Major/Program lưu trong db)
- Major/Program (search/choose + others)
- Category
- Description ngắn
- File

### Metadata optional

- Semester
- Academic year
- Teacher name
- Tags
- Source note



### Category đề xuất

- Slide bài giảng
- Đề thi cũ
- Lời giải/tham khảo
- Note cá nhân
- Bài tập lớn/project mẫu
- Tài liệu tham khảo
- Lab/report
- Khác

### Acceptance criteria

- Người dùng đăng nhập có thể upload file hợp lệ.
- Hệ thống từ chối file quá dung lượng.
- Hệ thống từ chối định dạng file không hỗ trợ.
- Sau khi upload thành công, tài liệu xuất hiện trong danh sách tài liệu.
- Hệ thống lưu được metadata trong MongoDB.
- Hệ thống lưu được đường dẫn file trong database.
- Người upload nhận điểm đóng góp cơ bản.

### Priority

**P1 – Cần cho MVP**

---

## FR-03. Xem danh sách tài liệu / Danh sách Recommendation (cái này ở homepage)

### Mục tiêu

Giúp người dùng duyệt nhanh kho tài liệu và chọn tài liệu phù hợp và nhanh nhất óc thể.

### Mô tả

Trang danh sách hiển thị các tài liệu theo dạng card hoặc table. Mỗi item cần có đủ thông tin để người dùng đánh giá nhanh trước khi bấm vào chi tiết.\
Các card hiển thị ở trang chủ theo từng mục lớn: \
\*\*Continue reading, \*\*\*\*Recently viewed, \*\*, \*\*Trending in your courses/môn học (dựa vào thông tin chuyên ngành mà người dùng chọn lúc ban đầu \*\*

### Thông tin hiển thị trên card

- Tên tài liệu
- Môn học
- Chuyên ngành
- Loại tài liệu
- Người đăng
- Ngày đăng
- Số lượt xem
- Số lượt tải
- Số upvote/downvote hoặc điểm tin cậy
- Trạng thái verified nếu có

### Sắp xếp mặc định

- Mới nhất trước, hoặc
- Phổ biến nhất trước trong mùa thi

### Acceptance criteria

- Người dùng có thể xem danh sách tài liệu không cần đăng nhập.
- Danh sách có phân trang hoặc infinite scroll đơn giản.
- Tài liệu bị admin ẩn sẽ không hiển thị với user thường.
- Thông tin trên card hiển thị rõ và nhất quán.



### Priority

**P1 – Cần cho MVP**

---

## FR-04. Tìm kiếm tài liệu

### Mục tiêu

Giúp người dùng tìm đúng tài liệu trong thời gian ngắn.

### Mô tả

Người dùng có thể tìm kiếm tài liệu theo từ khóa. Từ khóa có thể match với title, description, subject, teacher name hoặc tags.

### Search field

- Search bar đặt ở trang chủ và trang danh sách.
- Placeholder ví dụ: “Tìm môn học, đề thi, slide, note...”

### Logic tìm kiếm MVP

Backend query bằng MongoDB text index hoặc regex có kiểm soát trên các field:

- title
- description
- subjectName
- tags

### Acceptance criteria

- Người dùng nhập từ khóa và nhận danh sách kết quả phù hợp.
- Nếu không có kết quả, hệ thống hiển thị empty state rõ ràng.
- Search có thể kết hợp với filter.
- Kết quả search phản hồi trong thời gian chấp nhận được với dữ liệu MVP.

### Priority

**P1 – Cần cho MVP**

---

## FR-05. Bộ lọc tài liệu

### Mục tiêu

Giúp người dùng sàng lọc tài liệu hiệu quả khi kho dữ liệu tăng lên.

### Mô tả

Từ feedback người dùng, cải thiện tìm kiếm/lọc là nhu cầu nổi bật. MVP cần có filter đủ dùng theo bối cảnh HUST.

### Filter cần có

- Chuyên ngành/program
- Môn học
- Loại tài liệu
- Học kỳ/năm học, optional
- Sắp xếp theo ngày đăng
- Sắp xếp theo số upvote
- Sắp xếp theo số lượt tải
- Sắp xếp theo người đăng, optional

### Filter nâng cao có thể để sau MVP

- Lọc theo giảng viên
- Lọc theo trạng thái verified
- Lọc theo khoảng thời gian upload
- Lọc theo file type

### Acceptance criteria

- Người dùng có thể lọc theo môn học và chuyên ngành.
- Người dùng có thể lọc theo loại tài liệu.
- Người dùng có thể sort theo mới nhất, nhiều upvote nhất, nhiều lượt tải nhất.
- Filter có thể dùng cùng search keyword.

### Priority

**P1 – Cần cho MVP**

---

## FR-06. Xem chi tiết tài liệu

### Mục tiêu

Cung cấp đủ thông tin để người dùng quyết định tài liệu có đáng tải hay không.

### Mô tả

Trang chi tiết tài liệu là nơi người dùng xem thông tin đầy đủ, preview, vote, bình luận và tải file.

### Nội dung cần hiển thị

- Title
- Description
- Subject
- Major/program
- Category
- Tags
- File type
- File size
- Upload date
- Uploader
- Download count
- View count
- Upvote/downvote count
- Verified badge (upload bởi người dùng có tích xanh)
- Preview area
- Comment area
- Related documents, optional sau MVP

### Acceptance criteria

- Người dùng có thể mở trang chi tiết từ danh sách tài liệu.
- View count tăng khi người dùng mở chi tiết.
- Tất cả metadata quan trọng hiển thị rõ.
- Có nút download.
- Có khu vực vote và comment.

### Priority

**P1 – Cần cho MVP**

---

## FR-07. Preview tài liệu

### Mục tiêu

Cho phép người dùng kiểm tra sơ bộ nội dung trước khi download, giảm tải nhầm tài liệu không phù hợp.

### Mô tả

MVP nên ưu tiên preview PDF trước. Với DOCX/PPTX/XLSX, có thể hiển thị thông báo “Preview chưa hỗ trợ, vui lòng tải xuống” hoặc convert sau MVP.

### Cách làm MVP đề xuất

- Với PDF: dùng iframe hoặc PDF viewer ở frontend.
- Với ảnh: hiển thị ảnh trực tiếp.
- Với file Office: chưa preview hoặc chỉ hiển thị metadata.

### Acceptance criteria

- PDF có thể xem trực tiếp trên trang chi tiết.
- Nếu file không hỗ trợ preview, hệ thống hiển thị thông báo rõ ràng.
- Preview không tự động download file.
- Người dùng có thể download sau khi xem preview.

### Priority

**P1 – Cần cho MVP**, vì 40% người dùng yêu cầu preview.

---

## FR-08. Download tài liệu

### Mục tiêu

Cho phép người dùng lấy tài liệu về máy để học tập.

### Mô tả

Người dùng có thể tải tài liệu từ trang chi tiết. MVP có thể cho phép download không cần đăng nhập, hoặc yêu cầu đăng nhập tùy mục tiêu tăng tài khoản.

### Đề xuất MVP

- Cho phép xem danh sách/chi tiết không cần đăng nhập.
- Yêu cầu đăng nhập khi download nếu muốn tracking và tính điểm.
- Nếu muốn friction thấp, có thể cho download không cần đăng nhập trong demo đầu tiên.

### Acceptance criteria

- Người dùng bấm nút download và nhận file đúng.
- Download count tăng sau khi tải thành công.
- File tải xuống giữ đúng tên hoặc có tên dễ hiểu.
- Nếu file không tồn tại trên local storage, hệ thống báo lỗi thân thiện.

### Priority

**P1 – Cần cho MVP**

---

## FR-09. Upvote/downvote tài liệu

### Mục tiêu

Tạo cơ chế cộng đồng để đánh giá độ hữu ích và độ tin cậy của tài liệu.

### Mô tả

Người dùng đăng nhập có thể upvote hoặc downvote một tài liệu. Mỗi người chỉ được có một trạng thái vote trên một tài liệu.

### Quy tắc

- Nếu chưa vote: có thể upvote hoặc downvote.
- Nếu đã upvote và bấm upvote lần nữa: hủy upvote.
- Nếu đã upvote và bấm downvote: chuyển từ upvote sang downvote.
- Một user không được vote nhiều lần cho cùng một tài liệu.

### Acceptance criteria

- Người dùng đăng nhập có thể vote.
- Người dùng chưa đăng nhập được yêu cầu đăng nhập khi vote.
- Hệ thống tính đúng tổng upvote/downvote.
- Vote state của user được hiển thị khi quay lại trang.
- Vote ảnh hưởng đến score/tín hiệu chất lượng của tài liệu.

### Priority

**P1 – Cần cho MVP**

---

## FR-10. Bình luận tài liệu

### Mục tiêu

Cho phép người dùng bổ sung nhận xét, xác nhận chất lượng hoặc cảnh báo tài liệu không phù hợp.

### Mô tả

Người dùng đăng nhập có thể bình luận dưới tài liệu. Bình luận giúp người khác biết tài liệu có sát môn học không, có lỗi không, có phù hợp ôn thi không.

### Comment content gợi ý

- “Tài liệu này đúng với đề cuối kỳ năm 2024.”
- “File này chỉ là slide phần đầu, chưa đủ chương 4–6.”
- “Dùng tốt cho môn Nhúng của thầy/cô X.”

### Acceptance criteria

- Người dùng đăng nhập có thể thêm bình luận.
- Bình luận hiển thị theo thời gian mới nhất hoặc cũ nhất.
- Người dùng có thể xóa bình luận của chính mình.
- Admin có thể xóa bình luận vi phạm.
- Bình luận rỗng hoặc quá dài bị từ chối.

### Priority

**P1 – Cần cho MVP**

---

## FR-11. Điểm đóng góp, điểm thưởng và đổi quà

### Mục tiêu

Khuyến khích người dùng upload và chia sẻ tài liệu lâu dài bằng cách ghi nhận đóng góp thông qua điểm thưởng. Người dùng có thể sử dụng điểm tích lũy để đổi lấy phần quà trong hệ thống, từ đó tăng động lực tham gia và duy trì hoạt động chia sẻ tài liệu.

### Mô tả

Trong khảo sát, hệ thống phần thưởng là một yếu tố hấp dẫn. Ở MVP, cơ chế điểm thưởng nên được triển khai ở mức vừa đủ: người dùng nhận điểm khi thực hiện các hành động có giá trị cho cộng đồng như upload tài liệu hợp lệ, nhận upvote từ người khác hoặc có tài liệu đạt mốc lượt tải nhất định.

Người dùng có thể truy cập trang “Đổi quà” để xem tổng điểm hiện có, danh sách phần quà có thể đổi, số điểm yêu cầu cho từng phần quà và lịch sử đổi quà của mình. Khi người dùng đổi quà thành công, hệ thống trừ điểm tương ứng và lưu lại giao dịch đổi điểm.

Trong giai đoạn MVP, quà tặng nên ưu tiên các loại dễ quản lý, không cần tích hợp thanh toán, vận chuyển hoặc bên thứ ba. Ví dụ: huy hiệu đặc biệt, khung avatar, quyền gắn nhãn nổi bật cho tài liệu, voucher nội bộ hoặc phần quà offline do admin xử lý thủ công.

### Cơ chế điểm MVP đề xuất

- Upload tài liệu hợp lệ: +10 điểm.
- Tài liệu nhận 1 upvote: +2 điểm cho người upload.
- Tài liệu đạt mốc 50 lượt tải: +20 điểm thưởng.
- Tài liệu bị downvote: chưa trừ điểm ở MVP, tránh gây tâm lý tiêu cực.
- Tài liệu bị admin xóa vì vi phạm: có thể thu hồi điểm đã cộng từ tài liệu đó.
- Người dùng đổi quà thành công: trừ số điểm tương ứng với phần quà.

### Trang đổi quà

Trang đổi quà cho phép người dùng xem và sử dụng điểm thưởng của mình.

Thông tin cần hiển thị:

- Tổng điểm hiện có của người dùng.
- Danh sách phần quà đang khả dụng.
- Tên phần quà.
- Mô tả phần quà.
- Số điểm cần để đổi.
- Số lượng quà còn lại, nếu có.
- Trạng thái phần quà: còn hàng, hết hàng, tạm ẩn.
- Nút “Đổi quà”.
- Lịch sử đổi quà của người dùng.

### Loại phần quà đề xuất cho MVP

- Huy hiệu đặc biệt hiển thị trên profile.
- Khung avatar hoặc badge trang trí.
- Quyền gắn nhãn “Featured” cho một tài liệu trong thời gian ngắn.
- Voucher nhỏ hoặc quà offline do admin cấu hình thủ công.
- Quyền ưu tiên xét verified contributor, nếu phù hợp.

### Quy tắc đổi quà

- Người dùng phải đăng nhập mới được đổi quà.
- Người dùng chỉ đổi được quà nếu số điểm hiện có lớn hơn hoặc bằng số điểm yêu cầu.
- Khi đổi quà thành công, hệ thống trừ điểm ngay lập tức.
- Mỗi giao dịch đổi quà phải được lưu lại trong lịch sử.
- Nếu phần quà có giới hạn số lượng, hệ thống phải kiểm tra số lượng còn lại trước khi cho đổi.
- Nếu quà đã hết hàng hoặc bị admin ẩn, người dùng không thể đổi.
- Với quà offline/voucher, hệ thống có thể tạo yêu cầu ở trạng thái `pending` để admin xử lý thủ công.
- Hệ thống không được trừ điểm hai lần cho cùng một yêu cầu đổi quà.

### Hiển thị

- Điểm đóng góp trên trang cá nhân.
- Điểm hiện có trên trang đổi quà.
- Top contributors ở trang chủ hoặc sidebar, optional.
- Badge “Verified contributor” hoặc “Top uploader”, bắt buộc cho MVP.
- Lịch sử cộng/trừ điểm cơ bản để người dùng biết điểm đến từ đâu và đã dùng vào việc gì.

### Acceptance criteria

- Điểm tăng khi upload tài liệu thành công.
- Điểm tăng khi tài liệu được upvote.
- Điểm tăng khi tài liệu đạt mốc lượt tải theo quy định.
- Điểm không bị cộng lặp sai khi một user đổi vote.
- Người dùng xem được tổng điểm hiện có của mình.
- Người dùng có thể truy cập trang đổi quà.
- Người dùng có thể xem danh sách phần quà đang khả dụng.
- Người dùng không thể đổi quà nếu không đủ điểm.
- Người dùng không thể đổi quà đã hết hàng hoặc bị ẩn.
- Khi đổi quà thành công, điểm của người dùng bị trừ đúng số điểm yêu cầu.
- Hệ thống tạo lịch sử giao dịch đổi quà sau mỗi lần đổi thành công.
- Người dùng có thể xem lịch sử đổi quà của mình.
- Admin có thể tạo, chỉnh sửa, ẩn/hiện và cập nhật số lượng phần quà.
- Admin có thể xem danh sách giao dịch đổi quà của người dùng.
- Hệ thống không được trừ điểm hai lần cho cùng một yêu cầu đổi quà.

### Priority

**P1 – Cần cho MVP** nếu điểm thưởng và đổi quà là điểm khác biệt chính của sản phẩm.

---

## FR-12. Trang cá nhân người dùng

### Mục tiêu

Cho phép người dùng xem tài liệu đã upload và điểm đóng góp.

### Mô tả

Trang cá nhân ở MVP cần đơn giản, không cần mạng xã hội phức tạp.

### Nội dung

- Tên người dùng
- Avatar optional
- Contribution points
- Số tài liệu đã upload
- Danh sách tài liệu đã upload
- Tổng lượt tải/upvote từ tài liệu của mình
- Verified badge nếu có

### Acceptance criteria

- Người dùng đăng nhập có thể xem trang cá nhân của mình.
- Người dùng có thể xem danh sách tài liệu mình đã upload.
- Người dùng có thể mở chi tiết tài liệu từ trang cá nhân.

### Priority

**P2 – Nên có nếu đủ thời gian**

---

## FR-13. Admin quản lý tài liệu

### Mục tiêu

Đảm bảo hệ thống có cơ chế xử lý tài liệu sai, trùng lặp hoặc vi phạm.

### Mô tả

Admin có thể truy cập trang quản trị cơ bản để xem và quản lý tài liệu.

### Chức năng admin MVP

- Xem danh sách tất cả tài liệu.
- Ẩn/hiện tài liệu.
- Xóa tài liệu.
- Gắn trạng thái verified cho tài liệu.
- Gắn verified cho user, optional.
- Quản lý danh mục môn học/chuyên ngành, optional.

### Acceptance criteria

- Chỉ admin truy cập được trang quản trị.
- Admin có thể ẩn tài liệu khỏi danh sách public.
- Admin có thể xóa tài liệu và file liên quan.
- Người dùng thường không gọi được API admin.

### Priority

**P2 – Nên có trong MVP nếu nhóm đủ thời gian**, đặc biệt nếu demo cần thể hiện độ tin cậy.

---

## 9. Danh mục dữ liệu đề xuất

## 10.1. User

```js
{
  _id: ObjectId,
  fullName: String,
  username: String,
  email: String,
  passwordHash: String,
  role: 'user' | 'admin',
  avatarUrl: String,
  contributionPoints: Number,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 10.2. Document

```js
{
  _id: ObjectId,
  title: String,
  description: String,
  subjectId: ObjectId,
  majorId: ObjectId,
  category: String,
  tags: [String],
  teacherName: String,
  semester: String,
  academicYear: String,
  uploaderId: ObjectId,
  file: {
    originalName: String,
    storedName: String,
    mimeType: String,
    size: Number,
    path: String,
    extension: String
  },
  status: 'public' | 'pending' | 'hidden' | 'deleted',
  isVerified: Boolean,
  viewCount: Number,
  downloadCount: Number,
  upvoteCount: Number,
  downvoteCount: Number,
  score: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 10.3. Subject

```js
{
  _id: ObjectId,
  name: String,
  code: String,
  majorIds: [ObjectId],
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 10.4. Major

```js
{
  _id: ObjectId,
  name: String,
  code: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 10.5. Vote

```js
{
  _id: ObjectId,
  userId: ObjectId,
  documentId: ObjectId,
  value: 1 | -1,
  createdAt: Date,
  updatedAt: Date
}
```

Unique index:

```js
{ userId: 1, documentId: 1 }
```

## 10.6. Comment

```js
{
  _id: ObjectId,
  userId: ObjectId,
  documentId: ObjectId,
  content: String,
  status: 'public' | 'hidden' | 'deleted',
  createdAt: Date,
  updatedAt: Date
}
```

## 10.7. PointTransaction

```js
{
  _id: ObjectId,
  userId: ObjectId,
  documentId: ObjectId,
  rewardRedemptionId: ObjectId,
  type: 
    'UPLOAD_DOCUMENT' 
    | 'DOCUMENT_UPVOTED' 
    | 'DOCUMENT_DOWNLOAD_MILESTONE'
    | 'REDEEM_REWARD'
    | 'ADMIN_ADJUSTMENT',
  points: Number,
  reason: String,
  createdAt: Date
}
```

Trong đó, giao dịch đổi quà sẽ có `points` là số âm, ví dụ:

```js
{
  type: 'REDEEM_REWARD',
  points: -100,
  reason: 'Đổi quà: Featured Contributor Badge'
}
```

## 10.8. RewardItem

```js
{
  _id: ObjectId,
  name: String,
  description: String,
  requiredPoints: Number,
  quantity: Number,
  type: 'BADGE' | 'AVATAR_FRAME' | 'FEATURED_DOCUMENT' | 'VOUCHER' | 'OFFLINE_GIFT' | 'OTHER',
  status: 'active' | 'inactive' | 'out_of_stock',
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 10.9. RewardRedemption

```js
{
  _id: ObjectId,
  userId: ObjectId,
  rewardItemId: ObjectId,
  pointsUsed: Number,
  status: 'pending' | 'completed' | 'cancelled',
  note: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 10. API requirements đề xuất

## 11.1. Auth APIs

### POST `/api/auth/register`

Đăng ký tài khoản.

Request:

```json
{
  "fullName": "Nguyen Van A",
  "username": "vana",
  "email": "vana@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "Registered successfully",
  "user": {
    "id": "...",
    "fullName": "Nguyen Van A",
    "username": "vana",
    "email": "vana@example.com"
  }
}
```

### POST `/api/auth/login`

Đăng nhập.

Request:

```json
{
  "emailOrUsername": "vana@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "accessToken": "jwt-token",
  "user": {
    "id": "...",
    "username": "vana",
    "role": "user"
  }
}
```

---

## 11.2. Document APIs

### GET `/api/documents`

Lấy danh sách tài liệu.

Query params:

- `q`
- `subjectId`
- `majorId`
- `category`
- `tag`
- `sort`
- `page`
- `limit`

Sort values:

- `latest`
- `mostDownloaded`
- `mostUpvoted`
- `highestScore`

### GET `/api/documents/:id`

Lấy chi tiết tài liệu và tăng view count.

### POST `/api/documents`

Upload tài liệu.\
Content type: `multipart/form-data`

Fields:

- `file`
- `title`
- `description`
- `subjectId`
- `majorId`
- `category`
- `tags`
- `teacherName`
- `semester`
- `academicYear`

### GET `/api/documents/:id/download`

Download file và tăng download count.

### GET `/api/documents/:id/preview`

Trả file để preview nếu định dạng hỗ trợ.

### PATCH `/api/documents/:id`

Người upload hoặc admin chỉnh sửa metadata.

### DELETE `/api/documents/:id`

Người upload hoặc admin xóa/ẩn tài liệu, tùy quyền.

---

## 11.3. Vote APIs

### POST `/api/documents/:id/vote`

Request:

```json
{
  "value": 1
}
```

Hoặc:

```json
{
  "value": -1
}
```

Response:

```json
{
  "upvoteCount": 12,
  "downvoteCount": 2,
  "myVote": 1
}
```

### DELETE `/api/documents/:id/vote`

Hủy vote hiện tại của user.

---

## 11.4. Comment APIs

### GET `/api/documents/:id/comments`

Lấy danh sách bình luận.

### POST `/api/documents/:id/comments`

Tạo bình luận.

Request:

```json
{
  "content": "Tài liệu này khá sát đề cuối kỳ 2024."
}
```

### DELETE `/api/comments/:commentId`

Xóa bình luận của chính mình hoặc admin xóa bình luận vi phạm.

---

## 11.5. User APIs

### GET `/api/users/me`

Lấy thông tin cá nhân.

### GET `/api/users/me/documents`

Lấy danh sách tài liệu mình đã upload.

### GET `/api/users/:id`

Xem profile public của user.

---

## 11.6. Reward APIs

### GET `/api/rewards`

Lấy danh sách phần quà đang khả dụng.

### GET `/api/rewards/me/redemptions`

Lấy lịch sử đổi quà của người dùng hiện tại.

### POST `/api/rewards/:rewardId/redeem`

Đổi điểm lấy quà.

Request:

```json
{
  "note": "Tôi muốn dùng badge này cho tài khoản của mình"
}
```

Response:

```json
{
  "message": "Redeemed successfully",
  "remainingPoints": 120,
  "redemption": {
    "id": "...",
    "rewardName": "Featured Contributor Badge",
    "pointsUsed": 100,
    "status": "completed"
  }
}
```

---

## 11.7. Admin APIs

### GET `/api/admin/documents`

Lấy tất cả tài liệu, bao gồm pending/hidden.

### PATCH `/api/admin/documents/:id/status`

Request:

```json
{
  "status": "hidden"
}
```

### PATCH `/api/admin/documents/:id/verify`

Request:

```json
{
  "isVerified": true
}
```

### PATCH `/api/admin/users/:id/verify`

Gắn verified cho user.

### POST `/api/admin/rewards`

Tạo phần quà mới.

### GET `/api/admin/rewards`

Xem danh sách tất cả phần quà, bao gồm phần quà đang ẩn hoặc hết hàng.

### PATCH `/api/admin/rewards/:id`

Cập nhật thông tin phần quà, số điểm yêu cầu, số lượng hoặc trạng thái.

### DELETE `/api/admin/rewards/:id`

Xóa hoặc vô hiệu hóa phần quà.

### GET `/api/admin/reward-redemptions`

Xem danh sách giao dịch đổi quà của người dùng.

### PATCH `/api/admin/reward-redemptions/:id/status`

Cập nhật trạng thái xử lý giao dịch đổi quà, ví dụ `pending`, `completed`, `cancelled`.

---

## 11. Frontend pages đề xuất

## 12.1. Public pages

### Home page

Mục tiêu:

- Giải thích ngắn gọn giá trị sản phẩm.
- Cho phép search nhanh.
- Hiển thị tài liệu nổi bật/mới nhất.
- Hiển thị top contributors nếu có.

Sections:

- Hero: “Tìm tài liệu HUST nhanh hơn, đáng tin hơn”
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

## 12.2. Authenticated pages

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

## 12.3. Admin pages

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

---

## 12. UI/UX requirements

### 13.1. Nguyên tắc thiết kế

- Ưu tiên thao tác nhanh trong mùa thi.
- Search bar phải nổi bật.
- Thông tin độ tin cậy phải nhìn thấy ngay trên card và trang chi tiết.
- Upload form không được quá dài.
- Preview phải nằm trước nút download hoặc gần nút download.
- Trạng thái empty/error/loading phải rõ ràng.

### 13.2. Document card nên có

- Tiêu đề rõ ràng
- Môn học/chuyên ngành
- Loại tài liệu
- Badge file type
- Upvote/downvote
- Download count
- Upload date
- Uploader
- Verified badge nếu có

### 13.3. Empty states

Ví dụ:

- “Chưa có tài liệu nào cho môn này. Hãy là người đầu tiên upload.”
- “Không tìm thấy kết quả phù hợp. Thử đổi từ khóa hoặc bỏ bớt bộ lọc.”

### 13.4. Error states

Ví dụ:

- “File vượt quá dung lượng cho phép.”
- “Định dạng file chưa được hỗ trợ.”
- “Không thể tải tài liệu. File có thể đã bị xóa.”

---

## 13. Non-functional requirements

## 14.1. Performance

- Trang danh sách tài liệu phản hồi dưới 2 giây với dữ liệu MVP.
- Search/filter phản hồi dưới 2 giây với tối đa vài nghìn documents.
- Upload file 20–50MB hoạt động ổn định trong môi trường local/dev.
- Preview PDF không làm treo UI.

## 14.2. Security

- Password phải được hash bằng bcrypt hoặc thư viện tương đương.
- API upload cần kiểm tra MIME type và extension.
- Không cho upload file thực thi như `.exe`, `.sh`, `.bat`.
- File lưu local cần đổi tên để tránh trùng và tránh path traversal.
- API admin cần middleware kiểm tra role.
- Cần giới hạn dung lượng file.
- Cần sanitize input cơ bản để tránh XSS trong comment/description.

## 14.3. Reliability

- Nếu lưu metadata thành công nhưng lưu file thất bại, cần rollback hoặc báo lỗi rõ ràng.
- Nếu xóa tài liệu, cần xử lý cả metadata và file vật lý.
- Nếu file vật lý bị mất, API download cần trả lỗi thân thiện.

## 14.4. Maintainability

- Backend nên chia module rõ ràng: auth, users, documents, votes, comments, admin, subjects.
- Không hard-code danh mục môn học trong frontend nếu có thể lưu trong database.
- Tách service xử lý file storage để sau này chuyển từ local sang cloud.

---

## 14. Kiến trúc hệ thống đề xuất

## 15.1. High-level architecture

```text
React Frontend
      |
      | REST API
      v
Express.js Backend
      |
      | metadata
      v
MongoDB
      |
      | file path
      v
Local File Storage (/uploads)
```

## 15.2. Backend folder structure đề xuất

```text
server/
  src/
    config/
      db.js
      env.js
      storage.js
    modules/
      auth/
        auth.controller.js
        auth.service.js
        auth.routes.js
        auth.middleware.js
      users/
        user.model.js
        user.controller.js
        user.service.js
        user.routes.js
      documents/
        document.model.js
        document.controller.js
        document.service.js
        document.routes.js
        document.validation.js
      votes/
        vote.model.js
        vote.controller.js
        vote.service.js
        vote.routes.js
      comments/
        comment.model.js
        comment.controller.js
        comment.service.js
        comment.routes.js
      subjects/
        subject.model.js
        subject.controller.js
        subject.service.js
        subject.routes.js
      admin/
        admin.routes.js
        admin.controller.js
    middlewares/
      error.middleware.js
      upload.middleware.js
      role.middleware.js
    utils/
      file.util.js
      pagination.util.js
    app.js
    server.js
  uploads/
```

## 15.3. Frontend folder structure đề xuất

```text
client/
  src/
    api/
      axiosClient.js
      authApi.js
      documentApi.js
      commentApi.js
      voteApi.js
    components/
      common/
      document/
      layout/
      form/
    pages/
      HomePage.jsx
      DocumentsPage.jsx
      DocumentDetailPage.jsx
      UploadPage.jsx
      LoginPage.jsx
      RegisterPage.jsx
      ProfilePage.jsx
      AdminDocumentsPage.jsx
    hooks/
      useAuth.js
      useDocuments.js
    contexts/
      AuthContext.jsx
    routes/
      AppRoutes.jsx
    utils/
      formatFileSize.js
      formatDate.js
```

---

## 15. Local storage design cho MVP

## 16.1. Cách lưu file

Khi upload, backend dùng `multer` để nhận file và lưu vào thư mục local:

```text
server/uploads/documents/{yyyy}/{mm}/{generated-file-name}
```

Ví dụ:

```text
server/uploads/documents/2026/05/1715840000-abc123-machine-learning-final.pdf
```

## 16.2. Nguyên tắc đặt tên file

Không lưu file bằng tên gốc hoàn toàn vì có thể trùng hoặc chứa ký tự không an toàn.

Tên lưu trữ nên gồm:

- timestamp
- random string/uuid
- slug ngắn từ tên gốc
- extension

## 16.3. Metadata lưu trong MongoDB

Database chỉ lưu:

- originalName
- storedName
- path
- mimeType
- size
- extension

## 16.4. Chuẩn bị để migrate lên cloud

Nên tạo một lớp `StorageService`:

```js
class StorageService {
  async saveFile(file) {}
  async deleteFile(path) {}
  getFileUrl(path) {}
}
```

Ở MVP, `LocalStorageService` implement logic lưu local. Sau này có thể thay bằng `S3StorageService` mà không cần sửa toàn bộ business logic.

---

## 16. Ranking và scoring tài liệu

## 17.1. Mục tiêu

Giúp tài liệu tốt nổi bật hơn khi người dùng tìm kiếm.

## 17.2. Score MVP đơn giản

```text
score = upvoteCount * 2 + downloadCount * 0.5 + viewCount * 0.1 - downvoteCount * 1.5
```

Có thể tính realtime hoặc lưu trong field `score` và cập nhật khi có vote/download/view.

## 17.3. Lưu ý

Không nên phụ thuộc tuyệt đối vào viewCount vì tài liệu clickbait có thể nhiều lượt xem nhưng không hữu ích. Upvote và comment xác nhận chất lượng nên có trọng số cao hơn.

---

## 17. Moderation và trust design

## 18.1. Vấn đề

Người dùng sợ học sai kiến thức từ nguồn không chính thống. Vì vậy, hệ thống cần tín hiệu tin cậy.

## 18.2. Trust signals trong MVP

- Upvote/downvote
- Comment
- Download count
- Uploader name
- Upload date
- Verified document badge
- Verified contributor badge, optional

## 18.3. Verified badge đề xuất

### Verified document

Admin đánh dấu cho tài liệu đã kiểm tra sơ bộ.

### Verified contributor

User đạt điều kiện nhất định thì có badge.

Điều kiện MVP có thể là:

- Có ít nhất 5 tài liệu public.
- Tổng upvote từ tài liệu >= 20.
- Không có tài liệu bị admin ẩn/xóa vì vi phạm.

Trong MVP đầu tiên, verified contributor có thể để admin gắn thủ công để giảm độ phức tạp.

---

## 18. Metrics đo thành công

## 19.1. Activation metrics

- Số user đăng ký.
- Tỷ lệ user upload ít nhất 1 tài liệu.
- Tỷ lệ user download ít nhất 1 tài liệu.

## 19.2. Content metrics

- Số tài liệu upload.
- Số môn học có ít nhất 1 tài liệu.
- Số tài liệu có đầy đủ metadata.
- Tỷ lệ tài liệu được preview/download.

## 19.3. Engagement metrics

- Số lượt search mỗi user.
- Số lượt download.
- Số lượt upvote/downvote.
- Số bình luận.
- Số user quay lại trước kỳ thi.

## 19.4. Quality metrics

- Tỷ lệ tài liệu có upvote dương.
- Tỷ lệ tài liệu bị report/ẩn.
- Trung bình thời gian từ search đến download.
- Tỷ lệ search không có kết quả.

---

## 19. MVP priority matrix

| Nhóm chức năng                        | Priority | Lý do                                      |
| ------------------------------------- | -------- | ------------------------------------------ |
| Upload tài liệu                       | P1       | Cốt lõi của hệ thống chia sẻ               |
| Xem danh sách tài liệu                | P1       | Cần để duyệt tài liệu                      |
| Search tài liệu                       | P1       | Người dùng ưu tiên tìm nhanh               |
| Filter theo môn/chuyên ngành/category | P1       | Giải quyết vấn đề tài liệu phân tán        |
| Xem chi tiết tài liệu                 | P1       | Cần để ra quyết định tải                   |
| Preview PDF                           | P1       | Feedback người dùng yêu cầu mạnh           |
| Download tài liệu                     | P1       | Giá trị sử dụng trực tiếp                  |
| Upvote/downvote                       | P1       | Tăng độ tin cậy                            |
| Comment                               | P1       | Tăng kiểm chứng cộng đồng                  |
| Auth                                  | P1       | Cần cho upload/vote/comment                |
| Điểm đóng góp                         | P1       | Tạo động lực upload tài liệu              |
| Đổi điểm lấy quà                      | P1       | Là điểm khác biệt và tăng động lực đóng góp |
| Profile cá nhân                       | P2       | Hỗ trợ retention, không phải core search   |
| Admin moderation                      | P2       | Quan trọng cho trust nhưng có thể tối giản |
| Verified badge tự động                | P3       | Nên làm sau MVP                            |
| AI summary/quiz                       | P3       | Không cần cho MVP                          |
| Mobile app                            | P3       | Web responsive trước                       |

---

## 20. Release plan đề xuất

## Phase 0 – Setup nền tảng

Deliverables:

- Khởi tạo MERN project.
- Kết nối MongoDB.
- Cấu hình Express server.
- Cấu hình React routing.
- Cấu hình local upload folder.
- Thiết kế schema User, Document, Subject, Major.

## Phase 1 – Core document flow

Deliverables:

- Upload tài liệu.
- Lưu file local.
- Lưu metadata vào MongoDB.
- Xem danh sách tài liệu.
- Xem chi tiết tài liệu.
- Download tài liệu.

Đây là phase quan trọng nhất. Sau phase này, sản phẩm đã có luồng chia sẻ tài liệu cơ bản.

## Phase 2 – Search, filter, preview

Deliverables:

- Search keyword.
- Filter theo môn/chuyên ngành/category.
- Sort theo mới nhất, upvote, download.
- Preview PDF.
- Empty/loading/error states.

Phase này giải quyết trực tiếp feedback: cần tìm nhanh, lọc tốt, xem trước trước khi tải.

## Phase 3 – Trust & community

Deliverables:

- Upvote/downvote.
- Comment.
- Score tài liệu.
- Contribution points cơ bản.
- Profile người dùng cơ bản.

Phase này giải quyết nhu cầu tin cậy và khuyến khích chia sẻ bền vững. Trong phase này cũng nên triển khai trang đổi điểm lấy quà ở mức MVP, bao gồm danh sách quà, đổi quà, trừ điểm và lịch sử đổi quà.

## Phase 4 – Admin & polish

Deliverables:

- Admin document management.
- Ẩn/xóa/verify tài liệu.
- Tối ưu UI.
- Responsive layout.
- Seed dữ liệu demo.
- Test trước demo.

---

## 21. Risks và hướng xử lý

## 22.1. Rủi ro: Không đủ tài liệu ban đầu

Từ feedback, người dùng đánh giá điểm yếu lớn là số lượng tài liệu còn ít. Nếu kho tài liệu trống, sản phẩm khó thuyết phục.

Hướng xử lý:

- Seed trước tài liệu mẫu cho các môn phổ biến.
- Tập trung vào 5–10 môn có nhu cầu cao.
- Khuyến khích nhóm/khóa upload tài liệu trước khi demo.
- Hiển thị empty state kêu gọi upload.

## 22.2. Rủi ro: Tài liệu không đáng tin

Hướng xử lý:

- Hiển thị upvote/downvote/comment rõ ràng.
- Có admin verify thủ công.
- Cho phép người dùng báo cáo tài liệu, optional.

## 22.3. Rủi ro: Upload file gây lỗi hoặc mất file

Hướng xử lý:

- Validate file type và size.
- Lưu file bằng generated filename.
- Kiểm tra file tồn tại trước khi download.
- Tách StorageService để dễ thay thế.

## 22.4. Rủi ro: Scope quá lớn

Hướng xử lý:

- Không làm AI, premium, chat, recommendation trong MVP.
- Ưu tiên document flow trước.
- Điểm thưởng chỉ làm ở mức cộng điểm cơ bản.

---

## 22. Definition of Done cho MVP

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

## 23. Demo scenario đề xuất

### Scenario 1: Người dùng tìm tài liệu ôn thi

1. Truy cập trang chủ.
2. Search “Nhúng” hoặc “Android”.
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
5. Bấm “Đổi quà”.
6. Hệ thống trừ điểm và tạo lịch sử đổi quà.
7. Người dùng xem trạng thái giao dịch đổi quà trong lịch sử.

### Scenario 4: Admin kiểm duyệt tài liệu

1. Admin đăng nhập.
2. Vào trang quản lý tài liệu.
3. Xem tài liệu mới upload.
4. Gắn verified hoặc ẩn tài liệu.
5. Kiểm tra trạng thái hiển thị ở trang public.

---

## 24. Kết luận định hướng sản phẩm

Sản phẩm nên được định vị là **kho tài liệu học tập tập trung, đáng tin và tối ưu cho sinh viên HUST**, thay vì chỉ là nơi upload/download file đơn thuần. Điểm khác biệt quan trọng không nằm ở số lượng tài liệu ngay từ đầu, mà ở việc tài liệu được tổ chức theo môn học/chuyên ngành HUST, có preview trước khi tải, có tín hiệu đánh giá từ cộng đồng và có cơ chế khuyến khích sinh viên đóng góp.

Trong MVP, nhóm nên tập trung vào luồng cốt lõi: **upload → tìm kiếm/lọc → xem chi tiết/preview → download → đánh giá/bình luận → tích điểm đóng góp → đổi điểm lấy quà**. Các tính năng nâng cao như AI summary, quiz, recommendation, premium hoặc mobile app nên để sau khi MVP chứng minh được nhu cầu sử dụng thật.

