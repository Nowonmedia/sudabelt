import React, { useState } from 'react'
import { X, ChevronRight, User } from 'lucide-react'
import { HeaderTextReveal, SectionReveal } from '../common/Reveal'

interface TeamMember {
  name: string
  role: string
  avatar: string
  shortBio: string
  fullBio: string
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Bashir Eltayeb',
    role: 'Co-Founder & Chief Executive Officer',
    avatar: '/images/team/bashir-eltayeb.jpg',
    shortBio:
      "Guides Sudabelt's strategic expansion, forging alliances with global OEM manufacturers and overseeing turnkey clinical delivery across Africa.",
    fullBio:
      "Bashir Eltayeb is the Co-Founder and Chief Executive Officer of Sudabelt Medical, a leading provider of medical technology, healthcare infrastructure, and integrated clinical solutions across Sub-Saharan Africa.\n\nSince co-founding the company in 2016, he has led Sudabelt Medical's strategic expansion, forging partnerships with some of the world's foremost healthcare technology manufacturers and overseeing the delivery of complex healthcare projects for government institutions, teaching hospitals, military facilities, and private healthcare providers. Under his leadership, the company has grown into a trusted regional partner in the design, supply, installation, and lifecycle support of advanced medical technologies.\n\nWith professional experience spanning finance, technology distribution, and healthcare, Bashir brings a distinctive blend of commercial insight and strategic leadership. His expertise encompasses healthcare infrastructure development, public-private partnerships, market expansion, and the execution of large-scale medical technology initiatives across emerging markets.\n\nGuided by a vision to transform healthcare delivery in Africa, Bashir is committed to expanding access to world-class medical technologies and advancing sustainable, patient-centred healthcare solutions. He believes that innovation, strategic collaboration, and investment in local capacity are fundamental to building resilient health systems capable of meeting the continent's evolving healthcare needs.\n\nBashir holds a Bachelor of Science degree in Accounting from Bayero University, Kano. He continues to lead Sudabelt Medical with an unwavering commitment to excellence, integrity, innovation, and long-term impact across the African healthcare landscape.",
  },
  {
    name: 'Mustapha Usman',
    role: 'Chief Operating Officer (COO)',
    avatar: '/images/team/mustapha-usman.jpg',
    shortBio:
      'Directs regional operations and technology integration, driving high-performing business development and operational excellence.',
    fullBio:
      'The Chief Operating Officer at Sudabelt Medical is passionate about Africa and innovative Technological applications that enhance the business development of companies.\n\nHe has gained vast experience in business development and held managerial positions at Loquat Classic Limited, co-founded Frimb, Africa Infotech Consulting, and Sudabelt Medical.\n\nAll companies have gone on to become market leaders in their niches. He holds a B.Sc. in Business Information Systems from the University of East London, and a master’s in International Management/Digital Business Specialization (M.Sc.) from IE Business School.',
  },
  {
    name: 'Amir Hassan Mohammed Ahmed',
    role: 'Chief Financial Officer (CFO)',
    avatar: '/images/team/amir-ahmed.jpg',
    shortBio:
      'CPA and CMA with over 14 years of international financial leadership, driving rigorous governance and capital stewardship.',
    fullBio:
      'He is an accomplished accounting and finance professional with over fourteen (14) years of international experience in finance and accounting.\n\nHe worked at Faisal Islamic Bank, Khartoum as an Accountant before moving on to Mubarak For Accounting, Auditing & Financial Consultancy (CPAs), Khartoum, where he worked as an Audit Associate and later Audit Supervisor.\n\nHe worked with Alategahat Almotadida Co. Ltd., Khartoum as Finance Manager. He also served at Hameen Investments L.L.C., Abu Dhabi as Financial Controller, and with Aseelia Manufacturing in Khartoum, Sudan as Finance Manager.\n\nHe is a Certified Public Accountant (CPA) in the state of Washington, USA, and a Certified Management Accountant (CMA) - USA. He obtained a Bachelor’s degree in Banking & Finance from Sudan Academy for Banking and Finance, and an MBA (Finance) from the University of Wales Bangor, UK.',
  },
  {
    name: 'Allan Alberto Klein',
    role: 'Operations Director',
    avatar: '/images/team/allan-klein.jpg',
    shortBio:
      'Over 22 years of operations and supply chain leadership. Certified ISO 9001:2015 Lead Auditor overseeing quality and retail hospital hubs.',
    fullBio:
      'Allan Alberto-Klein is an accomplished executive with over 22 years of experience in Operations, Supply Chain, Human Resources, and Administration across manufacturing, fast-moving consumer goods, and services industries. He is also a guest lecturer.\n\nAllan holds an HND, PGD, MSc, M.LSCM, and MBA from Lagos State Polytechnic, Miva Open University, Rome Business School, Valencian International University (VIU) Spain, and the College of Supply Chain. He is an ISO 9001:2015 QMS Certified Lead Auditor/Facilitator, and a Certified Professional Logistician from the Canadian Logistics Institute, Ontario. He is a member of several local and foreign professional bodies and institutions.\n\nHis career includes progressive leadership roles at leading organizations including SevenUp Bottling Company, Sidel, Markem Imaje, and SBA Group Nigeria. At Sudabelt Medical, he oversees Operations, Human Resources, Administration, Supply Chain, Quality Assurance, and Retail Operations across all Sudabelt Medical offices and hubs.\n\nKnown for driving operational excellence and process optimization, Allan brings a strategic, results-driven approach to building high-performing teams and resilient business operations.',
  },
  {
    name: 'Bukky Adetunji',
    role: 'National Sales Director',
    avatar: '/images/team/bukky-adetunji.jpg',
    shortBio:
      'Sales executive with over 25 years of healthcare and technology experience, previously with GE Healthcare, leading commercial strategy across Nigeria.',
    fullBio:
      "Bukky Adetunji is a sales and business development executive with over 25 years of experience across the healthcare, technology, and corporate sectors. As National Sales Director at Sudabelt Medical, he leads the company's sales strategy and commercial operations, driving customer engagement, business development, and market expansion across Nigeria and Sub-Saharan Africa.\n\nPrior to joining Sudabelt Medical, Bukky held leadership roles at GE Healthcare, MultiChoice Nigeria, Interglobal Limited, Itex Furniture, and GBY International Limited, where he served as Director of Sales & Marketing and Chief Operating Officer. His experience spans key account management, business operations, strategic partnerships, and sales leadership, with a strong track record of delivering sustainable business growth.\n\nBukky holds a Bachelor of Technology (B.Tech.) in Computer Science from Abubakar Tafawa Balewa University.",
  },
  {
    name: 'Julianah Bakare',
    role: 'Service Director',
    avatar: '/images/team/julianah-bakare.jpg',
    shortBio:
      'Over 30 years of engineering leadership, ISO Lead Auditor, and former Service Director at GE Healthcare leading biomedical services.',
    fullBio:
      'Julianah Bakare is an experienced Engineer and a technical operations Professional with over 30 years experience managing people and handling electrical and biomedical systems.\n\nShe is also an ISO Lead Auditor as part of her journey to quality and excellence. She is a people manager, a team lead and a trusted hand in managing technical operations wing-to-wing. She previously served as Service Director at GE Healthcare and CEO at Glenn-Gold Int Ltd before joining Sudabelt Medical to direct its nationwide biomedical engineering desk.',
  },
]

const TeamSection: React.FC = () => {
  const [activeBio, setActiveBio] = useState<TeamMember | null>(null)

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="sudabelt-container">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <SectionReveal direction="up" delay={0.1}>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-0.75 bg-sudabelt-red rounded-xs" />
              <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-sudabelt-green">
                Our Team
              </span>
            </div>
          </SectionReveal>

          <HeaderTextReveal>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-sudabelt-navy tracking-tight">
              The Team Behind Sudabelt.
            </h2>
          </HeaderTextReveal>
        </div>

        {/* 6 Leadership Members Grid - Border Radius on Top-Left & Bottom-Right ONLY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TEAM_MEMBERS.map((member, idx) => (
            <SectionReveal key={member.name} direction="up" delay={0.08 * (idx + 1)}>
              <div className="h-full bg-white border border-sudabelt-border rounded-tl-card rounded-br-card rounded-tr-none rounded-bl-none p-6 sm:p-7 flex flex-col justify-between hover:border-sudabelt-green hover:shadow-card transition-all group">
                <div>
                  {/* Left-Aligned Circular Avatar */}
                  <div className="flex justify-start mb-4">
                    <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-sudabelt-surface shadow-xs bg-sudabelt-surface">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center text-sudabelt-muted">
                        <User className="w-8 h-8" />
                      </div>
                    </div>
                  </div>

                  {/* Left-Aligned Name & Title */}
                  <div className="text-left mb-2.5">
                    <h3 className="text-lg sm:text-xl font-bold text-sudabelt-navy group-hover:text-sudabelt-green transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-bold text-sudabelt-green tracking-wide uppercase mt-1">
                      {member.role}
                    </p>
                  </div>

                  {/* Left-Aligned Short Description */}
                  <p className="text-xs sm:text-sm text-sudabelt-body text-left leading-relaxed">
                    {member.shortBio}
                  </p>
                </div>

                {/* Left-Aligned Read Bio Action */}
                <div className="mt-6 pt-4 border-t border-sudabelt-border/70 flex justify-start">
                  <button
                    type="button"
                    onClick={() => setActiveBio(member)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sudabelt-navy hover:text-sudabelt-green transition-colors cursor-pointer"
                  >
                    <span>Read Executive Bio</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>

      {/* Leadership Member Modal - Enhanced with Generous Image Space */}
      {activeBio && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sudabelt-navy/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-3xl bg-white rounded-card shadow-modal overflow-hidden border border-sudabelt-border max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-sudabelt-navy text-white px-6 sm:px-8 py-5 flex items-center justify-between border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-widest text-sudabelt-blue">
                Executive Leadership Profile
              </span>

              <button
                type="button"
                onClick={() => setActiveBio(null)}
                className="w-8 h-8 rounded-control bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content - Two Column Layout with Ample Space for Large Portrait */}
            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start mb-6 pb-6 border-b border-sudabelt-border">
                {/* Generous Space for Profile Image */}
                <div className="shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-card overflow-hidden ring-4 ring-sudabelt-surface shadow-md bg-sudabelt-surface">
                  <img
                    src={activeBio.avatar}
                    alt={activeBio.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Executive Title & Header Details */}
                <div className="flex-1 text-left">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-sudabelt-navy leading-tight">
                    {activeBio.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-extrabold text-sudabelt-green uppercase tracking-wide mt-1.5">
                    {activeBio.role}
                  </p>
                  <p className="text-xs text-sudabelt-muted mt-1 font-medium">
                    Sudabelt Medical Executive Committee
                  </p>
                </div>
              </div>

              {/* Biography Body */}
              <div className="space-y-4 text-sm text-sudabelt-body leading-relaxed whitespace-pre-line text-left">
                {activeBio.fullBio}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 sm:px-8 py-4 bg-sudabelt-surface border-t border-sudabelt-border flex justify-end">
              <button
                type="button"
                onClick={() => setActiveBio(null)}
                className="px-6 py-2.5 rounded-control bg-sudabelt-navy text-white text-xs font-bold uppercase hover:bg-sudabelt-navy/90 transition-colors cursor-pointer"
              >
                Close Bio
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default TeamSection
