
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, CreditCard, Settings, LogOut } from "lucide-react"
import { logOut } from "@/lib/actions"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-100 dark:bg-slate-900 border-r min-h-screen hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold">Client Portal</h2>
        </div>
        <nav className="space-y-2 p-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Обзор
            </Button>
          </Link>
          <Link href="/dashboard/billing">
            <Button variant="ghost" className="w-full justify-start">
              <CreditCard className="mr-2 h-4 w-4" />
              Биллинг
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Настройки
            </Button>
          </Link>
          <form action={logOut}>
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100">
              <LogOut className="mr-2 h-4 w-4" />
              Выход
            </Button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
