import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NavigationItem from '@/components/molecules/NavigationItem'
import ApperIcon from '@/components/ApperIcon'
import { useVaccineAlerts } from '@/hooks/useVaccineAlerts'

const Sidebar = ({ isOpen, onClose }) => {
  const { expiringCount, lowStockCount } = useVaccineAlerts()
  
  const navigation = [
    { to: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
    { to: '/receiving', icon: 'PackageOpen', label: 'Receiving' },
    { to: '/administration', icon: 'Syringe', label: 'Administration' },
    { to: '/inventory', icon: 'Package', label: 'Inventory', badge: expiringCount > 0 ? expiringCount : null },
    { to: '/reconciliation', icon: 'Calculator', label: 'Reconciliation' },
    { to: '/reports', icon: 'FileText', label: 'Reports' }
  ]
  
  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block sidebar-desktop">
      <div className="w-64 bg-white border-r border-gray-200 h-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg">
              <ApperIcon name="Shield" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">VaxTrack</h1>
              <p className="text-sm text-gray-500">Pro</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavigationItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
              />
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
  
  // Mobile Sidebar
  const MobileSidebar = () => (
    <div className="lg:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={onClose}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-64 h-full bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg">
                      <ApperIcon name="Shield" size={24} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">VaxTrack</h1>
                      <p className="text-sm text-gray-500">Pro</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} className="text-gray-500" />
                  </button>
                </div>
                
                <nav className="space-y-2">
                  {navigation.map((item) => (
                    <NavigationItem
                      key={item.to}
                      to={item.to}
                      icon={item.icon}
                      label={item.label}
                      badge={item.badge}
                      onClick={onClose}
                    />
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
  
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

export default Sidebar