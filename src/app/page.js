'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [homeworks, setHomeworks] = useState([])
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    upcoming: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      fetchHomeworks()
    }
  }, [isLoggedIn])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHomeworks = async () => {
    try {
      const response = await fetch('/api/homework')
      if (response.ok) {
        const data = await response.json()
        setHomeworks(data)
        calculateStats(data)
      }
    } catch (error) {
      console.error('Fetch homeworks error:', error)
    }
  }

  const calculateStats = (homeworkList) => {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    const pending = homeworkList.filter(hw => hw.status === 'ยังไม่ส่ง').length
    const completed = homeworkList.filter(hw => hw.status === 'ส่งแล้ว').length
    const upcoming = homeworkList.filter(hw => 
      hw.status === 'ยังไม่ส่ง' && 
      new Date(hw.dueDate) <= tomorrow
    ).length

    setStats({ pending, completed, upcoming })
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsLoggedIn(false)
      setUser(null)
      setHomeworks([])
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const homework = homeworks.find(hw => hw.id === id)
      const response = await fetch(`/api/homework/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...homework,
          status: newStatus
        })
      })

      if (response.ok) {
        fetchHomeworks()
      }
    } catch (error) {
      console.error('Update status error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('คุณต้องการลบการบ้านนี้หรือไม่?')) return

    try {
      const response = await fetch(`/api/homework/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchHomeworks()
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status, dueDate) => {
    if (status === 'ส่งแล้ว') return 'bg-green-100 text-green-800'
    if (status === 'ยังไม่ส่ง') {
      const now = new Date()
      const due = new Date(dueDate)
      if (due < now) return 'bg-red-100 text-red-800'
      if (due <= new Date(now.getTime() + 24 * 60 * 60 * 1000)) return 'bg-orange-100 text-orange-800'
      return 'bg-blue-100 text-blue-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            ระบบบันทึกการบ้าน
          </h1>
          <p className="text-center text-gray-600 mb-6">
            ระบบช่วยจัดการและติดตามการบ้านของคุณ
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => router.push('/register')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              ลงทะเบียน
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              ระบบบันทึกการบ้าน
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">สวัสดี, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  การบ้านที่ต้องทำ
                </h3>
                <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
                <p className="text-sm text-gray-500">รายการ</p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  การบ้านที่ส่งแล้ว
                </h3>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-sm text-gray-500">รายการ</p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  การบ้านที่ใกล้กำหนด
                </h3>
                <p className="text-3xl font-bold text-orange-600">{stats.upcoming}</p>
                <p className="text-sm text-gray-500">รายการ</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  รายการการบ้าน
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push('/admin/notifications')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    จัดการแจ้งเตือน
                  </button>
                  <button
                    onClick={() => router.push('/homework/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    เพิ่มการบ้านใหม่
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              {homeworks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  ยังไม่มีรายการการบ้าน
                </p>
              ) : (
                <div className="space-y-4">
                  {homeworks.map((homework) => (
                    <div key={homework.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {homework.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(homework.status, homework.dueDate)}`}>
                              {homework.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">วิชา:</span> {homework.subject}
                          </p>
                          {homework.description && (
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">รายละเอียด:</span> {homework.description}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">กำหนดส่ง:</span> {formatDate(homework.dueDate)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(homework.id, homework.status === 'ยังไม่ส่ง' ? 'ส่งแล้ว' : 'ยังไม่ส่ง')}
                            className={`px-3 py-1 text-sm rounded ${
                              homework.status === 'ยังไม่ส่ง' 
                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {homework.status === 'ยังไม่ส่ง' ? 'ทำเสร็จแล้ว' : 'ยังไม่เสร็จ'}
                          </button>
                          <button
                            onClick={() => handleDelete(homework.id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
