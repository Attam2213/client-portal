
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { clientData } from "@/lib/data"

export default function BillingPage() {
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
            <div className="text-4xl font-bold">{clientData.balance} ₽</div>
            <Button>Пополнить баланс</Button>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-bold mt-8">История транзакций</h2>
      <p className="text-muted-foreground">История пока пуста.</p>
    </div>
  )
}
