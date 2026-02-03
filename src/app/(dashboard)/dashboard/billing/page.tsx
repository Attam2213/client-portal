import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import prisma from "@/lib/db"
import { redirect } from "next/navigation"

export default async function BillingPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      invoices: true
    }
  })

  if (!user) {
    return <div>Пользователь не найден</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Биллинг</h1>
      <Card>
        <CardHeader>
          <CardTitle>Текущий баланс</CardTitle>
          <CardDescription>Управление финансами</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{Number(user.balance).toFixed(2)} ₽</div>
            <Button>Пополнить баланс</Button>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-bold mt-8">История транзакций</h2>
      {user.invoices.length === 0 ? (
        <p className="text-muted-foreground">История пока пуста.</p>
      ) : (
        <div className="space-y-4">
             {user.invoices.map(invoice => (
                 <Card key={invoice.id}>
                     <CardContent className="flex justify-between items-center p-4">
                         <div>
                             <p className="font-bold">Счет #{invoice.id.slice(-6)}</p>
                             <p className="text-sm text-muted-foreground">{invoice.createdAt.toLocaleDateString()}</p>
                         </div>
                         <div className="text-right">
                             <p className="font-bold">{Number(invoice.amount).toFixed(2)} ₽</p>
                             <p className="text-sm text-muted-foreground">{invoice.status}</p>
                         </div>
                     </CardContent>
                 </Card>
             ))}
        </div>
      )}
    </div>
  )
}