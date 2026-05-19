# Review — Functional Requirements (FR-01 → FR-13)

> Review chi tiết Chương 8 của PRD, bám sát nghiệp vụ + thiết kế cho MVP. Nội dung được nhóm theo: (a) vấn đề **nghiệp vụ/ý tưởng**, (b) vấn đề **thiết kế/kỹ thuật**, (c) **gợi ý sửa**.

## 0. Nhận xét tổng quan trước khi đi vào từng FR

### 0.1. Vấn đề chéo nhiều FR
1. **Đánh số chương sai trong PRD gốc** — Chương 5 lại có sub-section "6.1", chương 6 có "7.1"... lệch hết. Dù đã sửa khi tách file, gốc nên fix để tránh nhầm khi cite.
2. **Lỗi typo, markdown vỡ** trong FR-03: `Androi d`, `óc thể`, dấu `*` thừa làm vỡ format danh sách "Continue reading / Recently viewed / Trending in your courses". Cần sửa lại.
3. **Thiếu hẳn 3 nhóm chức năng nền tảng nhưng không nằm trong scope nào**:
   - **Onboarding** (sinh viên chọn Major lúc đăng ký) — FR-03 đã reference "chuyên ngành người dùng chọn lúc ban đầu" nhưng FR-01 không có bước này.
   - **Report/Flag tài liệu hoặc comment** — Trust signal yếu nếu không có. Risk section (Ch.21) có nhắc "optional" nhưng không có FR.
   - **Pending review workflow** — Journey 7.2 nói "public hoặc pending review tùy cơ chế MVP" nhưng không có FR cho admin queue review.
4. **Định danh người dùng không gắn với HUST** — Đăng ký bằng email bất kỳ. Người ngoài có thể spam upload, fake download, gaming điểm. Đề xuất: ép verify email `@*.hust.edu.vn` hoặc cho admin whitelist.
5. **Bản quyền/Copyright** — Chia sẻ slide giảng viên / đề thi có thể vi phạm sở hữu trí tuệ. PRD hoàn toàn không có:
   - Checkbox cam kết khi upload ("Tôi xác nhận tài liệu này không vi phạm bản quyền").
   - Cơ chế DMCA / yêu cầu gỡ bỏ.
   - Điều khoản sử dụng.
   Đây là rủi ro pháp lý thực tế ở HUST, không chỉ là chi tiết kỹ thuật.
6. **Schema chưa đủ cho một số FR** (xem chi tiết ở FR-11, FR-12): badge sở hữu, avatar frame, featured document, view history.
7. **Anti-gaming / Sybil** — Toàn bộ hệ thống điểm bị hở: tự đăng ký 2 account, A upload, B upvote và download nhiều lần → A nhận điểm. Cần ít nhất ràng buộc 1 vote / 1 IP / 1 ngày, hoặc weighted score, hoặc ràng buộc HUST email + 1 account/email.

---

## FR-01. Đăng ký, đăng nhập, đăng xuất

### Nghiệp vụ
- ❌ **Không có bước onboarding** chọn Major/chuyên ngành — nhưng FR-03 ("Trending in your courses") **lại phụ thuộc** vào dữ liệu này. Mâu thuẫn.
- ❌ **Không có forgot password / reset password** — Sinh viên quên mật khẩu sẽ không lấy lại được. Tuy "optional cho MVP" có thể chấp nhận, nhưng phải có ít nhất ghi chú.
- ⚠️ **Email verification để optional** — Nếu mở đăng ký tự do và không verify, hệ thống tạo điểm thưởng và đổi quà sẽ bị abuse ngay từ ngày đầu.
- ⚠️ **Không xác thực là sinh viên HUST** — Mâu thuẫn với định vị "tài liệu sát chương trình HUST".

