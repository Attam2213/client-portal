export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Панель управления</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg bg-card shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Всего проектов</h3>
          <div className="text-2xl font-bold">12</div>
        </div>
        <div className="p-6 border rounded-lg bg-card shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Клиентов</h3>
          <div className="text-2xl font-bold">5</div>
        </div>
        <div className="p-6 border rounded-lg bg-card shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Доход (мес)</h3>
          <div className="text-2xl font-bold">₽45,000</div>
        </div>
      </div>
    </div>
  )
}
