'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Group {
  _id: string;
  name: string;
  participants: any[];
}

export default function Dashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const res = await fetch('/api/groups');
    if (res.ok) {
      const data = await res.json();
      setGroups(data);
    } else if (res.status === 401) {
      router.push('/login');
    }
    setLoading(false);
  };

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newGroupName }),
    });
    if (res.ok) {
      const group = await res.json();
      setGroups([...groups, group]);
      setNewGroupName('');
    } else {
      setError('Failed to create group');
    }
  };

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white shadow-sm border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-white">₹</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SplitMint</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Groups</h1>
          <p className="text-gray-600">Manage and track expenses with your friends</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Group</h2>
          <form onSubmit={createGroup} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Create
            </button>
          </form>
          {error && (
            <p className="mt-3 text-red-600 text-sm font-medium">{error}</p>
          )}
        </div>

        <div>
          {groups.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 border border-indigo-100 text-center">
              <div className="inline-block w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <p className="text-gray-600 text-lg">No groups yet. Create your first group to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <div
                  key={group._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg border border-indigo-100 overflow-hidden transition-all duration-200 hover:scale-105 cursor-pointer group"
                  onClick={() => router.push(`/groups/${group._id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform">
                        👥
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {group.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      {group.participants.length} participant{group.participants.length !== 1 ? 's' : ''}
                    </p>
                    <button
                      className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                    >
                      View Group →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}