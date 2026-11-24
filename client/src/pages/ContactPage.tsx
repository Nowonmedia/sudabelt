import React, { useEffect } from 'react'
import { ContactHeroSection } from '../components/contact/ContactHeroSection'
import { ContactFormAndInfoSection } from '../components/contact/ContactFormAndInfoSection'
import { ContactBranchesSection } from '../components/contact/ContactBranchesSection'

const ContactPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Contact Us | Sudabelt Medical'
  }, [])

  return (
    <div className="w-full flex flex-col">
      {/* 1. Contact Hero: We would love to hear from you */}
      <ContactHeroSection />

      {/* 2. Message Form & Direct Office Information */}
      <ContactFormAndInfoSection />

      {/* 3. Regional Branches: Lagos, Abuja, Kano */}
      <ContactBranchesSection />
    </div>
  )
}

export default ContactPage