### Thiết kế/kỹ thuật
- ❌ **Login dùng `emailOrUsername`** (xem [API](06-api.md)) nhưng FR-01 mô tả "Người dùng có thể đăng nhập bằng email/username và password" — OK, nhưng frontend cần hint rõ field cho phép cả 2.
- ❌ **Không spec rõ token strategy**: JWT? Access + refresh? Thời hạn? Lưu localStorage hay httpOnly cookie?
- ❌ **Không có rate limit** trên `/login` — brute force vô tư.
- ❌ **Logout client-only** — Nếu là JWT stateless, "đăng xuất" chỉ xóa token client; nếu token rò rỉ vẫn dùng được tới hết expiration. Cần token blocklist hoặc rotate refresh.
- ❌ **Password complexity**: không quy định min length, chữ hoa/số. Acceptance criteria không nhắc.
- ⚠️ **Field `verified status` (User)** vs **`isVerified` (Document)** — hai khái niệm khác nhau (verified contributor vs verified document) nhưng dùng cùng tên gây nhầm lẫn. Khuyến nghị đổi `isVerified` (User) → `isVerifiedContributor`.
- ⚠️ **Bootstrap admin đầu tiên**: ai tạo? Seed script? Cần ghi rõ.

### Gợi ý sửa
- Thêm bước "Chọn Major khi đăng ký" hoặc step sau lần login đầu (`needsOnboarding: true` field).
- Mặc định **bắt buộc email verification** sau khi reward store có giá trị thật. Có thể relax trong demo nội bộ.
- Spec JWT 15p + refresh token 7 ngày, refresh trong httpOnly cookie.
- Rate-limit `/login` 5 lần / phút / IP.
- Đổi tên `isVerified` ở User để phân biệt.

---

## FR-02. Upload tài liệu

### Nghiệp vụ
- ❌ **Cộng điểm ngay khi upload** dễ bị abuse: user upload file rác để farm điểm rồi xóa hoặc bị admin gỡ. Quy tắc "có thể thu hồi điểm" ở FR-11 dùng từ "có thể" — mơ hồ. Khuyến nghị: chỉ cộng điểm sau khi tài liệu được **approve (pending → public)** hoặc đạt ngưỡng (vd: 3 download).
- ❌ **Subject + Major bắt buộc cùng lúc** — Một Subject có thể thuộc nhiều Major (schema `Subject.majorIds: [ObjectId]` xác nhận). Vậy user chọn Major nào khi subject thuộc 3 major? UX cần rõ: subject quyết định major hay ngược lại?
- ❌ **Không có duplicate detection** — Cùng 1 file PDF được 10 sinh viên upload → kho rác. Cần hash file (SHA-256) và cảnh báo "Tài liệu này đã có sẵn, bạn có muốn upload bản khác?".
- ❌ **Không có cam kết bản quyền** khi upload. Pháp lý.
- ⚠️ **Trạng thái sau upload: "public HOẶC pending"** — Phải quyết, không để mở. Khuyến nghị: MVP chọn **public ngay** + cờ "auto-hidden khi bị flag X lần"; pending review chỉ dùng cho tài khoản mới (<3 ngày tuổi).
- ⚠️ **Mỗi lần upload 1 file** — Sinh viên thường có project gồm 5–10 file (source + báo cáo + slide). Hoặc cho phép upload ZIP có ý nghĩa, hoặc cho phép gom nhiều file vào 1 "document bundle".
- ⚠️ **PNG/JPG optional** — Use case không rõ. Nếu chấp nhận, phải mô tả: ảnh chụp đề thi? Cần cảnh báo OCR chất lượng kém.

### Thiết kế/kỹ thuật
- ❌ **Dung lượng "20MB hoặc 50MB tùy cấu hình"** — Phải chọn một. Đề xuất 50MB cho MVP (slide PPT thường 30–40MB).
- ❌ **Validate file type chỉ bằng extension/MIME** không đủ — File `malware.exe` đổi tên thành `notes.pdf` qua được. Phải check **magic bytes** (lib `file-type` của npm).
- ❌ **ZIP optional → rủi ro**: ZIP có thể chứa `.exe`, `.sh`. Nếu accept, phải scan recursive hoặc disable hẳn.
- ❌ **Không có virus scan** — Tài liệu chia sẻ công cộng mà không scan là rủi ro thực sự. ClamAV local cho MVP.
- ❌ **`Source note`** trong Metadata optional không được định nghĩa là gì.
- ❌ **Không tracking phiên upload progress** (multer load hết vào RAM → nguy hiểm với file 50MB và nhiều user đồng thời). Cần streaming + tempfile.

### Gợi ý sửa
- Đổi cơ chế cộng điểm: `+10` chỉ trigger khi `status = public` (sau approve hoặc passed auto-check).
- Bắt buộc checkbox **"Tôi xác nhận tôi có quyền chia sẻ tài liệu này"** (lưu field `copyrightAcknowledgedAt`).
- Hash SHA-256 file, lưu trong `file.hash`, dedupe ở mức cảnh báo.
- Magic-bytes validation + ClamAV scan async.
- Chốt 50MB.

---

## FR-03. Xem danh sách tài liệu / Recommendation

### Nghiệp vụ
- ❌ **Trộn 2 khái niệm**: "danh sách tài liệu" (listing page có filter) và "recommendation cá nhân hóa trên homepage" (Continue reading, Recently viewed, Trending). Hai trang/2 component khác nhau, nên tách thành **FR-03a (Listing)** và **FR-03b (Personalized Home)**.
- ❌ **"Continue reading"** đòi user có **reading progress** — schema Document/User không có field này. Phải thêm `ReadingProgress { userId, documentId, lastPage, lastViewedAt }`. Đây là feature đắt cho MVP, nên giữ hay drop?
- ❌ **"Recently viewed"** đòi history. Schema chưa có. Đây là item dễ làm hơn (chỉ cần `viewedAt` mới nhất). Nên giữ.
- ❌ **"Trending in your courses"** phụ thuộc onboarding chọn major (xem FR-01) — chưa có flow.
- ⚠️ **"Sắp xếp mặc định: mới nhất HOẶC phổ biến trong mùa thi"** — Ai/cái gì định nghĩa "mùa thi"? Nếu là logic hardcode (vd: tháng 5–6 và 11–12) thì cần ghi rõ.

### Thiết kế/kỹ thuật
- ❌ **Card hiển thị "điểm tin cậy"** — Schema chỉ có `score` (công thức trong [Ch.16](11-ranking-and-trust.md)). "Điểm tin cậy" là tên hiển thị hay field riêng? Cần thống nhất.
- ❌ **10 fields trên 1 card** quá tải. Card nên có hierarchy: tiêu đề + 1-2 metadata phụ + 1 trust signal. Phần còn lại ẩn trong tooltip/hover.
- ❌ **"Phân trang HOẶC infinite scroll"** — Chọn một. Đề xuất phân trang (dễ test, dễ deep-link).
- ⚠️ **`viewCount`** tăng khi mở danh sách hay chỉ khi mở chi tiết? Theo FR-06 là khi mở chi tiết — đúng rồi, nhưng làm rõ.
- ⚠️ **Lỗi typo và markdown vỡ** ở phần "Mô tả" — cần dọn.

### Gợi ý sửa
- Tách FR-03 thành 2 FR riêng.
- Bỏ "Continue reading" khỏi MVP (đắt, ROI thấp). Giữ "Recently viewed" (rẻ).
- Card: ưu tiên Title / Môn học / Verified badge / Upvote count / Download count. Hide các field còn lại sau hover hoặc đẩy vào chi tiết.

---

## FR-04. Tìm kiếm tài liệu

### Nghiệp vụ
- ❌ **Tiếng Việt có dấu / không dấu** — Sinh viên gõ "ky thuat lap trinh" có ra "kỹ thuật lập trình" không? MongoDB text index không tự xử lý. Cần slug-normalized field hoặc dùng Atlas Search.
- ❌ **Không track failed search** — Quality metric (Ch.18) có "tỷ lệ search không có kết quả" nhưng không có schema lưu log.
- ⚠️ **Không có autocomplete/suggest** — Đây là UX killer trên trang search trọng tâm.

### Thiết kế/kỹ thuật
- ❌ **"Regex có kiểm soát"** — Performance trên data lớn rất tệ và dễ bị **ReDoS** nếu user nhập pattern xấu. Phải dùng `$text` + text index, không phải regex.
- ❌ **Logic search match `teacherName`** trong mô tả nhưng **không có trong logic field list** (chỉ `title/description/subjectName/tags`). Inconsistent.
- ❌ **Không có ranking relevance** — Cùng từ khóa, tài liệu nào lên đầu? Score độ tin cậy hay BM25? Cần spec.

### Gợi ý sửa
- Thêm field `searchableText` chứa title + description + subjectName + tags + teacherName, đã normalize Việt không dấu (slugify).
- Tạo MongoDB text index trên `searchableText`.
- Hoặc nâng cấp: dùng Meilisearch/Typesense (free, dễ deploy local).

---

## FR-05. Bộ lọc tài liệu

### Nghiệp vụ
- ⚠️ **"Học kỳ/năm học" optional** — Thực tế sinh viên ít lọc theo trường này (môn học giữ nguyên qua các kỳ). Có thể drop.
- ⚠️ **Filter theo file type bỏ sau MVP** — Nhưng user thực tế cần (chỉ muốn PDF). Đơn giản, nên giữ.

### Thiết kế/kỹ thuật
- ❌ **Section "Filter cần có" lẫn lộn filter và sort** (4 filter + 4 sort). Cần tách rõ.
- ❌ **Combine search + filter** không có spec thứ tự apply. Mặc định: filter trước, search rank trong tập đã filter.

### Gợi ý sửa
- Tách trong PRD: "Filter" và "Sort" là 2 mục.
- Đưa file type filter vào MVP (rẻ).

---

## FR-06. Xem chi tiết tài liệu

### Nghiệp vụ
- ❌ **Hai loại "Verified" gây nhầm lẫn**: verified document (badge gắn vào tài liệu) vs verified contributor (badge cạnh tên user). Trang chi tiết cần hiển thị cả 2 với label rõ ("Tài liệu đã kiểm chứng" / "Người đăng đáng tin cậy").
- ❌ **Không có Report button** cho user — Trust signal yếu. Quan trọng nếu PRD muốn cộng đồng tự kiểm duyệt.
- ❌ **Không có version history / re-upload** — Tài liệu sai chính tả, sai đáp án thì uploader sửa cách nào? Cách workaround "xóa và upload lại" làm mất vote/comment cũ.

### Thiết kế/kỹ thuật
- ❌ **`viewCount` tăng mỗi lần mở chi tiết** — User refresh 100 lần → 100 view, dễ bị gaming và méo metric. Phải dedupe: 1 view / userId(hoặc IP) / document / 24h.
- ⚠️ **"Related documents optional"** — Nếu làm thật cần spec cách tính (cùng subject? same uploader? text similarity?).

### Gợi ý sửa
- Bổ sung Report flow ngay trong MVP (nút "Báo cáo tài liệu" → tạo record `Report { userId, documentId, reason, status }` → admin xử lý).
- Dedupe viewCount bằng cache Redis hoặc field `Viewed { userId, documentId, lastAt }` với TTL 24h.

---

## FR-07. Preview tài liệu

### Nghiệp vụ
- ❌ **"Preview qua iframe PDF"** = client tải nguyên file để render. Bandwidth tốn bằng download. Không phục vụ mục tiêu "kiểm tra sơ bộ trước khi tải". Cần thumbnail vài trang đầu, hoặc PDF.js render lazy theo page.
- ❌ **Mâu thuẫn với "yêu cầu đăng nhập khi download"** — Preview = file đầy đủ, user mở DevTools save về vô tư. Auth gate ở download là illusion.
- ⚠️ **Office files chưa preview** — Sinh viên upload PPT rất nhiều. "Tải xuống mới xem được" là UX kém. Giải pháp MVP rẻ: dùng Google Docs Viewer iframe (free, không cần backend convert) hoặc convert sang PDF bằng LibreOffice headless cron.

### Thiết kế/kỹ thuật
- ❌ **Không spec watermark** — Nếu lo bản quyền, có thể watermark "HUST Docs - {username}" qua preview để đe răn screenshot.
- ⚠️ **SVG/ảnh upload + preview** có rủi ro XSS nếu SVG chứa script.

### Gợi ý sửa
- MVP rẻ: PDF preview = first 3 pages render qua PDF.js, watermark dynamic, blur trang 4+.
- Office: Google Docs Viewer cho lần 1, sau đó plan LibreOffice headless.

---

## FR-08. Download tài liệu

