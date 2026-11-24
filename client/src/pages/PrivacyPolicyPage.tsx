import React, { useEffect } from 'react'
import { Shield } from 'lucide-react'

const TOC_ITEMS = [
  { id: 'collection-of-data', label: '1. Collection of Data' },
  { id: 'use-of-collected-data', label: '2. Use of Collected Data' },
  { id: 'third-party-websites', label: '3. Third-Party Websites' },
  { id: 'sharing-of-collected-data', label: '4. Sharing of Collected Data' },
  { id: 'transfer-of-collected-data', label: '5. Transfer of Collected Data' },
  { id: 'data-security', label: '6. Data Security' },
  { id: 'data-retention', label: '7. Data Retention' },
  { id: 'children-and-parents', label: '8. Children and Parents' },
  { id: 'dnt-policy', label: '9. Our "Do Not Track" (DNT) Policy' },
  { id: 'your-data-preferences', label: '10. Your Data Preferences' },
  { id: 'contact-us', label: '11. Contact Us' },
]

const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Privacy Policy | Sudabelt Medical'
  }, [])

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-sudabelt-navy text-white py-14 sm:py-16">
        <div className="sudabelt-container max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-control bg-sudabelt-blue/20 border border-sudabelt-blue/30 text-sudabelt-blue text-[11px] font-bold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>Legal &amp; Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-sm text-white/75 mt-3 font-mono">
            This policy was last modified on, 28th April 2022.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16">
        <div className="sudabelt-container max-w-4xl space-y-10 text-sudabelt-body text-[15px] leading-relaxed">
          <p>
            This privacy policy (this &quot;Privacy Policy&quot;) describes how we collect, use, and
            share data that we obtain through your use of the Internet sites, applications, and
            online services (the &quot;Site&quot;) operated by, controlled by, or affiliated with
            Sudabelt Medical Co. By using the Site, you agree to the practices described in this
            Privacy Policy and any updates posted here from time to time. To make sure you stay
            informed of all changes, you should check this Privacy Policy periodically. Updates will
            be referenced by the &quot;Last Modified&quot; date shown above.
          </p>

          {/* Table of Contents */}
          <div className="rounded-card border border-sudabelt-border bg-sudabelt-surface/60 p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-sudabelt-navy mb-4">
              Table of Contents
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {TOC_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sudabelt-navy hover:text-sudabelt-green font-medium transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 1 */}
          <section id="collection-of-data" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy">
              1. Collection of Data
            </h2>
            <p>
              We collect data from you in several different ways on the Site, including personal
              data and data about your use of the Site which does not identify you personally.
              Personal data means information, or a combination of information, that can reasonably
              be used to identify you personally (such as your name, phone number, address, and
              email address).
            </p>
            <h3 className="text-base font-bold text-sudabelt-navy pt-2">
              We collect personal data that you voluntarily provide to us.
            </h3>
            <p>
              We collect personal data that you voluntarily provide to us (such as when you submit
              an inquiry), including name, email address, and any other data you choose to provide.
            </p>
            <h3 className="text-base font-bold text-sudabelt-navy pt-2">
              We automatically collect data about your use of the Site.
            </h3>
            <p>
              When you access and use the Site, our technology and tools may automatically collect
              and record certain data about your use of and interaction with the Site that does not
              identify you personally (such as your IP address, browser type, the make and model of
              the device used to view the Site, unique device identifiers, the referring webpage,
              pages visited, and search terms). We also use various tracking technologies (such as
              cookies and pixel tags) to collect data about your use of and access to the Site.
              Cookies are small data files stored on your hard drive or in device memory by
              websites you visit, applications you use, or advertisements you view and help us
              improve the Site and your experience on the Site. Pixel tags are electronic images
              that generate a generic notice of a visit to the Site and are used in conjunction with
              cookies to anonymously track the activity on the Site by a particular browser.
            </p>
            <h3 className="text-base font-bold text-sudabelt-navy pt-2">
              Third parties may also automatically collect data about you.
            </h3>
            <p>
              Some content on the Site may be served by third-party content providers and may also
              use cookies, pixels tags, or other similar tracking technologies to automatically
              collect data about you, both on the Site and throughout the Internet. We do not control
              the technologies of those third parties. Data collection and use by those third
              parties is subject to the privacy policies of those third parties. It is up to you to
              review the terms of use and privacy policies of those third parties.
            </p>
          </section>

          {/* Section 2 */}
          <section id="use-of-collected-data" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy">
              2. Use of Collected Data
            </h2>
            <p>
              We use the data we collect to assist in the administration and operation of the Site
              and to provide you with an efficient, meaningful, and customized experience.
            </p>
            <p className="font-semibold text-sudabelt-navy">We may use data to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                Fulfil our obligations with respect to the reason you voluntarily provided the data
                (such as responding to an inquiry);
              </li>
              <li>Allow you to participate in certain features of the Site;</li>
              <li>
                Improve the Site or our products, events, and services and for other business or
                commercial purposes;
              </li>
              <li>Notify you about changes to the Site (including this Privacy Policy);</li>
              <li>Carry out any other purpose described to you at the time the data was collected; and</li>
              <li>Carry out any other purpose with your consent or as permitted by law.</li>
            </ul>
            <p className="font-semibold text-sudabelt-navy pt-2">
              Additionally, we may use data for marketing purposes to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                Provide you with additional information regarding products, events, and services from
                Sudabelt via email or through advertising on various social media platforms or
                websites (both desktop and mobile) that you may visit; and
              </li>
              <li>
                Develop, improve, and target our promotional messaging to you and others via
                retargeting online behavioural advertising, and the use of social media platform
                tools for advertising (such as the creation of Facebook Lookalike Audiences).
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="third-party-websites" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy">
              3. Third-Party Websites
            </h2>
            <p>
              Through your use of the Site, you may access, directly or indirectly, other websites
              or services, including from our service providers, business partners, and other third
              parties, in each case, that is not owned or controlled by us. Data collection and use
              by those third parties are subject to the privacy policies of those third parties. It
              is up to you to review the terms of use and privacy policies of those third parties.
            </p>
          </section>

          {/* Section 4 */}
          <section id="sharing-of-collected-data" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy">
              4. Sharing of Collected Data
            </h2>
            <p>We may share the data we collect as follows:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                With our current and future parents, affiliates, subsidiaries, and other companies
                under common control and ownership;
              </li>
              <li>
                With the service providers that perform services for us (such as e-mail and mobile
                marketing, analytics, and web hosting);
              </li>
              <li>With our sponsors or event partners in connection with certain ticketed events;</li>
              <li>
                To comply with a court order or other legal obligation, to enforce the Site terms of
                use, and to protect the rights, property, or safety of our users and other third
                parties;
              </li>
              <li>
                With government or law enforcement officials or private parties (including our legal
                or other professional advisors) as we determine, in our sole and absolute discretion,
                is necessary or appropriate to respond to claims or to comply with legal processes,
                laws, regulations, or ordinances, or to prevent or stop illegal, unethical, or
                actionable activity;
              </li>
              <li>
                In connection with, or during negotiations of, any merger, acquisition by another
                company, or sale of all or substantially all of our business or assets; and
              </li>
              <li>With your consent or at your direction.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="transfer-of-collected-data" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy">
              5. Transfer of Collected Data
            </h2>
            <p>
              The Site is operated in Nigeria. If you are located in another jurisdiction, please be
              aware that the data we collect will be transferred to, stored, and processed in
              Nigeria. By using the Site and/or providing us with any data, you consent to this
              transfer, processing, and storage of your data in Nigeria. We will take all steps
              reasonably necessary to ensure that your data is treated securely and in accordance
              with this Privacy Notice. We will take all steps reasonably necessary to ensure that
              your data is subject to appropriate safeguards and ensure that your data is treated
              securely and in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Section 6 */}
          <section id="data-security" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy">
              6. Data Security
            </h2>
            <p>
              We use commercially reasonable technical and organizational measures to help secure and
              safeguard your data in our possession. However, no data transmission over the Internet
              is completely secure and no security mechanism is impenetrable. Therefore, although we
              take steps to protect your data, we cannot guarantee the security of the data that we
              collect from you or the security of our servers or the Site. By accessing the Site,
              any transmission of data is at your own risk and you agree to assume all risk in
              connection with data sent to us or collected by us.
            </p>
          </section>

          {/* Section 7 */}
          <section id="data-retention" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy">
              7. Data Retention
            </h2>
            <p>
              We retain data only as long as necessary in light of the purpose(s) for which it was
              initially collected. Please note that we may retain your data for longer periods of
              time as necessary to comply with our legal obligations or respond to governmental
              authorities.
            </p>
          </section>

          {/* Section 8 */}
          <section id="children-and-parents" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy">
              8. Children and Parents
            </h2>
            <p>
              We respect children&apos;s privacy. We do not target or knowingly or intentionally
              collect personal data from children under the age of 13. By using the Site, you have
              represented and warranted that you are either at least 18 years of age or using the
              Site with the supervision of a parent or guardian. If you are under the age of 13, you
              may not use the Site. If you become aware that your child has provided us with
              personal data without your consent, please email us.
            </p>
          </section>

          {/* Section 9 */}
          <section id="dnt-policy" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy">
              9. Our &quot;Do Not Track&quot; (DNT) Policy
            </h2>
            <p>
              Some websites have &quot;do not track&quot; features that allow you to tell a website
              not to track you. We do not currently respond to those signals or any similar
              mechanisms transmitted by web browsers. To learn more about DNT and tracking signals,
              please visit{' '}
              <a
                href="https://allaboutdnt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sudabelt-blue hover:underline font-medium"
              >
                All About DNT
              </a>
              .
            </p>
          </section>

          {/* Section 10 */}
          <section id="your-data-preferences" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy">
              10. Your Data Preferences
            </h2>
            <h3 className="text-base font-bold text-sudabelt-navy pt-1">Use of Collected Data</h3>
            <p>
              If you no longer want us to use your collected data as described above, please submit
              a request via email.
            </p>
            <h3 className="text-base font-bold text-sudabelt-navy pt-1">Communications</h3>
            <p>
              If you no longer wish to receive communications from Sudabelt Medical Co., please
              follow the instructions in the emails to opt out from receiving such messages in the
              future.
            </p>
            <h3 className="text-base font-bold text-sudabelt-navy pt-1">
              Cookies, Pixel Tags, and Other Similar Tracking Technologies
            </h3>
            <p>
              You may remove or reject cookies by adjusting settings on your browser, and thus opt
              out of certain features of the Site and the Site&apos;s automatic collection of
              certain data. These tracking technology opt-out tools are device and browser-specific
              so you must repeat the opt-out from each of your devices and browsers. Please note
              that removing or rejecting cookies could affect the Site&apos;s functionality.
            </p>
            <h3 className="text-base font-bold text-sudabelt-navy pt-1">
              Advertising Preferences
            </h3>
            <p>
              You may adjust your advertising preferences on various social media websites by
              adjusting your Settings on a particular platform. For example, you may adjust the
              types of Facebook ads you receive on Facebook and the types of Google ads you receive
              on Google.
            </p>
          </section>

          {/* Section 11 */}
          <section id="contact-us" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-extrabold text-sudabelt-navy">
              11. Contact Us
            </h2>
            <p>To submit a request relating to Your Data Preferences, please email us.</p>
            <p>
              If you have any questions about this Privacy Policy, please email us at{' '}
              <a href="mailto:info@sudabelt.com" className="text-sudabelt-blue hover:underline font-medium">
                info@Sudabelt.com
              </a>{' '}
              or write to us at one of the following addresses:
            </p>
            <address className="not-italic rounded-card border border-sudabelt-border bg-sudabelt-surface/50 p-5 text-sudabelt-navy font-medium">
              Sudabelt,
              <br />
              11A Oba Idowu Abiodun Oniru Street,
              <br />
              Victoria Island, Lagos.
              <br />
              Nigeria.
            </address>
          </section>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicyPage
