export default function StatusBox({ loading, error, success }) {
    if (loading) return <p className="p-2 bg-gray-100">Procesando...</p>
    if (error) return <p className="p-2 bg-red-100 text-red-500">{error}</p>
    if (success) return <p className="p-2 bg-green-100 text-green-500">{success}</p>
    return null;
}