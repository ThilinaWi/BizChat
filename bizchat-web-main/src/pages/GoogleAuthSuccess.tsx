import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const GoogleAuthSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')

    if (!accessToken || !refreshToken) {
      navigate('/signin?error=google_auth_failed')
      return
    }

    // Store tokens first
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    // Fetch the full user object so Navbar / auth checks work correctly
    const apiBase = import.meta.env.VITE_API_URL || 'https://biz-chat-backend-crg2djbrfzftaed5.canadacentral-01.azurewebsites.net'
    fetch(`${apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      })
      .catch(() => {/* non-fatal – user data will be re-fetched on next reload */})
      .finally(() => {
        navigate('/')
      })
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF6000] border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Signing you in...</p>
      </div>
    </div>
  )
}

export default GoogleAuthSuccess
