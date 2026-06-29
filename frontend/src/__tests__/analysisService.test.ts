import { analysisService } from '@/services/analysisService'
import api from '@/lib/api'

jest.mock('@/lib/api')
const mockedApi = api as jest.Mocked<typeof api>

describe('analysisService', () => {
  describe('generateAnalysis', () => {
    it('should call the generate endpoint with ideaId', async () => {
      mockedApi.post.mockResolvedValue({ data: { analysis: { ideaScore: 85 } } })

      const result = await analysisService.generateAnalysis('idea-123')

      expect(mockedApi.post).toHaveBeenCalledWith('/analysis/generate', { ideaId: 'idea-123' })
      expect(result.data.analysis.ideaScore).toBe(85)
    })
  })

  describe('getAnalysis', () => {
    it('should fetch analysis by ideaId', async () => {
      mockedApi.get.mockResolvedValue({ data: { ideaScore: 78 } })

      const result = await analysisService.getAnalysis('idea-123')

      expect(mockedApi.get).toHaveBeenCalledWith('/analysis/idea-123')
      expect(result.data.ideaScore).toBe(78)
    })
  })
})
