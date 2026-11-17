import React from 'react'
import { Link } from 'react-router'

const BlogPage: React.FC = () => {
  return (
    <section className="py-16">
      <div className="sudabelt-container">
        <span className="text-eyebrow text-sudabelt-green">CLINICAL & ENGINEERING JOURNAL</span>
        <h1 className="text-section-heading text-sudabelt-navy mt-2">
          Healthcare Infrastructure Articles & Blog
        </h1>
        <p className="text-sudabelt-body mt-3 max-w-2xl">
          Technical monographs on hemodialysis water standards, therapeutic apheresis protocols, and
          hospital biomedical uptime across West Africa.
        </p>
        <div className="mt-6">
          <Link
            to="/blog/standardizing-dialysis-hygiene-cleancart-c"
            className="h-11.5 px-5 rounded-control bg-sudabelt-navy text-white font-bold text-[13px] tracking-[0.05em] uppercase inline-flex items-center"
          >
            Read Sample Blog Article
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogPage
