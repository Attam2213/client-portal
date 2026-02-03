"use client"
 
import { useActionState, useEffect } from 'react'
import { register } from '@/lib/actions'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [errorMessage, dispatch, isPending] = useActionState(register, undefined);
  const router = useRouter()
  
  useEffect(() => {
    if (errorMessage === 'success') {
        router.push('/login?registered=true')
    }
  }, [errorMessage, router])

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Регистрация</CardTitle>
        <CardDescription>Создайте аккаунт для доступа к порталу.</CardDescription>
      </CardHeader>
      <form action={dispatch}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Имя</Label>
              <Input id="name" name="name" placeholder="Иван Иванов" required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="client@example.com" required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="confirmPassword">Повторите пароль</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} />
            </div>
            {errorMessage && errorMessage !== 'success' && (
              <div className="text-sm text-red-500">
                {errorMessage}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex justify-between w-full">
            <Link href="/">
                <Button variant="ghost" type="button">Назад</Button>
            </Link>
            <Button type="submit" aria-disabled={isPending}>
                {isPending ? "Регистрация..." : "Создать аккаунт"}
            </Button>
          </div>
           <div className="text-sm text-center text-muted-foreground">
             Уже есть аккаунт? <Link href="/login" className="text-primary hover:underline">Войти</Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}