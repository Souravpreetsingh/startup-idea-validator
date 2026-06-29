import { authService } from '@/services/authService'
import api from '@/lib/api'

jest.mock('@/lib/api')
const mockedApi = api as jest.Mocked<typeof api>

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('signup', () => {
    it('should send signup request with correct data', async () => {
      const mockResponse = {
        data: {
          user: { _id: '1', fullName: 'Test User', email: 'test@example.com' },
          token: 'test-token',
        },
      }
      mockedApi.post.mockResolvedValue(mockResponse)

      const result = await authService.signup({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      })

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/signup', {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('login', () => {
    it('should send login request with credentials', async () => {
      const mockResponse = {
        data: {
          user: { _id: '1', fullName: 'Test User', email: 'test@example.com' },
          token: 'test-token',
        },
      }
      mockedApi.post.mockResolvedValue(mockResponse)

      const result = await authService.login({
        email: 'test@example.com',
        password: 'Password123!',
      })

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'Password123!',
      })
      expect(result).toEqual(mockResponse)
    })
  })
})
