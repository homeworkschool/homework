export const dynamic = 'force-dynamic';

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

// PUT - แก้ไขการบ้าน
export async function PUT(request, { params }) {
  try {
    const userId = getUserIdFromToken(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'กรุณาล็อกอิน' },
        { status: 401 }
      )
    }

    const { id } = params
    const { subject, title, description, dueDate, status } = await request.json()

    // ตรวจสอบว่าการบ้านเป็นของผู้ใช้นี้หรือไม่
    const existingHomework = await prisma.homework.findFirst({
      where: { id: parseInt(id), userId }
    })

    if (!existingHomework) {
      return NextResponse.json(
        { error: 'ไม่พบการบ้านหรือไม่มีสิทธิ์แก้ไข' },
        { status: 404 }
      )
    }

    const updatedHomework = await prisma.homework.update({
      where: { id: parseInt(id) },
      data: {
        subject,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status
      }
    })

    return NextResponse.json(updatedHomework)
  } catch (error) {
    console.error('Update homework error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการแก้ไขการบ้าน' },
      { status: 500 }
    )
  }
}

// DELETE - ลบการบ้าน
export async function DELETE(request, { params }) {
  try {
    const userId = getUserIdFromToken(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'กรุณาล็อกอิน' },
        { status: 401 }
      )
    }

    const { id } = params

    // ตรวจสอบว่าการบ้านเป็นของผู้ใช้นี้หรือไม่
    const existingHomework = await prisma.homework.findFirst({
      where: { id: parseInt(id), userId }
    })

    if (!existingHomework) {
      return NextResponse.json(
        { error: 'ไม่พบการบ้านหรือไม่มีสิทธิ์ลบ' },
        { status: 404 }
      )
    }

    await prisma.homework.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json(
      { message: 'ลบการบ้านสำเร็จ' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete homework error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบการบ้าน' },
      { status: 500 }
    )
  }
} 