'use client'

import { useSignupModal } from '@/hooks/useSignupModal'
import SignupModal from './SignupModal'

export default function SignupModalProvider() {
  const { isOpen, triggerAction, closeModal } = useSignupModal()

  return (
    <SignupModal
      isOpen={isOpen}
      onClose={closeModal}
      triggerAction={triggerAction}
    />
  )
}
