export default function AdminUserDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Details</h1>
      <p className="text-gray-600">User ID: {params.id}</p>
    </div>
  )
}

