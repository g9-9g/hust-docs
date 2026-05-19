# 05. Danh mục dữ liệu (Chương 9)

## 5.1. User

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

## 5.2. Document

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

## 5.3. Subject

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

## 5.4. Major

```js
{
  _id: ObjectId,
  name: String,
  code: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 5.5. Vote

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

## 5.6. Comment

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

## 5.7. PointTransaction

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

## 5.8. RewardItem

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

## 5.9. RewardRedemption

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
