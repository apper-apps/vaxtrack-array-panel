import { useState } from 'react'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { useVaccineAlerts } from '@/hooks/useVaccineAlerts'

const Header = ({ onMenuClick }) => {
  const { expiringCount, lowStockCount } = useVaccineAlerts()
  
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="md"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden"
          />
          <div className="hidden lg:block">
            <h2 className="text-xl font-bold text-gray-900">Vaccine Inventory Management</h2>
            <p className="text-sm text-gray-500">Track, manage, and report vaccine inventory</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Alert Indicators */}
          <div className="flex items-center space-x-2">
            {expiringCount > 0 && (
              <div className="flex items-center space-x-1 px-3 py-1 bg-warning/10 border border-warning/20 rounded-full">
                <ApperIcon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning">{expiringCount} expiring</span>
              </div>
            )}
            {lowStockCount > 0 && (
              <div className="flex items-center space-x-1 px-3 py-1 bg-error/10 border border-error/20 rounded-full">
                <ApperIcon name="AlertCircle" size={16} className="text-error" />
                <span className="text-sm font-medium text-error">{lowStockCount} low stock</span>
              </div>
            )}
          </div>
          
<div className="flex items-center space-x-2">
            <Button
              variant="primary"
              size="sm"
              icon="RefreshCw"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon="LogOut"
              onClick={async () => {
                try {
                  const { ApperUI } = window.ApperSDK
                  await ApperUI.logout()
                  window.location.href = '/login'
                } catch (error) {
                  console.error("Logout failed:", error)
                }
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header