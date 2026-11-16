import React from 'react'
import { Link } from 'react-router'
import { ArrowRight, ShieldCheck, Wrench, GraduationCap, PackageCheck } from 'lucide-react'

const Homepage: React.FC = () => {
  return (
    <div>
      {/* Baseline Hero Shell — Ready for Figma Homepage Screenshot Implementation */}
      <section className="bg-[#001142] text-white py-20 lg:py-28 border-b border-white/15">
        <div className="sudabelt-container">
          <span className="text-eyebrow text-[#3FA9F5]">
            AFRICA’S END-TO-END HEALTHCARE INFRASTRUCTURE PARTNER
          </span>
          <h1 className="text-hero-display text-white mt-4 max-w-3xl">
            Advancing healthcare excellence across Africa.
          </h1>
          <p className="text-[16px] lg:text-[18px] text-white/80 max-w-2xl mt-5 leading-relaxed">
            Genuine OEM medical equipment supply, turnkey facility planning, on-site clinical staff
            certification, local buffer consumables, and &lt;24hr biomedical maintenance SLAs.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              className="h-[50px] px-[26px] rounded-[5.5px] bg-[#3FA9F5] hover:bg-[#2b99eb] text-[#001142] font-extrabold text-[13px] tracking-[0.06em] uppercase inline-flex items-center gap-2.5 transition-colors"
            >
              <span>Explore OEM Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/why-sudabelt/compare"
              className="h-[50px] px-[26px] rounded-[5.5px] border border-white/30 hover:border-[#3FA9F5] text-white font-bold text-[13px] tracking-[0.06em] uppercase inline-flex items-center gap-2.5 transition-colors"
            >
              <span>Open Live Comparison</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Turnkey Pillars Baseline Strip */}
      <section className="py-16 bg-[#F4F6F9]">
        <div className="sudabelt-container">
          <span className="text-eyebrow text-[#006837]">TURNKEY CLINICAL INFRASTRUCTURE</span>
          <h2 className="text-section-heading text-[#001142] mt-2">One accountable partner</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {[
              {
                icon: PackageCheck,
                title: 'Equipment Supply',
                desc: 'Authorized OEM medical devices & local buffer consumables (Baxter, Terumo BCT).',
              },
              {
                icon: ShieldCheck,
                title: 'Turnkey Engineering',
                desc: 'Pre-installation RO water, electrical auditing, and medical gas infrastructure.',
              },
              {
                icon: GraduationCap,
                title: 'Clinical Training',
                desc: '40–60 hours hands-on certification for renal nurses, doctors, and lab scientists.',
              },
              {
                icon: Wrench,
                title: 'Biomedical SLAs',
                desc: 'Preventive calibration and <24hr emergency response across Lagos, Abuja & Kano.',
              },
            ].map((pillar) => {
              const IconComponent = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="bg-white p-6 rounded-tl-[22px] rounded-br-[22px] border border-[#99C1A1]"
                >
                  <div className="w-11 h-11 rounded-[5.5px] bg-[#001142] text-[#3FA9F5] inline-flex items-center justify-center mb-4">
                    <IconComponent className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-card-title text-[#001142]">{pillar.title}</h3>
                  <p className="text-[15px] text-[#3B4468] mt-2">{pillar.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage
