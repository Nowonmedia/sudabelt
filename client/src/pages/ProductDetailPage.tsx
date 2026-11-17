import React from 'react'
import { useParams } from 'react-router'

const ProductDetailPage: React.FC = () => {
  const { category, slug } = useParams<{ category: string; slug: string }>()

  return (
    <section className="py-16">
      <div className="sudabelt-container">
        <span className="text-eyebrow text-sudabelt-green">
          {category?.replace(/-/g, ' ') || 'PRODUCT SPECIFICATION'}
        </span>
        <h1 className="text-section-heading text-sudabelt-navy mt-2">
          {slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </h1>
        <p className="text-tech-mono text-sudabelt-label mt-2">
          Route: /products/{category}/{slug}
        </p>
      </div>
    </section>
  )
}

export default ProductDetailPage
