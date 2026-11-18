import React, { useState } from 'react'
import TrainingHeroSection from '../components/training/TrainingHeroSection'
import TrainingTracksSection from '../components/training/TrainingTracksSection'
import HowTrainingRunsSection from '../components/training/HowTrainingRunsSection'
import TrainingCtaBanner from '../components/training/TrainingCtaBanner'
import TrainingBookingModal from '../components/training/TrainingBookingModal'

const TrainingHubPage: React.FC = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<string | undefined>()

  const handleOpenBooking = (track?: string) => {
    setSelectedTrack(track)
    setIsBookingModalOpen(true)
  }

  const handleScrollToTracks = () => {
    const el = document.getElementById('training-tracks')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section: Dark Clinical Image, Zero Blue Background, Headline, CTAs & KPI metrics */}
      <TrainingHeroSection
        onBookClick={handleOpenBooking}
        onExploreTracksClick={handleScrollToTracks}
      />

      {/* 2. Training Tracks Grid: 4 Certification Tracks */}
      <TrainingTracksSection onSelectTrack={handleOpenBooking} />

      {/* 3. How Training Runs: 4-Step Process */}
      <HowTrainingRunsSection />

      {/* 4. Pre-Footer Emerald Green CTA Banner */}
      <TrainingCtaBanner onBookClick={() => handleOpenBooking()} />

      {/* 5. Institutional Training Booking Modal */}
      <TrainingBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedTrack={selectedTrack}
      />
    </div>
  )
}

export default TrainingHubPage