import React from 'react'
import { Link } from 'react-router'

const BlogPage: React.FC = () => {
  return (
    <section className="py-16">
      <div className="sudabelt-container">
        <span className="text-eyebrow text-[#006837]">CLINICAL & ENGINEERING JOURNAL</span>
        <h1 className="text-section-heading text-[#001142] mt-2">
          Healthcare Infrastructure Articles & Blog
        </h1>
        <p className="text-[#3B4468] mt-3 max-w-2xl">
          Technical monographs on hemodialysis water standards, therapeutic apheresis protocols, and
          hospital biomedical uptime across West Africa.
        </p>
        <div className="mt-6">
          <Link
            to="/blog/standardizing-dialysis-hygiene-cleancart-c"
            className="h-[46px] px-5 rounded-[5.5px] bg-[#001142] text-white font-bold text-[13px] tracking-[0.05em] uppercase inline-flex items-center"
          >
            Read Sample Blog Article
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogPage
