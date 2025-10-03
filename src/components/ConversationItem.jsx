import React from 'react'
import { useSelector } from 'react-redux'
import { formatDistanceToNow } from 'date-fns'
import { selectUserById } from '../store/slices/usersSlice'

const ConversationItem = ({ conversation, isActive, onClick }) => {
  const getConversationAvatar = () => {
    if (conversation.type === 'group') {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-lg">
            {conversation.name.charAt(0)}
          </span>
        </div>
      )
    }
    
    return (
      <div className="relative">
        <img
          src={conversation.avatar}
          alt={conversation.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {conversation.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
    )
  }

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      return 'now'
    }
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isActive 
          ? 'bg-blue-50 border-r-2 border-blue-600' 
          : 'hover:bg-gray-50'
      }`}
    >
      {getConversationAvatar()}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={`font-medium truncate ${
            isActive ? 'text-blue-900' : 'text-gray-900'
          }`}>
            {conversation.name}
          </h3>
          <span className="text-xs text-gray-500">
            {formatTime(conversation.lastMessageTime)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">
            {conversation.lastMessage || 'No messages yet'}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConversationItem