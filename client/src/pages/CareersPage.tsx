import React, { useEffect } from 'react'
import { CareersHeroSection } from '../components/careers/CareersHeroSection'
import { CareersMetricsSection } from '../components/careers/CareersMetricsSection'
import { CareersOpenRolesSection } from '../components/careers/CareersOpenRolesSection'

const CareersPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Careers | Sudabelt Medical'
  }, [])

  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero: Join our community of experts */}
      <CareersHeroSection />

      {/* 2. Metrics: Work that reaches hospitals across the country */}
      <CareersMetricsSection />

      {/* 3. Open Roles & CV Application Bento */}
      <CareersOpenRolesSection />
    </div>
  )
}

export default CareersPage
