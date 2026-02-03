import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, Globe, Server, CreditCard } from "lucide-react"
import { auth } from "@/auth"
import prisma from "@/lib/db"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      domains: true,
      servers: true,
    }
  })

  if (!user) {
    // Should not happen if auth is working, but safe fallback
    return <div>Пользователь не найден</div>
  }

  const activeServicesCount = 
    user.domains.filter(d => d.status === 'active').length + 
    user.servers.filter(s => s.status === 'running').length

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Добро пожаловать, {user.name || "Клиент"}!</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Баланс</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(user.balance).toFixed(2)} ₽</div>
            <p className="text-xs text-muted-foreground">Доступно для оплаты услуг</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные услуги</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeServicesCount}</div>
            <p className="text-xs text-muted-foreground">Домены и сервера</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Мои домены
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Домен</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Истекает</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.domains.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">Нет активных доменов</TableCell>
                    </TableRow>
                ) : (
                    user.domains.map((domain) => (
                    <TableRow key={domain.id}>
                        <TableCell className="font-medium">{domain.name}</TableCell>
                        <TableCell>
                            <Badge variant={domain.status === "active" ? "default" : "destructive"}>
                                {domain.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{domain.expiresAt.toLocaleDateString()}</TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Мои сервера
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Провайдер</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.servers.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">Нет активных серверов</TableCell>
                    </TableRow>
                ) : (
                    user.servers.map((server) => (
                    <TableRow key={server.id}>
                        <TableCell className="font-medium">{server.name}</TableCell>
                        <TableCell>{server.ip}</TableCell>
                        <TableCell>{server.provider}</TableCell>
                        <TableCell>
                            <Badge variant={server.status === "running" ? "outline" : "secondary"}>
                                {server.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}