
"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"

export async function logOut() {
  await signOut();
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    console.log("[Action] Attempting login...");
    await signIn('credentials', Object.fromEntries(formData), { redirectTo: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Неверные учетные данные.';
        default:
          return 'Произошла ошибка при входе.';
      }
    }
    // Don't log NEXT_REDIRECT errors as they are expected behavior
    const isRedirect = (error as Error).message === 'NEXT_REDIRECT' || 
                       (error as any).digest?.startsWith('NEXT_REDIRECT') ||
                       (error as Error).message.includes('NEXT_REDIRECT');

    if (isRedirect) {
      console.log("[Action] Redirecting...");
      throw error;
    }
    console.error("Auth error in action:", error);
    throw error;
  }
}

export async function register(prevState: string | undefined, formData: FormData) {
  const name = formData.get("name") as string
  const email = (formData.get("email") as string).toLowerCase().trim()
  const password = formData.get("password") as string
  
  if (!email || !password) {
    return "Email и пароль обязательны"
  }
  
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return "Пользователь с таким email уже существует"
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user"
      },
    })
    
    // Auto login after register (optional, but usually redirects to login)
    // For now we just return success
    
  } catch (error) {
    console.error("Registration error:", error)
    return "Ошибка при регистрации"
  }
  
  // Successful registration
  return "success"
}

export async function createPortfolioItem(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const image = formData.get("image") as string
  const tagsString = formData.get("tags") as string
  
  // Simple validation
  if (!title || !description) {
    throw new Error("Title and description are required")
  }

  const tags = tagsString.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0)

  try {
    await prisma.portfolioItem.create({
      data: {
        title,
        description,
        image: image || "/placeholder.svg?height=400&width=600",
        tags,
      },
    })
    revalidatePath("/admin/portfolio")
    revalidatePath("/") // Обновляем главную
  } catch (error) {
    console.error("Failed to create portfolio item:", error)
    throw new Error("Failed to create item")
  }
}

export async function deletePortfolioItem(id: string) {
    try {
        await prisma.portfolioItem.delete({
            where: { id }
        })
        revalidatePath("/admin/portfolio")
        revalidatePath("/")
    } catch (error) {
        console.error("Failed to delete item:", error)
        throw new Error("Failed to delete item")
    }
}
