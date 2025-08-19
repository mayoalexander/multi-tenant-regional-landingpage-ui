export interface Brand {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  phone: string
  states: string[]
  zipCodes: string[]
}

export const brands: Brand[] = [
  {
    id: 'safehaven',
    name: 'SafeHaven Security',
    primaryColor: 'blue',
    secondaryColor: 'slate',
    phone: '1-800-SAFE-HOME',
    states: ['NC', 'SC', 'TN'],
    zipCodes: ['27', '28', '29', '37', '38']
  },
  {
    id: 'topsecurity',
    name: 'TopSecurity',
    primaryColor: 'emerald',
    secondaryColor: 'gray',
    phone: '1-800-TOP-SECURE',
    states: ['GA'],
    zipCodes: ['30', '31']
  },
  {
    id: 'bestsecurity',
    name: 'BestSecurity',
    primaryColor: 'orange',
    secondaryColor: 'amber',
    phone: '1-800-BEST-SEC',
    states: ['FL'],
    zipCodes: ['32', '33', '34']
  },
  {
    id: 'redhawk',
    name: 'RedHawk Alarms',
    primaryColor: 'red',
    secondaryColor: 'rose',
    phone: '1-800-RED-HAWK',
    states: ['AL'],
    zipCodes: ['35', '36']
  }
]

export const getBrandByZip = (zipCode: string): Brand => {
  const prefix = zipCode.substring(0, 2)
  return brands.find(brand => 
    brand.zipCodes.some(zip => prefix.startsWith(zip))
  ) || brands[0]
}

export const getBrandById = (id: string): Brand => {
  return brands.find(brand => brand.id === id) || brands[0]
}