# การแก้ไขปัญหา Path Import

## ปัญหาที่พบ

```
Module not found: Can't resolve '../../../../lib/db'
```

## สาเหตุ

การ import path ใน API routes ไม่ถูกต้อง เนื่องจากโครงสร้างโฟลเดอร์:

```
src/
├── app/
│   └── api/
│       ├── auth/
│       │   ├── login/
│       │   ├── register/
│       │   └── me/
│       └── homework/
│           └── [id]/
└── lib/
    └── db.js
```

## การแก้ไข

### วิธีที่ 1: ใช้ Relative Path (แก้ไขแล้ว)
### วิธีที่ 2: ใช้ Alias Path (แนะนำ)

อัปเดต `jsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

### ไฟล์ที่แก้ไข:

1. **`src/app/api/homework/route.js`**
   ```javascript
   // เปลี่ยนเป็น
   import { prisma } from '@/lib/db'
   ```

2. **`src/app/api/homework/[id]/route.js`**
   ```javascript
   // เปลี่ยนเป็น
   import { prisma } from '@/lib/db'
   ```

3. **`src/app/api/auth/register/route.js`**
   ```javascript
   // เปลี่ยนเป็น
   import { prisma } from '@/lib/db'
   ```

4. **`src/app/api/auth/login/route.js`**
   ```javascript
   // เปลี่ยนเป็น
   import { prisma } from '@/lib/db'
   ```

5. **`src/app/api/auth/me/route.js`**
   ```javascript
   // เปลี่ยนเป็น
   import { prisma } from '@/lib/db'
   ```

## การคำนวณ Path

### จาก `src/app/api/homework/route.js` ไป `src/lib/db.js`:
- ออกจาก `homework/` = `../`
- ออกจาก `api/` = `../`
- ออกจาก `app/` = `../`
- เข้า `lib/` = `lib/db`
- รวม = `../../../lib/db`

### จาก `src/app/api/homework/[id]/route.js` ไป `src/lib/db.js`:
- ออกจาก `[id]/` = `../`
- ออกจาก `homework/` = `../`
- ออกจาก `api/` = `../`
- ออกจาก `app/` = `../`
- เข้า `lib/` = `lib/db`
- รวม = `../../../../lib/db`

## หมายเหตุ

- ใช้ relative path แทน absolute path
- ตรวจสอบโครงสร้างโฟลเดอร์ก่อนเขียน import path
- ใช้ `../` เพื่อออกจากโฟลเดอร์ปัจจุบัน
- ใช้ `./` เพื่อเข้าสู่โฟลเดอร์ย่อย

## การป้องกันปัญหาในอนาคต

1. ใช้ IDE ที่มี path autocomplete
2. ตรวจสอบโครงสร้างโฟลเดอร์ก่อนเขียน import
3. ใช้ TypeScript เพื่อให้ IDE ช่วยตรวจสอบ path
4. ใช้ alias path ใน jsconfig.json หรือ tsconfig.json

## ตัวอย่าง jsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

แล้วใช้:
```javascript
import { prisma } from '@/lib/db'
``` 