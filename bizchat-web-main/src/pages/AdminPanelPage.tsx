import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { api, getUser } from '../utils/api'

// ── Types ────────────────────────────────────────────────────────

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  role: string
  googleId?: string
  createdAt: string
  updatedAt: string
}

interface UserStats {
  total: number
  byRole: { _id: string; count: number }[]
}

// ── Shared UI ────────────────────────────────────────────────────

const Input = ({
  label,
  required,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
      {label}{required && <span className="text-[#FF6000] ml-0.5">*</span>}
    </label>
    <input
      required={required}
      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6000]/30 focus:border-[#FF6000] transition-colors"
      {...props}
    />
  </div>
)

// ── Create Manager Tab ───────────────────────────────────────────

const CreateManagerTab = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!/^\d{10}$/.test(form.phoneNumber.trim())) {
      setError('Phone number must be exactly 10 digits')
      return
    }
    setLoading(true)
    try {
      const res = await api<{ message: string; data: User }>('/admin/managers', {
        method: 'POST',
        body: form,
        auth: true,
      })
      setSuccess(`Manager "${res.data.firstName} ${res.data.lastName}" created successfully!`)
      setForm({ firstName: '', lastName: '', email: '', phoneNumber: '', password: '' })
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to create manager')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Create Manager Account</h2>
      <p className="text-sm text-gray-500 mb-6">
        Create accounts for event managers who can manage events, tickets, and verify bookings.
      </p>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="First Name" value={form.firstName} onChange={set('firstName')} required />
          <Input label="Last Name" value={form.lastName} onChange={set('lastName')} required />
        </div>
        <Input label="Email" type="email" value={form.email} onChange={set('email')} required />
        <Input
          label="Phone Number"
          type="tel"
          value={form.phoneNumber}
          onChange={set('phoneNumber')}
          placeholder="0761234567"
          required
        />
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
            Password<span className="text-[#FF6000] ml-0.5">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              minLength={6}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6000]/30 focus:border-[#FF6000] transition-colors pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF6000] hover:bg-[#e55500] text-white py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Manager'}
        </button>
      </form>
    </div>
  )
}

// ── All Users Tab ────────────────────────────────────────────────

