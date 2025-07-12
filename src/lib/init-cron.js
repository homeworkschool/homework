import { startCronJobs } from './cron'

// ตรวจสอบว่า cron jobs เริ่มต้นแล้วหรือยัง
let cronStarted = false

export function initCronJobs() {
  if (!cronStarted && typeof window === 'undefined') {
    // เริ่มต้น cron jobs เฉพาะใน server side
    startCronJobs()
    cronStarted = true
    console.log('Cron jobs initialized')
  }
} 