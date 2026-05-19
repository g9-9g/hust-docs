# 06. API Requirements (Chương 10)

## 6.1. Auth APIs

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

## 6.2. Document APIs

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

## 6.3. Vote APIs

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

## 6.4. Comment APIs

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

## 6.5. User APIs

### GET `/api/users/me`

Lấy thông tin cá nhân.

### GET `/api/users/me/documents`

Lấy danh sách tài liệu mình đã upload.

### GET `/api/users/:id`

Xem profile public của user.

---

## 6.6. Reward APIs

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

## 6.7. Admin APIs

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
