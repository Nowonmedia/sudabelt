import React from 'react'

export const ContactHeroSection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[340px] lg:min-h-[380px]">
        {/* Left Side: 2/3 (8 of 12 columns), Soft Gray Background */}
        <div className="lg:col-span-8 xl:col-span-9 bg-sudabelt-surface px-6 sm:px-12 lg:px-16 py-12 lg:py-16 flex flex-col justify-center">
          <div className="max-w-xl">
            {/* Red Accent Bar */}
            <div className="w-10 h-1 bg-sudabelt-red mb-4" />
            <span className="text-xs uppercase tracking-widest font-bold text-sudabelt-green block mb-2">
              CONTACT US
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sudabelt-navy leading-tight">
              We would love to hear from you.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-sudabelt-body leading-relaxed max-w-lg">
              Tell us what your facility needs. Our team will help you find the right next step.
            </p>
          </div>
        </div>

        {/* Right Side: 1/3 (4 of 12 columns), Compact Brand Green Block */}
        <div className="lg:col-span-4 xl:col-span-3 bg-sudabelt-green px-6 sm:px-8 lg:px-10 py-10 lg:py-14 flex flex-col justify-center text-white">
          <div className="space-y-1 sm:space-y-1.5">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Projects.
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Equipment.
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Ongoing support.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactHeroSection
