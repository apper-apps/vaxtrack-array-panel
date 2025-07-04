import mockAdministrations from '@/services/mockData/administrations.json'

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const administrationService = {
  async getAll() {
    await delay(300)
    return [...mockAdministrations]
  },
  
  async getById(id) {
    await delay(200)
    const administration = mockAdministrations.find(a => a.Id === id)
    if (!administration) {
      throw new Error('Administration record not found')
    }
    return { ...administration }
  },
  
  async create(data) {
    await delay(400)
    const newId = Math.max(...mockAdministrations.map(a => a.Id), 0) + 1
    const newAdministration = {
      Id: newId,
      ...data
    }
    mockAdministrations.push(newAdministration)
    return { ...newAdministration }
  },
  
  async update(id, data) {
    await delay(300)
    const index = mockAdministrations.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Administration record not found')
    }
    mockAdministrations[index] = { ...mockAdministrations[index], ...data }
    return { ...mockAdministrations[index] }
  },
  
  async delete(id) {
    await delay(300)
    const index = mockAdministrations.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Administration record not found')
    }
    const deleted = mockAdministrations.splice(index, 1)[0]
    return { ...deleted }
  }
}