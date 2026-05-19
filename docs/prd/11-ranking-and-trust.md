# 11. Ranking & Moderation/Trust Design (Chương 16–17)

## 11.1. Mục tiêu ranking

Giúp tài liệu tốt nổi bật hơn khi người dùng tìm kiếm.

## 11.2. Score MVP đơn giản

```text
score = upvoteCount * 2 + downloadCount * 0.5 + viewCount * 0.1 - downvoteCount * 1.5
```

Có thể tính realtime hoặc lưu trong field `score` và cập nhật khi có vote/download/view.

## 11.3. Lưu ý

Không nên phụ thuộc tuyệt đối vào viewCount vì tài liệu clickbait có thể nhiều lượt xem nhưng không hữu ích. Upvote và comment xác nhận chất lượng nên có trọng số cao hơn.

---

## 11.4. Vấn đề moderation

Người dùng sợ học sai kiến thức từ nguồn không chính thống. Vì vậy, hệ thống cần tín hiệu tin cậy.

## 11.5. Trust signals trong MVP

- Upvote/downvote
- Comment
- Download count
- Uploader name
- Upload date
- Verified document badge
- Verified contributor badge, optional

## 11.6. Verified badge đề xuất

### Verified document

Admin đánh dấu cho tài liệu đã kiểm tra sơ bộ.

### Verified contributor

User đạt điều kiện nhất định thì có badge.

Điều kiện MVP có thể là:

- Có ít nhất 5 tài liệu public.
- Tổng upvote từ tài liệu >= 20.
- Không có tài liệu bị admin ẩn/xóa vì vi phạm.

Trong MVP đầu tiên, verified contributor có thể để admin gắn thủ công để giảm độ phức tạp.
