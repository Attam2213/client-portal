import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

// Fix common environment variable issues (spaces)
if (process.env.NEXTAUTH_URL) {
  const originalUrl = process.env.NEXTAUTH_URL;
  process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL.trim();
  if (originalUrl !== process.env.NEXTAUTH_URL) {
    console.log(`[FIX] Trimmed NEXTAUTH_URL from "${originalUrl}" to "${process.env.NEXTAUTH_URL}"`);
  }
}

if (process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET.trim();
}

console.log("[DEBUG] Auth Config Check:");
console.log(" - NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log(" - NEXTAUTH_SECRET set:", !!process.env.NEXTAUTH_SECRET);
console.log(" - NODE_ENV:", process.env.NODE_ENV);

async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    return user
  } catch (error) {
    console.error("Failed to fetch user:", error)
    throw new Error("Failed to fetch user.")
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  trustHost: true,
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser(email.toLowerCase().trim())
          if (!user) {
            console.log("User not found:", email);
            return null
          }
          
          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (passwordsMatch) {
            console.log("User authenticated:", user.email)
            return user
          } else {
             console.log("Password mismatch for:", email);
          }
        }

        console.log("Invalid credentials")
        return null
      },
    }),
  ],
})