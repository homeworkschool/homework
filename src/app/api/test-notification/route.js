import { NextResponse } from 'next/server'
import { testLineNotification } from '@/lib/cron'

export async function POST() {
  try {
    await testLineNotification()
    return NextResponse.json({ 
      success: true, 
      message: 'ข้อความทดสอบถูกส่งไปยังทุกคนที่แอด Line Bot แล้ว' 
    })
  } catch (error) {
    console.error('Error testing notification:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการส่งข้อความทดสอบ' 
      },
      { status: 500 }
    )
  }
} 