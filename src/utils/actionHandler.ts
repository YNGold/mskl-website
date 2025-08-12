'use client'

import { useSession } from 'next-auth/react'
import { useSignupModal } from '@/hooks/useSignupModal'
import { useRouter } from 'next/navigation'

export function useActionHandler() {
  const { data: session } = useSession()
  const { openModal } = useSignupModal()
  const router = useRouter()

  const handleAction = (action: string, protectedRoute?: string) => {
    if (!session) {
      // User is not authenticated, show signup modal
      openModal(action)
    } else if (protectedRoute) {
      // User is authenticated, navigate to protected route
      router.push(protectedRoute)
    }
  }

  return { handleAction, isAuthenticated: !!session }
}
