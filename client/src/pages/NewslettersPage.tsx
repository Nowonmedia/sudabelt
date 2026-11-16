import React from 'react'
import { Link } from 'react-router'

const NewslettersPage: React.FC = () => {
  return (
    <section className="py-16">
      <div className="sudabelt-container">
        <span className="text-eyebrow text-[#006837]">CLINICAL PUBLICATIONS</span>
        <h1 className="text-section-heading text-[#001142] mt-2">
          Unlimited Newsletter & Clinical Insights Archive
        </h1>
        <p className="text-[#3B4468] mt-3 max-w-2xl">
          Browse historical and current editions of the Sudabelt Medical Clinical Bulletin with full
          web reading views and original print PDF downloads.
        </p>
        <div className="mt-6">
          <Link
            to="/resources/newsletters/mirasol-prt-blood-safety-advances"
            className="h-[46px] px-5 rounded-[5.5px] bg-[#001142] text-white font-bold text-[13px] tracking-[0.05em] uppercase inline-flex items-center"
          >
            Read Sample Newsletter Issue
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NewslettersPage
