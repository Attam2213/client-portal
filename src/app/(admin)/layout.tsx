
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FolderKanban, Settings, LogOut } from "lucide-react"
import { logOut } from "@/lib/actions"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-white border-r min-h-screen hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="space-y-2 p-4">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Обзор
            </Button>
          </Link>
          <Link href="/admin/portfolio">
            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
              <FolderKanban className="mr-2 h-4 w-4" />
              Портфолио
            </Button>
          </Link>
          <form action={logOut}>
            <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20">
              <LogOut className="mr-2 h-4 w-4" />
              Выход
            </Button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-slate-50 dark:bg-slate-950">
        {children}
      </main>
    </div>
  )
}
