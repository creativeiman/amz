export default function ScanDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Scan Details</h1>
      <p className="text-gray-600">Scan ID: {params.id}</p>
    </div>
  )
}