### Nghiệp vụ
- ❌ **Login để download HAY không cần** — Không quyết, để mở. Là quyết định nghiệp vụ chính. Khuyến nghị: **bắt buộc login** vì nó:
  - Tăng tỷ lệ tạo account (activation metric ở Ch.18).
  - Đo `downloadCount` chính xác.
  - Liên kết milestone download với điểm thưởng (FR-11).
- ⚠️ **Download count dedupe** — Cùng user re-download có tăng count không? Không quy định. Khuyến nghị dedupe per user/24h giống view count.

### Thiết kế/kỹ thuật
- ❌ **Không có rate limit** — 1 user pull 1000 file/phút bằng script.
- ❌ **"File tải xuống giữ đúng tên hoặc có tên dễ hiểu"** — Mơ hồ. Nên là `originalName` (đẹp cho user, server đã đổi tên storage).
- ⚠️ **Streaming response cho file lớn** — `res.sendFile` của Express OK với 50MB nhưng cần `Content-Disposition` đúng.

### Gợi ý sửa
- Chốt: login mới download.
- Rate limit 30 download / user / phút.

---

## FR-09. Upvote/downvote

### Nghiệp vụ
- ❌ **Sybil/anti-gaming** — Không có rào cản. A có 5 account → upvote farm. Tối thiểu: 1 vote / IP / document.
- ❌ **Cho phép self-upvote không?** — Không quy định. Khuyến nghị **cấm**, kèm message rõ. Vì nó gây méo "Tài liệu nhận upvote → uploader +2 điểm".
- ❌ **Vote trên tài liệu pending?** — Không quy định. Khuyến nghị: chỉ vote được trên `status = public`.
- ⚠️ **Vote ảnh hưởng điểm uploader**: FR-11 cộng +2/upvote. **Khi user đổi vote (upvote → downvote), điểm uploader có trừ -2 không?** PRD chỉ nói "Điểm không bị cộng lặp" — chưa rõ logic refund. Phải spec.

### Thiết kế/kỹ thuật
- ❌ **2 cơ chế hủy vote khác nhau**:
  - FR-09: "bấm upvote lần nữa: hủy upvote" (toggle).
  - API: `DELETE /api/documents/:id/vote` (explicit endpoint).
  Frontend dùng cái nào? Khuyến nghị giữ explicit DELETE, bỏ toggle để logic backend đơn giản.
- ⚠️ **Vote counter denormalized** (`upvoteCount`, `downvoteCount` trong Document) — Phải update transactional với insert Vote. Race condition nếu không dùng `$inc` atomic.

### Gợi ý sửa
- Cấm self-vote: check `uploaderId !== userId` khi insert vote.
- Vote chỉ cho `status = public`.
- Khi đổi vote (upvote → downvote): tạo PointTransaction `ADJUSTMENT` -2 cho uploader, kèm reason.

---

## FR-10. Bình luận

### Nghiệp vụ
- ⚠️ **Không có notification** cho uploader khi có comment mới — Giảm engagement, nhưng acceptable cho MVP.
- ⚠️ **Không có report comment** — Comment toxic không có cách user flag.
- ⚠️ **Không có edit comment** — Sửa typo phải xóa và viết lại, mất context.

### Thiết kế/kỹ thuật
- ❌ **"Bình luận rỗng hoặc quá dài bị từ chối"** — Không có giới hạn cụ thể. Đề xuất 1–2000 ký tự.
- ❌ **Không có rate limit** — Spam comment dễ.
- ❌ **XSS sanitization** chỉ nhắc ở Ch.13 non-functional, FR-10 không reference. Cần explicit (DOMPurify ở backend trước khi lưu, hoặc escape khi render).

### Gợi ý sửa
- Spec rõ length (1–2000), rate limit 5 comment/phút/user.
- Thêm "report comment" với cùng workflow như report document.

---

## FR-11. Điểm đóng góp, điểm thưởng và đổi quà ⚠️ (FR có nhiều vấn đề nhất)

