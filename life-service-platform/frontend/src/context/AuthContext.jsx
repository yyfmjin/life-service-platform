import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    console.log('AuthContext useEffect:', { token })
    if (token) {
      // 设置axios请求头
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // 获取用户信息
      fetchUserInfo()
    } else {
      // 没有token，设置用户为null，加载完成
      console.log('No token found, setting user to null and loading to false')
      setUser(null)
      setLoading(false)
    }
  }, [])

  const fetchUserInfo = async () => {
    try {
      // 真实API请求
      const response = await authAPI.getMe()
      setUser(response)
    } catch (error) {
      console.error('获取用户信息失败:', error)
      logout()
    } finally {
      // 确保loading状态总是设置为false
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const { email, password } = credentials
      
      // 真实API请求
      const response = await authAPI.login({ email, password })
      const { token, user } = response
      
      // 保存token到localStorage
      localStorage.setItem('token', token)
      // 设置用户信息
      setUser(user)
      
      return { success: true }
    } catch (error) {
      console.error('登录失败:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || '登录失败，请稍后重试' 
      }
    }
  }

  const register = async (userData) => {
    try {
      // 真实API请求
      const response = await authAPI.register(userData)
      const { token, user } = response
      
      // 保存token到localStorage
      localStorage.setItem('token', token)
      // 设置用户信息
      setUser(user)
      
      return { success: true }
    } catch (error) {
      console.error('注册失败:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || '注册失败，请稍后重试' 
      }
    }
  }

  const logout = () => {
    // 清除localStorage中的token
    localStorage.removeItem('token')
    // 清除axios请求头
    delete axios.defaults.headers.common['Authorization']
    // 清除用户信息
    setUser(null)
  }

  const updateProfile = async (profileData) => {
    try {
      // 真实API请求
      const response = await authAPI.updateProfile(profileData)
      setUser(response)
      return { success: true, data: response }
    } catch (error) {
      console.error('更新个人资料失败:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || '更新个人资料失败，请稍后重试' 
      }
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}