import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Search, Plus, Settings, LogOut, MessageCircle, Users } from 'lucide-react'
import { 
  selectFilteredConversations, 
  selectActiveConversation,
  setActiveConversation,
  setSearchTerm,
  selectSearchTerm
} from '../store/slices/chatSlice'
import { selectUser, logout } from '../store/slices/authSlice'
import { selectOnlineUsersList } from '../store/slices/usersSlice'
import ConversationItem from './ConversationItem'
import NewChatModal from './NewChatModal'

const Sidebar = () => {
  const dispatch = useDispatch()
  const conversations = useSelector(selectFilteredConversations)
  const activeConversation = useSelector(selectActiveConversation)
  const searchTerm = useSelector(selectSearchTerm)
  const currentUser = useSelector(selectUser)
  const onlineUsers = useSelector(selectOnlineUsersList)
  
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [activeTab, setActiveTab] = useState('chats')

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value))
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout())
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-gray-900">{currentUser?.name}</h2>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="New Chat"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center space-x-2 ${
            activeTab === 'chats'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Chats</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center space-x-2 ${
            activeTab === 'users'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Users</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chats' ? (
          <div className="p-2">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={conversation.id === activeConversation}
                  onClick={() => dispatch(setActiveConversation(conversation.id))}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No conversations yet</p>
                <button
                  onClick={() => setShowNewChatModal(true)}
                  className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Start a new chat
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-2">
            <div className="mb-4 px-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Online Users ({onlineUsers.length})
              </h3>
            </div>
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => {
                  // Create new conversation with this user
                  setShowNewChatModal(true)
                }}
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.bio}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <NewChatModal onClose={() => setShowNewChatModal(false)} />
      )}
    </div>
  )
}

export default Sidebar