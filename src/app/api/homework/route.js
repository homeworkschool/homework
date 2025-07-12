import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'

// ฟังก์ชันสำหรับตรวจสอบ JWT token
function getUserIdFromToken(request) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) return null
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    return decoded.userId
  } catch (error) {
    return null
  }
}

// GET - ดึงรายการการบ้าน
export async function GET(request) {
  try {
    const userId = getUserIdFromToken(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'กรุณาล็อกอิน' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    const status = searchParams.get('status')

    let whereClause = { userId }

    if (subject) {
      whereClause.subject = { contains: subject }
    }

    if (status) {
      whereClause.status = status
    }

    const homeworks = await prisma.homework.findMany({
      where: whereClause,
      orderBy: { dueDate: 'asc' }
    })

    return NextResponse.json(homeworks)
  } catch (error) {
    console.error('Get homework error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    )
  }
}

// POST - เพิ่มการบ้านใหม่
export async function POST(request) {
  try {
    const userId = getUserIdFromToken(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'กรุณาล็อกอิน' },
        { status: 401 }
      )
    }

    const { subject, title, description, dueDate } = await request.json()

    if (!subject || !title || !dueDate) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    const homework = await prisma.homework.create({
      data: {
        subject,
        title,
        description,
        dueDate: new Date(dueDate),
        userId
      }
    })

    return NextResponse.json(homework, { status: 201 })
  } catch (error) {
    console.error('Create homework error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างการบ้าน' },
      { status: 500 }
    )
  }
} 