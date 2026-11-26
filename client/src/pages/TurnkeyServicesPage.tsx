import React, { useEffect } from 'react'
import ServicesHeroSection from '../components/services/ServicesHeroSection'
import FourServicesSection from '../components/services/FourServicesSection'
import GbagadaOxygenSection from '../components/services/GbagadaOxygenSection'
import PartnerSlider from '../components/home/PartnerSlider'
import CompanyProfileCtaBar from '../components/about/CompanyProfileCtaBar'
import PreFooterCTA from '../components/common/PreFooterCTA'

const TurnkeyServicesPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Turnkey Medical Services & Infrastructure | Sudabelt Medical'
  }, [])

  return (
    <div className="w-full flex flex-col">
      {/* 1. Services Hero: Four Services. One Accountable Partner */}
      <ServicesHeroSection />

      {/* 2. Four Turnkey Services Stack (Cards 01 to 04 with alternating green background) */}
      <FourServicesSection />

      {/* 3. Company Profile Download Section */}
      <CompanyProfileCtaBar />

      {/* 4. Project in Focus: Gbagada General Hospital Oxygen Plant */}
      <GbagadaOxygenSection />

      {/* 5. Partner Brands Infinite Slider with SEO Backlinks (Like Homepage) */}
      <PartnerSlider />      

      {/* 6. Pre-Footer CTA: Tell us what you need. We'll scope it end to end. */}
      <PreFooterCTA
        title="Tell us what you need. We'll scope it end to end."
        subtitle="Our biomedical and turnkey project teams are available to assess facility requirements and provide rapid project scoping."
        primaryLabel="REQUEST A QUOTE"
        primaryTo="/rfq"
        secondaryLabel="MEET THE COMPANY"
        secondaryTo="/about"
        secondaryType="link"
      />
    </div>
  )
}

export default TurnkeyServicesPage
