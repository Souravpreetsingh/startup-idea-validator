import api from '@/lib/api'

export interface SignupData {
  fullName: string
  email: string
  password: string
  startupExperience?: string
  industryInterest?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: {
      _id: string
      fullName: string
      email: string
      startupExperience?: string
      industryInterest?: string
    }
    token: string
  }
}

export const authService = {
  async signup(data: SignupData) {
    const res = await api.post<AuthResponse>('/auth/signup', data)
    return res.data
  },

  async login(data: LoginData) {
    const res = await api.post<AuthResponse>('/auth/login', data)
    return res.data
  },

  async getCurrentUser() {
    const res = await api.get('/auth/me')
    return res.data
  },
}