### Nghiệp vụ
- ❌ **Reward kiểu "Featured document"** — Spec "quyền gắn nhãn Featured cho tài liệu trong thời gian ngắn" nhưng **schema thiếu**: thời gian bắt đầu/kết thúc, document được gắn, ai gắn. Cần thêm `FeaturedDocument { documentId, byUserId, expiresAt }` hoặc field `featuredUntil` trong Document.
- ❌ **Reward kiểu "Badge / Avatar Frame"** — User redeem rồi user **sở hữu** item đó. Schema **không track ownership**: `RewardRedemption` chỉ ghi giao dịch, không có `UserInventory` hay `UserBadge`. Nếu admin sau muốn hỏi "user X có badge nào?" → phải scan toàn bộ redemptions với status=completed, type=BADGE.
- ❌ **"Quyền ưu tiên xét verified contributor"** — Ý nghĩa quá mơ hồ, không actionable. Nên bỏ hoặc spec rõ.
- ❌ **Thu hồi điểm khi tài liệu bị xóa** — PRD dùng "có thể" mơ hồ. Phải chốt: yes hoặc no, và logic cụ thể (rút điểm upload + tất cả điểm upvote nhận được? trừ điểm của user dù họ đã đổi quà rồi → âm điểm?).
- ❌ **Vote farming**: A tạo 5 tài khoản → upvote tài liệu của A → A nhận 10 điểm. Không có rào cản (chỉ ràng buộc 1 vote / user / document).
- ❌ **Milestone 50 downloads + dedupe download**: nếu download dedupe per user, mốc 50 hợp lý. Nếu không dedupe, gameable. Phải kết với quyết định FR-08.
- ⚠️ **Quà offline pending**: workflow giao quà cho admin thiếu thông tin nhận hàng (địa chỉ, SĐT). Cần form khi redeem `type = OFFLINE_GIFT`.

### Thiết kế/kỹ thuật
- ❌ **Race condition khi redeem**: 2 user cùng redeem reward có `quantity = 1`. Không spec atomic decrement. Cần MongoDB `findOneAndUpdate({ _id, quantity: { $gt: 0 } }, { $inc: { quantity: -1 } })` để atomic.
- ❌ **Idempotency cho redeem**: AC nói "không trừ điểm 2 lần cho cùng yêu cầu" — cần idempotency key từ client hoặc lock theo `userId + rewardId + window`.
- ❌ **Pending → cancelled flow**: khi admin cancel redemption đã `pending`, **điểm có refund không?** Không spec. Khuyến nghị có (tạo PointTransaction ngược).
- ❌ **`PointTransaction` thiếu index** — Query "lịch sử điểm của tôi sắp xếp mới nhất" cần index `{ userId: 1, createdAt: -1 }`.
- ❌ **Tính `contributionPoints` denormalized trên User** — Phải đồng bộ với SUM(PointTransaction). Drift dễ xảy ra. Nên có job reconcile định kỳ hoặc luôn tính từ transactions.
- ⚠️ **Acceptance criteria "Người dùng không thể đổi quà nếu không đủ điểm"** + race với điểm âm: nếu 2 thread cùng đọc balance=100 cùng đổi quà 100, cả 2 pass check → balance = -100. Cần atomic check-and-decrement.

### Gợi ý sửa
- Thêm schema `UserInventory { userId, itemType, itemId, sourceRedemptionId, acquiredAt, status: 'active'|'consumed'|'expired' }` để track sở hữu.
- Featured document: dùng field `featuredUntil: Date` trên Document; redeem reward tạo PointTransaction + update `featuredUntil`.
- Self-vote: cấm hẳn (đã nói ở FR-09).
- Atomic decrement quantity, kèm session/transaction cho `User.contributionPoints` -- `RewardItem.quantity` -- `RewardRedemption` insert.
- Spec rõ: cancel redemption → refund điểm (tạo `ADJUSTMENT` ngược).
- Drop "Quyền ưu tiên xét verified contributor".

---

## FR-12. Trang cá nhân

### Nghiệp vụ
- ⚠️ **Không có edit profile** (đổi avatar, fullname) — Acceptable nếu để sau MVP, nhưng phải nói rõ.
- ⚠️ **Public profile của người khác** (`GET /api/users/:id` trong API) — FR-12 chỉ mô tả "profile của mình". Có hiển thị giống nhau không? Hide email/SĐT của user khác?

