import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Settings, Bell, Shield, Palette, Volume2 } from 'lucide-react'
import { selectActiveConversationData } from '../store/slices/chatSlice'
import { selectUserById } from '../store/slices/usersSlice'
import { selectUser, updateUserStatus } from '../store/slices/authSlice'

const UserProfile = () => {
  const dispatch = useDispatch()
  const activeConversation = useSelector(selectActiveConversationData)
  const currentUser = useSelector(selectUser)
  
  const [activeTab, setActiveTab] = useState('profile')

  // Get the other user in direct conversation
  const otherUserId = activeConversation?.type === 'direct' 
    ? activeConversation.participants.find(id => id !== currentUser?.id)
    : null
  
  const otherUser = useSelector(state => otherUserId ? selectUserById(state, otherUserId) : null)

  const displayUser = activeConversation?.type === 'direct' ? otherUser : null

  const handleStatusChange = (status) => {
    dispatch(updateUserStatus(status))
  }

  if (!activeConversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Select a conversation to view details</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="text-center">
          {activeConversation.type === 'group' ? (
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">
                {activeConversation.name.charAt(0)}
              </span>
            </div>
          ) : (
            <img
              src={displayUser?.avatar}
              alt={displayUser?.name}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
            />
          )}
          <h3 className="text-lg font-semibold text-gray-900">{activeConversation.name}</h3>
          <p className="text-sm text-gray-500">
            {activeConversation.type === 'group' 
              ? `${activeConversation.participants.length} members`
              : displayUser?.bio
            }
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === 'profile'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === 'settings'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'profile' ? (
          <div className="space-y-6">
            {activeConversation.type === 'direct' && displayUser ? (
              <>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">About</h4>
                  <p className="text-gray-900">{displayUser.bio}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Email</h4>
                  <p className="text-gray-900">{displayUser.email}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      displayUser.status === 'online' ? 'bg-green-500' :
                      displayUser.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-gray-900 capitalize">{displayUser.status}</span>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Group Members</h4>
                <div className="space-y-3">
                  {activeConversation.participants.map(participantId => {
                    const user = useSelector(state => selectUserById(state, participantId))
                    return user ? (
                      <div key={user.id} className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.bio}</p>
                        </div>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Your Status</h4>
              <div className="space-y-2">
                {['online', 'away', 'busy', 'offline'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      currentUser?.status === status
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'online' ? 'bg-green-500' :
                      status === 'away' ? 'bg-yellow-500' :
                      status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="capitalize font-medium">{status}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Notifications</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">Push Notifications</span>
                  </div>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">Sound</span>
                  </div>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Appearance</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Palette className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">Dark Mode</span>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile