import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { IUser, UserRole } from '../types'
import api from '../api/axios'

interface AuthContextType {
  user: IUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
  role: UserRole
  vehicleType?: string
  vehicleNumber?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('ridelink_token')
    const storedUser = localStorage.getItem('ridelink_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('ridelink_token', data.token)
    localStorage.setItem('ridelink_user', JSON.stringify(data.user))
  }

  const register = async (formData: RegisterData) => {
    const { data } = await api.post('/auth/register', formData)
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('ridelink_token', data.token)
    localStorage.setItem('ridelink_user', JSON.stringify(data.user))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('ridelink_token')
    localStorage.removeItem('ridelink_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
