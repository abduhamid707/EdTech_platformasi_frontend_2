'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function DashboardPage() {
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [popularCourses, setPopularCourses] = useState([])

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/student')
      .then((res) => setStudents(res.data))
    axios
      .get('http://localhost:5000/api/course')
      .then((res) => setCourses(res.data))
    axios
      .get('http://localhost:5000/api/analytics/popular-courses')
      .then((res) => setPopularCourses(res.data))
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  return (
    <div
      className={`min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white`}
    >
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <Switch
          checked={darkMode}
          onCheckedChange={() => setDarkMode(!darkMode)}
          label='Dark Mode'
        />
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='bg-white dark:bg-gray-800'>
          <CardHeader>
            <CardTitle>Talabalar soni</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{students.length}</p>
          </CardContent>
        </Card>
        <Card className='bg-white dark:bg-gray-800'>
          <CardHeader>
            <CardTitle>Kurslar soni</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{courses.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Courses Chart */}
      <div className='mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
        <h2 className='text-xl font-bold mb-4'>Ommabop Kurslar</h2>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={popularCourses.map((course) => ({
              name: course.title,
              count: course.count,
            }))}
          >
            <XAxis dataKey='name' stroke='#ccc' />
            <YAxis stroke='#ccc' />
            <Tooltip
              contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff' }}
            />
            <Bar dataKey='count' fill={darkMode ? '#4F46E5' : '#1D4ED8'} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Students Table */}
      <div className='mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md'>
        <h2 className='text-xl font-bold mb-4'>Talabalar Ro'yxati</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Ism</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ro'yxatdan o'tgan kurslar</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student._id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  {student.enrolledCourses
                    .map((course) => course.title)
                    .join(', ') || 'None'}
                </TableCell>
                <TableCell>
                  {student.progress.length > 0
                    ? `${student.progress[0].completedLessons} / ${student.progress[0].totalLessons}`
                    : 'No Progress'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Kurslar Ro'yxati */}
      <div className='mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md'>
        <h2 className='text-xl font-bold mb-4'>Mavjud Kurslar</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {courses.map((course) => (
            <Card key={course._id} className='bg-white dark:bg-gray-800'>
              <CardHeader>
                <CardTitle>ID: {course._id}</CardTitle>
                <br />
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-700 dark:text-gray-300'>
                  {course.description}
                </p>
                <p className='font-bold mt-2'>Narx: ${course.price}</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  O'qituvchi: {course.instructor}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
