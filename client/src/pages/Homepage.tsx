import React from 'react'
import HeroSection from '../components/home/HeroSection'
import PartnerSlider from '../components/home/PartnerSlider'
import ExecutiveMessageSection from '../components/home/ExecutiveMessageSection'
import TurnkeyPillarsSection from '../components/home/TurnkeyPillarsSection'
import ProductsByCategorySection from '../components/home/ProductsByCategorySection'
import ComparisonTeaserSection from '../components/home/ComparisonTeaserSection'
import FeaturedProjectSection from '../components/home/FeaturedProjectSection'
import AwardsAndClientsSection from '../components/home/AwardsAndClientsSection'
import LatestNewslettersSection from '../components/home/LatestNewslettersSection'
import PreFooterCTA from '../components/common/PreFooterCTA'

const Homepage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <PartnerSlider />
      <ExecutiveMessageSection />
      <TurnkeyPillarsSection />
      <ProductsByCategorySection />
      <ComparisonTeaserSection />
      <FeaturedProjectSection />
      <AwardsAndClientsSection />
      <LatestNewslettersSection />
      <PreFooterCTA />
    </div>
  )
}

export default Homepage
