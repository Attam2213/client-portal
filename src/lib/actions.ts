
"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

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
