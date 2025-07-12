import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json(
    { message: 'ล็อกเอาท์สำเร็จ' },
    { status: 200 }
  )

  // ลบ cookie
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0
  })

  return response
} 