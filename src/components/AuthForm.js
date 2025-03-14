'use client'
import { useState } from 'react'
// import { useRouter } from "next/navigation";
import API from '../utils/axiosInstance'
import { useRouter } from 'next/navigation'

const AuthForm = ({ isLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const response = await API.post(endpoint, formData)

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        document.cookie = `accessToken=${response.data.token}; path=/dashboard;`
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-sm p-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-xl font-semibold text-center'>
          {isLogin ? 'Login' : 'Register'}
        </h2>
        {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 border rounded-lg'
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 border rounded-lg'
          />
          <button
            type='submit'
            className='w-full px-4 py-2 text-white bg-blue-500 rounded-lg'
          >
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        {/* <p className='mt-2 text-sm text-center'>
          {isLogin ? 'No account?' : 'Already have an account?'}{' '}
          <a
            href={isLogin ? '/register' : '/login'}
            className='text-blue-500 underline'
          >
            {isLogin ? 'Register' : 'Login'}
          </a>
        </p> */}
      </div>
    </div>
  )
}

export default AuthForm
