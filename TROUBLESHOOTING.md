# คู่มือการแก้ไขปัญหา

## ปัญหาที่พบบ่อยและการแก้ไข

### 1. ปัญหา SWC Compiler ใน Windows

**อาการ:** 
```
⚠ Attempted to load @next/swc-win32-x64-msvc, but an error occurred
```

**วิธีแก้:**
1. ลบ `--turbopack` ออกจาก script dev ใน `package.json`
2. ใช้ `"dev": "next dev"` แทน `"dev": "next dev --turbopack"`
3. ลบโฟลเดอร์ `.next` และ `node_modules`
4. รัน `npm install` ใหม่
5. รัน `npm run dev`

### 2. ปัญหา Prisma Client

**อาการ:**
```
Error: Prisma Client not found
```

**วิธีแก้:**
```bash
npx prisma generate
```

### 3. ปัญหาการเชื่อมต่อฐานข้อมูล

**อาการ:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**วิธีแก้:**
1. ตรวจสอบว่า MySQL server กำลังทำงาน
2. ตรวจสอบการตั้งค่า DATABASE_URL ในไฟล์ .env
3. ตรวจสอบสิทธิ์การเข้าถึงฐานข้อมูล

### 4. ปัญหา JWT Token

**อาการ:**
```
Error: Token ไม่ถูกต้อง
```

**วิธีแก้:**
1. ลบ cookie ของเว็บไซต์
2. ล็อกอินใหม่
3. ตรวจสอบการตั้งค่า JWT_SECRET

### 5. ปัญหาการ Build

**อาการ:**
```
Build failed because of webpack errors
```

**วิธีแก้:**
1. ตรวจสอบการตั้งค่า environment variables
2. ตรวจสอบการเชื่อมต่อฐานข้อมูล
3. ตรวจสอบการ import modules
4. ลบโฟลเดอร์ `.next` และ build ใหม่

### 6. ปัญหา Port ถูกใช้งาน

**อาการ:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**วิธีแก้:**
1. หยุดโปรเซสที่ใช้ port 3000
2. หรือเปลี่ยน port: `npm run dev -- -p 3001`

### 7. ปัญหา Node.js Version

**อาการ:**
```
Error: Unsupported Node.js version
```

**วิธีแก้:**
1. อัปเกรด Node.js เป็นเวอร์ชัน 18+
2. หรือใช้ nvm เพื่อเปลี่ยน Node.js version

### 8. ปัญหา Dependencies

**อาการ:**
```
Error: Cannot find module
```

**วิธีแก้:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### 9. ปัญหา Environment Variables

**อาการ:**
```
Error: Environment variable not found
```

**วิธีแก้:**
1. สร้างไฟล์ `.env` จาก `env.example`
2. ตรวจสอบการตั้งค่า DATABASE_URL และ JWT_SECRET
3. รีสตาร์ท development server

### 10. ปัญหา Database Schema

**อาการ:**
```
Error: Table doesn't exist
```

**วิธีแก้:**
```bash
npx prisma db push
```

## คำสั่งที่มีประโยชน์สำหรับการแก้ไขปัญหา

```bash
# ล้าง cache และ reinstall dependencies
rm -rf node_modules package-lock.json .next
npm install

# รีเซ็ตฐานข้อมูล
npx prisma db push --force-reset

# ตรวจสอบสถานะฐานข้อมูล
npx prisma db pull

# เปิด Prisma Studio เพื่อตรวจสอบข้อมูล
npx prisma studio

# ตรวจสอบ Prisma schema
npx prisma validate

# Generate Prisma client ใหม่
npx prisma generate

# ตรวจสอบ environment variables
node -e "console.log(process.env.DATABASE_URL)"
```

## การตรวจสอบระบบ

### 1. ตรวจสอบ Node.js Version
```bash
node --version
# ควรเป็น 18+ 
```

### 2. ตรวจสอบ MySQL
```bash
mysql --version
# ควรเป็น 8.0+
```

### 3. ตรวจสอบการเชื่อมต่อฐานข้อมูล
```bash
mysql -u username -p -h localhost
```

### 4. ตรวจสอบ Port
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

## การติดต่อขอความช่วยเหลือ

หากยังมีปัญหาอยู่ ให้ตรวจสอบ:

1. **Logs**: ดู error messages ใน terminal
2. **Browser Console**: เปิด Developer Tools และดู Console
3. **Network Tab**: ตรวจสอบ API calls ใน Network tab
4. **Database**: ตรวจสอบข้อมูลในฐานข้อมูลผ่าน Prisma Studio

## ข้อมูลที่จำเป็นสำหรับการแก้ไขปัญหา

เมื่อขอความช่วยเหลือ กรุณาแจ้ง:

1. **Operating System**: Windows/Mac/Linux
2. **Node.js Version**: `node --version`
3. **MySQL Version**: `mysql --version`
4. **Error Message**: ข้อความ error ที่แสดง
5. **Steps to Reproduce**: ขั้นตอนที่ทำให้เกิดปัญหา
6. **Expected Behavior**: ผลลัพธ์ที่คาดหวัง 