const UsersTab = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [stats, setStats] = useState<UserStats | null>(null)

  // Edit modal
  const [editTarget, setEditTarget] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phoneNumber: '', role: '' })
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState('')

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const query = roleFilter ? `&role=${roleFilter}` : ''
      const res = await api<{
        success: boolean
        data: User[]
        pagination: { page: number; pages: number; total: number }
      }>(`/admin/users?page=${page}&limit=15${query}`, { auth: true })
      // backend returns { success, data: [...], pagination: {...} }
      const list = Array.isArray(res.data) ? res.data : (res as unknown as { users: User[] }).users ?? []
      setUsers(list)
      setTotalPages(res.pagination?.pages ?? 1)
    } catch (err: unknown) {
      setUsers([])
      setError((err as Error).message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [page, roleFilter])

  const fetchStats = useCallback(async () => {
    try {
      const res = await api<{ success: boolean; data: { total: number; byRole: Record<string, number> | { _id: string; count: number }[] } }>('/admin/users/stats', { auth: true })
      if (res.data && typeof res.data.total === 'number') {
        // backend returns byRole as { user: 5, manager: 2 } (plain object)
        const raw = res.data.byRole
        const byRole: { _id: string; count: number }[] = Array.isArray(raw)
          ? raw
          : Object.entries(raw as Record<string, number>).map(([_id, count]) => ({ _id, count }))
        setStats({ total: res.data.total, byRole })
      }
    } catch {
      // silent — stats are decorative
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api(`/admin/users/${userId}`, {
        method: 'PUT',
        body: { role: newRole },
        auth: true,
      })
      fetchUsers()
      fetchStats()
    } catch {
      // silent
    }
  }

  const openEdit = (u: User) => {
    setEditTarget(u)
    setEditForm({ firstName: u.firstName || '', lastName: u.lastName || '', phoneNumber: u.phoneNumber || '', role: u.role })
    setEditError('')
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTarget) return
    if (editForm.phoneNumber && !/^\d{10}$/.test(editForm.phoneNumber.trim())) {
      setEditError('Phone number must be exactly 10 digits')
      return
    }
    setEditSaving(true)
    setEditError('')
    try {
      await api(`/admin/users/${editTarget._id}`, {
        method: 'PUT',
        body: editForm,
        auth: true,
      })
      setEditTarget(null)
      fetchUsers()
      fetchStats()
    } catch (err: unknown) {
      setEditError((err as Error).message || 'Failed to update user')
    } finally {
      setEditSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api(`/admin/users/${deleteTarget._id}`, { method: 'DELETE', auth: true })
      setDeleteTarget(null)
      fetchUsers()
      fetchStats()
    } catch {
      // silent
    } finally {
      setDeleting(false)
    }
  }

  const roles = ['', 'user', 'manager', 'admin']

  return (
    <div>
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Users</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{stats.total}</p>
          </div>
          {stats.byRole.map((r) => (
            <div key={r._id} className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {r._id.charAt(0).toUpperCase() + r._id.slice(1)}s
              </p>
              <p className="text-2xl font-black text-gray-900 mt-1">{r.count}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Filter:</span>
        {roles.map((r) => (
          <button
            key={r || 'all'}
            onClick={() => { setRoleFilter(r); setPage(1) }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
              roleFilter === r
                ? 'bg-[#FF6000] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {r || 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#FF6000] border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading users...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left max-w-lg mx-auto">
            <p className="text-red-700 font-medium text-sm mb-1">Failed to load users</p>
            <p className="text-red-500 text-xs font-mono">{error}</p>
          </div>
          <button
            onClick={() => fetchUsers()}
            className="text-sm bg-[#FF6000] text-white px-4 py-2 rounded-lg hover:bg-[#e55500] transition-colors"
          >
            Retry
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No users found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Name</th>
                <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Email</th>
                <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Phone</th>
                <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Role</th>
                <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Joined</th>
                <th className="text-right py-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 font-medium text-gray-900">
                    {[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}
                    {u.googleId && (
                      <span className="ml-1.5 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">
                        Google
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-gray-600">{u.email}</td>
                  <td className="py-3 px-3 text-gray-600">{u.phoneNumber || '—'}</td>
                  <td className="py-3 px-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#FF6000]/30 bg-white"
                    >
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-gray-500 text-xs">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(u)}
                        className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit User Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Edit User</h3>
              <button onClick={() => setEditTarget(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleEditSubmit} className="px-6 py-5 space-y-4">
              {editError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{editError}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={editForm.firstName}
                  onChange={(e) => { setEditForm((p) => ({ ...p, firstName: e.target.value })); setEditError('') }}
                  required
                />
                <Input
                  label="Last Name"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm((p) => ({ ...p, lastName: e.target.value }))}
                />
              </div>
              <Input
                label="Phone Number"
                type="tel"
                value={editForm.phoneNumber}
                onChange={(e) => { setEditForm((p) => ({ ...p, phoneNumber: e.target.value })); setEditError('') }}
                placeholder="10 digits"
              />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6000]/30 focus:border-[#FF6000] transition-colors"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="flex-1 py-2.5 rounded-lg bg-[#FF6000] hover:bg-[#e55500] text-white text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {editSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center mb-1">Delete User</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-800">"{[deleteTarget.firstName, deleteTarget.lastName].filter(Boolean).join(' ') || deleteTarget.email}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────

type Tab = 'create-manager' | 'users'

const AdminPanelPage = () => {
  const navigate = useNavigate()
  const user = getUser()
  const [activeTab, setActiveTab] = useState<Tab>('create-manager')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
    }
  }, [user, navigate])

  if (!user || user.role !== 'admin') return null

  const tabs: { key: Tab; label: string }[] = [
    { key: 'create-manager', label: 'Create Manager' },
    { key: 'users', label: 'All Users' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar solid />

      <section className="pt-28 pb-6 px-4 md:px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1">Admin Panel</h1>
          <p className="text-gray-400 text-sm">
            Manage users, create manager accounts, and oversee the platform
          </p>

          <div className="flex gap-1 mt-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === t.key
                    ? 'bg-gray-50 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {activeTab === 'create-manager' && <CreateManagerTab />}
        {activeTab === 'users' && <UsersTab />}
      </section>

      <Footer />
    </div>
  )
}

export default AdminPanelPage
