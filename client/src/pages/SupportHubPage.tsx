import React, { useEffect } from 'react'
import SupportHeroSection from '../components/support/SupportHeroSection'
import SupportActionCardsSection from '../components/support/SupportActionCardsSection'
import SupportFaqSection from '../components/support/SupportFaqSection'

const SupportHubPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Support & Maintenance | Sudabelt Medical'
  }, [])

  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero: Our engineers are on standby */}
      <SupportHeroSection />

      {/* 2. Action Cards: After Sales Support & Medical Training */}
      <SupportActionCardsSection />

      {/* 3. Common questions FAQ with slow, smooth animations */}
      <SupportFaqSection />
    </div>
  )
}

export default SupportHubPage
