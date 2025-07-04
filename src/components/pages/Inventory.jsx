import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import SearchBar from '@/components/molecules/SearchBar'
import InventoryTable from '@/components/organisms/InventoryTable'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Select from '@/components/atoms/Select'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { useVaccineInventory } from '@/hooks/useVaccineInventory'
import { differenceInDays } from 'date-fns'

const Inventory = () => {
  const location = useLocation()
  const { inventory, loading, error, loadInventory } = useVaccineInventory()
  const [filteredInventory, setFilteredInventory] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'vaccine', direction: 'asc' })
  const [filterBy, setFilterBy] = useState('all')
  const [familyFilter, setFamilyFilter] = useState('all')
  
  const filterOptions = [
    { value: 'all', label: 'All Vaccines' },
    { value: 'expiring', label: 'Expiring Soon' },
    { value: 'expired', label: 'Expired' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ]
  
  const [familyOptions, setFamilyOptions] = useState([])
  
  useEffect(() => {
    loadInventory()
  }, [])
  
  useEffect(() => {
    if (inventory.length > 0) {
      const families = [...new Set(inventory.map(item => item.family))].sort()
      setFamilyOptions([
        { value: 'all', label: 'All Families' },
        ...families.map(family => ({ value: family, label: family }))
      ])
    }
  }, [inventory])
  
  useEffect(() => {
    // Apply filters from navigation state
    if (location.state?.filter) {
      setFilterBy(location.state.filter)
    }
  }, [location.state])
  
  useEffect(() => {
    let filtered = [...inventory]
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.vaccine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.family.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(item => {
        const daysUntilExpiration = differenceInDays(new Date(item.expirationDate), new Date())
        
        switch (filterBy) {
          case 'expiring':
            return daysUntilExpiration <= 90 && daysUntilExpiration > 0
          case 'expired':
            return daysUntilExpiration < 0
          case 'low-stock':
            return item.quantityOnHand <= 25 && item.quantityOnHand > 0
          case 'out-of-stock':
            return item.quantityOnHand === 0
          default:
            return true
        }
      })
    }
    
    // Apply family filter
    if (familyFilter !== 'all') {
      filtered = filtered.filter(item => item.family === familyFilter)
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (sortConfig.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
    
    setFilteredInventory(filtered)
  }, [inventory, searchTerm, filterBy, familyFilter, sortConfig])
  
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }
  
  const handleSearch = (term) => {
    setSearchTerm(term)
  }
  
  const handleFilterChange = (e) => {
    setFilterBy(e.target.value)
  }
  
  const handleFamilyFilterChange = (e) => {
    setFamilyFilter(e.target.value)
  }
  
  const clearFilters = () => {
    setSearchTerm('')
    setFilterBy('all')
    setFamilyFilter('all')
  }
  
  if (loading) {
    return <Loading type="table" />
  }
  
  if (error) {
    return <Error onRetry={loadInventory} />
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vaccine Inventory</h1>
          <p className="mt-2 text-gray-600">Manage and monitor vaccine stock levels</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-4">
          <Button variant="secondary" icon="Download">
            Export
          </Button>
          <Button variant="primary" icon="Plus">
            Add Manual Entry
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search vaccines, lots, or families..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-4">
          <Select
            value={filterBy}
            onChange={handleFilterChange}
            options={filterOptions}
            placeholder="Filter by status"
          />
          <Select
            value={familyFilter}
            onChange={handleFamilyFilterChange}
            options={familyOptions}
            placeholder="Filter by family"
          />
          {(searchTerm || filterBy !== 'all' || familyFilter !== 'all') && (
            <Button variant="secondary" onClick={clearFilters} icon="X">
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{filteredInventory.length}</p>
            </div>
            <Badge variant="info" size="lg">{filteredInventory.length}</Badge>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Doses</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInventory.reduce((sum, item) => sum + item.quantityOnHand, 0)}
              </p>
            </div>
            <Badge variant="success" size="lg">
              {filteredInventory.reduce((sum, item) => sum + item.quantityOnHand, 0)}
            </Badge>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInventory.filter(item => {
                  const days = differenceInDays(new Date(item.expirationDate), new Date())
                  return days <= 90 && days > 0
                }).length}
              </p>
            </div>
            <Badge variant="warning" size="lg">
              {filteredInventory.filter(item => {
                const days = differenceInDays(new Date(item.expirationDate), new Date())
                return days <= 90 && days > 0
              }).length}
            </Badge>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInventory.filter(item => item.quantityOnHand <= 25 && item.quantityOnHand > 0).length}
              </p>
            </div>
            <Badge variant="error" size="lg">
              {filteredInventory.filter(item => item.quantityOnHand <= 25 && item.quantityOnHand > 0).length}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Inventory Table */}
      {filteredInventory.length === 0 ? (
        <Empty
          title="No inventory items found"
          message="No vaccines match your current filters"
          action={clearFilters}
          actionLabel="Clear Filters"
          icon="Package"
        />
      ) : (
        <InventoryTable
          data={filteredInventory}
          loading={false}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      )}
    </div>
  )
}

export default Inventory