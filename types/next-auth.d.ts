import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    username: string
    grade: number
    state: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      username: string
      grade: number
      state: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    grade: number
    state: string
  }
}
