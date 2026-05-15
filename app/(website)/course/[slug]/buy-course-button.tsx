'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface BuyCourseButtonProps {
  courseId: string
  courseSlug: string
  price: number
  title: string
}

export default function BuyCourseButton({ courseId, courseSlug, price, title }: BuyCourseButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePurchase = async () => {
    setLoading(true)
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    try {
      if (price === 0) {
        // Free course - direct enrollment
        const { error } = await supabase
          .from('enrollments')
          .insert({
            user_id: user.id,
            course_id: courseId
          })

        if (error) {
          console.error('Enrollment error:', error)
          alert('Failed to enroll in course')
        } else {
          router.push(`/student/course/${courseSlug}`)
        }
      } else {
        // Paid course - redirect to payment
        router.push(`/payment/${courseId}`)
      }
    } catch (error) {
      console.error('Purchase error:', error)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handlePurchase} 
      className="w-full" 
      disabled={loading}
    >
      {loading ? 'Processing...' : price === 0 ? 'Enroll for Free' : 'Buy Now'}
    </Button>
  )
}