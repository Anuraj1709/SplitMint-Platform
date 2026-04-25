import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">₹</span>
              </div>
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-3">SplitMint</h1>
            <p className="text-lg text-gray-600 font-medium">Your Gateway to Karbon</p>
            <p className="text-sm text-gray-500 mt-2">Split expenses. Settle debts. Stay connected.</p>
          </div>

          {/* Features Preview */}
          <div className="space-y-3 mb-8 p-6 bg-white rounded-2xl shadow-sm border border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-bold">👥</span>
              </div>
              <span className="text-sm text-gray-700">Create groups with friends</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">💰</span>
              </div>
              <span className="text-sm text-gray-700">Track shared expenses</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-pink-600 font-bold">🧮</span>
              </div>
              <span className="text-sm text-gray-700">Settle payments easily</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/register"
              className="w-full flex justify-center py-3 px-4 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="w-full flex justify-center py-3 px-4 rounded-xl font-semibold text-base text-indigo-600 bg-white border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Already a member? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
