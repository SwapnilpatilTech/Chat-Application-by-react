import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Send, Smile, Paperclip, Phone, Video, MoveVertical as MoreVertical, MessageCircle } from 'lucide-react'
import {
  selectActiveConversationData,
  selectActiveMessages,
  sendMessage,
  saveChatData
} from '../store/slices/chatSlice'
import { selectUser } from '../store/slices/authSlice'
import { selectUserById, selectAllUsers } from '../store/slices/usersSlice'
import MessageItem from './MessageItem'

const ChatWindow = () => {
  const dispatch = useDispatch()
  const activeConversation = useSelector(selectActiveConversationData)
  const messages = useSelector(selectActiveMessages)
  const currentUser = useSelector(selectUser)
  const allUsers = useSelector(selectAllUsers)
  
  const [messageText, setMessageText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Focus input when conversation changes
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [activeConversation])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    
    if (messageText.trim() && activeConversation && currentUser) {
      dispatch(sendMessage({
        conversationId: activeConversation.id,
        senderId: currentUser.id,
        content: messageText.trim(),
        type: 'text'
      }))
      
      setMessageText('')
      dispatch(saveChatData())
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  if (!activeConversation) {
    const registeredUsers = allUsers.filter(u => u.id !== currentUser?.id)

    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="max-w-4xl w-full px-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ChatApp</h3>
            <p className="text-gray-600 mb-6">Connect with people and start chatting</p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500 mb-8">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">💬</span>
                <span>Instant Messages</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">👥</span>
                <span>Group Chats</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📱</span>
                <span>Mobile Ready</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-gray-900">
                Registered Users ({registeredUsers.length})
              </h4>
              <p className="text-sm text-gray-500">Click on a user to start chatting</p>
            </div>

            {registeredUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {registeredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                        user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No other users registered yet</p>
                <p className="text-sm text-gray-400">Invite your friends to join ChatApp!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {activeConversation.type === 'group' ? (
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {activeConversation.name.charAt(0)}
                  </span>
                </div>
              ) : (
                <>
                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {activeConversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{activeConversation.name}</h3>
              <p className="text-sm text-gray-500">
                {activeConversation.type === 'group' 
                  ? `${activeConversation.participants.length} members`
                  : activeConversation.isOnline ? 'Online' : 'Last seen recently'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Video className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUser?.id}
              showAvatar={
                index === 0 || 
                messages[index - 1].senderId !== message.senderId ||
                new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000
              }
            />
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="1"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Smile className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatWindow