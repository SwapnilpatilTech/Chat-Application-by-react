import React from 'react'
import Sidebar from './Sidebar'
import ChatWindow from './ChatWindow'
import UserProfile from './UserProfile'

const ChatApp = () => {
  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <Sidebar />
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatWindow />
      </div>
      
      {/* User Profile Panel (Optional) */}
      <div className="w-80 bg-white border-l border-gray-200 hidden xl:block">
        <UserProfile />
      </div>
    </div>
  )
}

export default ChatApp