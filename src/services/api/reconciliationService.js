import mockReconciliations from '@/services/mockData/reconciliations.json'

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const reconciliationService = {
  async getAll() {
    await delay(300)
    return [...mockReconciliations]
  },
  
  async getById(id) {
    await delay(200)
    const reconciliation = mockReconciliations.find(r => r.Id === id)
    if (!reconciliation) {
      throw new Error('Reconciliation record not found')
    }
    return { ...reconciliation }
  },
  
  async create(data) {
    await delay(400)
    const newId = Math.max(...mockReconciliations.map(r => r.Id), 0) + 1
    const newReconciliation = {
      Id: newId,
      ...data
    }
    mockReconciliations.push(newReconciliation)
    return { ...newReconciliation }
  },
  
  async update(id, data) {
    await delay(300)
    const index = mockReconciliations.findIndex(r => r.Id === id)
    if (index === -1) {
      throw new Error('Reconciliation record not found')
    }
    mockReconciliations[index] = { ...mockReconciliations[index], ...data }
    return { ...mockReconciliations[index] }
  },
  
  async delete(id) {
    await delay(300)
    const index = mockReconciliations.findIndex(r => r.Id === id)
    if (index === -1) {
      throw new Error('Reconciliation record not found')
    }
    const deleted = mockReconciliations.splice(index, 1)[0]
    return { ...deleted }
  }
}