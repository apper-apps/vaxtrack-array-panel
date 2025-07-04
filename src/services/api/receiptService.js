import mockReceipts from '@/services/mockData/receipts.json'

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const receiptService = {
  async getAll() {
    await delay(300)
    return [...mockReceipts]
  },
  
  async getById(id) {
    await delay(200)
    const receipt = mockReceipts.find(r => r.Id === id)
    if (!receipt) {
      throw new Error('Receipt not found')
    }
    return { ...receipt }
  },
  
  async create(data) {
    await delay(400)
    const newId = Math.max(...mockReceipts.map(r => r.Id), 0) + 1
    const newReceipt = {
      Id: newId,
      ...data
    }
    mockReceipts.push(newReceipt)
    return { ...newReceipt }
  },
  
  async update(id, data) {
    await delay(300)
    const index = mockReceipts.findIndex(r => r.Id === id)
    if (index === -1) {
      throw new Error('Receipt not found')
    }
    mockReceipts[index] = { ...mockReceipts[index], ...data }
    return { ...mockReceipts[index] }
  },
  
  async delete(id) {
    await delay(300)
    const index = mockReceipts.findIndex(r => r.Id === id)
    if (index === -1) {
      throw new Error('Receipt not found')
    }
    const deleted = mockReceipts.splice(index, 1)[0]
    return { ...deleted }
  }
}