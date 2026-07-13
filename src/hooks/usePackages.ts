import { useState, useEffect } from 'react'
import type { Package, Service } from '@/types'
import { packageService } from '@/services/packageService'
import { serviceLibrary } from '@/services/serviceService'

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    packageService.getAll().then(setPackages).finally(() => setLoading(false))
  }, [])

  return { packages, loading }
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    serviceLibrary.getAll().then(setServices).finally(() => setLoading(false))
  }, [])

  return { services, loading }
}
