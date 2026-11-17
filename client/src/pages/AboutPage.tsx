import React, { useEffect } from 'react'
import AboutHeroSection from '../components/about/AboutHeroSection'
import VisionMissionSection from '../components/about/VisionMissionSection'
import CompanyProfileCtaBar from '../components/about/CompanyProfileCtaBar'
import CareStandardSection from '../components/about/CareStandardSection'
import BrandMilestonesSection from '../components/about/BrandMilestonesSection'
import AboutRecognitionSection from '../components/about/AboutRecognitionSection'
import TeamSection from '../components/about/TeamSection'
import NationwidePresenceSection from '../components/about/NationwidePresenceSection'
import PreFooterCTA from '../components/common/PreFooterCTA'

const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'About Us | Sudabelt Medical'
  }, [])

  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero Section with Clinical Image + Metric Bar */}
      <AboutHeroSection />

      {/* 2. Vision & Mission Cards */}
      <VisionMissionSection />

      {/* 3. Company Profile Download CTA Bar */}
      <CompanyProfileCtaBar />

      {/* 4. The C.A.R.E. Standard 2x2 Grid */}
      <CareStandardSection />

      {/* 5. Brand Milestones / OEM Partnerships + ISO 9001:2015 Modal */}
      <BrandMilestonesSection />

      {/* 6. Awards & Government Recognition on Dark Navy Backdrop */}
      <AboutRecognitionSection />

      {/* 7. Leadership Team Behind Sudabelt with Circular Avatars & Bios */}
      <TeamSection />

      {/* 8. Regional Presence & Nationwide Service Hubs */}
      <NationwidePresenceSection />

      {/* 9. Pre-Footer Common CTA */}
      <PreFooterCTA />
    </div>
  )
}

export default AboutPage
