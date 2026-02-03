import { Outlet, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 p-6 hidden md:block">
        <div className="font-bold text-xl mb-8">Admin Panel</div>
        <nav className="space-y-2">
          <Link to="/admin" className="block"><Button variant="ghost" className="w-full justify-start">Обзор</Button></Link>
          <Link to="/admin/portfolio" className="block"><Button variant="ghost" className="w-full justify-start">Портфолио</Button></Link>
          <Link to="/admin/settings" className="block"><Button variant="ghost" className="w-full justify-start">Настройки</Button></Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
