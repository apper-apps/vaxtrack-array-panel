import { useState, useEffect } from 'react'
import { useVaccineInventory } from '@/hooks/useVaccineInventory'
import { differenceInDays } from 'date-fns'

export const useVaccineAlerts = () => {
  const { inventory, loadInventory } = useVaccineInventory()
  const [alerts, setAlerts] = useState({
    expiringCount: 0,
    lowStockCount: 0,
    expiredCount: 0,
    totalValue: 0
  })
  
  useEffect(() => {
    loadInventory()
  }, [loadInventory])
  
  useEffect(() => {
    if (inventory.length > 0) {
      const now = new Date()
      
      let expiringCount = 0
      let lowStockCount = 0
      let expiredCount = 0
      let totalValue = 0
      
      inventory.forEach(item => {
        const daysUntilExpiration = differenceInDays(new Date(item.expirationDate), now)
        
        // Count expiring vaccines (within 90 days but not expired)
        if (daysUntilExpiration <= 90 && daysUntilExpiration > 0) {
          expiringCount++
        }
        
        // Count expired vaccines
        if (daysUntilExpiration < 0) {
          expiredCount++
        }
        
        // Count low stock vaccines (25 or fewer doses)
        if (item.quantityOnHand <= 25 && item.quantityOnHand > 0) {
          lowStockCount++
        }
        
        // Estimate total value (assuming $50 per dose average)
        totalValue += item.quantityOnHand * 50
      })
      
      setAlerts({
        expiringCount,
        lowStockCount,
        expiredCount,
        totalValue
      })
    }
  }, [inventory])
  
  return alerts
}