import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function FormsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Formulários</h1>
          <p className="text-muted-foreground">
            Gerencie seus formulários
          </p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">
          Novo Formulário
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Lista de formulários aqui */}
      </div>
    </div>
  )
}
