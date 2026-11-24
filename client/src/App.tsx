import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router'

import RootLayout from './layout/RootLayout'
import Homepage from './pages/Homepage'

const AboutPage = lazy(() => import('./pages/AboutPage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const TurnkeyServicesPage = lazy(() => import('./pages/TurnkeyServicesPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const TrainingHubPage = lazy(() => import('./pages/TrainingHubPage'))
const TrainingRegisterPage = lazy(() => import('./pages/TrainingRegisterPage'))
const ComparePage = lazy(() => import('./pages/ComparePage'))
const NewslettersPage = lazy(() => import('./pages/NewslettersPage'))
const NewsletterDetailPage = lazy(() => import('./pages/NewsletterDetailPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'))
const SupportHubPage = lazy(() => import('./pages/SupportHubPage'))
const EmergencyBreakdownPage = lazy(() => import('./pages/EmergencyBreakdownPage'))
const MaintenanceCalibrationPage = lazy(() => import('./pages/MaintenanceCalibrationPage'))
const RFQPage = lazy(() => import('./pages/RFQPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const CareersPage = lazy(() => import('./pages/CareersPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'))
const SitemapPage = lazy(() => import('./pages/SitemapPage'))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))

const PageFallback: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-sudabelt-green border-t-transparent animate-spin" />
      <span className="text-xs font-semibold text-sudabelt-muted uppercase tracking-wider">
        Loading...
      </span>
    </div>
  </div>
)

const App: React.FC = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
      {/* Dedicated Admin CRM & CMS Routes (Outside Public Layout) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/*" element={<AdminDashboardPage />} />

      {/* Public Client Routes with Global Header & PreFooter CTA */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/portfolio" element={<ProductsPage />} />
        <Route path="/products/:category/:slug" element={<ProductDetailPage />} />
        <Route path="/services/turnkey" element={<TurnkeyServicesPage />} />
        <Route path="/services" element={<TurnkeyServicesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/training-hub" element={<TrainingHubPage />} />
        <Route path="/training-hub/register" element={<TrainingRegisterPage />} />
        <Route path="/why-sudabelt/compare" element={<ComparePage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/resources/newsletters" element={<NewslettersPage />} />
        <Route path="/resources/newsletters/:slug" element={<NewsletterDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/support" element={<SupportHubPage />} />
        <Route path="/support/after-sales" element={<EmergencyBreakdownPage />} />
        <Route path="/support/emergency-breakdown" element={<EmergencyBreakdownPage />} />
        <Route path="/support/medical-training" element={<MaintenanceCalibrationPage />} />
        <Route path="/support/maintenance-calibration" element={<MaintenanceCalibrationPage />} />
        <Route path="/rfq" element={<RFQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-use" element={<TermsOfUsePage />} />
        <Route path="/sitemap" element={<SitemapPage />} />
      </Route>
      </Routes>
    </Suspense>
  )
}

export default App
