import { NextResponse } from 'next/server'
import { initCronJobs } from '@/lib/init-cron'

export async function POST() {
  try {
    initCronJobs()
    
    return NextResponse.json(
      { message: 'Cron jobs started successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Init cron error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเริ่มต้น cron jobs' },
      { status: 500 }
    )
  }
} 