import React from 'react'
import { MapPin, ExternalLink } from 'lucide-react'

interface BranchOffice {
  id: string
  region: string
  locationTitle: string
  address: string
  embedUrl: string
  mapUrl: string
  phone?: string
}

const BRANCHES: BranchOffice[] = [
  {
    id: 'lagos',
    region: 'LAGOS',
    locationTitle: 'Lagos · Victoria Island',
    address: '11A Oba Idowu Abiodun Oniru Street, Victoria Island, Lagos.',
    embedUrl:
      'https://maps.google.com/maps?q=6.431173,3.447853&hl=en&z=15&output=embed',
    mapUrl:
      'https://maps.google.com/?q=11A+Oba+Idowu+Abiodun+Oniru+Street+Victoria+Island+Lagos',
    phone: '+234 (0) 913 5733 876',
  },
  {
    id: 'abuja',
    region: 'ABUJA',
    locationTitle: 'Abuja · Maitama',
    address: '8 Dep Street, Off Nikon Lake Street, Maitama, FCT Abuja.',
    embedUrl:
      'https://maps.google.com/maps?q=9.091176,7.495048&hl=en&z=15&output=embed',
    mapUrl:
      'https://maps.google.com/?q=8+Dep+Street+Off+Nikon+Lake+Street+Maitama+Abuja',
    phone: '09011235400',
  },
  {
    id: 'kano',
    region: 'KANO',
    locationTitle: 'Kano · Sharada',
    address: 'Plot 70 Sharada Phase 3, Sharada Road, Kano.',
    embedUrl:
      'https://maps.google.com/maps?q=11.970972,8.514816&hl=en&z=15&output=embed',
    mapUrl:
      'https://maps.google.com/?q=Plot+70+Sharada+Phase+3+Sharada+Road+Kano',
    phone: '+234 (0) 913 5733 876',
  },
]

export const ContactBranchesSection: React.FC = () => {
  return (
    <section className="bg-sudabelt-green-tint py-20 lg:py-28">
      <div className="sudabelt-container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 lg:mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-sudabelt-green block mb-2">
            BRANCHES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-sudabelt-navy leading-tight">
            Three Offices. Engineers Everywhere.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
            Direct regional presence in Nigeria's key healthcare corridors, backed by mobile engineering teams deployed nationwide.
          </p>
        </div>

        {/* 3 Large Regional Location Cards with Map Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {BRANCHES.map((branch) => {
            return (
              <div
                key={branch.id}
                className="bg-white rounded-[22px] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-gray-100 min-h-[520px] group"
              >
                {/* Top Side: Live Interactive Map Widget */}
                <div className="relative w-full h-[250px] sm:h-[270px] bg-gray-200 overflow-hidden">
                  <iframe
                    src={branch.embedUrl}
                    title={`${branch.region} Regional Office Map`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen={false}
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                  {/* Regional Badge Overlay */}
                  <div className="absolute top-3.5 left-3.5 bg-sudabelt-navy/90 backdrop-blur-xs text-white px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-sm pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-sudabelt-red" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      {branch.region}
                    </span>
                  </div>

                  {/* View on Map Link Badge */}
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${branch.region} in Google Maps`}
                    className="absolute top-3.5 right-3.5 bg-white/95 hover:bg-white text-sudabelt-navy px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <span>Full Map</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </a>
                </div>

                {/* Bottom Side: Card Content */}
                <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sudabelt-green mb-2">
                      <MapPin className="w-4 h-4 shrink-0 text-sudabelt-green" />
                      <span>Regional Office</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-sudabelt-navy mb-3">
                      {branch.locationTitle}
                    </h3>

                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
                      {branch.address}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <a
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-sudabelt-green group-hover:text-emerald-700 transition-colors"
                    >
                      <span>GET DIRECTIONS</span>
                      <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                        &rarr;
                      </span>
                    </a>

                    {branch.phone && (
                      <a
                        href={`tel:${branch.phone.replace(/[^0-9+]/g, '')}`}
                        className="text-xs font-medium text-gray-500 hover:text-sudabelt-navy transition-colors"
                      >
                        {branch.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
