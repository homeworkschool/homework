// This file is no longer used for cron jobs
// Cron jobs have been moved to Railway deployment (server.js)
// This file is kept for reference only

import axios from 'axios'

// Line Messaging API Configuration
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN

// ฟังก์ชันส่งข้อความไปยังทุกคนที่แอด Line Bot (สำหรับ manual trigger)
export async function sendLineMessage(message) {
  try {
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
      console.log('Line configuration not found, skipping notification')
      return
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
    )

    console.log('Line broadcast message sent successfully:', response.data)
  } catch (error) {
    console.error('Error sending Line broadcast message:', error.response?.data || error.message)
  }
}

// ฟังก์ชันทดสอบการส่งข้อความ (สำหรับ manual trigger)
export async function testLineNotification() {
  const testMessage = '🧪 ทดสอบระบบแจ้งเตือนการบ้าน\n\nระบบแจ้งเตือนการบ้านทำงานปกติ!'
  await sendLineMessage(testMessage)
}

// Note: Cron jobs are now handled by Railway deployment
// See server.js for the actual cron job implementation 