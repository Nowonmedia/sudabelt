import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import SudaBotWidget from '../components/common/SudaBotWidget'

const RootLayout: React.FC = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col bg-white text-sudabelt-navy">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Permanently suspended Suda Bot widget on bottom-right of viewport */}
      <SudaBotWidget />
    </div>
  )
}

export default RootLayout
