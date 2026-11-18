import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
}

// Verbatim FAQs extracted directly from https://www.sudabelt.com/support
const LIVE_SUDABELT_FAQS: FaqItem[] = [
  {
    question: 'What is Sudabelt Medical',
    answer:
      'Sudabelt Medical is a leading provider of quality medical equipment, committed to delivering the best solutions to healthcare centres across Nigeria and Africa.',
  },
  {
    question: 'What type of medical equipment does Sudabelt Medical supply?',
    answer:
      'Through our partnership with global medical brands, we are able to provide medical equipment, consumables and accessories across all portfolios such as renal, ultrasound, and more.',
  },
  {
    question: 'Where are Sudabelt Medical offices located?',
    answer:
      'We have physical offices in Abuja, Lagos and Kano State with presence in all Nigerian states. See our contact us page for all addresses.',
  },
  {
    question: 'What if I cannot find the equipment or consumables I need on the website?',
    answer:
      'You can reach out to us via the Contact Form on our website or through a phone call and our sales managers will assist you in sourcing what you need.',
  },
  {
    question: 'Does Sudabelt Medical provide local technical support for medical equipment purchased?',
    answer:
      'Yes, we provide local support through our team of expert engineers. We are available to repair, troubleshoot, manage and service the equipment to help make sure it works properly. Our engineers provide quick responses to clients and proffer adequate solutions where needed.',
  },
  {
    question: 'How do I request technical support for equipment purchased?',
    answer:
      "You can request technical support by clicking the Services tab at the top of the website. In Aftersale Support column, click on 'Open Ticket', fill out the ticket form, click 'Submit' and your request will be promptly processed.",
  },
  {
    question: 'Does Sudabelt offer training on equipment use after purchase?',
    answer:
      'Yes, we offer after-sale trainings to ensure optimal use of our turnkey equipment and solutions. We also deliver clinical training and demonstrations to clients for effective healthcare service delivery. Request via the services tab on the website.',
  },
  {
    question: 'Can I request a demo session for medical equipment?',
    answer:
      'Yes, you can request a demo session. We have demo systems in place for our medical equipment. Contact us via our website to request a demo session.',
  },
  {
    question: 'Is there a warranty on equipment purchased?',
    answer:
      'Yes, we have a warranty for our medical equipment and this warranty period depends on the type of equipment purchased.',
  },
  {
    question: 'Does Sudabelt provide financial payment plans on their equipment?',
    answer:
      'Yes, we have flexible payment options. Reach out to us now via the Contact Form on our website or a phone call to request a quote and discuss possible payment plans.',
  },
]

export const SupportFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-sudabelt-green-tint py-20 lg:py-28">
      <div className="sudabelt-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Heading */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <span className="text-xs uppercase tracking-widest font-bold text-sudabelt-green block mb-2">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-sudabelt-navy leading-tight">
              Common questions
            </h2>
            <p className="mt-3 text-sm sm:text-base text-sudabelt-body leading-relaxed max-w-md">
              Answers to the most frequently asked questions regarding our medical technology, warranty, after-sales biomedical support, and clinical training.
            </p>
          </div>

          {/* Right Column: Clean Accordion List with only border bottom */}
          <div className="lg:col-span-7 divide-y divide-sudabelt-border/80">
            {LIVE_SUDABELT_FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx
              return (
                <div
                  key={idx}
                  className="py-5 sm:py-6 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none group"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-bold text-sudabelt-navy leading-snug group-hover:text-sudabelt-green transition-colors">
                      {faq.question}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/70 group-hover:bg-white flex items-center justify-center shrink-0 text-sudabelt-navy transition-colors shadow-2xs">
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-sudabelt-green" />
                      ) : (
                        <Plus className="w-4 h-4 text-sudabelt-navy" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: 'auto',
                          opacity: 1,
                          transition: {
                            height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.35, delay: 0.08 },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.15 },
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 pr-8 pb-2 text-sm sm:text-base text-sudabelt-body leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SupportFaqSection
