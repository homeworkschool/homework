'use client'

import { useState } from 'react'

export default function AdminNotifications() {
  const [testResult, setTestResult] = useState(null)
  const [cronResult, setCronResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testNotification = async () => {
    setLoading(true)
    setTestResult(null)
    
    try {
      const response = await fetch('/api/test-notification', {
        method: 'POST'
      })
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ success: false, error: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' })
    } finally {
      setLoading(false)
    }
  }

  const startCronJobs = async () => {
    setLoading(true)
    setCronResult(null)
    
    try {
      const response = await fetch('/api/init-cron', {
        method: 'POST'
      })
      const data = await response.json()
      setCronResult(data)
    } catch (error) {
      setCronResult({ success: false, error: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">จัดการระบบแจ้งเตือน</h1>
          
          <div className="space-y-8">
            {/* การตั้งค่า Line Bot */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">การตั้งค่า Line Bot</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>หมายเหตุ:</strong> ระบบจะส่งข้อความไปยังทุกคนที่แอด Line Bot เป็นเพื่อน</p>
                <p><strong>ข้อดี:</strong> ไม่ต้องหา LINE_USER_ID ของแต่ละคน</p>
                <p><strong>วิธีการ:</strong> เพียงแค่แอด Line Bot เป็นเพื่อนก็จะได้รับข้อความแจ้งเตือน</p>
              </div>
            </div>

            {/* ทดสอบการส่งข้อความ */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">ทดสอบการส่งข้อความ</h2>
              <p className="text-gray-700 mb-4">
                ส่งข้อความทดสอบไปยังทุกคนที่แอด Line Bot เป็นเพื่อน
              </p>
              <button
                onClick={testNotification}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? 'กำลังส่ง...' : 'ทดสอบการส่งข้อความ'}
              </button>
              
              {testResult && (
                <div className={`mt-4 p-4 rounded-lg ${
                  testResult.success 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {testResult.success ? (
                    <p className="font-medium">✅ {testResult.message}</p>
                  ) : (
                    <p className="font-medium">❌ {testResult.error}</p>
                  )}
                </div>
              )}
            </div>

            {/* เริ่มต้น Cron Jobs */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">เริ่มต้น Cron Jobs</h2>
              <p className="text-gray-700 mb-4">
                เริ่มต้นระบบตรวจสอบการบ้านและส่งข้อความแจ้งเตือนอัตโนมัติ
              </p>
              <button
                onClick={startCronJobs}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? 'กำลังเริ่มต้น...' : 'เริ่มต้น Cron Jobs'}
              </button>
              
              {cronResult && (
                <div className={`mt-4 p-4 rounded-lg ${
                  cronResult.success 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {cronResult.success ? (
                    <p className="font-medium">✅ {cronResult.message}</p>
                  ) : (
                    <p className="font-medium">❌ {cronResult.error}</p>
                  )}
                </div>
              )}
            </div>

            {/* ข้อมูลเพิ่มเติม */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">ข้อมูลเพิ่มเติม</h2>
              <div className="space-y-3 text-gray-700">
                <p><strong>ความถี่การตรวจสอบ:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>ทุก 30 นาที - สำหรับการบ้านที่ใกล้หมดเวลา (1 ชั่วโมง)</li>
                  <li>ทุก 1 ชั่วโมง - สำหรับการบ้านที่เหลือเวลา 1 วัน</li>
                  <li>ทุก 6 ชั่วโมง - สำหรับการบ้านที่เหลือเวลา 2 วัน</li>
                </ul>
                <p className="mt-4"><strong>ข้อความแจ้งเตือน:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>🚨 การบ้านที่เหลือเวลา 1 ชั่วโมง</li>
                  <li>⚠️ การบ้านที่เหลือเวลา 1 วัน</li>
                  <li>📚 การบ้านที่เหลือเวลา 2 วัน</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 