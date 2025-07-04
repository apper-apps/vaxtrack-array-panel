import { useState, useCallback } from 'react'
import { vaccineLotService } from '@/services/api/vaccineLotService'
import { vaccineService } from '@/services/api/vaccineService'

export const useVaccineInventory = () => {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const loadInventory = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [lots, vaccines] = await Promise.all([
        vaccineLotService.getAll(),
        vaccineService.getAll()
      ])
      
      // Combine lot data with vaccine information
      const inventoryData = lots.map(lot => {
        const vaccine = vaccines.find(v => v.Id === lot.vaccineId)
        return {
          ...lot,
          vaccine: vaccine?.name || 'Unknown',
          family: vaccine?.family || 'Unknown',
          manufacturer: vaccine?.manufacturer || 'Unknown'
        }
      })
      
      setInventory(inventoryData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])
  
  return {
    inventory,
    loading,
    error,
    loadInventory
  }
}