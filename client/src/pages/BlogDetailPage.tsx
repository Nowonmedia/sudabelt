import React from 'react'
import { useParams } from 'react-router'

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  return (
    <article className="py-16">
      <div className="sudabelt-container">
        <span className="text-eyebrow text-[#006837]">CLINICAL ARTICLE</span>
        <h1 className="text-section-heading text-[#001142] mt-2">
          {slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </h1>
      </div>
    </article>
  )
}

export default BlogDetailPage
