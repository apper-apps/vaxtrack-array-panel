import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import StatCard from '@/components/molecules/StatCard'
import AlertCard from '@/components/molecules/AlertCard'
import InventoryTable from '@/components/organisms/InventoryTable'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { useVaccineInventory } from '@/hooks/useVaccineInventory'
import { useVaccineAlerts } from '@/hooks/useVaccineAlerts'

const Dashboard = () => {
  const navigate = useNavigate()
  const { inventory, loading, error, loadInventory } = useVaccineInventory()
  const { expiringCount, lowStockCount, expiredCount, totalValue } = useVaccineAlerts()
  
  const [recentInventory, setRecentInventory] = useState([])
  
  useEffect(() => {
    loadInventory()
  }, [])
  
  useEffect(() => {
    if (inventory.length > 0) {
      // Get 5 most recent inventory items
      const recent = inventory
        .sort((a, b) => new Date(b.dateReceived || 0) - new Date(a.dateReceived || 0))
        .slice(0, 5)
      setRecentInventory(recent)
    }
  }, [inventory])
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="cards" />
        <Loading type="table" />
      </div>
    )
  }
  
  if (error) {
    return <Error onRetry={loadInventory} />
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Monitor your vaccine inventory and alerts</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-4">
          <button
            onClick={() => navigate('/receiving')}
            className="btn-primary"
          >
            Receive Vaccines
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Vaccines"
          value={inventory.length}
          icon="Package"
          color="primary"
        />
        <StatCard
          title="Total Doses"
          value={inventory.reduce((sum, item) => sum + item.quantityOnHand, 0)}
          icon="Syringe"
          color="success"
        />
        <StatCard
          title="Vaccine Families"
          value={new Set(inventory.map(item => item.family)).size}
          icon="Grid3x3"
          color="info"
        />
        <StatCard
          title="Estimated Value"
          value={`$${totalValue.toLocaleString()}`}
          icon="DollarSign"
          color="warning"
        />
      </div>
      
      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AlertCard
          title="Expiring Soon"
          count={expiringCount}
          variant="warning"
          icon="Clock"
          onClick={() => navigate('/inventory', { state: { filter: 'expiring' } })}
        />
        <AlertCard
          title="Low Stock"
          count={lowStockCount}
          variant="error"
          icon="AlertTriangle"
          onClick={() => navigate('/inventory', { state: { filter: 'low-stock' } })}
        />
        <AlertCard
          title="Expired"
          count={expiredCount}
          variant="error"
          icon="XCircle"
          onClick={() => navigate('/inventory', { state: { filter: 'expired' } })}
        />
      </div>
      
      {/* Recent Inventory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Inventory</h2>
          <button
            onClick={() => navigate('/inventory')}
            className="text-primary hover:text-primary/80 font-medium"
          >
            View All →
          </button>
        </div>
        
        {recentInventory.length === 0 ? (
          <Empty
            title="No inventory data"
            message="Start by receiving your first vaccine shipment"
            action={() => navigate('/receiving')}
            actionLabel="Receive Vaccines"
            icon="Package"
          />
        ) : (
          <InventoryTable
            data={recentInventory}
            loading={false}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard