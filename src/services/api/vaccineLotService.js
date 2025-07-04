import mockVaccineLots from '@/services/mockData/vaccineLots.json'

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const vaccineLotService = {
  async getAll() {
    await delay(300)
    return [...mockVaccineLots]
  },
  
  async getById(id) {
    await delay(200)
    const lot = mockVaccineLots.find(l => l.Id === id)
    if (!lot) {
      throw new Error('Vaccine lot not found')
    }
    return { ...lot }
  },
  
  async create(data) {
    await delay(400)
    const newId = Math.max(...mockVaccineLots.map(l => l.Id), 0) + 1
    const newLot = {
      Id: newId,
      ...data
    }
    mockVaccineLots.push(newLot)
    return { ...newLot }
  },
  
  async update(id, data) {
    await delay(300)
    const index = mockVaccineLots.findIndex(l => l.Id === id)
    if (index === -1) {
      throw new Error('Vaccine lot not found')
    }
    mockVaccineLots[index] = { ...mockVaccineLots[index], ...data }
    return { ...mockVaccineLots[index] }
  },
  
  async delete(id) {
    await delay(300)
    const index = mockVaccineLots.findIndex(l => l.Id === id)
    if (index === -1) {
      throw new Error('Vaccine lot not found')
    }
    const deleted = mockVaccineLots.splice(index, 1)[0]
    return { ...deleted }
  }
}