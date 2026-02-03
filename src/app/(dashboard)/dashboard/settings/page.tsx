import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Настройки</h1>
      <Card>
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
          <CardDescription>Управляйте своими личными данными.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Email" disabled value="client@example.com" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
             <Label htmlFor="name">Имя</Label>
             <Input type="text" id="name" placeholder="Имя" />
          </div>
          <Button>Сохранить</Button>
        </CardContent>
      </Card>
    </div>
  )
}
