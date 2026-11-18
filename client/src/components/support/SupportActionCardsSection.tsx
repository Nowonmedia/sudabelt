import React from 'react'
import { Link } from 'react-router'
import { Wrench, GraduationCap } from 'lucide-react'

export const SupportActionCardsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="sudabelt-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: After Sales Support */}
          <div className="border border-sudabelt-border rounded-card p-8 sm:p-10 lg:p-12 bg-white hover:bg-sudabelt-green-tint shadow-xs hover:shadow-md transition-colors duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-8 h-1 bg-sudabelt-red mb-5" />
              <div className="w-12 h-12 rounded-control bg-sudabelt-green text-white flex items-center justify-center mb-6 shadow-xs">
                <Wrench className="w-6 h-6" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-sudabelt-navy mb-3">
                After Sales Support
              </h2>

              <p className="text-sm sm:text-base text-sudabelt-body leading-relaxed mb-8">
                Experiencing technical issues with your medical equipment? Our technicians are on standby to help.
              </p>
            </div>

            <div>
              <Link
                to="/support/after-sales"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-control bg-sudabelt-blue hover:bg-sudabelt-blue-hover text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                OPEN TICKET
              </Link>
            </div>
          </div>

          {/* Card 2: Medical Training */}
          <div className="border border-sudabelt-border rounded-card p-8 sm:p-10 lg:p-12 bg-white hover:bg-sudabelt-green-tint shadow-xs hover:shadow-md transition-colors duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-8 h-1 bg-sudabelt-red mb-5" />
              <div className="w-12 h-12 rounded-control bg-sudabelt-green text-white flex items-center justify-center mb-6 shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-sudabelt-navy mb-3">
                Medical Training
              </h2>

              <p className="text-sm sm:text-base text-sudabelt-body leading-relaxed mb-8">
                Request proper training and we will send trainers to your hospital to guide your team.
              </p>
            </div>

            <div>
              <Link
                to="/support/medical-training"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-control bg-sudabelt-blue hover:bg-sudabelt-blue-hover text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                BOOK NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SupportActionCardsSection
