import React, { useEffect } from 'react'
import ProjectsHeroSection from '../components/projects/ProjectsHeroSection'
import FeaturedProjectCard from '../components/projects/FeaturedProjectCard'
import ProjectsGridWithFilters from '../components/projects/ProjectsGridWithFilters'
import PreFooterCTA from '../components/common/PreFooterCTA'

const ProjectsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Landmark Healthcare Projects | Sudabelt Medical'
  }, [])

  return (
    <div className="w-full flex flex-col">
      {/* 1. Projects Hero: Hospitals we have helped build and equip */}
      <ProjectsHeroSection />

      {/* 2. Featured Project Card: Enoch & Folu Adeboye Dialysis Centre */}
      <FeaturedProjectCard />

      {/* 3. Interactive Projects Grid with Type & Year Filters and Pagination */}
      <ProjectsGridWithFilters />

      {/* 4. Pre-Footer CTA: Planning a similar project? */}
      <PreFooterCTA
        title="Planning a similar project?"
        subtitle="Speak with our turnkey medical engineering and hospital planning experts."
        primaryLabel="SEND A BRIEF"
        primaryTo="/contact"
        secondaryLabel="CONTACT US"
        secondaryTo="/contact"
        secondaryType="link"
      />
    </div>
  )
}

export default ProjectsPage
