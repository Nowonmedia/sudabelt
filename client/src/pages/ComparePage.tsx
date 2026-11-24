import React, { useEffect, useState } from 'react'
import CompareHeroSection from '../components/compare/CompareHeroSection'
import type { DepartmentFilter } from '../components/compare/CompareHeroSection'
import ComparisonMatrixSection from '../components/compare/ComparisonMatrixSection'
import DowntimeSimulatorSection from '../components/compare/DowntimeSimulatorSection'
import PreFooterCTA from '../components/common/PreFooterCTA'

const ComparePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<DepartmentFilter>('all')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Why Sudabelt · Live Comparison | Sudabelt Medical'
  }, [])

  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      {/* 1. Hero with Department Filter Pills */}
      <CompareHeroSection
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* 2. Comprehensive 4-Factor Comparison Matrix Table */}
      <ComparisonMatrixSection activeFilter={activeFilter} />

      {/* 3. Interactive Downtime & TCO Evaluator Simulator */}
      <DowntimeSimulatorSection />

      {/* 4. Pre-Footer Call to Action */}
      <PreFooterCTA
        title="Ready to build on a partner, not a vendor?"
        primaryLabel="REQUEST A QUOTE"
        primaryTo="/rfq"
        secondaryLabel="SEE THE TRAINING HUB"
        secondaryTo="/training-hub"
      />
    </div>
  )
}

export default ComparePage
