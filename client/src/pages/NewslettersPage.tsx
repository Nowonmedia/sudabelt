import React from 'react'
import { Link } from 'react-router'

const NewslettersPage: React.FC = () => {
  return (
    <section className="py-16">
      <div className="sudabelt-container">
        <span className="text-eyebrow text-sudabelt-green">CLINICAL PUBLICATIONS</span>
        <h1 className="text-section-heading text-sudabelt-navy mt-2">
          Unlimited Newsletter & Clinical Insights Archive
        </h1>
        <p className="text-sudabelt-body mt-3 max-w-2xl">
          Browse historical and current editions of the Sudabelt Medical Clinical Bulletin with full
          web reading views and original print PDF downloads.
        </p>
        <div className="mt-6">
          <Link
            to="/resources/newsletters/mirasol-prt-blood-safety-advances"
            className="h-11.5 px-5 rounded-control bg-sudabelt-navy text-white font-bold text-[13px] tracking-[0.05em] uppercase inline-flex items-center"
          >
            Read Sample Newsletter Issue
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NewslettersPage
