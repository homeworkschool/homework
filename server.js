const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Line Messaging API Configuration
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

// ฟังก์ชันส่งข้อความไปยังทุกคนที่แอด Line Bot
async function sendLineMessage(message) {
  try {
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
      console.log('Line configuration not found, skipping notification');
      return;
    }

    const response = await axios.post(
      'https://api.line.me/v2/bot/message/broadcast',
      {
        messages: [
          {
            type: 'text',
            text: message
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
        }
      }
    );

    console.log('Line broadcast message sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending Line broadcast message:', error.response?.data || error.message);
  }
}

// ฟังก์ชันตรวจสอบการบ้านที่ใกล้หมดเวลา
async function checkUpcomingHomework() {
  try {
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 วัน
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 วัน
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); // 1 ชั่วโมง

    // ดึงการบ้านที่ยังไม่ส่งและใกล้หมดเวลา
    const upcomingHomework = await prisma.homework.findMany({
      where: {
        status: 'ยังไม่ส่ง',
        dueDate: {
          gte: now,
          lte: twoDaysFromNow
        }
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });

    if (upcomingHomework.length === 0) {
      console.log('No upcoming homework found');
      return;
    }

    // แยกการบ้านตามช่วงเวลา
    const homework2Days = upcomingHomework.filter(hw => 
      new Date(hw.dueDate) <= twoDaysFromNow && 
      new Date(hw.dueDate) > oneDayFromNow
    );

    const homework1Day = upcomingHomework.filter(hw => 
      new Date(hw.dueDate) <= oneDayFromNow && 
      new Date(hw.dueDate) > oneHourFromNow
    );

    const homework1Hour = upcomingHomework.filter(hw => 
      new Date(hw.dueDate) <= oneHourFromNow
    );

    // ส่งข้อความแจ้งเตือน
    let message = '';

    if (homework2Days.length > 0) {
      message += '📚 การบ้านที่เหลือเวลา 2 วัน:\n';
      homework2Days.forEach(hw => {
        const dueDate = new Date(hw.dueDate).toLocaleString('th-TH');
        message += `• ${hw.title} (${hw.subject})\n  กำหนดส่ง: ${dueDate}\n  ผู้ใช้: ${hw.user.username}\n\n`;
      });
    }

    if (homework1Day.length > 0) {
      message += '⚠️ การบ้านที่เหลือเวลา 1 วัน:\n';
      homework1Day.forEach(hw => {
        const dueDate = new Date(hw.dueDate).toLocaleString('th-TH');
        message += `• ${hw.title} (${hw.subject})\n  กำหนดส่ง: ${dueDate}\n  ผู้ใช้: ${hw.user.username}\n\n`;
      });
    }

    if (homework1Hour.length > 0) {
      message += '🚨 การบ้านที่เหลือเวลา 1 ชั่วโมง:\n';
      homework1Hour.forEach(hw => {
        const dueDate = new Date(hw.dueDate).toLocaleString('th-TH');
        message += `• ${hw.title} (${hw.subject})\n  กำหนดส่ง: ${dueDate}\n  ผู้ใช้: ${hw.user.username}\n\n`;
      });
    }

    if (message) {
      await sendLineMessage(message.trim());
    }

  } catch (error) {
    console.error('Error checking upcoming homework:', error);
  }
}

// ฟังก์ชันเริ่มต้น cron jobs
function startCronJobs() {
  console.log('Starting cron jobs...');

  // ตรวจสอบทุก 1 ชั่วโมง
  cron.schedule('0 * * * *', async () => {
    console.log('Running hourly homework check...');
    await checkUpcomingHomework();
  });

  // ตรวจสอบทุก 6 ชั่วโมง (สำหรับการบ้านที่เหลือ 2 วัน)
  cron.schedule('0 */6 * * *', async () => {
    console.log('Running 6-hour homework check...');
    await checkUpcomingHomework();
  });

  // ตรวจสอบทุก 30 นาที (สำหรับการบ้านที่ใกล้หมดเวลา)
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running 30-minute homework check...');
    await checkUpcomingHomework();
  });

  console.log('Cron jobs started successfully');
}

// API Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Homework Notification Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Test notification endpoint
app.post('/test-notification', async (req, res) => {
  try {
    const testMessage = '🧪 ทดสอบระบบแจ้งเตือนการบ้าน\n\nระบบแจ้งเตือนการบ้านทำงานปกติ!';
    await sendLineMessage(testMessage);
    res.json({ 
      success: true, 
      message: 'ข้อความทดสอบถูกส่งไปยังทุกคนที่แอด Line Bot แล้ว' 
    });
  } catch (error) {
    console.error('Error testing notification:', error);
    res.status(500).json({ 
      success: false, 
      error: 'เกิดข้อผิดพลาดในการส่งข้อความทดสอบ' 
    });
  }
});

// Manual trigger endpoint
app.post('/trigger-check', async (req, res) => {
  try {
    await checkUpcomingHomework();
    res.json({ 
      success: true, 
      message: 'การตรวจสอบการบ้านถูกเรียกใช้งานแล้ว' 
    });
  } catch (error) {
    console.error('Error triggering check:', error);
    res.status(500).json({ 
      success: false, 
      error: 'เกิดข้อผิดพลาดในการตรวจสอบ' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cronJobs: 'running'
  });
});

// Start server and cron jobs
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startCronJobs();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
