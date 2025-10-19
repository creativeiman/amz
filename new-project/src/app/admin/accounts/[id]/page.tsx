export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Details</h1>
      <p className="text-muted-foreground">User ID: {id}</p>
    </div>
  )
}

