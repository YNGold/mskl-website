'use client'

import { create } from 'zustand'

interface SignupModalState {
  isOpen: boolean
  triggerAction: string | undefined
  openModal: (action?: string) => void
  closeModal: () => void
}

export const useSignupModal = create<SignupModalState>((set) => ({
  isOpen: false,
  triggerAction: undefined,
  openModal: (action?: string) => set({ isOpen: true, triggerAction: action }),
  closeModal: () => set({ isOpen: false, triggerAction: undefined }),
}))
