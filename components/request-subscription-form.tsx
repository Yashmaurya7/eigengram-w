'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { requestSubscription } from '@/app/actions/subscriptions'
import { useToast } from '@/hooks/use-toast'

export function RequestSubscriptionForm({ userId, serviceId }: { userId: string; serviceId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      const result = await requestSubscription({ userId, serviceId })
      if (result.success) {
        toast({
          title: 'Request submitted',
          description: 'Your subscription request has been submitted successfully.',
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit subscription request. Please try again.',
        variant: 'destructive',
      })
      console.log("Error: ",error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Request Subscription'}
      </Button>
    </form>
  )
}