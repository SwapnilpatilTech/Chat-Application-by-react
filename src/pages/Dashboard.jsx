import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BookOpen, Users, AlertTriangle, DollarSign, TrendingUp, Clock, BarChart3 } from 'lucide-react'
import { selectAllBooks } from '../store/slices/booksSlice'
import { selectAllMembers } from '../store/slices/membersSlice'
import { selectCurrentlyIssuedBooks, selectOverdueBooks, updateOverdueStatus } from '../store/slices/issuedBooksSlice'
import { selectTotalUnpaidFines } from '../store/slices/finesSlice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const books = useSelector(selectAllBooks)
  const members = useSelector(selectAllMembers)
  const issuedBooks = useSelector(selectCurrentlyIssuedBooks)
  const overdueBooks = useSelector(selectOverdueBooks)
  const totalFines = useSelector(selectTotalUnpaidFines)

  useEffect(() => {
    // Update overdue status on dashboard load
    dispatch(updateOverdueStatus())
  }, [dispatch])

  const stats = [
    {
      title: 'Total Books',
      value: books.length,
      icon: BookOpen,
      color: 'bg-blue-500',
      change: '+12 this month'
    },
    {
      title: 'Active Members',
      value: members.filter(m => m.status === 'active').length,
      icon: Users,
      color: 'bg-green-500',
      change: '+5 this month'
    },
    {
      title: 'Books Issued',
      value: issuedBooks.length,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: `${issuedBooks.length} currently out`
    },
    {
      title: 'Overdue Books',
      value: overdueBooks.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: 'Needs attention'
    },
    {
      title: 'Unpaid Fines',
      value: `$${totalFines.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: 'Outstanding amount'
    },
    {
      title: 'Available Books',
      value: books.filter(b => b.status === 'available').length,
      icon: Clock,
      color: 'bg-indigo-500',
      change: 'Ready to issue'
    }
  ]

  const recentActivity = [
    { action: 'Book Issued', details: '"1984" issued to John Doe', time: '2 hours ago', type: 'issue' },
    { action: 'Book Returned', details: '"Pride and Prejudice" returned by Jane Smith', time: '4 hours ago', type: 'return' },
    { action: 'New Member', details: 'Alice Johnson joined as Student member', time: '1 day ago', type: 'member' },
    { action: 'Fine Paid', details: 'Bob Wilson paid $5.50 fine', time: '2 days ago', type: 'fine' },
    { action: 'Book Added', details: '"The Hobbit" added to collection', time: '3 days ago', type: 'book' }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'issue': return '📤'
      case 'return': return '📥'
      case 'member': return '👤'
      case 'fine': return '💰'
      case 'book': return '📚'
      default: return '📋'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="text-lg">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Add Book</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Add Member</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Issue Book</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <BarChart3 className="h-8 w-8 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">View Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Books Alert */}
      {overdueBooks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-sm font-medium text-red-800">
              Attention: {overdueBooks.length} book(s) are overdue
            </h3>
          </div>
          <p className="text-sm text-red-700 mt-1">
            Please follow up with members to return overdue books and collect applicable fines.
          </p>
        </div>
      )}
    </div>
  )
}

export default Dashboard