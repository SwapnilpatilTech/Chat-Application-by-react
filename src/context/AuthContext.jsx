import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Mock login - in real app, this would call an API
    const mockUser = {
      id: 1,
      email,
      name: 'John Doe',
      wishlist: []
    }
    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
    return mockUser
  }

  const register = (userData) => {
    // Mock registration - in real app, this would call an API
    const newUser = {
      id: Date.now(),
      ...userData,
      wishlist: []
    }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    return newUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const addToWishlist = (productId) => {
    if (user && !user.wishlist.includes(productId)) {
      const updatedUser = {
        ...user,
        wishlist: [...user.wishlist, productId]
      }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const removeFromWishlist = (productId) => {
    if (user) {
      const updatedUser = {
        ...user,
        wishlist: user.wishlist.filter(id => id !== productId)
      }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const isInWishlist = (productId) => {
    return user?.wishlist?.includes(productId) || false
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}