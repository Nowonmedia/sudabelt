import React from 'react'
import { Routes, Route } from 'react-router'

import RootLayout from './layout/RootLayout'
import Homepage from './pages/Homepage'
import AboutPage from './pages/AboutPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import TurnkeyServicesPage from './pages/TurnkeyServicesPage'
import ProjectsPage from './pages/ProjectsPage'
import TrainingHubPage from './pages/TrainingHubPage'
import TrainingRegisterPage from './pages/TrainingRegisterPage'
import ComparePage from './pages/ComparePage'
import NewslettersPage from './pages/NewslettersPage'
import NewsletterDetailPage from './pages/NewsletterDetailPage'
import BlogPage from './pages/BlogPage'
import BlogDetailPage from './pages/BlogDetailPage'
import SupportHubPage from './pages/SupportHubPage'
import EmergencyBreakdownPage from './pages/EmergencyBreakdownPage'
import MaintenanceCalibrationPage from './pages/MaintenanceCalibrationPage'
import RFQPage from './pages/RFQPage'
import ContactPage from './pages/ContactPage'
import CareersPage from './pages/CareersPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'

const App: React.FC = () => {
  return (
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
      </Route>
    </Routes>
  )
}

export default App
