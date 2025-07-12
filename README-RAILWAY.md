# Homework Notification Server (Railway)

เซิร์ฟเวอร์สำหรับจัดการ cron jobs และส่งแจ้งเตือนการบ้านไปยัง LINE

## การ Deploy บน Railway

### 1. เตรียมไฟล์
- `server.js` - Express server พร้อม cron jobs
- `package-railway.json` - Dependencies สำหรับ Railway
- `Procfile` - บอก Railway วิธีรัน server
- `prisma/schema.prisma` - Database schema (ใช้ไฟล์เดียวกับ Vercel)

### 2. สร้าง Repository แยก
```bash
# สร้างโฟลเดอร์ใหม่สำหรับ Railway
mkdir homework-notification-server
cd homework-notification-server

# คัดลอกไฟล์ที่จำเป็น
cp ../homework/server.js .
cp ../homework/package-railway.json ./package.json
cp ../homework/Procfile .
cp -r ../homework/prisma .
cp ../homework/env-railway.example .env.example
```

### 3. Deploy บน Railway
1. ไปที่ [Railway.app](https://railway.app)
2. สร้าง project ใหม่
3. Connect GitHub repository
4. Set Environment Variables:
   - `DATABASE_URL` - ใช้ database เดียวกับ Vercel
   - `JWT_SECRET` - ใช้ secret เดียวกับ Vercel
   - `LINE_CHANNEL_ACCESS_TOKEN` - LINE Bot token

### 4. ตรวจสอบการทำงาน
- Health check: `GET https://your-railway-app.railway.app/health`
- Test notification: `POST https://your-railway-app.railway.app/test-notification`
- Manual trigger: `POST https://your-railway-app.railway.app/trigger-check`

## API Endpoints

### GET `/`
- ตรวจสอบว่า server ทำงานอยู่

### GET `/health`
- Health check endpoint
- ตรวจสอบสถานะ cron jobs

### POST `/test-notification`
- ทดสอบส่งข้อความไปยัง LINE
- ใช้สำหรับตรวจสอบว่า LINE Bot ทำงานถูกต้อง

### POST `/trigger-check`
- เรียกตรวจสอบการบ้านทันที
- ใช้สำหรับทดสอบการทำงานของ cron job

## Cron Jobs

- **ทุก 30 นาที**: ตรวจสอบการบ้านที่ใกล้หมดเวลา (1 ชั่วโมง)
- **ทุก 1 ชั่วโมง**: ตรวจสอบการบ้านที่เหลือ 1 วัน
- **ทุก 6 ชั่วโมง**: ตรวจสอบการบ้านที่เหลือ 2 วัน

## การแก้ไขปัญหา

### 1. LINE ไม่ได้รับข้อความ
- ตรวจสอบ `LINE_CHANNEL_ACCESS_TOKEN` ถูกต้อง
- ตรวจสอบ LINE Bot เปิดใช้งาน Messaging API
- ตรวจสอบ log ที่ Railway

### 2. Database Connection Error
- ตรวจสอบ `DATABASE_URL` ถูกต้อง
- ตรวจสอบ database server ทำงานอยู่
- ตรวจสอบ firewall/network settings

### 3. Cron Jobs ไม่ทำงาน
- ตรวจสอบ log ที่ Railway
- ใช้ `/trigger-check` เพื่อทดสอบการทำงาน
- ตรวจสอบ timezone settings

## การ Monitor

### Railway Logs
- ดู logs ที่ Railway dashboard
- ตรวจสอบ error messages
- ดู cron job execution logs

### Health Check
```bash
curl https://your-railway-app.railway.app/health
```

### Test Notification
```bash
curl -X POST https://your-railway-app.railway.app/test-notification
``` 