### Thiết kế/kỹ thuật
- ❌ **"Verified badge nếu có"** — Lại confused giữa 2 loại verified. Xem FR-01 gợi ý đổi tên.

### Gợi ý sửa
- Spec rõ public profile (tách `me` view và `public` view), ẩn email/email-username khi xem profile người khác.

---

## FR-13. Admin quản lý tài liệu

### Nghiệp vụ
- ❌ **Không có queue "pending review"** — Journey 7.2 nói có thể là pending, nhưng admin không có giao diện duyệt. Mâu thuẫn.
- ❌ **"Quản lý danh mục môn học/chuyên ngành" để optional** — Nhưng FR-02 upload **bắt buộc** chọn subject/major từ database. Nếu admin không quản lý được, ai khởi tạo? Cần ít nhất seed script + spec rõ "có/không bắt buộc CRUD UI".
- ❌ **Không có Report inbox** — Khi user report tài liệu, admin xem ở đâu? (Nếu chấp nhận đề xuất thêm report ở FR-06).
- ❌ **Không có audit log** — Admin xóa nhầm thì truy vết bằng cách nào? Đề xuất `AdminAction { adminId, action, targetType, targetId, beforeState, afterState, at }`.
- ⚠️ **Soft delete vs hard delete** — "Xóa tài liệu và file liên quan" có nghĩa hard delete. Mất audit và nếu là tài liệu pháp lý còn rắc rối. Khuyến nghị soft delete (status='deleted') + cron xóa file sau 30 ngày.

### Thiết kế/kỹ thuật
- ❌ **Không có bulk operation** — Admin xử lý 100 tài liệu rác phải click 100 lần.
- ⚠️ **Permission chỉ `user` / `admin`** — Không có moderator role. Sau MVP cần.

### Gợi ý sửa
- Bắt buộc Subject/Major CRUD trong MVP (không optional) hoặc cung cấp seed file đầy đủ.
- Thêm FR mới: "Admin pending review queue" và "Admin report inbox".
- Soft delete by default.

---

## Tổng kết ưu tiên fix trước khi build

| # | Vấn đề | Mức độ | FR liên quan |
| - | ------ | ------ | ------------ |
| 1 | Cam kết bản quyền + DMCA workflow | 🔴 Pháp lý | FR-02, FR-13 |
| 2 | Sybil/anti-gaming (self-vote, multi-account farming) | 🔴 Phá vỡ hệ thống điểm | FR-09, FR-11 |
| 3 | Race condition khi redeem reward | 🔴 Data integrity | FR-11 |
| 4 | Schema thiếu UserInventory + FeaturedDocument | 🔴 Không build được feature | FR-11 |
| 5 | Onboarding chọn Major bị bỏ quên | 🟠 Mâu thuẫn FR-01/FR-03 | FR-01, FR-03 |
| 6 | viewCount/downloadCount dedupe | 🟠 Metric méo | FR-06, FR-08 |
| 7 | Pending review workflow thiếu admin queue | 🟠 Mâu thuẫn journey | FR-02, FR-13 |
| 8 | Report flow cho user | 🟠 Trust signal yếu | FR-06, FR-10, FR-13 |
| 9 | Verified document vs Verified contributor nhầm tên | 🟡 UX rối | FR-01, FR-06, FR-12 |
| 10 | Chốt: login mới download? Chốt: dung lượng max? | 🟡 Decision đang treo | FR-02, FR-08 |
| 11 | Subject/Major CRUD optional vs upload required | 🟡 Chicken-and-egg | FR-02, FR-13 |
| 12 | Search tiếng Việt có dấu/không dấu | 🟡 UX | FR-04 |
| 13 | Preview = full file (no protection) | 🟡 Bandwidth + bản quyền | FR-07 |
| 14 | Token strategy, rate limit, password rule | 🟡 Security baseline | FR-01 |
| 15 | Lỗi typo + markdown vỡ ở FR-03 | ⚪ Form | FR-03 |

🔴 must fix trước khi code  ·  🟠 nên fix trong sprint 1  ·  🟡 fix khi gặp  ·  ⚪ dọn dẹp
