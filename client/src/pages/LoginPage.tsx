import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md border">
        <h2 className="text-2xl font-bold mb-6 text-center">Вход</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full p-2 border rounded-md bg-background" placeholder="name@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Пароль</label>
            <input type="password" className="w-full p-2 border rounded-md bg-background" placeholder="••••••••" />
          </div>
          <Button className="w-full">Войти</Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Нет аккаунта? <Link to="/register" className="text-primary hover:underline">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  )
}
