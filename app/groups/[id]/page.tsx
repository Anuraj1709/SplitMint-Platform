'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Participant {
  _id: string;
  name: string;
  email?: string;
  color: string;
}

interface Expense {
  _id: string;
  description: string;
  amount: number;
  date: string;
  payer: Participant;
  splitType: string;
  splits: { participant: Participant; amount: number }[];
}

interface Group {
  _id: string;
  name: string;
  participants: Participant[];
}

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    payerId: '',
    splitType: 'equal',
  });

  useEffect(() => {
    fetchGroupData();
  }, [params.id]);

  const fetchGroupData = async () => {
    const res = await fetch(`/api/groups/${params.id}`);
    if (res.ok) {
      const data = await res.json();
      setGroup(data.group);
      setExpenses(data.expenses);
    } else if (res.status === 401) {
      router.push('/login');
    }
    setLoading(false);
  };

  const addParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/groups/${params.id}/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newParticipantName }),
    });
    if (res.ok) {
      const participant = await res.json();
      setGroup({ ...group!, participants: [...group!.participants, participant] });
      setNewParticipantName('');
    }
  };

  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/groups/${params.id}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newExpense,
        amount: parseFloat(newExpense.amount),
      }),
    });
    if (res.ok) {
      const expense = await res.json();
      setExpenses([expense, ...expenses]);
      setNewExpense({ description: '', amount: '', payerId: '', splitType: 'equal' });
    }
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

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Group not found</p>
          <a href="/dashboard" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
          <div className="w-8"></div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Participants */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Participants</h2>

              {/* Add Participant Form */}
              <form onSubmit={addParticipant} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newParticipantName}
                    onChange={(e) => setNewParticipantName(e.target.value)}
                    placeholder="Add another person"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                  >
                    +
                  </button>
                </div>
              </form>

              {/* Participants List */}
              <div className="space-y-3">
                {group.participants.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No participants yet</p>
                ) : (
                  group.participants.map((participant) => (
                    <div key={participant._id} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: participant.color }}
                      ></div>
                      <span className="font-medium text-gray-900 text-sm">{participant.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Expenses */}
          <div className="lg:col-span-2">
            {/* Add Expense Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Add Expense</h2>
              <form onSubmit={addExpense} className="space-y-5">
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="e.g., Dinner"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    required
                  />
                </div>

                {/* Payer */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Who paid?
                  </label>
                  <select
                    value={newExpense.payerId}
                    onChange={(e) => setNewExpense({ ...newExpense, payerId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    required
                  >
                    <option value="">Select a person</option>
                    {group.participants.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Split Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Split type
                  </label>
                  <select
                    value={newExpense.splitType}
                    onChange={(e) => setNewExpense({ ...newExpense, splitType: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                  >
                    <option value="equal">Equal Split</option>
                    <option value="custom">Custom Amount</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Add Expense
                </button>
              </form>
            </div>

            {/* Expenses List */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Expenses</h2>
              {expenses.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 border border-indigo-100 text-center">
                  <div className="inline-block w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">💳</span>
                  </div>
                  <p className="text-gray-600 text-lg">No expenses yet. Add one to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div key={expense._id} className="bg-white rounded-2xl shadow-md p-6 border border-indigo-100 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{expense.description}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Paid by <span className="font-semibold text-gray-900">{expense.payer.name}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(expense.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-indigo-600">₹{expense.amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500 mt-1">Split {expense.splitType}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}