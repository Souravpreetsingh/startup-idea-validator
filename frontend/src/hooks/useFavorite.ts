import { useState, useCallback } from 'react'
import { favoriteService } from '@/services/favoriteService'
import toast from 'react-hot-toast'

export function useFavorite(ideaId: string) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [toggling, setToggling] = useState(false)

  const toggle = useCallback(async () => {
    setToggling(true)
    try {
      if (isFavorited) {
        await favoriteService.removeFavorite(ideaId)
        setIsFavorited(false)
        toast.success('Removed from bookmarks')
      } else {
        await favoriteService.addFavorite(ideaId)
        setIsFavorited(true)
        toast.success('Bookmarked!')
      }
    } catch {
      toast.error('Failed to update bookmark')
    } finally {
      setToggling(false)
    }
  }, [ideaId, isFavorited])

  const check = useCallback(async () => {
    try {
      const res = await favoriteService.getFavorites()
      const ids = res.data.favorites.map((f: any) => f.ideaId?._id || f.ideaId)
      setIsFavorited(ids.includes(ideaId))
    } catch {
      // ignore
    }
  }, [ideaId])

  return { isFavorited, toggling, toggle, check }
}
