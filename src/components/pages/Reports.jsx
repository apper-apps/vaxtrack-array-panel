import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { useVaccineInventory } from '@/hooks/useVaccineInventory'
import { administrationService } from '@/services/api/administrationService'
import { reconciliationService } from '@/services/api/reconciliationService'
import { format, differenceInDays } from 'date-fns'

const Reports = () => {
  const { inventory, loading: inventoryLoading, error: inventoryError, loadInventory } = useVaccineInventory()
  const [administrations, setAdministrations] = useState([])
  const [reconciliations, setReconciliations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedReport, setSelectedReport] = useState('inventory')
  
  const loadReportData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [administrationsData, reconciliationsData] = await Promise.all([
        administrationService.getAll(),
        reconciliationService.getAll()
      ])
      
      setAdministrations(administrationsData)
      setReconciliations(reconciliationsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadInventory()
    loadReportData()
  }, [])
  
  const generateInventoryReport = () => {
    const report = inventory.map(item => {
      const daysUntilExpiration = differenceInDays(new Date(item.expirationDate), new Date())
      let status = 'Good'
      
      if (daysUntilExpiration < 0) {
        status = 'Expired'
      } else if (daysUntilExpiration <= 30) {
        status = 'Critical'
      } else if (daysUntilExpiration <= 90) {
        status = 'Warning'
      }
      
      return {
        ...item,
        status,
        daysUntilExpiration
      }
    })
    
    return report
  }
  
  const generateAdministrationReport = () => {
    const report = administrations.map(admin => {
      const lot = inventory.find(item => item.Id === admin.lotId)
      return {
        ...admin,
        vaccine: lot?.vaccine || 'Unknown',
        lotNumber: lot?.lotNumber || 'Unknown'
      }
    })
    
    return report
  }
  
  const generateLossReport = () => {
    const expiredVaccines = inventory.filter(item => {
      const daysUntilExpiration = differenceInDays(new Date(item.expirationDate), new Date())
      return daysUntilExpiration < 0
    })
    
    const reconciliationLosses = reconciliations.filter(rec => rec.adjustmentAmount < 0)
    
    return {
      expiredVaccines,
      reconciliationLosses,
      totalExpiredDoses: expiredVaccines.reduce((sum, item) => sum + item.quantityOnHand, 0),
      totalReconciliationLoss: reconciliationLosses.reduce((sum, rec) => sum + Math.abs(rec.adjustmentAmount), 0)
    }
  }
  
  const exportReport = (reportType) => {
    let data = []
    let filename = ''
    
    switch (reportType) {
      case 'inventory':
        data = generateInventoryReport()
        filename = 'vaccine-inventory-report.csv'
        break
      case 'administration':
        data = generateAdministrationReport()
        filename = 'vaccine-administration-report.csv'
        break
      case 'loss':
        const lossReport = generateLossReport()
        data = [...lossReport.expiredVaccines, ...lossReport.reconciliationLosses]
        filename = 'vaccine-loss-report.csv'
        break
      default:
        return
    }
    
    if (data.length === 0) {
      return
    }
    
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
  
  if (inventoryLoading || loading) {
    return <Loading type="table" />
  }
  
  if (inventoryError || error) {
    return <Error onRetry={() => { loadInventory(); loadReportData() }} />
  }
  
  const reportTypes = [
    { key: 'inventory', label: 'Inventory Status', icon: 'Package' },
    { key: 'administration', label: 'Administration Log', icon: 'Syringe' },
    { key: 'loss', label: 'Loss Report', icon: 'AlertTriangle' }
  ]
  
  const inventoryReport = generateInventoryReport()
  const administrationReport = generateAdministrationReport()
  const lossReport = generateLossReport()
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="mt-2 text-gray-600">Generate and view vaccine inventory reports</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            icon="Download"
            onClick={() => exportReport(selectedReport)}
          >
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Report Type Selection */}
      <div className="flex flex-wrap gap-2">
        {reportTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => setSelectedReport(type.key)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
              ${selectedReport === type.key
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            <ApperIcon name={type.icon} size={16} />
            <span>{type.label}</span>
          </button>
        ))}
      </div>
      
      {/* Report Content */}
      <motion.div
        key={selectedReport}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {selectedReport === 'inventory' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Inventory Status</h2>
              <p className="text-gray-600">Complete list of all vaccines with expiration status</p>
            </div>
            
            {inventoryReport.length === 0 ? (
              <Empty
                title="No inventory data"
                message="No vaccines in inventory to report"
                icon="Package"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Vaccine</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Lot Number</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Expiration Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Quantity</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryReport.map((item) => (
                      <tr key={item.Id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{item.vaccine}</p>
                            <p className="text-sm text-gray-500">{item.family}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{item.lotNumber}</code>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-900">
                            {format(new Date(item.expirationDate), 'MMM d, yyyy')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.daysUntilExpiration < 0 
                              ? `${Math.abs(item.daysUntilExpiration)} days ago`
                              : `${item.daysUntilExpiration} days left`
                            }
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-900">{item.quantityOnHand}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              item.status === 'Good' ? 'success' :
                              item.status === 'Warning' ? 'warning' :
                              item.status === 'Critical' ? 'error' : 'error'
                            }
                          >
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
        
        {selectedReport === 'administration' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Administration Log</h2>
              <p className="text-gray-600">Record of all administered vaccine doses</p>
            </div>
            
            {administrationReport.length === 0 ? (
              <Empty
                title="No administration data"
                message="No vaccine administrations recorded"
                icon="Syringe"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Vaccine</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Lot Number</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Age Group</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Doses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {administrationReport.map((admin) => (
                      <tr key={admin.Id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          {format(new Date(admin.dateAdministered), 'MMM d, yyyy')}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">{admin.vaccine}</p>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{admin.lotNumber}</code>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="info">{admin.ageGroup}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-success">{admin.dosesAdministered}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
        
        {selectedReport === 'loss' && (
          <div className="space-y-6">
            <Card>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Vaccine Loss Summary</h2>
                <p className="text-gray-600">Overview of expired vaccines and reconciliation losses</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Expired Vaccines</h3>
                  <p className="text-2xl font-bold text-red-600">{lossReport.totalExpiredDoses}</p>
                  <p className="text-sm text-red-600">Total expired doses</p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Reconciliation Losses</h3>
                  <p className="text-2xl font-bold text-orange-600">{lossReport.totalReconciliationLoss}</p>
                  <p className="text-sm text-orange-600">Total adjustment losses</p>
                </div>
              </div>
              
              {lossReport.expiredVaccines.length === 0 && lossReport.reconciliationLosses.length === 0 ? (
                <Empty
                  title="No losses recorded"
                  message="No expired vaccines or reconciliation losses found"
                  icon="AlertTriangle"
                />
              ) : (
                <div className="space-y-6">
                  {lossReport.expiredVaccines.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Expired Vaccines</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 px-3 font-semibold text-gray-900">Vaccine</th>
                              <th className="text-left py-2 px-3 font-semibold text-gray-900">Lot Number</th>
                              <th className="text-left py-2 px-3 font-semibold text-gray-900">Expiration Date</th>
                              <th className="text-left py-2 px-3 font-semibold text-gray-900">Quantity Lost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lossReport.expiredVaccines.map((item) => (
                              <tr key={item.Id} className="border-b border-gray-100">
                                <td className="py-2 px-3 text-sm">{item.vaccine}</td>
                                <td className="py-2 px-3 text-sm">
                                  <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{item.lotNumber}</code>
                                </td>
                                <td className="py-2 px-3 text-sm">
                                  {format(new Date(item.expirationDate), 'MMM d, yyyy')}
                                </td>
                                <td className="py-2 px-3 text-sm font-semibold text-red-600">{item.quantityOnHand}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {lossReport.reconciliationLosses.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Reconciliation Losses</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 px-3 font-semibold text-gray-900">Date</th>
                              <th className="text-left py-2 px-3 font-semibold text-gray-900">Lot ID</th>
                              <th className="text-left py-2 px-3 font-semibold text-gray-900">Loss Amount</th>
                              <th className="text-left py-2 px-3 font-semibold text-gray-900">Reason</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lossReport.reconciliationLosses.map((loss) => (
                              <tr key={loss.Id} className="border-b border-gray-100">
                                <td className="py-2 px-3 text-sm">
                                  {format(new Date(loss.date), 'MMM d, yyyy')}
                                </td>
                                <td className="py-2 px-3 text-sm">#{loss.lotId}</td>
                                <td className="py-2 px-3 text-sm font-semibold text-red-600">
                                  {Math.abs(loss.adjustmentAmount)}
                                </td>
                                <td className="py-2 px-3 text-sm">{loss.adjustmentReason}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Reports