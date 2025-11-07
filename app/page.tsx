'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, RefreshCw, Search, Settings, Trash2, Edit, Loader2, 
  CheckCircle2, AlertTriangle, ChevronRight, Menu
} from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'

export default function DashboardPage() {
  const [blueprints, setBlueprints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Load live data from API
  useEffect(() => {
    fetchBlueprints()
  }, [])

  const fetchBlueprints = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/blueprints')
      setBlueprints(res.data)
    } catch (err) {
      console.error('Error fetching blueprints:', err)
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    setRefreshing(true)
    await fetchBlueprints()
    setRefreshing(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blueprint?')) return
    try {
      await axios.delete(`/api/blueprints/${id}`)
      setBlueprints(prev => prev.filter(b => b.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const filteredBlueprints = blueprints.filter(bp =>
    bp.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-semibold">Project Blueprints</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search blueprints..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            onClick={refresh} 
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            {refreshing ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
          </button>

          <Link href="/create">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Plus size={18} /> New
            </button>
          </Link>

          <Link href="/settings">
            <Settings className="text-gray-600 hover:text-gray-900" size={20} />
          </Link>
        </div>
      </header>

      {/* Blueprint Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlueprints.length === 0 ? (
            <div className="text-center text-gray-500 col-span-full py-10">
              <AlertTriangle className="mx-auto mb-2" />
              No blueprints found.
            </div>
          ) : (
            filteredBlueprints.map(bp => (
              <div 
                key={bp.id}
                className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition relative"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-semibold text-lg">{bp.name}</h2>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(bp.id)}>
                      <Trash2 className="text-red-500 hover:text-red-700" size={16} />
                    </button>
                    <Link href={`/edit/${bp.id}`}>
                      <Edit className="text-gray-500 hover:text-gray-700" size={16} />
                    </Link>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{bp.description || 'No description'}</p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    Updated {new Date(bp.updatedAt).toLocaleDateString()}
                  </span>
                  {bp.status === 'complete' ? (
                    <CheckCircle2 className="text-green-500" size={18} />
                  ) : (
                    <ChevronRight className="text-blue-500" size={18} />
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      )}
    </main>
  )
}
