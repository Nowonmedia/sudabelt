import React from 'react'

export const CareersOpenRolesSection: React.FC = () => {
  return (
    <section id="apply-section" className="bg-sudabelt-green-tint py-20 lg:py-28">
      <div className="sudabelt-container max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Open Roles Status (White Card) */}
          <div className="bg-white rounded-[22px] p-8 sm:p-10 lg:p-12 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-sudabelt-green block mb-3">
                OPEN ROLES
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-sudabelt-navy mb-4">
                No open roles right now.
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                We're always interested in strong profiles. Share your CV and the kind of role
                you're looking for, and we'll keep you in mind for relevant opportunities.
              </p>
            </div>

            <div className="pt-10">
              <div className="w-8 h-1 bg-sudabelt-red mb-3" />
              <p className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy leading-snug">
                Your expertise. <br />
                A healthier future.
              </p>
            </div>
          </div>

          {/* Card 2: Proactive Application (Green Card) */}
          <div className="bg-sudabelt-green text-white rounded-[22px] p-8 sm:p-10 lg:p-12 flex flex-col justify-between shadow-md">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-emerald-200 block mb-3">
                APPLY
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                We will keep you in mind.
              </h3>
              <p className="text-sm sm:text-base text-emerald-100 leading-relaxed mb-8">
                We will notify you about relevant positions and keep you in mind whenever interesting
                opportunities become available. Kindly share your CV at{' '}
                <a
                  href="mailto:connect@sudabelt.com"
                  className="text-white font-semibold underline underline-offset-2 hover:text-emerald-200"
                >
                  connect@sudabelt.com
                </a>{' '}
                and specify the job title you are interested in.
              </p>
            </div>

            <div className="pt-4">
              <a
                href="mailto:connect@sudabelt.com?subject=Job%20Application%20-%20Sudabelt%20Medical"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-[6px] bg-sudabelt-blue hover:bg-blue-400 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                EMAIL YOUR CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
