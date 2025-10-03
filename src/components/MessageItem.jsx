import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'
import { MoreVertical, Edit, Trash2, Check, X } from 'lucide-react'
import { selectUserById } from '../store/slices/usersSlice'
import { editMessage, deleteMessage, saveChatData } from '../store/slices/chatSlice'

const MessageItem = ({ message, isOwn, showAvatar }) => {
  const dispatch = useDispatch()
  const sender = useSelector(state => selectUserById(state, message.senderId))

  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(message.content)

  const formatTime = (timestamp) => {
    try {
      return format(new Date(timestamp), 'HH:mm')
    } catch {
      return ''
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setShowMenu(false)
  }

  const handleSaveEdit = () => {
    if (editedContent.trim() && editedContent !== message.content) {
      dispatch(editMessage({
        conversationId: message.conversationId,
        messageId: message.id,
        newContent: editedContent.trim()
      }))
      dispatch(saveChatData())
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedContent(message.content)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      dispatch(deleteMessage({
        conversationId: message.conversationId,
        messageId: message.id
      }))
      dispatch(saveChatData())
    }
    setShowMenu(false)
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {showAvatar && !isOwn && (
          <img
            src={sender?.avatar}
            alt={sender?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}

        <div className="relative">
          {isEditing ? (
            <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="2"
                autoFocus
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={handleCancelEdit}
                  className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                  title="Save"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                className={`px-4 py-2 rounded-2xl ${
                  isOwn
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                }`}
              >
                {!isOwn && showAvatar && (
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    {sender?.name}
                  </p>
                )}

                <p className="text-sm break-words">{message.content}</p>
                {message.edited && (
                  <p className="text-xs opacity-70 mt-1">(edited)</p>
                )}
              </div>

              <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                {formatTime(message.timestamp)}
                {isOwn && (
                  <span className="ml-1">
                    {message.status === 'sent' && '✓'}
                    {message.status === 'delivered' && '✓✓'}
                    {message.status === 'read' && <span className="text-blue-500">✓✓</span>}
                  </span>
                )}
              </p>

              {isOwn && (
                <div className={`absolute ${isOwn ? '-left-8' : '-right-8'} top-1`}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {showMenu && (
                    <div className="absolute top-0 right-0 mt-6 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                      <button
                        onClick={handleEdit}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageItem