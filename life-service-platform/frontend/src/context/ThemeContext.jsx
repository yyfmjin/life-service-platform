import React, { createContext, useState, useEffect, useContext } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  // 从localStorage获取主题设置，默认深色模式
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme ? savedTheme === 'dark' : true
  })

  useEffect(() => {
    // 更新CSS变量和localStorage
    const root = document.documentElement
    if (isDarkMode) {
      // 深色主题变量
      root.style.setProperty('--dark-bg', '#121212')
      root.style.setProperty('--card-bg', '#1e1e1e')
      root.style.setProperty('--text-primary', '#ffffff')
      root.style.setProperty('--text-secondary', '#b0b0b0')
      root.style.setProperty('--border-color', '#333333')
      root.style.setProperty('--shadow-color', 'rgba(138, 43, 226, 0.3)')
      localStorage.setItem('theme', 'dark')
    } else {
      // 浅色主题变量
      root.style.setProperty('--dark-bg', '#f5f5f5')
      root.style.setProperty('--card-bg', '#ffffff')
      root.style.setProperty('--text-primary', '#000000')
      root.style.setProperty('--text-secondary', '#666666')
      root.style.setProperty('--border-color', '#e0e0e0')
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const value = {
    isDarkMode,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
