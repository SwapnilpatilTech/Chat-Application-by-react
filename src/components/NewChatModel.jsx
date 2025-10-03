import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { X, Search, Users, MessageCircle } from 'lucide-react'
import { selectAllUsers } from '../store/slices/usersSlice'
import { selectUser } from '../store/slices/authSlice'
import { createConversation, setActiveConversation } from '../store/slices/chatSlice'

const NewChatModal = ({ onClose }) => {
  const dispatch = useDispatch()
  const allUsers = useSelector(selectAllUsers)
  const currentUser = useSelector(selectUser)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [chatType, setChatType] = useState('direct')
  const [groupName, setGroupName] = useState('')

  const availableUsers = allUsers.filter(user => 
    user.id !== currentUser?.id &&
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUserSelect = (user) => {
    if (chatType === 'direct') {
      // Create direct conversation immediately
      const newConversation = {
        participants: [currentUser.id, user.id],
        type: 'direct',
        name: user.name,
        avatar: user.avatar
      }
      
      dispatch(createConversation(newConversation))
      onClose()
    } else {
      // Add to group selection
      if (selectedUsers.find(u => u.id === user.id)) {
        setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))
      } else {
        setSelectedUsers([...selectedUsers, user])
      }
    }
  }

  const handleCreateGroup = () => {
    if (selectedUsers.length > 0 && groupName.trim()) {
      const newConversation = {
        participants: [currentUser.id, ...selectedUsers.map(u => u.id)],
        type: 'group',
        name: groupName.trim(),
        avatar: null
      }
      
      dispatch(createConversation(newConversation))
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">New Chat</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Type Selection */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setChatType('direct')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-colors ${
                chatType === 'direct'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Direct Chat</span>
            </button>
            <button
              onClick={() => setChatType('group')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-colors ${
                chatType === 'group'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Group Chat</span>
            </button>
          </div>
        </div>

        {/* Group Name Input (for group chats) */}
        {chatType === 'group' && (
          <div className="p-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {availableUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedUsers.find(u => u.id === user.id)
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {user.status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.bio}</p>
                </div>
                {chatType === 'group' && selectedUsers.find(u => u.id === user.id) && (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        {chatType === 'group' && (
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleCreateGroup}
              disabled={selectedUsers.length === 0 || !groupName.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Create Group ({selectedUsers.length} members)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewChatModal