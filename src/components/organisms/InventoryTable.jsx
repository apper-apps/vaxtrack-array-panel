import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { format, differenceInDays } from 'date-fns'

const InventoryTable = ({ data, loading, onSort, sortConfig }) => {
  const [selectedItems, setSelectedItems] = useState([])
  
  const getExpirationStatus = (expirationDate) => {
    const daysUntilExpiration = differenceInDays(new Date(expirationDate), new Date())
    
    if (daysUntilExpiration < 0) {
      return { status: 'expired', variant: 'error', label: 'Expired' }
    } else if (daysUntilExpiration <= 30) {
      return { status: 'critical', variant: 'error', label: `${daysUntilExpiration}d` }
    } else if (daysUntilExpiration <= 60) {
      return { status: 'warning', variant: 'warning', label: `${daysUntilExpiration}d` }
    } else if (daysUntilExpiration <= 90) {
      return { status: 'caution', variant: 'info', label: `${daysUntilExpiration}d` }
    } else {
      return { status: 'good', variant: 'success', label: `${daysUntilExpiration}d` }
    }
  }
  
  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return { status: 'out', variant: 'error', label: 'Out of Stock' }
    } else if (quantity <= 10) {
      return { status: 'low', variant: 'warning', label: 'Low Stock' }
    } else if (quantity <= 25) {
      return { status: 'medium', variant: 'info', label: 'Medium Stock' }
    } else {
      return { status: 'good', variant: 'success', label: 'Good Stock' }
    }
  }
  
  const handleSort = (key) => {
    if (onSort) {
      onSort(key)
    }
  }
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(data.map(item => item.Id))
    } else {
      setSelectedItems([])
    }
  }
  
  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }
  
  const columns = [
    { key: 'vaccine', label: 'Vaccine', sortable: true },
    { key: 'family', label: 'Family', sortable: true },
    { key: 'lotNumber', label: 'Lot Number', sortable: true },
    { key: 'expirationDate', label: 'Expiration', sortable: true },
    { key: 'quantityOnHand', label: 'Quantity', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false }
  ]
  
  if (loading) {
    return (
      <Card>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }
  
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedItems.length === data.length && data.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-3 px-4 font-semibold text-gray-900"
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center space-x-1 hover:text-primary transition-colors"
                    >
                      <span>{column.label}</span>
                      <ApperIcon 
                        name={sortConfig?.key === column.key && sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                        size={16} 
                      />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const expirationStatus = getExpirationStatus(item.expirationDate)
              const stockStatus = getStockStatus(item.quantityOnHand)
              
              return (
                <motion.tr
                  key={item.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.Id)}
                      onChange={() => handleSelectItem(item.Id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{item.vaccine}</p>
                      <p className="text-sm text-gray-500">{item.manufacturer}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="default" size="sm">{item.family}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{item.lotNumber}</code>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {format(new Date(item.expirationDate), 'MMM d, yyyy')}
                      </p>
                      <Badge variant={expirationStatus.variant} size="sm">
                        {expirationStatus.label}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">{item.quantityOnHand}</span>
                      <span className="text-sm text-gray-500">doses</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col space-y-1">
                      <Badge variant={expirationStatus.variant} size="sm">
                        {expirationStatus.status === 'expired' ? 'Expired' : 'Expires Soon'}
                      </Badge>
                      <Badge variant={stockStatus.variant} size="sm">
                        {stockStatus.label}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" icon="Eye">
                        View
                      </Button>
                      <Button variant="ghost" size="sm" icon="Edit">
                        Edit
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {selectedItems.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {selectedItems.length} items selected
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm" icon="Download">
                Export
              </Button>
              <Button variant="secondary" size="sm" icon="Archive">
                Archive
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default InventoryTable