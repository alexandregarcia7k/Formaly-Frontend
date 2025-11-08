export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header/Navbar aqui */}
      <main className="flex-1">{children}</main>
      {/* Footer aqui */}
    </div>
  )
}
