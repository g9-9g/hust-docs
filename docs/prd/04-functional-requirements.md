# 04. Yêu cầu chức năng chi tiết (Chương 8 — FR-01 đến FR-13)

## FR-01. Đăng ký, đăng nhập, đăng xuất

### Mục tiêu

Cho phép người dùng có tài khoản để upload tài liệu, vote, bình luận, theo dõi điểm đóng góp và quản lý tài liệu đã đăng.

### Mô tả

Người dùng có thể đăng ký bằng email, username và password. Trong MVP, có thể chưa cần xác thực email thật. Tuy nhiên nên thiết kế database để sau này có thể thêm email verification.

Sau khi đăng ký thành công, người dùng được điều hướng sang luồng **Onboarding** ([FR-14](#fr-14-onboarding-chọn-chuyên-ngành-và-môn-học-quan-tâm)) để chọn chuyên ngành và môn học quan tâm. Bước này phục vụ cá nhân hóa homepage (FR-03).

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
Các card hiển thị ở trang chủ theo từng mục lớn: \
**Continue reading, **Recently viewed, **, **Trending in your courses/môn học (dựa vào thông tin chuyên ngành mà người dùng chọn lúc ban đầu **

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
- Placeholder ví dụ: "Tìm môn học, đề thi, slide, note..."

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

MVP nên ưu tiên preview PDF trước. Với DOCX/PPTX/XLSX, có thể hiển thị thông báo "Preview chưa hỗ trợ, vui lòng tải xuống" hoặc convert sau MVP.

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

- "Tài liệu này đúng với đề cuối kỳ năm 2024."
- "File này chỉ là slide phần đầu, chưa đủ chương 4–6."
- "Dùng tốt cho môn Nhúng của thầy/cô X."

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

Người dùng có thể truy cập trang "Đổi quà" để xem tổng điểm hiện có, danh sách phần quà có thể đổi, số điểm yêu cầu cho từng phần quà và lịch sử đổi quà của mình. Khi người dùng đổi quà thành công, hệ thống trừ điểm tương ứng và lưu lại giao dịch đổi điểm.

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
- Nút "Đổi quà".
- Lịch sử đổi quà của người dùng.

### Loại phần quà đề xuất cho MVP

- Huy hiệu đặc biệt hiển thị trên profile.
- Khung avatar hoặc badge trang trí.
- Quyền gắn nhãn "Featured" cho một tài liệu trong thời gian ngắn.
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
- Badge "Verified contributor" hoặc "Top uploader", bắt buộc cho MVP.
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

Admin có thể truy cập trang quản trị cơ bản để xem và quản lý tài liệu. Trang quản trị này phối hợp với hai luồng riêng:

- **Pending review queue** ([FR-16](#fr-16-quy-trình-duyệt-tài-liệu-pending-review)) cho tài liệu cần duyệt trước khi public.
- **Report inbox** ([FR-15](#fr-15-báo-cáo-flag-tài-liệu-và-bình-luận)) cho tài liệu/bình luận do người dùng báo cáo.

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

## FR-14. Onboarding: chọn chuyên ngành và môn học quan tâm

### Mục tiêu

Thu thập thông tin chuyên ngành và môn học quan tâm của sinh viên ngay sau khi đăng ký, làm dữ liệu đầu vào cho cá nhân hóa homepage ("Trending in your courses", gợi ý tài liệu — xem FR-03) và bộ lọc mặc định.

### Mô tả

Sau khi đăng ký thành công, người dùng được tự động điều hướng tới trang Onboarding gồm các bước đơn giản:

1. **Bước 1 – Chọn Major chính (bắt buộc):** một chuyên ngành/program, lấy từ danh sách `Major` trong database. Cho phép tìm kiếm.
2. **Bước 2 – Chọn môn học quan tâm (optional):** chọn 0..N subject từ danh sách subject thuộc Major đã chọn (có nút "Bỏ qua").
3. **Bước 3 – Xác nhận:** hoàn tất, điều hướng về trang chủ.

Người dùng có quyền bỏ qua bước 1 (chọn "Tôi sẽ chọn sau"). Trong trường hợp đó:

- Homepage hiển thị banner nhắc nhở hoàn thành onboarding.
- Các section cá nhân hóa ở FR-03 ("Trending in your courses") sẽ ẩn hoặc hiển thị tài liệu phổ biến toàn hệ thống thay thế.

Người dùng có thể quay lại sửa lựa chọn này bất cứ lúc nào từ trang cá nhân (FR-12).

### Trường dữ liệu (beta, sẽ tinh chỉnh ở schema)

Mở rộng `User`:

- `primaryMajorId`: ObjectId — chuyên ngành chính.
- `interestedSubjectIds`: [ObjectId] — danh sách môn học quan tâm.
- `onboardingCompletedAt`: Date | null — null nếu chưa hoàn tất.

### Acceptance criteria

- Người dùng mới sau khi đăng ký được điều hướng đến trang Onboarding, không phải trang chủ.
- Người dùng có thể tìm kiếm và chọn 1 Major từ danh sách database.
- Danh sách Subject ở bước 2 được lọc theo Major đã chọn.
- Người dùng có thể bỏ qua onboarding và đi thẳng đến trang chủ.
- Khi onboarding chưa hoàn tất, homepage hiển thị nhắc nhở.
- Khi onboarding hoàn tất, `User.onboardingCompletedAt` được set và FR-03 dùng `primaryMajorId` + `interestedSubjectIds` để cá nhân hóa.
- Người dùng có thể vào trang cá nhân để sửa `primaryMajorId` và `interestedSubjectIds`.
- Người dùng cũ trước thời điểm thêm tính năng này (nếu có) được prompt onboarding lần đăng nhập kế tiếp.

### Priority

**P1 – Cần cho MVP**, vì FR-03 phụ thuộc trực tiếp vào dữ liệu này; nếu thiếu, các section "Trending in your courses" không có dữ liệu để hiển thị.

---

## FR-15. Báo cáo (flag) tài liệu và bình luận

### Mục tiêu

Trao quyền cộng đồng giúp phát hiện sớm nội dung sai phạm (spam, sai kiến thức, vi phạm bản quyền, không phù hợp), giảm phụ thuộc vào admin chủ động đi tìm tài liệu xấu — đồng thời tạo trust signal định lượng (số report) để hệ thống tự bảo vệ.

### Mô tả

Người dùng đăng nhập có thể báo cáo:

- **Tài liệu** từ trang chi tiết (FR-06): nút "Báo cáo tài liệu" mở modal chọn lý do + ghi chú.
- **Bình luận** từ danh sách comment (FR-10): biểu tượng cờ cạnh mỗi comment.

Hệ thống ghi nhận report, hiển thị toast xác nhận, và đẩy vào **Report inbox** của admin.

### Lý do báo cáo (enum)

- `SPAM` – nội dung quảng cáo, rác.
- `COPYRIGHT` – vi phạm bản quyền (tài liệu nội bộ giảng viên, sách bản quyền…).
- `INCORRECT_CONTENT` – nội dung sai, sai đáp án, sai chương trình.
- `OFF_TOPIC` – không liên quan môn học khai báo.
- `INAPPROPRIATE` – ngôn từ phản cảm, xúc phạm (đặc biệt áp dụng cho comment).
- `OTHER` – kèm note bắt buộc.

### Quy tắc nghiệp vụ

- 1 user chỉ tạo được **1 report active** trên cùng 1 target (tài liệu hoặc comment). Nếu báo cáo lại, hệ thống cập nhật lý do thay vì tạo bản ghi mới.
- Người dùng **không thể** báo cáo tài liệu/comment do chính mình tạo.
- Khi 1 target đạt ngưỡng **≥ 5 report distinct trong 24h**:
  - Nếu là tài liệu: tự động chuyển `status = 'pending'` (đẩy vào pending queue — FR-16) và ẩn khỏi danh sách public, kèm `autoFlaggedAt`.
  - Nếu là comment: tự động `status = 'hidden'` chờ admin duyệt.
  - Thông báo uploader/author lý do tạm ẩn.
- Khi admin giải quyết:
  - `resolved` (đồng ý): áp dụng action tương ứng (xóa, ẩn, gỡ verified, cảnh cáo user…).
  - `rejected` (từ chối): trả về trạng thái public; mọi report liên quan đóng kèm reason "false positive".
- Người dùng lạm dụng báo cáo (vd: ≥10 report bị reject trong 30 ngày) bị admin có thể vô hiệu hóa quyền report (cờ `canReport = false`).

### Trường dữ liệu (beta)

`Report`:

- `_id`, `reporterId`
- `targetType`: `'DOCUMENT' | 'COMMENT'`
- `targetId`: ObjectId
- `reason`: enum như trên
- `note`: String (bắt buộc nếu `reason = OTHER`)
- `status`: `'open' | 'reviewing' | 'resolved' | 'rejected'`
- `resolvedBy`: ObjectId admin, nullable
- `resolvedAt`: Date, nullable
- `resolution`: String (ghi chú khi đóng)
- `createdAt`, `updatedAt`

Unique index: `{ reporterId: 1, targetType: 1, targetId: 1 }` (1 report active / user / target).

### Acceptance criteria

- Người dùng đăng nhập có thể báo cáo tài liệu từ trang chi tiết và bình luận từ section comment.
- Modal báo cáo bắt buộc chọn lý do; nếu chọn `OTHER` thì note bắt buộc.
- 1 user chỉ có 1 report active trên 1 target — báo cáo lại sẽ cập nhật, không tạo bản ghi mới.
- Người dùng không báo cáo được nội dung của chính mình.
- Khi target đạt ngưỡng ≥5 report distinct/24h, hệ thống tự chuyển sang pending (tài liệu) hoặc hidden (comment).
- Admin có inbox xem danh sách report sắp xếp theo thời gian và độ ưu tiên (auto-flagged lên trước).
- Admin có thể mark `resolved` hoặc `rejected` kèm ghi chú; uploader/author nhận được thông báo kết quả.
- Người dùng báo cáo nhận xác nhận "Báo cáo đã được ghi nhận", không thấy được kết quả xử lý cụ thể (để tránh trả thù).
- Toàn bộ thao tác báo cáo chỉ truy cập được khi đã đăng nhập; user chưa đăng nhập bấm nút sẽ được prompt đăng nhập.

### Priority

**P1 – Cần cho MVP.** Đây là trust signal cốt lõi và là cơ chế phòng vệ tối thiểu cho hệ thống nội dung công khai; thiếu nó, admin phải tự đi tìm vi phạm — không scale.

---

## FR-16. Quy trình duyệt tài liệu (Pending review)

### Mục tiêu

Đảm bảo tài liệu có rủi ro (uploader mới, hoặc bị cộng đồng flag nhiều) được admin xem qua trước khi xuất hiện công khai, vừa giảm rác vừa tạo trust ban đầu cho người dùng tìm tài liệu.

### Mô tả

Một tài liệu sau upload (FR-02) sẽ được hệ thống đánh giá tự động và rơi vào một trong hai trạng thái:

- **`public` (mặc định):** xuất hiện ngay trên danh sách công khai. Áp dụng cho uploader đã đủ tin cậy.
- **`pending`:** ẩn khỏi danh sách công khai, chờ admin duyệt. Hiển thị trong **Pending Queue** của admin.

### Tiêu chí tự động chuyển sang `pending`

Áp dụng theo thứ tự, đủ một điều kiện là `pending`:

1. Tài khoản uploader có `createdAt` trong vòng **3 ngày gần nhất** (tài khoản mới).
2. Uploader có **≥1 tài liệu trước đó bị admin xóa vì vi phạm** trong 30 ngày qua (tài khoản đang nghi vấn).
3. Tài liệu bị tự động flag bởi FR-15 (≥5 report distinct trong 24h).
4. Uploader chưa hoàn tất email verification (nếu MVP bật verification).

Các trường hợp khác mặc định `public`.

### Hành vi của tài liệu `pending`

- **Không hiển thị** ở danh sách công khai (FR-03), kết quả search (FR-04), filter (FR-05), preview/download công khai.
- **Uploader vẫn xem được** tài liệu của mình ở trang cá nhân (FR-12) với label trạng thái rõ ràng: "Đang chờ duyệt".
- **Không tính** view, download, vote, comment trong khi pending.
- **Không cộng điểm** đóng góp cho uploader (FR-11) cho tới khi được approve.

### Hành vi của admin trong Pending Queue

- Truy cập trang **Admin → Pending Queue**.
- Xem danh sách tài liệu pending, sắp xếp:
  - Mặc định: cũ nhất trước (FIFO).
  - Filter: `auto-flagged` (do FR-15) lên trên, `new account` ở giữa, còn lại sau.
- Với mỗi tài liệu pending, admin có thể:
  - Mở preview để xem nội dung (như FR-07).
  - **Approve:** chuyển `status = 'public'`. Trigger cộng điểm upload cho uploader (FR-11). Ghi `approvedBy`, `approvedAt`.
  - **Reject:** chuyển `status = 'hidden'` hoặc `'deleted'` tùy mức nghiêm trọng. Ghi `rejectedBy`, `rejectedAt`, `rejectionReason`. Thông báo uploader kèm lý do.
  - **Request changes:** thêm ghi chú cho uploader để sửa metadata, giữ status `pending`.

### Thông báo cho uploader

- Sau approve: thông báo "Tài liệu đã được duyệt" + link tới trang chi tiết + báo điểm cộng.
- Sau reject: thông báo "Tài liệu chưa được duyệt" + lý do.
- Request changes: thông báo kèm comment của admin + nút "Chỉnh sửa metadata".

### Trường dữ liệu mở rộng (beta)

Mở rộng `Document`:

- `status`: thêm semantic `'pending'` (đã có sẵn trong enum schema beta).
- `pendingReason`: `'NEW_ACCOUNT' | 'PRIOR_VIOLATION' | 'AUTO_FLAGGED' | 'UNVERIFIED_EMAIL' | 'MANUAL'`.
- `autoFlaggedAt`: Date, nullable.
- `approvedBy`, `approvedAt`: nullable.
- `rejectedBy`, `rejectedAt`, `rejectionReason`: nullable.
- `adminNote`: String — note request changes của admin, nullable.

### Acceptance criteria

- Tài liệu upload bởi tài khoản mới (<3 ngày) tự động chuyển `status = 'pending'` kèm `pendingReason = 'NEW_ACCOUNT'`.
- Tài liệu bị FR-15 auto-flag chuyển `status = 'pending'` kèm `pendingReason = 'AUTO_FLAGGED'`.
- Tài liệu pending không xuất hiện trong listing/search/filter/preview/download công khai.
- Uploader nhìn thấy tài liệu pending của mình ở trang cá nhân với badge trạng thái.
- Khi pending, view/download/upvote/downvote/comment đều bị từ chối hoặc không được tính.
- Khi pending, FR-11 không cộng điểm upload cho uploader.
- Admin có trang Pending Queue với sorting/filtering theo `pendingReason`.
- Admin approve → tài liệu chuyển sang `public`, cộng điểm upload trigger ngay, uploader nhận thông báo.
- Admin reject → tài liệu chuyển sang `hidden`/`deleted` kèm lý do, uploader nhận thông báo.
- Admin có thể request changes mà không thay đổi status; uploader sửa metadata và resubmit về queue.
- Mọi hành động approve/reject/request được ghi vào `Document` (auditable).
- Nếu cùng tài liệu được FR-15 flag lại sau khi đã approve, lập lại quy trình pending.

### Priority

**P1 – Cần cho MVP**, vì:

- Giải quyết mâu thuẫn ở Journey 7.2 (nói "public hoặc pending tùy cơ chế" mà không có FR cho admin xử lý pending).
- Là tiền đề cho FR-11 (chỉ cộng điểm sau approve), giảm anti-gaming nói trong review.
- Tích hợp với FR-15 (auto-flag → pending) tạo vòng kiểm soát nội dung khép kín.
