import React from 'react'
import { useParams } from 'react-router'

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  return (
    <article className="py-16">
      <div className="sudabelt-container">
        <span className="text-eyebrow text-sudabelt-green">CLINICAL ARTICLE</span>
        <h1 className="text-section-heading text-sudabelt-navy mt-2">
          {slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </h1>
      </div>
    </article>
  )
}

export default BlogDetailPage
