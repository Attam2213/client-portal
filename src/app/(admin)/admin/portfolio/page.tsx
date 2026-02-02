
import { AddPortfolioDialog } from "./add-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deletePortfolioItem } from "@/lib/actions"

// Компонент для удаления (client component wrapper or direct form action)
function DeleteButton({ id }: { id: string }) {
    return (
        <form action={async () => {
            "use server"
            await deletePortfolioItem(id)
        }}>
            <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
            </Button>
        </form>
    )
}

export default async function AdminPortfolioPage() {
  // В реальном приложении здесь будет запрос к БД
  // const items = await prisma.portfolioItem.findMany({ orderBy: { createdAt: 'desc' } })
  
  // Пока БД не подключена, используем пустой массив или try/catch
  let items: any[] = []
  try {
     items = await prisma.portfolioItem.findMany({ orderBy: { createdAt: 'desc' } })
  } catch (e) {
     console.warn("DB connection failed, showing empty list")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Управление портфолио</h1>
        <AddPortfolioDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
             <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground">
                {item.image ? (
                    <span className="text-sm">{item.image}</span>
                ) : (
                    <span className="text-4xl">🖼️</span>
                )}
            </div>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                  <span>{item.title}</span>
                  <DeleteButton id={item.id} />
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-10">
                Нет проектов. Добавьте первый проект!
                <br />
                <span className="text-xs text-red-500">(Требуется подключение к PostgreSQL)</span>
            </p>
        )}
      </div>
    </div>
  )
}
