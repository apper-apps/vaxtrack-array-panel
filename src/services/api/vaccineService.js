import mockVaccines from '@/services/mockData/vaccines.json'

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const vaccineService = {
  async getAll() {
    await delay(300)
    return [...mockVaccines]
  },
  
  async getById(id) {
    await delay(200)
    const vaccine = mockVaccines.find(v => v.Id === id)
    if (!vaccine) {
      throw new Error('Vaccine not found')
    }
    return { ...vaccine }
  },
  
  async create(data) {
    await delay(400)
    const newId = Math.max(...mockVaccines.map(v => v.Id), 0) + 1
    const newVaccine = {
      Id: newId,
      ...data
    }
    mockVaccines.push(newVaccine)
    return { ...newVaccine }
  },
  
  async update(id, data) {
    await delay(300)
    const index = mockVaccines.findIndex(v => v.Id === id)
    if (index === -1) {
      throw new Error('Vaccine not found')
    }
    mockVaccines[index] = { ...mockVaccines[index], ...data }
    return { ...mockVaccines[index] }
  },
  
  async delete(id) {
    await delay(300)
    const index = mockVaccines.findIndex(v => v.Id === id)
    if (index === -1) {
      throw new Error('Vaccine not found')
    }
    const deleted = mockVaccines.splice(index, 1)[0]
    return { ...deleted }
  }
}