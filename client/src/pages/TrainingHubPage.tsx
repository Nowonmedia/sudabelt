import React, { useEffect } from 'react'
import TrainingHeroSection from '../components/training/TrainingHeroSection'
import TrainingEnquirySection from '../components/training/TrainingEnquirySection'
import HowTrainingRunsSection from '../components/training/HowTrainingRunsSection'
import TrainingCtaBanner from '../components/training/TrainingCtaBanner'

const TrainingHubPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Clinical Applications Training & Biomedical Support | Sudabelt Medical'
  }, [])

  const scrollToEnquiry = () => {
    const el = document.getElementById('training-enquiry-form')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToPillars = () => {
    const el = document.getElementById('training-pillars')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <TrainingHeroSection
        onBookClick={scrollToEnquiry}
        onExploreTracksClick={scrollToPillars}
      />

      {/* 2. Two-Column Focus Highlight, 8 Global Brands & Training Enquiry Form */}
      <TrainingEnquirySection />

      {/* 3. How Training Runs: 4-Step Process */}
      <HowTrainingRunsSection />

      {/* 4. Pre-Footer Emerald Green CTA Banner */}
      <TrainingCtaBanner onBookClick={scrollToEnquiry} />
    </div>
  )
}

export default TrainingHubPage
