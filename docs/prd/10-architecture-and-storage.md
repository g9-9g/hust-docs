# 10. Kiến trúc & Local Storage Design (Chương 14–15)

## 10.1. High-level architecture

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

## 10.2. Backend folder structure đề xuất

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

## 10.3. Frontend folder structure đề xuất

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

## 10.4. Local Storage Design — Cách lưu file

Khi upload, backend dùng `multer` để nhận file và lưu vào thư mục local:

```text
server/uploads/documents/{yyyy}/{mm}/{generated-file-name}
```

Ví dụ:

```text
server/uploads/documents/2026/05/1715840000-abc123-machine-learning-final.pdf
```

## 10.5. Nguyên tắc đặt tên file

Không lưu file bằng tên gốc hoàn toàn vì có thể trùng hoặc chứa ký tự không an toàn.

Tên lưu trữ nên gồm:

- timestamp
- random string/uuid
- slug ngắn từ tên gốc
- extension

## 10.6. Metadata lưu trong MongoDB

Database chỉ lưu:

- originalName
- storedName
- path
- mimeType
- size
- extension

## 10.7. Chuẩn bị để migrate lên cloud

Nên tạo một lớp `StorageService`:

```js
class StorageService {
  async saveFile(file) {}
  async deleteFile(path) {}
  getFileUrl(path) {}
}
```

Ở MVP, `LocalStorageService` implement logic lưu local. Sau này có thể thay bằng `S3StorageService` mà không cần sửa toàn bộ business logic.
